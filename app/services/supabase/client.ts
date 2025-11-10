import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Config from '@/config'

/**
 * Supabase client for authentication, database, and storage
 * 
 * Uses AsyncStorage to persist auth sessions across app restarts
 */

// Debug: Check if credentials are loaded
console.log('🔍 Supabase Config Check:')
console.log('   URL:', Config.SUPABASE_URL || '❌ MISSING')
console.log('   Key:', Config.SUPABASE_ANON_KEY ? `✅ ${Config.SUPABASE_ANON_KEY.substring(0, 20)}...` : '❌ MISSING')

if (!Config.SUPABASE_URL || !Config.SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE CREDENTIALS MISSING!')
  console.error('   Check your .env.local file exists with:')
  console.error('   EXPO_PUBLIC_SUPABASE_URL=https://...')
  console.error('   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...')
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

