// Simulates the exact PUT /api/content flow without needing auth.
// DELETE this file once the issue is resolved.
import { sendJson, readJson } from "./_lib/http.js";
import { config } from "./_lib/config.js";

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
  const log = [];
  try {
    log.push("step:start method=" + req.method);

    // Step 1: parse body just like the real PUT handler
    log.push("step:readJson");
    let body;
    try {
      body = await readJson(req);
    } catch (e) {
      log.push("readJson_error:" + String(e?.message || e));
      return sendJson(res, 400, { ok: false, log, error: "readJson failed: " + String(e?.message) });
    }

    log.push("step:body_parsed type=" + typeof body + " keys=" + (body ? Object.keys(body).join(",") : "null"));

    const content = body?.content;
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      log.push("step:invalid_content body_preview=" + JSON.stringify(body)?.slice(0, 200));
      return sendJson(res, 400, { ok: false, log, error: "Contenu manquant ou invalide" });
    }

    const size = JSON.stringify(content).length;
    log.push("step:content_ok size=" + size + " keys=" + Object.keys(content).join(","));

    // Step 2: upsert just like the real handler
    log.push("step:upsert_start");
    const result = await upsertSiteContent(content);
    log.push("step:upsert_done result=" + JSON.stringify(result));

    if (!result.ok) {
      return sendJson(res, 500, { ok: false, log, error: result.error });
    }

    return sendJson(res, 200, { ok: true, log });
  } catch (err) {
    log.push("step:CRASH error=" + String(err?.message || err));
    log.push("stack=" + String(err?.stack || "").slice(0, 400));
    return sendJson(res, 500, { ok: false, log, error: String(err?.message || err) });
  }
}
