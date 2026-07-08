// ============================================================
// Client Saferpay JSON API (Node) — requêtes HTTPS avec
// Connection: close (recommandé par Saferpay, pas de keep-alive).
// Docs : https://saferpay.github.io/jsonapi/
// ============================================================

import https from "node:https";
import { randomUUID } from "node:crypto";
import { config } from "./config.js";

function host() {
  return config.saferpay.test ? "test.saferpay.com" : "www.saferpay.com";
}

function authHeader() {
  const { jsonKey, jsonSecret } = config.saferpay;
  return "Basic " + Buffer.from(`${jsonKey}:${jsonSecret}`).toString("base64");
}

function requestHeader() {
  return {
    SpecVersion: config.saferpay.specVersion,
    CustomerId: config.saferpay.customerId,
    RequestId: randomUUID(),
    RetryIndicator: 0,
  };
}

export class SaferpayError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "SaferpayError";
    this.details = details;
  }
}

function call(path, body) {
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: host(),
        port: 443,
        method: "POST",
        path: "/api" + path,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json",
          "Authorization": authHeader(),
          "Content-Length": Buffer.byteLength(payload),
          "Connection": "close",
        },
      },
      (resp) => {
        let text = "";
        resp.on("data", (c) => (text += c));
        resp.on("end", () => {
          let json = null;
          try {
            json = text ? JSON.parse(text) : null;
          } catch {
            json = { raw: text };
          }
          if (resp.statusCode < 200 || resp.statusCode >= 300) {
            reject(
              new SaferpayError(
                `Saferpay ${path} a répondu ${resp.statusCode}`,
                json,
              ),
            );
          } else {
            resolve(json);
          }
        });
      },
    );
    req.on("error", (e) =>
      reject(new SaferpayError(`Saferpay ${path}: ${e.message}`, { code: e.code })));
    req.setTimeout(25000, () => req.destroy(new Error("timeout")));
    req.write(payload);
    req.end();
  });
}

// Étape 1 — Initialize la page de paiement (spec JSON ≥ 1.32)
export function initialize(p) {
  const body = {
    RequestHeader: requestHeader(),
    TerminalId: config.saferpay.terminalId,
    Payment: {
      Amount: { Value: p.amountCents, CurrencyCode: "CHF" },
      OrderId: p.orderId,
      Description: p.description,
    },
    Payer: {
      LanguageCode: "fr",
      BillingAddress: {
        FirstName: p.firstName,
        LastName: p.lastName,
        Phone: p.phone,
      },
    },
    ReturnUrl: { Url: p.returnUrl },
  };
  return call("/Payment/v1/PaymentPage/Initialize", body);
}

// Étape 2 — Assert : vérifie le résultat du paiement
export function assert(token) {
  return call("/Payment/v1/PaymentPage/Assert", {
    RequestHeader: requestHeader(),
    Token: token,
  });
}

// Étape 3 — Capture : encaisse réellement la transaction
export function capture(transactionId) {
  return call("/Payment/v1/Transaction/Capture", {
    RequestHeader: requestHeader(),
    TransactionReference: { TransactionId: transactionId },
  });
}
