'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '⚠️ Supabase environment variables are missing. Check Vercel settings!'
  );
}

export const supabase = createClientComponentClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);'use client';

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
