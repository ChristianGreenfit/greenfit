// Configuration lue depuis les variables d'environnement des Edge Functions.
// AUCUN secret n'est jamais exposé au navigateur.

function required(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    console.error(`[config] Variable d'environnement manquante : ${name}`);
    return "";
  }
  return value;
}

export const config = {
  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  saferpay: {
    customerId: required("SAFERPAY_CUSTOMER_ID"),
    terminalId: required("SAFERPAY_TERMINAL_ID"),
    jsonKey: required("SAFERPAY_JSON_KEY"),
    jsonSecret: required("SAFERPAY_JSON_SECRET"),
    // "true" => environnement de test Saferpay
    test: (Deno.env.get("SAFERPAY_TEST") ?? "true") === "true",
    specVersion: Deno.env.get("SAFERPAY_SPEC_VERSION") ?? "1.35",
  },

  soap: {
    // Service gsinfo.ch MAW_WebService (valeurs publiques, surchargeables)
    endpoint: Deno.env.get("SOAP_ENDPOINT") ??
      "http://myfitness.gsinfo.ch/MAW_WEBSERVICE_WEB/awws/MAW_WebService.awws",
    namespace: Deno.env.get("SOAP_NAMESPACE") ?? "urn:MAW_WebService",
    login: Deno.env.get("SOAP_LOGIN") ?? "-1",
    password: Deno.env.get("SOAP_PASSWORD") ?? "",
  },

  email: {
    resendApiKey: Deno.env.get("RESEND_API_KEY") ?? "",
    adminEmail: Deno.env.get("ADMIN_EMAIL") ?? "info@green-fit.ch",
    fromEmail: Deno.env.get("FROM_EMAIL") ?? "info@green-fit.ch",
  },

  // URL publique du site React (pour les redirections de retour)
  siteUrl: Deno.env.get("SITE_URL") ?? "",
  // URL de base des Edge Functions (pour l'URL de succès Saferpay)
  functionsUrl: Deno.env.get("FUNCTIONS_URL") ?? "",

  // Origines autorisées pour le CORS (séparées par des virgules)
  allowedOrigins: (Deno.env.get("ALLOWED_ORIGINS") ?? "*")
    .split(",")
    .map((o) => o.trim()),
};

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = config.allowedOrigins;
  const allowOrigin =
    allowed.includes("*") || (origin && allowed.includes(origin))
      ? origin ?? "*"
      : allowed[0] ?? "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  };
}
