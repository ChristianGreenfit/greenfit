// Petits utilitaires HTTP pour les fonctions serverless Vercel (Node).

export function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

export function redirectTo(res, url) {
  res.statusCode = 302;
  res.setHeader("Location", url);
  res.end();
}

// URL de base réelle (respecte le domaine custom via les en-têtes Vercel).
export function baseUrl(req) {
  const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0];
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

// Lit le corps JSON, que Vercel l'ait déjà parsé (req.body) ou non.
export async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    return req.body;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
