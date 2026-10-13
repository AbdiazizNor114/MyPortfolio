import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
export const supabase = url && key ? createClient(url, key) : null;

export function getSupabase() {
  if (!supabase) throw new Error('Add your Supabase URL and publishable key to .env.local, then restart the app.');
  return supabase;
}
