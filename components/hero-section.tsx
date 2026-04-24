'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentHeroUrl, setCurrentHeroUrl] = useState('/images/hero-car.jpg')

  useEffect(() => {
    // Check for admin-set hero image (Client-only)
    const customHero = localStorage.getItem('admin_hero_url')
    if (customHero) {
      setCurrentHeroUrl(customHero)
    }
    
    const finalUrl = customHero || '/images/hero-car.jpg'

    // Preload hero image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImageLoaded(true)
    img.src = finalUrl
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url('${currentHeroUrl}')`,
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
            <span className="badge-highlight">The Future of Automotive Commerce</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter">
            Drive. Rent. Buy.<br />
            <span className="bg-gradient-to-r from-compass via-compass-light to-compass bg-clip-text text-transparent">
              All in one place.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto font-medium">
            Experience the next generation of car marketplaces. Whether you want to browse 3,200+ verified listings or turn your vehicle into an income stream — we’ve got you covered.
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
            <Button asChild className="btn-secondary h-14 px-12 text-base bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
              <Link href="/auth/signup?type=seller">
                List Your Vehicle
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-16 grid grid-cols-3 gap-12 text-white/90 border-t border-white/10 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-black tracking-tighter">50K+</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black tracking-tighter">100K+</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black tracking-tighter">$5B+</div>
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
  )
}
