import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { config } from "./config.ts";

// Client Supabase avec la service_role key : bypass la RLS.
// À n'utiliser QUE dans les Edge Functions (jamais côté navigateur).
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
} as const;
