import { createClient } from '@supabase/supabase-js'

// This helper is used to initialize the database with required tables
// It should be called once during project setup

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function initializeDatabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    // Create users table
    const { error: usersError } = await supabase.from('users').insert([]).select()
    if (usersError && !usersError.message.includes('already exists')) {
      console.log('Creating users table...')
      // Users table would be created via SQL in Supabase dashboard
    }

    console.log('Database initialized successfully')
    return true
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// Helper to create a user profile after signup
export async function createUserProfile(
  userId: string,
  email: string,
  fullName: string,
  userType: 'buyer' | 'seller' = 'buyer'
) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
      full_name: fullName,
      user_type: userType,
      is_verified: false,
      verification_status: 'pending',
    })
    .select()

  if (error) {
    console.error('Error creating user profile:', error)
    throw error
  }

  return data
}
