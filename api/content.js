// GET  /api/content  — public
// PUT  /api/content  — admin (Bearer admin token)
import { db } from "./_lib/db.js";
import { getBearerToken, verifyAdminToken } from "./_lib/adminAuth.js";
import { sendJson, readJson } from "./_lib/http.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { data, error } = await db
        .from("site_content")
        .select("data, updated_at")
        .eq("id", "main")
        .maybeSingle();

      if (error) throw error;

      const saved =
        data?.data && typeof data.data === "object" && Object.keys(data.data).length > 0
          ? data.data
          : null;

      return sendJson(res, 200, {
        content: saved,
        updatedAt: data?.updated_at ?? null,
        source: saved ? "supabase" : "empty",
      });
    }

    if (req.method === "PUT") {
      const token = getBearerToken(req);
      if (!verifyAdminToken(token)) {
        return sendJson(res, 401, { ok: false, error: "Non autorisé" });
      }

      const body = await readJson(req);
      const content = body?.content;
      if (!content || typeof content !== "object") {
        return sendJson(res, 400, { ok: false, error: "Contenu manquant" });
      }

      const { error } = await db.from("site_content").upsert({
        id: "main",
        data: content,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;

      return sendJson(res, 200, { ok: true, updatedAt: new Date().toISOString() });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (err) {
    console.error("[content]", err);
    return sendJson(res, 500, {
      ok: false,
      error: String(err?.message || err),
    });
  }
}
