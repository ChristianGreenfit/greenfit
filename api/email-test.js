// Test d'envoi de l'email de confirmation client.
// GET /api/email-test?to=email@example.com
// Auth : Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
import nodemailer from "nodemailer";
import { config } from "./_lib/config.js";
import { renderClientEmailPreview } from "./_lib/email.js";

export default async function handler(req, res) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || token !== config.supabaseServiceKey) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "Non autorisé" }));
    return;
  }

  const to = String(req.query?.to || "").trim();
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "Paramètre to (email) invalide" }));
    return;
  }

  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "SMTP non configuré sur Vercel" }));
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure || config.smtp.port === 465,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });

    const info = await transporter.sendMail({
      from: `"GreenFit" <${config.email.fromEmail}>`,
      to,
      subject: "GreenFit — Confirmation d’inscription (test)",
      html: renderClientEmailPreview(),
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        ok: true,
        to,
        messageId: info.messageId,
        response: info.response,
      }),
    );
  } catch (err) {
    console.error("[email-test]", err);
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        ok: false,
        error: String(err?.message || err),
      }),
    );
  }
}
