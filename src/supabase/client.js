import { createClient } from "@supabase/supabase-js";

// This publishable key is safe for browser clients. Access to data is
// still governed by Supabase Row Level Security policies.
const url =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://hwksfmccecfsxbxjlizm.supabase.co";

const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_csfbw1ltdqpNKaH71KsvDw_YBYExeiZ";

export const supabase = createClient(url, publishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
