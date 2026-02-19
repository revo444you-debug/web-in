import { createClient } from '@supabase/supabase-js'

// Supabase project URL and anon key
// Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable auth persistence for simplicity
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js-web',
    },
  },
})

// Log connection info for debugging
if (typeof window !== 'undefined') {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    anonKeyPrefix: supabaseAnonKey.substring(0, 20) + '...',
  })
}
