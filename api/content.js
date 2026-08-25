// GET  /api/content  — public (charge le contenu du site)
// PUT  /api/content  — admin (sauvegarde), Authorization: Bearer <admin token>
import { db } from "./_lib/db.js";
import { getBearerToken, verifyAdminToken } from "./_lib/adminAuth.js";
import { sendJson, readJson } from "./_lib/http.js";
import { defaultContent } from "./_lib/defaultContent.js";

function deepMerge(base, overlay) {
  if (!overlay || typeof overlay !== "object" || Array.isArray(overlay)) {
    return overlay === undefined ? base : overlay;
  }
  const out = { ...base };
  for (const key of Object.keys(overlay)) {
    const b = base?.[key];
    const o = overlay[key];
    if (
      b &&
      o &&
      typeof b === "object" &&
      typeof o === "object" &&
      !Array.isArray(b) &&
      !Array.isArray(o)
    ) {
      out[key] = deepMerge(b, o);
    } else if (o !== undefined) {
      out[key] = o;
    }
  }
  return out;
}

async function loadRow() {
  const { data, error } = await db
    .from("site_content")
    .select("data, updated_at")
    .eq("id", "main")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const row = await loadRow();
      const saved = row?.data && Object.keys(row.data).length > 0 ? row.data : null;
      const content = saved ? deepMerge(defaultContent, saved) : defaultContent;

      // Si vide, on initialise avec les défauts
      if (!saved) {
        await db.from("site_content").upsert({
          id: "main",
          data: defaultContent,
          updated_at: new Date().toISOString(),
        });
      }

      return sendJson(res, 200, {
        content,
        updatedAt: row?.updated_at ?? null,
        source: saved ? "supabase" : "defaults",
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

      return sendJson(res, 200, { ok: true });
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
