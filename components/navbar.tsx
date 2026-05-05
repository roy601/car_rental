'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch unread message count
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false)
        setUnreadCount(count || 0)

        // Fetch user type
        const { data: profile } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single()
        
        if (profile) setUserType(profile.user_type)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const isHomePage = pathname === '/'
  const forceDarkText = !isHomePage || isScrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        forceDarkText
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.05)] border-b border-border/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-max flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rivian to-rivian-light flex items-center justify-center shadow-lg shadow-rivian/20 transition-transform group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            </svg>
          </div>
          <span className={`text-xl font-extrabold tracking-tighter transition-colors ${forceDarkText ? 'text-midnight' : 'text-white'}`}>
            AutoFleet<span className="text-compass">Pro</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/marketplace"
            className={`text-[13px] font-bold uppercase tracking-widest transition-all hover:scale-105 ${
              forceDarkText ? 'text-midnight/70 hover:text-rivian' : 'text-white/80 hover:text-white'
            }`}
          >
            Marketplace
          </Link>
          <Link
            href="/#featured"
            className={`text-[13px] font-bold uppercase tracking-widest transition-all hover:scale-105 ${
              forceDarkText ? 'text-midnight/70 hover:text-rivian' : 'text-white/80 hover:text-white'
            }`}
          >
            Featured Cars
          </Link>
          <Link
            href="/#top-sellers"
            className={`text-[13px] font-bold uppercase tracking-widest transition-all hover:scale-105 ${
              forceDarkText ? 'text-midnight/70 hover:text-rivian' : 'text-white/80 hover:text-white'
            }`}
          >
            Top Sellers
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Messages icon with unread badge */}
              <Link href="/messages" className="relative p-2 rounded-xl transition-colors hover:bg-black/5">
                <MessageSquare className={`w-5 h-5 ${forceDarkText ? 'text-midnight/70' : 'text-white/80'}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rivian text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              {userType !== 'admin' && (
                <Link 
                  href="/my-bookings" 
                  className={`text-[13px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${
                    forceDarkText ? 'text-midnight/70 hover:bg-black/5' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  My Bookings
                </Link>
              )}
              <Link 
                href={userType === 'admin' ? '/admin' : '/dashboard'} 
                className={`text-[13px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${
                  forceDarkText ? 'text-midnight/70 hover:bg-black/5' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {userType === 'admin' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <Button onClick={handleSignOut} className="btn-primary h-10 px-6">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className={`text-[13px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${
                  forceDarkText ? 'text-midnight/70 hover:bg-black/5' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Login
              </Link>
              <Button asChild className="btn-primary h-10 px-6">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
