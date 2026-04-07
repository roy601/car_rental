import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { VINSearch } from '@/components/vin-search'
import { FeaturesSection } from '@/components/features-section'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'AutoFleet Pro - Buy, Rent, Sell Vehicles Online',
  description: 'The modern automotive marketplace. Find your perfect car, rent from owners, or list your vehicle for sale. Trusted by thousands.',
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroSection />

        {/* VIN Search Section */}
        <VINSearch />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="container-max">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Section Header */}
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                  <span className="text-balance">How It Works</span>
                </h2>
                <p className="text-xl text-text-secondary">
                  Get started in three simple steps
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    number: '1',
                    title: 'Browse Vehicles',
                    description: 'Search through thousands of verified listings. Filter by price, category, location, and more.',
                  },
                  {
                    number: '2',
                    title: 'Get Details',
                    description: 'View detailed specs, high-quality photos, reviews, and pricing. Use VIN lookup for instant data.',
                  },
                  {
                    number: '3',
                    title: 'Rent or Buy',
                    description: 'Complete your transaction securely. Choose rental or purchase with built-in escrow protection.',
                  },
                ].map((step, idx) => (
                  <div key={idx} className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-rivian text-white rounded-full flex items-center justify-center text-3xl font-bold">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-midnight text-white">
          <div className="container-max">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-balance">Ready to Find Your Perfect Vehicle?</span>
              </h2>
              <p className="text-xl text-white/80">
                Join thousands of happy customers who have found their ideal car on AutoFleet Pro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn-primary px-10 py-6 text-lg">
                  <Link href="/marketplace">
                    Start Browsing
                  </Link>
                </Button>
                <Button asChild className="btn-secondary px-10 py-6 text-lg">
                  <Link href="/auth/signup?type=seller">
                    Become a Seller
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background border-t border-border py-12 px-4 sm:px-6 lg:px-8">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-text-primary mb-4">AutoFleet Pro</h4>
                <p className="text-text-secondary">
                  The modern marketplace for buying, renting, and selling vehicles.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-text-primary mb-4">Company</h4>
                <ul className="space-y-2 text-text-secondary">
                  <li><Link href="#" className="hover:text-accent">About Us</Link></li>
                  <li><Link href="#" className="hover:text-accent">Blog</Link></li>
                  <li><Link href="#" className="hover:text-accent">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text-primary mb-4">Support</h4>
                <ul className="space-y-2 text-text-secondary">
                  <li><Link href="#" className="hover:text-accent">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-accent">Contact</Link></li>
                  <li><Link href="#" className="hover:text-accent">Safety</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text-primary mb-4">Legal</h4>
                <ul className="space-y-2 text-text-secondary">
                  <li><Link href="#" className="hover:text-accent">Terms</Link></li>
                  <li><Link href="#" className="hover:text-accent">Privacy</Link></li>
                  <li><Link href="#" className="hover:text-accent">Cookies</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-text-secondary">
              <p>&copy; 2026 AutoFleet Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
