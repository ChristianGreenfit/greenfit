// GET  /api/content  — public (charge le contenu du site)
// PUT  /api/content  — admin (sauvegarde), Authorization: Bearer <admin token>
import { db } from "./_lib/db.js";
import { getBearerToken, verifyAdminToken } from "./_lib/adminAuth.js";
import { sendJson, readJson } from "./_lib/http.js";
import { defaultContent } from "./_lib/defaultContent.js";
import { config } from "./_lib/config.js";

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

/** Upsert via REST PostgREST — plus stable que supabase-js sur Vercel pour gros JSON. */
async function upsertSiteContent(content) {
  const base = String(config.supabaseUrl || "").replace(/\/$/, "");
  const key = config.supabaseServiceKey;
  if (!base || !key) {
    return { ok: false, error: "Configuration Supabase manquante sur Vercel" };
  }

  let safeContent;
  try {
    safeContent = JSON.parse(JSON.stringify(content));
  } catch {
    return { ok: false, error: "Contenu non sérialisable" };
  }

  const res = await fetch(`${base}/rest/v1/site_content?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      id: "main",
      data: safeContent,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      error: `Supabase ${res.status}: ${text.slice(0, 300) || res.statusText}`,
    };
  }
  return { ok: true };
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const row = await loadRow();
      const saved = row?.data && Object.keys(row.data).length > 0 ? row.data : null;
      const content = saved ? deepMerge(defaultContent, saved) : defaultContent;

      if (!saved) {
        const init = await upsertSiteContent(defaultContent);
        if (!init.ok) throw new Error(init.error);
      }

      return sendJson(res, 200, {
        content,
        updatedAt: row?.updated_at ?? null,
        source: saved ? "supabase" : "defaults",
      });
    }

    if (req.method === "PUT") {
      console.log("[content PUT] start");

      const token = getBearerToken(req);
      console.log("[content PUT] token length:", token?.length ?? 0);

      if (!verifyAdminToken(token)) {
        console.log("[content PUT] auth failed");
        return sendJson(res, 401, { ok: false, error: "Non autorisé" });
      }
      console.log("[content PUT] auth OK");

      let body;
      try {
        body = await readJson(req);
        console.log("[content PUT] body parsed, type:", typeof body, "keys:", body ? Object.keys(body).join(",") : "null");
      } catch (parseErr) {
        console.error("[content PUT] readJson crash:", parseErr);
        return sendJson(res, 400, { ok: false, error: "Erreur lecture corps: " + String(parseErr?.message || parseErr) });
      }

      const content = body?.content;
      if (!content || typeof content !== "object" || Array.isArray(content)) {
        console.log("[content PUT] invalid content. body:", JSON.stringify(body)?.slice(0, 200));
        return sendJson(res, 400, {
          ok: false,
          error: "Contenu manquant ou invalide",
        });
      }

      const contentSize = JSON.stringify(content).length;
      console.log("[content PUT] content size:", contentSize, "bytes, keys:", Object.keys(content).join(","));

      const result = await upsertSiteContent(content);
      console.log("[content PUT] upsert result:", JSON.stringify(result));

      if (!result.ok) {
        return sendJson(res, 500, { ok: false, error: result.error });
      }

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
