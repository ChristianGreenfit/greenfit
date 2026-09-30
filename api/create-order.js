// ============================================================
// POST /api/create-order
// 1. valide les données client
// 2. calcule le montant AUTORITATIF (jamais celui du client)
// 3. enregistre user + order dans Supabase
// 4. initialise la page de paiement Saferpay
// 5. renvoie l'URL de redirection Saferpay
// ============================================================

import { db, STATUS } from "./_lib/db.js";
import { resolveOptions, resolvePlan } from "./_lib/catalog.js";
import { validateClient } from "./_lib/validation.js";
import { initialize } from "./_lib/saferpay.js";
import { baseUrl, readJson, sendJson } from "./_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const payload = await readJson(req);
  if (!payload || typeof payload !== "object") {
    return sendJson(res, 400, { error: "JSON invalide" });
  }

  // 1. Validation client
  const validation = validateClient(payload.client ?? {});
  if (!validation.success) {
    return sendJson(res, 422, { errors: validation.errors });
  }

  // 2. Résolution + calcul du montant autoritatif
  const plan = resolvePlan(payload.months);
  if (!plan) {
    return sendJson(res, 422, { errors: ["Formule d'abonnement inconnue"] });
  }
  const options = resolveOptions(payload.optionIds ?? []);
  const optionsTotal = options.reduce((s, o) => s + o.price, 0);
  const amount = plan.price + optionsTotal;

  if (amount <= 0) {
    return sendJson(res, 422, { errors: ["Montant invalide"] });
  }

  const c = payload.client;
  const phoneDigits = (c.member_phone ?? "").replace(/\D/g, "");

  // 3a. Upsert utilisateur (par email)
  const userInfo = {
    member_marital1: c.member_marital1,
    member_firstname: c.member_firstname,
    member_lastname: c.member_lastname,
    member_phone: `(+41)0${phoneDigits}`,
    member_address: c.member_address,
    member_npa: c.member_npa,
    member_city: c.member_city,
    member_dob: c.member_dob,
  };

  const { data: existing } = await db
    .from("abonnement_users")
    .select("id")
    .eq("email", c.member_email)
    .maybeSingle();

  let userId;
  if (existing) {
    userId = existing.id;
    await db.from("abonnement_users").update({ info: userInfo }).eq("id", userId);
  } else {
    const { data: inserted, error } = await db
      .from("abonnement_users")
      .insert({ email: c.member_email, info: userInfo })
      .select("id")
      .single();
    if (error || !inserted) {
      console.error("[create-order] insert user:", error);
      return sendJson(res, 500, { errors: ["Erreur enregistrement"] });
    }
    userId = inserted.id;
  }

  // 3b. Création de la commande
  const orderInfo = {
    title: plan.label,
    month_label: `${plan.months} mois`,
    month_price: plan.price,
    contract_id: plan.contractId,
    options: options.map((o) => ({
      id: o.id,
      title: o.label,
      price: o.price,
      contract_id: o.articleId,
    })),
    extra_fee: 0,
  };

  const { data: order, error: orderErr } = await db
    .from("abonnement_orders")
    .insert({
      user_id: userId,
      info: orderInfo,
      amount,
      status: STATUS.CREATED,
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    console.error("[create-order] insert order:", orderErr);
    return sendJson(res, 500, { errors: ["Erreur enregistrement commande"] });
  }

  // 4. Initialize Saferpay
  const amountCents = Math.round(amount * 100).toString();
  const description = `${plan.label}. Order No. ${order.id}`;

  try {
    const result = await initialize({
      amountCents,
      orderId: String(order.id),
      description,
      firstName: c.member_firstname ?? "",
      lastName: c.member_lastname ?? "",
      phone: `(+41)0${phoneDigits}`,
      returnUrl: `${baseUrl(req)}/api/checkout-confirm?order_id=${order.id}`,
    });

    await db
      .from("abonnement_orders")
      .update({ saferpay_token: result.Token, status: STATUS.PREPARE })
      .eq("id", order.id);

    // 5. URL de redirection vers la page de paiement
    return sendJson(res, 200, {
      redirectUrl: result.RedirectUrl,
      orderId: order.id,
    });
  } catch (err) {
    console.error("[create-order] saferpay initialize:", err?.details ?? err);
    return sendJson(res, 502, {
      errors: ["Impossible d'initialiser le paiement, réessayez."],
    });
  }
}
