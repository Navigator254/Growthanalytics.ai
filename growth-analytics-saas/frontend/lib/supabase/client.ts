'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase environment variables are missing. Check Vercel settings!');
}

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);