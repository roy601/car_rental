import { createClient } from '@/lib/supabase/client'

export async function signUp(email: string, password: string, fullName: string, userType: 'buyer' | 'seller' = 'buyer') {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        full_name: fullName,
        user_type: userType,
      },
    },
  })

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  return user
}
