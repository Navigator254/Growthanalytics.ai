import { createBrowserClient } from '@supabase/ssr'

// These environment variables are loaded from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for the entire app
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Helper types for your database tables
export type Profile = {
  id: string
  email: string
  full_name: string
  company: string | null
  created_at: string
}

export type AnalysisJob = {
  id: string
  user_id: string
  filename: string
  segments: any
  created_at: string
}

export type Lead = {
  id: string
  email: string
  source: string
  converted: boolean
  created_at: string
}
