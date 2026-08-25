// Aperçu navigateur de l'email de confirmation client.
// Ouvre : https://TON-SITE.vercel.app/api/email-preview
import { renderClientEmailPreview } from "./_lib/email.js";

export default function handler(_req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.statusCode = 200;
  res.end(renderClientEmailPreview());
}
