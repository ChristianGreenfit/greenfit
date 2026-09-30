/**
 * Test manuel : simule un checkout 12 mois à 750 CHF (offre octobre)
 * et crée le contrat gsinfo SANS Saferpay ni emails.
 *
 *   vercel env run --environment=production -- node scripts/simulate-promo-checkout.mjs
 */
import { resolvePlan } from "../api/_lib/catalog.js";
import { applyPlanPromo } from "../api/_lib/promo.js";
import { createContract } from "../api/_lib/contract.js";
import { validateClient, dobToYmd } from "../api/_lib/validation.js";

const client = {
  member_marital1: "Monsieur",
  member_firstname: "Test",
  member_lastname: "PromoOctobreSoldé",
  member_email: "test.promo.octobre.solde@green-fit.ch",
  member_phone: "790000001",
  member_dob: "15.03.1990",
  member_address: "Industriestrasse 16",
  member_npa: "3970",
  member_city: "Salquenen",
  conditions_fitness: true,
};

const validation = validateClient(client);
if (!validation.success) {
  console.error("validation", validation.errors);
  process.exit(1);
}

const plan = resolvePlan(12);
const promo = applyPlanPromo(plan);
const paidChf = promo.price;
const gsinfoChf = plan.price;
const montantCents = Math.round(gsinfoChf * 100).toString();

console.log(
  JSON.stringify(
    {
      step: "simulate-checkout",
      saferpay: "skipped (paiement simulé OK)",
      plan: plan.label,
      catalogChf: plan.price,
      promoActive: promo.active,
      promoDiscount: promo.discount,
      paidChf,
      gsinfoChf,
      montantCents,
      client: {
        nom: `${client.member_firstname} ${client.member_lastname}`,
        email: client.member_email,
      },
    },
    null,
    2,
  ),
);

const soap = await createContract({
  contractId: plan.contractId,
  civilite: client.member_marital1,
  prenom: client.member_firstname,
  nom: client.member_lastname,
  rue: client.member_address,
  npa: client.member_npa,
  ville: client.member_city,
  email: client.member_email,
  telephone: `(+41)0${client.member_phone}`,
  dateNaissanceYmd: dobToYmd(client.member_dob),
  montantCents,
  articleIds: [],
  sendClientEmail: "0",
  sendCentreEmail: "0",
});

console.log(
  JSON.stringify(
    {
      gsinfo: {
        success: soap.success,
        error: soap.error ?? null,
        data: soap.data ?? null,
      },
    },
    null,
    2,
  ),
);

if (!soap.success) process.exit(2);
