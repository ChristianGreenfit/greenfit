// Diagnostic endpoint — tests Supabase write WITHOUT auth.
// DELETE this file once the issue is resolved.
import { sendJson } from "./_lib/http.js";
import { config } from "./_lib/config.js";
import { db } from "./_lib/db.js";

export default async function handler(req, res) {
  const steps = [];

  try {
    // Step 1: Check env vars
    steps.push({
      step: "env",
      SUPABASE_URL: config.supabaseUrl ? `${config.supabaseUrl.slice(0, 30)}…` : "MISSING",
      SUPABASE_KEY: config.supabaseServiceKey ? `${config.supabaseServiceKey.slice(0, 10)}…` : "MISSING",
    });

    // Step 2: Read current row via supabase-js
    const { data: row, error: readErr } = await db
      .from("site_content")
      .select("id, updated_at")
      .eq("id", "main")
      .maybeSingle();

    steps.push({
      step: "read_supabase_js",
      ok: !readErr,
      row: row ? { id: row.id, updated_at: row.updated_at } : null,
      error: readErr ? String(readErr.message || readErr) : null,
    });

    // Step 3: Try writing via supabase-js upsert
    const testPayload = { _diag: true, ts: new Date().toISOString() };
    const { error: writeErr } = await db.from("site_content").upsert(
      { id: "diag_test", data: testPayload, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );

    steps.push({
      step: "write_supabase_js",
      ok: !writeErr,
      error: writeErr ? String(writeErr.message || writeErr) : null,
    });

    // Step 4: Try writing via raw fetch (PostgREST)
    const base = String(config.supabaseUrl || "").replace(/\/$/, "");
    const key = config.supabaseServiceKey;
    const fetchRes = await fetch(`${base}/rest/v1/site_content?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        id: "diag_test",
        data: { _diag: true, ts: new Date().toISOString(), via: "fetch" },
        updated_at: new Date().toISOString(),
      }),
    });

    const fetchText = await fetchRes.text().catch(() => "");
    steps.push({
      step: "write_postgrest_fetch",
      ok: fetchRes.ok,
      status: fetchRes.status,
      body: fetchText.slice(0, 300),
    });

    // Step 5: Cleanup diag row
    await db.from("site_content").delete().eq("id", "diag_test");
    steps.push({ step: "cleanup", ok: true });

    // Step 6: Try upserting the "main" row with minimal content to check write perms
    const { error: mainWriteErr } = await db.from("site_content").upsert(
      {
        id: "main",
        data: row?.data || { _init: true },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    steps.push({
      step: "write_main_supabase_js",
      ok: !mainWriteErr,
      error: mainWriteErr ? String(mainWriteErr.message || mainWriteErr) : null,
    });

    return sendJson(res, 200, { ok: true, steps });
  } catch (err) {
    steps.push({ step: "CRASH", error: String(err?.message || err), stack: String(err?.stack || "").slice(0, 500) });
    return sendJson(res, 500, { ok: false, steps });
  }
}
