// Configuration lue depuis les variables d'environnement Vercel.
// AUCUN secret n'est jamais exposé au navigateur (fonctions serveur only).

function required(name) {
  const value = process.env[name];
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
    // "true" => environnement de test Saferpay (par défaut : production)
    test: (process.env.SAFERPAY_TEST ?? "false") === "true",
    specVersion: process.env.SAFERPAY_SPEC_VERSION ?? "1.35",
  },

  soap: {
    endpoint: process.env.SOAP_ENDPOINT ??
      "http://myfitness.gsinfo.ch/MAW_WEBSERVICE_WEB/awws/MAW_WebService.awws",
    namespace: process.env.SOAP_NAMESPACE ?? "urn:MAW_WebService",
    login: process.env.SOAP_LOGIN ?? "-1",
    password: process.env.SOAP_PASSWORD ?? "",
  },

  email: {
    adminEmail: process.env.ADMIN_EMAIL ?? "info@green-fit.ch",
    fromEmail: process.env.FROM_EMAIL ?? "info@green-fit.ch",
  },

  // URL publique du site (logo + liens dans les emails)
  siteUrl: process.env.SITE_URL ?? "https://greenfit-nu.vercel.app",

  // SMTP (envoi des emails depuis la boîte info@green-fit.ch)
  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    // true pour le port 465 (SSL), false pour 587 (STARTTLS)
    secure: (process.env.SMTP_SECURE ?? "").toLowerCase() === "true",
  },
};
