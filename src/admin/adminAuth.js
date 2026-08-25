const STORAGE_KEY = "greenfit_admin_token";

export function getAdminToken() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function setAdminToken(token) {
  try {
    sessionStorage.setItem(STORAGE_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearAdminToken() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export async function loginAdmin(password) {
  const res = await fetch("/api/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    throw new Error(data.error || "Connexion impossible");
  }
  setAdminToken(data.token);
  return data.token;
}

export async function verifyAdminSession() {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/admin-session", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      clearAdminToken();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
