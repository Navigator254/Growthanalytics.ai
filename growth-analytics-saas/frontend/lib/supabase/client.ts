'use client';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

// Lazy-load env vars to avoid build-time crash
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase environment variables are missing. Check Vercel settings!'
  );
}

// Create browser client with auth helpers
export const supabase = createBrowserSupabaseClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
  options: {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
});
