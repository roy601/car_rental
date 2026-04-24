'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
  }

  return (
    <main style={{ minHeight: '100svh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left: Branding Panel ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0a0a0a 0%, #151515 50%, #1a2e1a 100%)' }}
      >
        {/* Decorative green glow */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '480px', height: '480px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,79,67,0.35), transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(218,170,0,0.12), transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #004F43, #006955)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            </svg>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.3px' }}>
            AutoFleet<span style={{ color: '#DAAA00' }}>Pro</span>
          </span>
        </div>

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '999px', marginBottom: '24px',
            background: 'rgba(0,79,67,0.2)', border: '1px solid rgba(0,105,85,0.4)',
            fontSize: '12px', fontWeight: 600, color: '#6ee7b7',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
            3,200+ vehicles available now
          </div>

          <h1 style={{
            fontSize: '48px', fontWeight: 800, lineHeight: 1.1,
            color: '#fff', letterSpacing: '-1px', marginBottom: '20px',
          }}>
            Drive your<br />
            <span style={{
              background: 'linear-gradient(90deg, #DAAA00, #E8C547)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              next adventure
            </span>
          </h1>

          <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.7, maxWidth: '360px', marginBottom: '40px' }}>
            Buy, rent, or sell vehicles on Bangladesh&apos;s most trusted automotive marketplace. Transparent pricing, verified listings.
          </p>

          {/* Feature Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🚗', label: 'Rent from verified private owners' },
              { icon: '🔍', label: 'Browse 3,200+ curated listings' },
              { icon: '🛡️', label: 'Fully insured & secure transactions' },
            ].map((f) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px', fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.06)',
                }}>
                  {f.icon}
                </div>
                <span style={{ color: '#ccc', fontSize: '14px', fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Testimonial */}
        <div style={{
          position: 'relative', zIndex: 10, padding: '20px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="14" height="14" fill="#DAAA00" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p style={{ color: '#bbb', fontSize: '13px', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '12px' }}>
            &quot;Rented a Corolla for a weekend trip. The process was incredibly smooth and the car was spotless.&quot;
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #004F43, #DAAA00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '12px', fontWeight: 700,
            }}>S</div>
            <div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>Sami Hossain</div>
              <div style={{ color: '#666', fontSize: '11px' }}>Verified Renter · Dhaka</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', background: '#F9F9F9', overflowY: 'auto',
      }}>
        {/* Mobile logo */}
        <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #004F43, #006955)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#151515' }}>
            AutoFleet<span style={{ color: '#004F43' }}>Pro</span>
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Card */}
          <div style={{
            background: '#fff', borderRadius: '18px',
            boxShadow: '0 4px 40px rgba(0,0,0,0.08)',
            border: '1px solid #ebebeb', padding: '36px',
          }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#151515', marginBottom: '6px' }}>
                Welcome back
              </h2>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.5 }}>
                Sign in to manage your rentals and listings
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: '20px', padding: '14px 16px', borderRadius: '10px',
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#dc2626', fontSize: '13px', display: 'flex', gap: '10px', alignItems: 'flex-start',
              }}>
                <svg style={{ flexShrink: 0, marginTop: '1px' }} width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Email */}
              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '7px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="15" height="15" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email" type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: '100%', paddingLeft: '38px', paddingRight: '14px',
                      paddingTop: '11px', paddingBottom: '11px',
                      borderRadius: '10px', border: '1.5px solid #e5e5e5',
                      background: '#fafafa', color: '#151515', fontSize: '14px',
                      outline: 'none', transition: 'border 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.border = '1.5px solid #004F43'; e.target.style.boxShadow = '0 0 0 3px rgba(0,79,67,0.1)'; e.target.style.background = '#fff'; }}
                    onBlur={(e) => { e.target.style.border = '1.5px solid #e5e5e5'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                  <label htmlFor="password" style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: '12px', fontWeight: 500, color: '#004F43', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="15" height="15" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: '100%', paddingLeft: '38px', paddingRight: '42px',
                      paddingTop: '11px', paddingBottom: '11px',
                      borderRadius: '10px', border: '1.5px solid #e5e5e5',
                      background: '#fafafa', color: '#151515', fontSize: '14px',
                      outline: 'none', transition: 'border 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.border = '1.5px solid #004F43'; e.target.style.boxShadow = '0 0 0 3px rgba(0,79,67,0.1)'; e.target.style.background = '#fff'; }}
                    onBlur={(e) => { e.target.style.border = '1.5px solid #e5e5e5'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa'; }}
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: '2px',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={isLoading}
                style={{
                  width: '100%', padding: '13px',
                  borderRadius: '10px', border: 'none',
                  background: isLoading ? '#aaa' : 'linear-gradient(135deg, #004F43 0%, #006955 100%)',
                  color: '#fff', fontWeight: 700, fontSize: '15px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: isLoading ? 'none' : '0 4px 16px rgba(0,79,67,0.35)',
                  transition: 'all 0.2s', marginTop: '4px',
                }}
                onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(0,79,67,0.45)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,79,67,0.35)'; }}
              >
                {isLoading ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#ebebeb' }} />
              <span style={{ fontSize: '12px', color: '#bbb', fontWeight: 500 }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: '#ebebeb' }} />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid #e5e5e5',
                background: '#fff',
                color: '#444',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s',
                marginBottom: '20px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f9f9f9'; e.currentTarget.style.borderColor = '#d1d1d1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e5e5'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#888' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" style={{ color: '#004F43', fontWeight: 700, textDecoration: 'none' }}>
                Create one free
              </Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', marginTop: '24px' }}>
            © {new Date().getFullYear()} AutoFleet Pro. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </main>
  )
}
