import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabasePublic = createClient(URL, ANON);

export const supabaseAdmin = createClient(URL, SERVICE);

export function createUserClient(accessToken) {
  return createClient(URL, ANON, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}
