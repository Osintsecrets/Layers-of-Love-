// Minimal Supabase client (ESM) without bundlers.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export async function sb() {
  // Load the edge-friendly browser client from CDN
  if (!window.supabase) {
    await import("https://esm.sh/@supabase/supabase-js@2?bundle-deps");
  }
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      flowType: "pkce",
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

export function fmtErr(e) {
  return e?.message || e?.error_description || String(e);
}
