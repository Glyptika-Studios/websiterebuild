import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const serverAuthOptions = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
};

export const supabasePublic = createClient(URL, ANON, {
  auth: serverAuthOptions,
});

export const supabaseAdmin = createClient(URL, SERVICE, {
  auth: serverAuthOptions,
});

export function createAuthClient() {
  return createClient(URL, ANON, {
    auth: serverAuthOptions,
  });
}

export function createUserClient(accessToken) {
  return createClient(URL, ANON, {
    auth: serverAuthOptions,
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}
