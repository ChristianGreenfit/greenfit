// ============================================================
// GET /checkout-confirm?order_id=X
// URL de retour "succès" de Saferpay. Reproduit confirmPayment() :
// 1. Assert (vérifie la transaction via le token)
// 2. Capture (encaisse)
// 3. createContract (SOAP)
// 4. envoi des emails
// 5. redirige vers /resultat?state=success|error
// ============================================================

import { config } from "../_shared/config.ts";
import { db, STATUS } from "../_shared/db.ts";
import { assert, capture } from "../_shared/saferpay.ts";
import { createContract } from "../_shared/contract.ts";
import { sendOrderEmails } from "../_shared/email.ts";
import { dobToYmd } from "../_shared/validation.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("order_id");

  if (!orderId) {
    return redirect("error");
  }

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
    if (!transaction?.Id) {
      return redirect("fail");
    }
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
    const info = order.info as Record<string, unknown>;
    const user = order.user as { email: string; info: Record<string, string> };
    const u = user.info;

    const articleIds = ((info.options as { contract_id?: string }[]) ?? [])
      .map((o) => o.contract_id)
      .filter((id): id is string => Boolean(id));

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
      optionsList: ((info.options as { title: string; price: number }[]) ?? [])
        .map((o) => `${o.title} (CHF ${o.price})`),
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

    // Le paiement a réussi -> succès pour le client, même si le SOAP
    // doit encore être finalisé côté centre.
    return redirect("success");
  } catch (err) {
    console.error("[checkout-confirm]:", err);
    return redirect("error");
  }
});

function redirect(state: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${config.siteUrl}/resultat?state=${state}&type=fitness`,
    },
  });
}
