import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Config from '@/config'

/**
 * Supabase client for authentication, database, and storage
 *
 * Uses AsyncStorage to persist auth sessions across app restarts
 */

if (!Config.SUPABASE_URL || !Config.SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase credentials are missing. Check your .env.local file for EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(
  Config.SUPABASE_URL,
  Config.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)

