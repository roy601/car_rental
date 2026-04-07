'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    // Preload hero image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImageLoaded(true)
    img.src = '/images/hero-car.jpg'
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero-car.jpg')`,
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <span className="badge-accent">The Future of Fleet</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            <span className="text-balance">
              Drive. Rent. Buy. All in one place.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Experience the future of automotive commerce. Find your perfect car or earn money renting yours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild className="btn-primary px-10 py-6 text-lg">
              <Link href="/marketplace">
                Explore Vehicles
              </Link>
            </Button>
            <Button asChild className="btn-secondary px-10 py-6 text-lg">
              <Link href="/auth/signup?type=seller">
                List Your Vehicle
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12 grid grid-cols-3 gap-6 text-white/80 text-sm">
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div>Active Listings</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100K+</div>
              <div>Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$5B+</div>
              <div>in Transactions</div>
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
