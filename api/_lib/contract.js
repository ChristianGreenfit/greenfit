// ============================================================
// Création de contrat via SOAP — port de createContract() + Soap.php
// Service : gsinfo.ch "MAW_WebService"
//   endpoint  : http://myfitness.gsinfo.ch/MAW_WEBSERVICE_WEB/awws/MAW_WebService.awws
//   style     : document / literal, elementFormDefault="unqualified"
//   méthode   : WS_Client_Contract_and_Articles_Create
// ============================================================

import { config } from "./config.js";
import { CENTER } from "./catalog.js";

const METHOD = "WS_Client_Contract_and_Articles_Create";
const RESULT_TAG = "WS_Client_Contract_and_Articles_CreateResult";

// Ordre EXACT du complexType d'entrée (document/literal → l'ordre compte).
function buildOrderedParams(p) {
  const today = new Date();
  const startYmd = today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  return [
    ["sVal_Fitness", CENTER.valFitness],
    ["sVal_Centre", CENTER.valCentre],
    ["sClientEmail", p.email],
    ["sClientCivilite", p.civilite],
    ["sClientNom", p.nom],
    ["sClientPrenom", p.prenom],
    ["sClientRue", p.rue],
    ["sClientNPA", p.npa],
    ["sClientVille", p.ville],
    ["sClientPays", "CH"],
    ["sClientTelFix", p.telephone],
    ["sClientTelMob", p.telephone],
    ["sClientProfession", ""],
    ["sClientDateNaissance", p.dateNaissanceYmd],
    ["sIDContrat", p.contractId],
    ["sDateDebutContrat", startYmd],
    ["sCodeModeReglement", CENTER.paymentMode], // "SP"
    ["sMontantPaye", p.montantCents],
    ["sListeIdArticles", (p.articleIds ?? []).join(";")],
    ["sLogin", config.soap.login], // "-1"
    ["sMotdePasse", config.soap.password], // ""
    ["sMethodeChiffrage", "0"], // 0 = en clair (comme le plugin)
    ["sEnvoieEmailClient", "1"],
    ["sEnvoieEmailCentre", "1"],
    ["sRenouvellement", "0"],
  ];
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Wrapper qualifié (préfixe m), enfants NON qualifiés (unqualified).
function buildEnvelope(params) {
  const children = params
    .map(([k, v]) => `<${k}>${escapeXml(v)}</${k}>`)
    .join("");
  return `<?xml version="1.0" encoding="utf-8"?>` +
    `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">` +
    `<soap:Body>` +
    `<m:${METHOD} xmlns:m="${config.soap.namespace}">${children}</m:${METHOD}>` +
    `</soap:Body>` +
    `</soap:Envelope>`;
}

// Équivalent de PHP urldecode() : '+' => espace puis %XX.
function phpUrldecode(value) {
  const spaced = value.replace(/\+/g, " ");
  try {
    return decodeURIComponent(spaced);
  } catch {
    return spaced;
  }
}

function decodeXmlEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

function extractResult(xml) {
  const re = new RegExp(
    `<(?:\\w+:)?${RESULT_TAG}[^>]*>([\\s\\S]*?)</(?:\\w+:)?${RESULT_TAG}>`,
  );
  const m = xml.match(re);
  return m ? m[1] : null;
}

export async function createContract(p) {
  if (!config.soap.endpoint || !config.soap.namespace) {
    return {
      success: false,
      error: "SOAP non configuré (SOAP_ENDPOINT / SOAP_NAMESPACE manquants).",
    };
  }

  const envelope = buildEnvelope(buildOrderedParams(p));

  let raw = "";
  try {
    const res = await fetch(config.soap.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: `${config.soap.namespace}/${METHOD}`,
        "Connection": "close",
      },
      body: envelope,
    });
    raw = await res.text();

    if (!res.ok) {
      return { success: false, raw, error: `SOAP HTTP ${res.status}` };
    }
    if (/<(?:\w+:)?Fault>/.test(raw)) {
      return { success: false, raw, error: "SOAP Fault" };
    }
  } catch (err) {
    return { success: false, error: String(err) };
  }

  const rawResult = extractResult(raw);
  if (rawResult === null) {
    return { success: false, raw, error: "Réponse SOAP inattendue" };
  }

  const result = phpUrldecode(decodeXmlEntities(rawResult)).trim();

  // "ERR:..." => échec ; nombre négatif => échec ; sinon => succès.
  if (result.startsWith("ERR:")) {
    return { success: false, raw, error: result.slice(4).trim() };
  }
  const asInt = parseInt(result, 10);
  if (!Number.isNaN(asInt) && asInt < 0) {
    return { success: false, raw, error: result, data: result };
  }
  return { success: true, raw, data: result };
}
