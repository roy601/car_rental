import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { VINSearch } from '@/components/vin-search'
import { TopSellers } from '@/components/top-sellers'
import { FeaturedInventory } from '@/components/featured-inventory'
import { CustomerReviews } from '@/components/customer-reviews'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'AutoFleet Pro - Buy, Rent, Sell Vehicles Online',
  description: 'The modern automotive marketplace. Find your perfect car, rent from owners, or list your vehicle for sale. Trusted by thousands.',
}

export default async function Home() {
  const supabase = await createClient()

  const { count: listingsCount } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { data: bookings } = await supabase
    .from('bookings')
    .select('total_price')
    .in('status', ['confirmed', 'completed'])

  const volume = bookings?.reduce((acc, b) => acc + Number(b.total_price || 0), 0) || 0

  const { data: heroData } = await supabase
    .from('platform_settings')
    .select('value')
    .eq('id', 'hero_image')
    .single()

  const heroUrl = heroData?.value?.url || '/images/hero-car.jpg'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroSection stats={{ listings: listingsCount || 0, users: usersCount || 0, volume }} heroUrl={heroUrl} />

        {/* VIN Search Section */}
        <VINSearch />

        {/* Featured Inventory Section */}
        <FeaturedInventory />

        {/* Top Sellers Section */}
        <TopSellers />

        {/* Customer Reviews Section */}
        <CustomerReviews />

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rivian to-midnight text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-compass/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="container-max relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                Ready to Find Your<br />
                <span className="text-compass">Perfect Vehicle?</span>
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium">
                Join 100,000+ satisfied customers who have found their ideal car on AutoFleet Pro. Secure, fast, and transparent.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
                <Button asChild className="btn-accent h-14 px-12 text-base">
                  <Link href="/marketplace">
                    Start Browsing
                  </Link>
                </Button>
                <Button asChild className="btn-secondary h-14 px-12 text-base bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                  <Link href="/auth/signup?type=seller">
                    Become a Seller
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-border py-20 px-4 sm:px-6 lg:px-8">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="space-y-6">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rivian to-rivian-light flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                      <rect x="9" y="11" width="14" height="10" rx="2" />
                    </svg>
                  </div>
                  <span className="text-xl font-black tracking-tighter text-midnight">
                    AutoFleet<span className="text-compass">Pro</span>
                  </span>
                </Link>
                <p className="text-text-secondary font-medium leading-relaxed">
                  The world's most advanced marketplace for buying, renting, and selling vehicles.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-midnight uppercase tracking-widest text-[11px] mb-6">Company</h4>
                <ul className="space-y-4 text-text-secondary font-medium text-sm">
                  <li><Link href="#" className="hover:text-rivian transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-rivian transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-rivian transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-midnight uppercase tracking-widest text-[11px] mb-6">Support</h4>
                <ul className="space-y-4 text-text-secondary font-medium text-sm">
                  <li><Link href="#" className="hover:text-rivian transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-rivian transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-rivian transition-colors">Safety</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-midnight uppercase tracking-widest text-[11px] mb-6">Legal</h4>
                <ul className="space-y-4 text-text-secondary font-medium text-sm">
                  <li><Link href="#" className="hover:text-rivian transition-colors">Terms</Link></li>
                  <li><Link href="#" className="hover:text-rivian transition-colors">Privacy</Link></li>
                  <li><Link href="#" className="hover:text-rivian transition-colors">Cookies</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-text-light text-sm font-medium">
              <p>&copy; 2026 AutoFleet Pro. All rights reserved.</p>
              <div className="flex gap-8">
                <Link href="#" className="hover:text-rivian transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-rivian transition-colors">LinkedIn</Link>
                <Link href="#" className="hover:text-rivian transition-colors">Instagram</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
