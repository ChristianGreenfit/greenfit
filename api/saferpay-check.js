// Fonction serverless de DIAGNOSTIC (Vercel / Node).
// But : vérifier si l'IP de sortie de Vercel est acceptée par l'API
// Saferpay (contrairement à Supabase qui est bloqué / "connection reset").
//
// À supprimer une fois le diagnostic terminé.
//
// Nécessite les variables d'environnement Vercel :
//   SAFERPAY_CUSTOMER_ID, SAFERPAY_TERMINAL_ID,
//   SAFERPAY_JSON_KEY, SAFERPAY_JSON_SECRET,
//   SAFERPAY_TEST (optionnel : "true" pour l'environnement de test)
import https from "node:https";

export default async function handler(_req, res) {
  const cust = process.env.SAFERPAY_CUSTOMER_ID;
  const term = process.env.SAFERPAY_TERMINAL_ID;
  const key = process.env.SAFERPAY_JSON_KEY;
  const secret = process.env.SAFERPAY_JSON_SECRET;
  const isTest = (process.env.SAFERPAY_TEST ?? "false") === "true";
  const host = isTest ? "test.saferpay.com" : "www.saferpay.com";

  if (!cust || !term || !key || !secret) {
    return res
      .status(500)
      .json({ ok: false, error: "Variables SAFERPAY_* manquantes sur Vercel" });
  }

  const body = JSON.stringify({
    RequestHeader: {
      SpecVersion: "1.35",
      CustomerId: cust,
      RequestId: "vercel-check-" + Date.now(),
      RetryIndicator: 0,
    },
    TerminalId: term,
    Payment: {
      Amount: { Value: "100", CurrencyCode: "CHF" },
      OrderId: "VERCEL-CHECK",
      Description: "Egress check",
    },
    Payer: {
      LanguageCode: "fr",
      BillingAddress: {
        FirstName: "Test",
        LastName: "Vercel",
        Phone: "(+41)0791234567",
      },
    },
    ReturnUrl: { Url: "https://example.com/ok" },
  });

  const auth = "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");

  const result = await new Promise((resolve) => {
    const r = https.request(
      {
        host,
        port: 443,
        method: "POST",
        path: "/api/Payment/v1/PaymentPage/Initialize",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json",
          "Authorization": auth,
          "Content-Length": Buffer.byteLength(body),
          // Saferpay recommande Connection: close (pas de keep-alive)
          "Connection": "close",
        },
      },
      (resp) => {
        let data = "";
        resp.on("data", (c) => (data += c));
        resp.on("end", () =>
          resolve({
            reachable: true,
            host,
            httpStatus: resp.statusCode,
            body: data.slice(0, 500),
          }));
      },
    );
    r.on("error", (e) =>
      resolve({
        reachable: false,
        host,
        error: String((e && e.message) || e),
        code: e && e.code,
      }));
    r.setTimeout(20000, () => r.destroy(new Error("timeout")));
    r.write(body);
    r.end();
  });

  return res.status(result.reachable ? 200 : 502).json(result);
}
