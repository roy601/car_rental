'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BecomeSellerModal } from '@/components/become-seller-modal'
import { toast } from 'sonner'

interface HeroStats {
  listings: number
  users: number
  volume: number
}

function formatNumber(num: number) {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B+'
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M+'
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K+'
  return num.toString() + '+'
}

export function HeroSection({ stats, heroUrl = '/images/hero-car.jpg' }: { stats?: HeroStats, heroUrl?: string }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Preload hero image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImageLoaded(true)
    img.src = heroUrl
  }, [heroUrl])

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { data: profile } = await supabase
        .from('users')
        .select('user_type, verification_status')
        .eq('id', user.id)
        .single()
      if (profile) setUserProfile(profile)
    }
    fetchUser()
  }, [])

  const fullText = "Join the most trusted platform for vehicle owners and car enthusiasts. Effortlessly find your dream ride or list your vehicle to start earning—all on one secure and seamless platform."
  const [displayText, setDisplayText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[index])
        setIndex((prev) => prev + 1)
      }, 15) // Adjust typing speed here
      return () => clearTimeout(timeout)
    }
  }, [index, fullText])

  const handleListVehicle = () => {
    if (!user) {
      // Not logged in — go to signup as seller with context
      router.push('/auth/signup?type=seller&intent=list-vehicle')
      return
    }

    const userType = userProfile?.user_type
    const verificationStatus = userProfile?.verification_status

    if (userType === 'buyer') {
      // Logged in as buyer — open upgrade modal
      setModalOpen(true)
      return
    }

    if (userType === 'seller' && verificationStatus === 'approved') {
      // Approved seller — go straight to new listing
      router.push('/dashboard/listings/new')
      return
    }

    // Seller but pending/rejected — redirect to dashboard with notice
    toast.info('Your seller account is pending approval. Check your dashboard for status.')
    router.push('/dashboard')
  }

  return (
    <>
      <section className="relative w-full h-screen overflow-hidden pt-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url('${heroUrl}')`,
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            {/* Badge */}
            <div className="inline-block animate-fade-in">
              <span className="badge-highlight font-outfit">The Ultimate Car Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter">
              Drive. Rent. Buy.<br />
              <span className="bg-gradient-to-r from-compass via-compass-light to-compass bg-clip-text text-transparent">
                All in one place.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-[#F9F9F9] leading-relaxed max-w-2xl mx-auto font-outfit font-light tracking-wide min-h-[4rem]">
              {displayText}
              <span className="inline-block w-0.5 h-5 bg-compass ml-1 animate-pulse" style={{ verticalAlign: 'middle', opacity: index < fullText.length ? 1 : 0 }}></span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
              <Button asChild className="btn-primary h-14 px-12 text-base group">
                <Link href="/marketplace" className="flex items-center gap-2">
                  Explore Marketplace
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
              <Button
                className="btn-secondary h-14 px-12 text-base bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                onClick={handleListVehicle}
              >
                List Your Vehicle
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-16 grid grid-cols-3 gap-12 text-white/90 border-t border-white/10 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black tracking-tighter">{stats ? formatNumber(stats.listings) : '50K+'}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1">Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black tracking-tighter">{stats ? formatNumber(stats.users) : '100K+'}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black tracking-tighter">{stats ? `৳${formatNumber(stats.volume)}` : '৳5B+'}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1">Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="animate-bounce text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Become Seller Modal */}
      <BecomeSellerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={user?.id}
        userName={user?.user_metadata?.full_name}
      />
    </>
  )
}
