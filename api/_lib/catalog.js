// ============================================================
// Catalogue AUTORITATIF (côté serveur uniquement)
// Le navigateur envoie seulement des identifiants ; les prix et
// numéros de contrat sont résolus ICI pour empêcher toute
// manipulation côté client.
// ============================================================

export const CENTER = {
  valFitness: "096",
  valCentre: "9601", // fitness (golf = 9602 si besoin plus tard)
  paymentMode: "SP",
};

// Numéros de contrat fournis par le centre
export const PLANS = {
  "3": {
    months: 3,
    label: "Abonnement 3 mois",
    price: 369,
    contractId: "2016040507190991_2015012617502346",
  },
  "6": {
    months: 6,
    label: "Abonnement 6 mois",
    price: 499,
    contractId: "2023091810523634_2015012617502346",
  },
  "12": {
    months: 12,
    label: "Abonnement 12 mois",
    price: 850,
    contractId: "2023090412512030_2015012617502346",
  },
};

export const OPTIONS = {
  "programme-inbody": {
    id: "programme-inbody",
    label: "Programme personnalisé / Inbody analyse corporelle",
    price: 60,
    articleId: "2016090717535974_20150122163636",
  },
  "test-condition": {
    id: "test-condition",
    label: "Test condition, programme personnalisé et Inbody analyse corporelle",
    price: 115,
    articleId: "2016090717543784_20150122163636",
  },
  "nutrition": {
    id: "nutrition",
    label: "Nutrition (4 séances) avec Inbody analyse corporelle",
    price: 390,
    articleId: "Import_78",
  },
  "linge-casier": {
    id: "linge-casier",
    label: "Linge / location casier",
    price: 150,
    articleId: "2016020212343944_2015012617502346",
  },
};

export function resolvePlan(months) {
  return PLANS[String(months)] ?? null;
}

export function resolveOptions(ids) {
  if (!Array.isArray(ids)) return [];
  return ids.map((id) => OPTIONS[id]).filter(Boolean);
}
