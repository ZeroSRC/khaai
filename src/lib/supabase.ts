import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase (used in browser/LIFF context)
// Sets app.line_uid config per request via RLS helper
export function createSupabaseClient(lineUid?: string) {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: lineUid ? { 'x-line-uid': lineUid } : {},
    },
  })
  return client
}

// Singleton for use in non-auth contexts (public reads)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
