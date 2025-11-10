import { supabase } from './client'

/**
 * Simple test to verify Supabase connection is working
 * Call this from a screen to test the connection
 */
export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test 1: Check if client is initialized
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
    console.log('✅ Supabase client initialized')
    
    // Test 2: Try to query the assessments table (will fail if not created yet)
    const { data, error } = await supabase
      .from('assessments')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('⚠️  Database query error:', error.message)
      console.log('   This is expected if you haven\'t run the SQL schema yet')
      return {
        success: false,
        message: 'Connected to Supabase, but tables not created yet',
        error: error.message,
      }
    }
    
    console.log('✅ Successfully queried database')
    console.log('✅ All tests passed!')
    
    return {
      success: true,
      message: 'Supabase connection working perfectly!',
    }
    
  } catch (error: any) {
    console.log('❌ Connection test failed:', error.message)
    return {
      success: false,
      message: 'Connection failed',
      error: error.message,
    }
  }
}

/**
 * Test authentication (sign up / sign in)
 */
export async function testSupabaseAuth(email: string, password: string) {
  try {
    console.log('🔍 Testing Supabase auth...')
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.log('⚠️  Auth error:', error.message)
      return {
        success: false,
        message: error.message,
      }
    }
    
    console.log('✅ Successfully authenticated!')
    console.log('   User ID:', data.user?.id)
    console.log('   Email:', data.user?.email)
    
    return {
      success: true,
      message: 'Authentication successful!',
      user: data.user,
    }
    
  } catch (error: any) {
    console.log('❌ Auth test failed:', error.message)
    return {
      success: false,
      message: error.message,
    }
  }
}

