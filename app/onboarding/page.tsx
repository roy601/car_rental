'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(' ')[0])
      }
    }
    getUser()
  }, [supabase])

  const handleRoleSelection = async (role: 'buyer' | 'seller') => {
    setIsLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Save the selection to the user's profile/metadata
    const { error } = await supabase.auth.updateUser({
      data: { user_type: role, onboarding_completed: true }
    })

    if (error) {
      console.error('Error saving role:', error.message)
      setIsLoading(false)
      return
    }

    // Redirect to home or dashboard
    router.push('/')
    router.refresh()
  }

  return (
    <main style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at top right, #004F43 0%, #0a0a0a 40%, #000 100%)',
      color: '#fff',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(218,170,0,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '800px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-1px' }}>
          Welcome{userName ? `, ${userName}` : ''}!
        </h1>
        <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '48px', maxWidth: '500px', marginInline: 'auto' }}>
          To give you the best experience, tell us how you plan to use AutoFleet Pro.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '20px'
        }}>
          {/* Buyer Card */}
          <button
            onClick={() => handleRoleSelection('buyer')}
            disabled={isLoading}
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <div style={iconBoxStyle}>🚘</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>I want to Rent</h3>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.5 }}>
              Browse thousands of verified vehicles and book your next trip in minutes.
            </p>
            <div className="arrow" style={arrowStyle}>→</div>
          </button>

          {/* Seller Card */}
          <button
            onClick={() => handleRoleSelection('seller')}
            disabled={isLoading}
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <div style={iconBoxStyle}>🏷️</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>I want to List</h3>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.5 }}>
              Turn your car into an income stream. List for free and start earning today.
            </p>
            <div className="arrow" style={arrowStyle}>→</div>
          </button>
        </div>

        {isLoading && (
          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#DAAA00', fontWeight: 600 }}>
            <div style={{ width: '20px', height: '20px', border: '3px solid rgba(218,170,0,0.2)', borderTopColor: '#DAAA00', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            Setting up your account...
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button { cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </main>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
  padding: '40px',
  textAlign: 'left',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}

const cardHover: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.07)',
  borderColor: '#004F43',
  transform: 'translateY(-8px)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,79,67,0.2)',
}

const iconBoxStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #004F43, #006955)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  marginBottom: '24px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
}

const arrowStyle: React.CSSProperties = {
  marginTop: '24px',
  fontSize: '20px',
  color: '#DAAA00',
  fontWeight: 700
}
