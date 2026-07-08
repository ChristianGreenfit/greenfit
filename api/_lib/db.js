import { createClient } from "@supabase/supabase-js";
import { config } from "./config.js";

// Client Supabase avec la service_role key : bypass la RLS.
// À n'utiliser QUE côté serveur (jamais dans le navigateur).
export const db = createClient(
  config.supabaseUrl,
  config.supabaseServiceKey,
  { auth: { persistSession: false } },
);

export const STATUS = {
  CREATED: 0,
  PREPARE: 1,
  CONFIRM: 2,
  CONTRACT_CREATED: 3,
};
