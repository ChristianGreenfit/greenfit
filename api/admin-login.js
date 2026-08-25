import {
  checkAdminPassword,
  createAdminToken,
  isAdminAuthConfigured,
} from "./_lib/adminAuth.js";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  if (!isAdminAuthConfigured()) {
    res.statusCode = 503;
    res.end(
      JSON.stringify({
        ok: false,
        error:
          "Mot de passe admin non configuré. Ajoutez ADMIN_PASSWORD dans Vercel.",
      }),
    );
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  if (!body || typeof body !== "object") {
    // Fallback: lire le flux si Vercel n'a pas parsé
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString("utf8");
      body = raw ? JSON.parse(raw) : {};
    } catch {
      body = {};
    }
  }

  const password = String(body.password || "");
  if (!checkAdminPassword(password)) {
    // Petite latence anti-bruteforce
    await new Promise((r) => setTimeout(r, 400));
    res.statusCode = 401;
    res.end(JSON.stringify({ ok: false, error: "Mot de passe incorrect" }));
    return;
  }

  const token = createAdminToken();
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, token }));
}
