// ============================================================
// Client Saferpay JSON API
// Reproduit fidèlement la logique du CheckoutController PHP
// (librairie ticketpark/saferpay-json) en appels fetch directs.
//
// Docs : https://saferpay.github.io/jsonapi/
// ============================================================

import { config } from "./config.ts";

function baseUrl(): string {
  return config.saferpay.test
    ? "https://test.saferpay.com/api"
    : "https://www.saferpay.com/api";
}

function authHeader(): string {
  const { jsonKey, jsonSecret } = config.saferpay;
  return "Basic " + btoa(`${jsonKey}:${jsonSecret}`);
}

function requestHeader() {
  return {
    SpecVersion: config.saferpay.specVersion,
    CustomerId: config.saferpay.customerId,
    RequestId: crypto.randomUUID(),
    RetryIndicator: 0,
  };
}

async function call<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(baseUrl() + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    throw new SaferpayError(
      `Saferpay ${path} a répondu ${res.status}`,
      json,
    );
  }
  return json as T;
}

export class SaferpayError extends Error {
  details: unknown;
  constructor(message: string, details: unknown) {
    super(message);
    this.name = "SaferpayError";
    this.details = details;
  }
}

interface InitializeParams {
  amountCents: string; // valeur en centimes, ex "36900"
  orderId: string;
  description: string;
  firstName: string;
  lastName: string;
  phone: string;
  // URL de retour unique : le client y revient quel que soit le résultat.
  // Le statut réel (autorisé / annulé) se lit ensuite via Assert.
  returnUrl: string;
}

export interface InitializeResult {
  Token: string;
  RedirectUrl: string;
}

// Étape 1 — Initialize la page de paiement (spec JSON ≥ 1.32)
export function initialize(p: InitializeParams): Promise<InitializeResult> {
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
  return call<InitializeResult>("/Payment/v1/PaymentPage/Initialize", body);
}

export interface AssertResult {
  Transaction?: {
    Id: string;
    Status: string; // AUTHORIZED | CAPTURED | PENDING ...
    Amount?: { Value: string; CurrencyCode: string };
  };
}

// Étape 2 — Assert : vérifie le résultat du paiement
export function assert(token: string): Promise<AssertResult> {
  const body = { RequestHeader: requestHeader(), Token: token };
  return call<AssertResult>("/Payment/v1/PaymentPage/Assert", body);
}

export interface CaptureResult {
  Status: string; // CAPTURED
  CaptureId?: string;
}

// Étape 3 — Capture : encaisse réellement la transaction
export function capture(transactionId: string): Promise<CaptureResult> {
  const body = {
    RequestHeader: requestHeader(),
    TransactionReference: { TransactionId: transactionId },
  };
  return call<CaptureResult>("/Payment/v1/Transaction/Capture", body);
}
