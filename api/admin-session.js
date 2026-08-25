import { getBearerToken, verifyAdminToken } from "./_lib/adminAuth.js";

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const token = getBearerToken(req);
  const ok = verifyAdminToken(token);
  res.statusCode = ok ? 200 : 401;
  res.end(JSON.stringify({ ok }));
}
