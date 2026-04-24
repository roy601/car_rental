'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState<'buyer' | 'seller'>('buyer')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeat, setShowRepeat] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) { setError('Passwords do not match'); setIsLoading(false); return; }
    if (!fullName.trim()) { setError('Full name is required'); setIsLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); setIsLoading(false); return; }

    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: { full_name: fullName, user_type: userType },
        },
      })
      if (error) throw error
      router.push('/auth/signup-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  /* Shared input style helpers */
  const inputBase: React.CSSProperties = {
    width: '100%', paddingTop: '11px', paddingBottom: '11px',
    paddingLeft: '38px', paddingRight: '14px',
    borderRadius: '10px', border: '1.5px solid #e5e5e5',
    background: '#fafafa', color: '#151515', fontSize: '14px',
    outline: 'none', transition: 'border 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  }
  const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.border = '1.5px solid #004F43'
    e.target.style.boxShadow = '0 0 0 3px rgba(0,79,67,0.1)'
    e.target.style.background = '#fff'
  }
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.border = '1.5px solid #e5e5e5'
    e.target.style.boxShadow = 'none'
    e.target.style.background = '#fafafa'
  }

  return (
    <main style={{ minHeight: '100svh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left Branding Panel ── */}
      <div
        className="hidden lg:flex lg:w-[48%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0a0a0a 0%, #151515 50%, #1a2e1a 100%)' }}
      >
        {/* Glows */}
        <div style={{ position:'absolute', top:'-100px', right:'-80px', width:'440px', height:'440px', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,79,67,0.35), transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-60px', width:'340px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle, rgba(218,170,0,0.12), transparent 65%)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:'linear-gradient(135deg, #004F43, #006955)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            </svg>
          </div>
          <span style={{ color:'#fff', fontWeight:700, fontSize:'20px', letterSpacing:'-0.3px' }}>
            AutoFleet<span style={{ color:'#DAAA00' }}>Pro</span>
          </span>
        </div>

        {/* Hero */}
        <div style={{ position:'relative', zIndex:10 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 14px', borderRadius:'999px', marginBottom:'24px', background:'rgba(0,79,67,0.2)', border:'1px solid rgba(0,105,85,0.4)', fontSize:'12px', fontWeight:600, color:'#6ee7b7' }}>
            <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#34d399', animation:'pulse 2s infinite' }} />
            Free to join — no credit card needed
          </div>

          <h1 style={{ fontSize:'44px', fontWeight:800, lineHeight:1.1, color:'#fff', letterSpacing:'-1px', marginBottom:'18px' }}>
            Join the<br />
            <span style={{ background:'linear-gradient(90deg, #DAAA00, #E8C547)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              AutoFleet community
            </span>
          </h1>

          <p style={{ color:'#888', fontSize:'15px', lineHeight:1.7, maxWidth:'340px', marginBottom:'36px' }}>
            Whether you want to rent a car for a day or list your vehicle to earn extra income — it all starts here.
          </p>

          {/* Benefits */}
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {[
              { emoji:'🧑‍💼', title:'Sellers', desc:'List your car and start earning within 24 hrs' },
              { emoji:'🚘', title:'Buyers', desc:'Browse verified cars with transparent pricing' },
              { emoji:'🔒', title:'Everyone', desc:'Secure payments & full insurance coverage' },
            ].map((item) => (
              <div key={item.title} style={{ display:'flex', gap:'14px', alignItems:'flex-start' }}>
                <div style={{ width:'38px', height:'38px', borderRadius:'9px', background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>
                  {item.emoji}
                </div>
                <div>
                  <div style={{ color:'#fff', fontWeight:600, fontSize:'14px' }}>{item.title}</div>
                  <div style={{ color:'#777', fontSize:'13px', lineHeight:1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ position:'relative', zIndex:10, display:'flex', gap:'32px' }}>
          {[
            { v:'3,200+', l:'Active Listings' },
            { v:'8,400+', l:'Happy Renters' },
            { v:'4.9★', l:'Avg. Rating' },
          ].map((s) => (
            <div key={s.l}>
              <div style={{ color:'#fff', fontWeight:800, fontSize:'20px' }}>{s.v}</div>
              <div style={{ color:'#555', fontSize:'12px', marginTop:'2px' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', background:'#F9F9F9', overflowY:'auto' }}>

        {/* Mobile Logo */}
        <div className="lg:hidden" style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'28px' }}>
          <div style={{ width:'38px', height:'38px', borderRadius:'9px', background:'linear-gradient(135deg, #004F43, #006955)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            </svg>
          </div>
          <span style={{ fontWeight:700, fontSize:'18px', color:'#151515' }}>
            AutoFleet<span style={{ color:'#004F43' }}>Pro</span>
          </span>
        </div>

        <div style={{ width:'100%', maxWidth:'430px' }}>
          <div style={{ background:'#fff', borderRadius:'18px', boxShadow:'0 4px 40px rgba(0,0,0,0.08)', border:'1px solid #ebebeb', padding:'36px' }}>

            {/* Header */}
            <div style={{ marginBottom:'24px' }}>
              <h2 style={{ fontSize:'24px', fontWeight:800, color:'#151515', marginBottom:'6px' }}>Create your account</h2>
              <p style={{ fontSize:'14px', color:'#888' }}>Join thousands of drivers & owners on AutoFleet Pro</p>
            </div>

            {/* Account Type Toggle */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'24px', padding:'4px', background:'#f5f5f5', borderRadius:'10px' }}>
              {(['buyer', 'seller'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  style={{
                    flex:1, padding:'9px', borderRadius:'8px', border:'none',
                    fontWeight:600, fontSize:'13px', cursor:'pointer',
                    transition:'all 0.2s',
                    background: userType === type ? '#004F43' : 'transparent',
                    color: userType === type ? '#fff' : '#888',
                    boxShadow: userType === type ? '0 2px 8px rgba(0,79,67,0.3)' : 'none',
                  }}
                >
                  {type === 'buyer' ? '🚘 I want to Rent' : '🏷️ I want to List'}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom:'18px', padding:'13px 15px', borderRadius:'10px', background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', fontSize:'13px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
                <svg style={{ flexShrink:0, marginTop:'1px' }} width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

              {/* Full Name */}
              <div>
                <label htmlFor="fullname" style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#333', marginBottom:'7px' }}>
                  Full Name <span style={{ color:'#004F43' }}>*</span>
                </label>
                <div style={{ position:'relative' }}>
                  <div style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                    <svg width="15" height="15" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input id="fullname" type="text" required value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    style={inputBase} onFocus={focusIn} onBlur={focusOut}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#333', marginBottom:'7px' }}>
                  Email Address <span style={{ color:'#004F43' }}>*</span>
                </label>
                <div style={{ position:'relative' }}>
                  <div style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                    <svg width="15" height="15" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input id="email" type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputBase} onFocus={focusIn} onBlur={focusOut}
                  />
                </div>
              </div>

              {/* Password row */}
              {[
                { id:'password', label:'Password', val:password, setVal:setPassword, show:showPassword, setShow:setShowPassword, ph:'Min. 6 characters' },
                { id:'repeatPassword', label:'Confirm Password', val:repeatPassword, setVal:setRepeatPassword, show:showRepeat, setShow:setShowRepeat, ph:'Re-enter password' },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#333', marginBottom:'7px' }}>
                    {f.label} <span style={{ color:'#004F43' }}>*</span>
                  </label>
                  <div style={{ position:'relative' }}>
                    <div style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                      <svg width="15" height="15" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input id={f.id} type={f.show ? 'text' : 'password'} required
                      value={f.val} onChange={(e) => f.setVal(e.target.value)}
                      placeholder={f.ph}
                      style={{ ...inputBase, paddingRight:'42px' }}
                      onFocus={focusIn} onBlur={focusOut}
                    />
                    <button type="button" onClick={() => f.setShow(!f.show)} tabIndex={-1}
                      style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#aaa', padding:'2px', display:'flex', alignItems:'center' }}>
                      {f.show ? (
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
              ))}

              {/* Submit */}
              <button
                type="submit" disabled={isLoading}
                style={{
                  width:'100%', padding:'13px', borderRadius:'10px', border:'none',
                  background: isLoading ? '#aaa' : 'linear-gradient(135deg, #004F43 0%, #006955 100%)',
                  color:'#fff', fontWeight:700, fontSize:'15px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                  boxShadow: isLoading ? 'none' : '0 4px 16px rgba(0,79,67,0.35)',
                  transition:'all 0.2s', marginTop:'4px',
                }}
                onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 22px rgba(0,79,67,0.45)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,79,67,0.35)'; }}
              >
                {isLoading ? (
                  <>
                    <svg style={{ animation:'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity:0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity:0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'22px 0' }}>
              <div style={{ flex:1, height:'1px', background:'#ebebeb' }} />
              <span style={{ fontSize:'12px', color:'#bbb', fontWeight:500 }}>or</span>
              <div style={{ flex:1, height:'1px', background:'#ebebeb' }} />
            </div>

            <p style={{ textAlign:'center', fontSize:'14px', color:'#888' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color:'#004F43', fontWeight:700, textDecoration:'none' }}>
                Sign in
              </Link>
            </p>
          </div>

          <p style={{ textAlign:'center', fontSize:'12px', color:'#bbb', marginTop:'20px', lineHeight:1.6 }}>
            By creating an account, you agree to our{' '}
            <a href="#" style={{ textDecoration:'underline', color:'#bbb' }}>Terms of Service</a> &amp;{' '}
            <a href="#" style={{ textDecoration:'underline', color:'#bbb' }}>Privacy Policy</a>.
          </p>
          <p style={{ textAlign:'center', fontSize:'12px', color:'#bbb', marginTop:'6px' }}>
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
