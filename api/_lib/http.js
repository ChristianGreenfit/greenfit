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

/**
 * Lit le corps JSON de façon compatible Vercel Node :
 * - body déjà parsé (objet)
 * - body string / Buffer
 * - sinon stream IncomingMessage via events (évite for-await qui crash parfois)
 */
export async function readJson(req) {
  try {
    if (req.body !== undefined && req.body !== null && req.body !== "") {
      if (typeof Buffer !== "undefined" && Buffer.isBuffer(req.body)) {
        const raw = req.body.toString("utf8");
        return raw ? JSON.parse(raw) : null;
      }
      if (typeof req.body === "string") {
        return req.body ? JSON.parse(req.body) : null;
      }
      if (typeof req.body === "object") {
        return req.body;
      }
    }

    if (typeof req.on !== "function") return null;

    const raw = await new Promise((resolve, reject) => {
      const chunks = [];
      let size = 0;
      const MAX = 4 * 1024 * 1024;

      const onData = (chunk) => {
        size += chunk.length || 0;
        if (size > MAX) {
          cleanup();
          reject(new Error("Body too large"));
          return;
        }
        chunks.push(chunk);
      };
      const onEnd = () => {
        cleanup();
        try {
          resolve(Buffer.concat(chunks).toString("utf8"));
        } catch (err) {
          reject(err);
        }
      };
      const onError = (err) => {
        cleanup();
        reject(err);
      };
      const cleanup = () => {
        req.off?.("data", onData);
        req.off?.("end", onEnd);
        req.off?.("error", onError);
      };

      req.on("data", onData);
      req.on("end", onEnd);
      req.on("error", onError);
    });

    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("[readJson]", String(err?.message || err));
    return null;
  }
}
