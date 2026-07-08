// ============================================================
// POST /create-order
// Reçoit la sélection + les infos client depuis le site React.
// 1. valide les données
// 2. calcule le montant AUTORITATIF (jamais celui du client)
// 3. enregistre le user + l'order
// 4. initialise la page de paiement Saferpay
// 5. renvoie l'URL de redirection Saferpay
// ============================================================

import { config, corsHeaders } from "../_shared/config.ts";
import { db, STATUS } from "../_shared/db.ts";
import { resolveOptions, resolvePlan } from "../_shared/catalog.ts";
import { type ClientInput, validateClient } from "../_shared/validation.ts";
import { initialize } from "../_shared/saferpay.ts";

interface Payload {
  months: number;
  optionIds: string[];
  client: ClientInput;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, cors);
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "JSON invalide" }, 400, cors);
  }

  // 1. Validation client
  const validation = validateClient(payload.client ?? {});
  if (!validation.success) {
    return json({ errors: validation.errors }, 422, cors);
  }

  // 2. Résolution + calcul du montant autoritatif
  const plan = resolvePlan(payload.months);
  if (!plan) {
    return json({ errors: ["Formule d'abonnement inconnue"] }, 422, cors);
  }
  const options = resolveOptions(payload.optionIds ?? []);
  const optionsTotal = options.reduce((s, o) => s + o.price, 0);
  const amount = plan.price + optionsTotal;

  if (amount <= 0) {
    return json({ errors: ["Montant invalide"] }, 422, cors);
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

  let userId: number;
  if (existing) {
    userId = existing.id;
    await db.from("abonnement_users").update({ info: userInfo }).eq(
      "id",
      userId,
    );
  } else {
    const { data: inserted, error } = await db
      .from("abonnement_users")
      .insert({ email: c.member_email, info: userInfo })
      .select("id")
      .single();
    if (error || !inserted) {
      console.error("[create-order] insert user:", error);
      return json({ errors: ["Erreur enregistrement"] }, 500, cors);
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
    return json({ errors: ["Erreur enregistrement commande"] }, 500, cors);
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
      returnUrl: `${config.functionsUrl}/checkout-confirm?order_id=${order.id}`,
    });

    await db
      .from("abonnement_orders")
      .update({ saferpay_token: result.Token, status: STATUS.PREPARE })
      .eq("id", order.id);

    // 5. URL de redirection vers la page de paiement
    return json({ redirectUrl: result.RedirectUrl, orderId: order.id }, 200, cors);
  } catch (err) {
    console.error("[create-order] saferpay initialize:", err);
    return json(
      { errors: ["Impossible d'initialiser le paiement, réessayez."] },
      502,
      cors,
    );
  }
});

function json(
  body: unknown,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
