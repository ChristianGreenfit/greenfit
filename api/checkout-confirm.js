// ============================================================
// GET /api/checkout-confirm?order_id=X
// URL de retour de Saferpay. Reproduit confirmPayment() :
// 1. Assert (vérifie la transaction via le token)
// 2. Capture (encaisse)
// 3. createContract (SOAP)
// 4. envoi des emails
// 5. redirige vers /resultat?state=success|fail|error
// ============================================================

import { db, STATUS } from "./_lib/db.js";
import { assert, capture } from "./_lib/saferpay.js";
import { createContract } from "./_lib/contract.js";
import { sendOrderEmails } from "./_lib/email.js";
import { dobToYmd } from "./_lib/validation.js";
import { baseUrl, redirectTo } from "./_lib/http.js";

export default async function handler(req, res) {
  const base = baseUrl(req);
  const redirect = (state) =>
    redirectTo(res, `${base}/resultat?state=${state}&type=fitness`);

  const orderId = req.query?.order_id;
  if (!orderId) return redirect("error");

  const { data: order } = await db
    .from("abonnement_orders")
    .select("*, user:abonnement_users(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || !order.saferpay_token) {
    return redirect("error");
  }

  try {
    // 1. Assert — lit le statut réel du paiement
    const assertResult = await assert(order.saferpay_token);
    const transaction = assertResult.Transaction;

    // Paiement annulé / échoué : pas de transaction autorisée
    if (!transaction?.Id) return redirect("fail");
    const status = transaction.Status;
    if (status !== "AUTHORIZED" && status !== "CAPTURED") {
      return redirect("fail");
    }

    // 2. Capture (sauf si déjà capturée)
    if (status === "AUTHORIZED") {
      await capture(transaction.Id);
    }
    await db
      .from("abonnement_orders")
      .update({
        status: STATUS.CONFIRM,
        transaction_id: transaction.Id,
        saferpay_token: null,
      })
      .eq("id", order.id);

    // 3. Création du contrat (SOAP) + 4. emails
    const info = order.info ?? {};
    const user = order.user ?? {};
    const u = user.info ?? {};

    const articleIds = (info.options ?? [])
      .map((o) => o.contract_id)
      .filter(Boolean);

    const contract = await createContract({
      contractId: String(info.contract_id ?? ""),
      civilite: u.member_marital1 ?? "",
      prenom: u.member_firstname ?? "",
      nom: u.member_lastname ?? "",
      rue: u.member_address ?? "",
      npa: u.member_npa ?? "",
      ville: u.member_city ?? "",
      email: user.email,
      telephone: u.member_phone ?? "",
      dateNaissanceYmd: dobToYmd(u.member_dob ?? ""),
      montantCents: Math.round(Number(order.amount) * 100).toString(),
      articleIds,
    });

    await sendOrderEmails({
      orderId: order.id,
      contractId: String(info.contract_id ?? ""),
      title: String(info.title ?? "Abonnement"),
      price: Number(order.amount),
      extraFee: Number(info.extra_fee ?? 0),
      optionsList: (info.options ?? []).map((o) => `${o.title} (CHF ${o.price})`),
      civilite: u.member_marital1 ?? "",
      nom: u.member_lastname ?? "",
      prenom: u.member_firstname ?? "",
      adresse: u.member_address ?? "",
      npa: u.member_npa ?? "",
      ville: u.member_city ?? "",
      email: user.email,
      telephone: u.member_phone ?? "",
      dateNaissance: u.member_dob ?? "",
    });

    if (contract.success) {
      await db
        .from("abonnement_orders")
        .update({ status: STATUS.CONTRACT_CREATED })
        .eq("id", order.id);
    } else {
      // Paiement OK mais contrat non créé automatiquement : on log,
      // le centre pourra le créer manuellement (email déjà envoyé).
      console.error("[checkout-confirm] contrat non créé:", contract.error);
    }

    return redirect("success");
  } catch (err) {
    console.error("[checkout-confirm]:", err?.details ?? err);
    return redirect("error");
  }
}
