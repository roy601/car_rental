'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createClient()

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-midnight">
          AutoFleet
        </Link>

        {/* Navigation Links - centered */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
          >
            Marketplace
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
          >
            Features
          </Link>
        </div>

        {/* Right side - Account and Cart */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost" className="text-sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild className="btn-primary">
                <Link href="/api/auth/signout">Sign Out</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="btn-primary">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
