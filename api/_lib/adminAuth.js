// Auth admin — token HMAC signé (pas de cookie httpOnly en serverless sans edge middleware).
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_HOURS = 12;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function isAdminAuthConfigured() {
  return Boolean(adminPassword());
}

function sign(payload) {
  const secret = sessionSecret();
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createAdminToken() {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `admin:${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const parts = payload.split(":");
  if (parts.length !== 2 || parts[0] !== "admin") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export function checkAdminPassword(password) {
  const expected = adminPassword();
  if (!expected || typeof password !== "string") return false;
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) {
    // Compare against itself to keep roughly constant time on length mismatch
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function getBearerToken(req) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  return "";
}
