import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return NextResponse.redirect(new URL(next, request.url))
    }
    return NextResponse.redirect(new URL(`/auth/error?error=${exchangeError.message}`, request.url))
  }

  if (error) {
    return NextResponse.redirect(new URL(`/auth/error?error=${error_description || error}`, request.url))
  }

  return NextResponse.redirect(new URL('/auth/error', request.url))
}
