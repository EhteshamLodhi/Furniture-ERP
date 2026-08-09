import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Lets UI decide whether to render a configuration notice instead of crashing. */
export const isSupabaseConfigured = Boolean(url && key);

/**
 * `createBrowserClient` returns a singleton, so calling this per component is
 * cheap and the auth/realtime connection is shared.
 */
export function createClient() {
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
    );
  }

  return createBrowserClient(url, key);
}
