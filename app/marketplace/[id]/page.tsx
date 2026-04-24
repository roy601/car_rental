'use client'

import { use, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock vehicle details - replace with real data from Supabase
const VEHICLE_DETAILS: Record<string, any> = {
  '1': {
    id: '1',
    title: '2023 Tesla Model 3',
    price: 45000,
    dailyRentalPrice: 89,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=800&h=600&fit=crop',
    ],
    category: 'sedan',
    year: 2023,
    mileage: 5000,
    location: 'San Francisco, CA',
    listingType: 'both',
    rating: 4.8,
    reviews: 24,
    seller: {
      name: 'Premium Motors',
      verified: true,
      rating: 4.9,
      reviews: 156,
    },
    specs: {
      engine: 'Electric',
      transmission: 'Automatic',
      drivetrain: 'RWD',
      fuelType: 'Electric',
      color: 'Pearl White',
      interior: 'Black Vegan Leather',
      condition: 'Excellent',
    },
    safetyFeatures: [
      'Airbags',
      'ABS',
      'Traction Control',
      'Electronic Stability Control',
      'Backup Camera',
      'Blind Spot Monitor',
      'Forward Collision Warning',
      'Lane Departure Warning',
    ],
    amenities: [
      'Bluetooth',
      'Navigation System',
      'Sunroof',
      'Climate Control',
      'Power Windows',
      'Power Locks',
      'Cruise Control',
      'Keyless Entry',
    ],
    description:
      'Pristine 2023 Tesla Model 3 with premium features. Fully serviced and ready for immediate pickup. Perfect for luxury commuting or weekend adventures. Low mileage with full warranty coverage.',
  },
}

export default function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedImage, setSelectedImage] = useState(0)
  const vehicle = VEHICLE_DETAILS[id] || VEHICLE_DETAILS['1']

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20 pb-12">
        <div className="container-max">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-accent hover:text-accent-light mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Marketplace
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                <img
                  src={vehicle.images[selectedImage]}
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  {vehicle.listingType === 'both' && (
                    <div className="flex gap-2">
                      <Badge className="badge-accent">Rent</Badge>
                      <Badge className="badge-highlight">Sale</Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-6 gap-2">
                {vehicle.images.map((image: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-rivian' : 'border-border'
                    }`}
                  >
                    <img src={image} alt={`${vehicle.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Title & Overview */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-text-primary mb-2">{vehicle.title}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-bold text-text-primary">{vehicle.rating}</span>
                      <span className="text-text-secondary">({vehicle.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                      </svg>
                      <span>{vehicle.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-text-secondary leading-relaxed">{vehicle.description}</p>
              </div>

              {/* Specifications Grid */}
              <div className="card">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(vehicle.specs).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <p className="text-sm text-text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="font-bold text-text-primary">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Features */}
              <div className="card">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Safety Features</h2>
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.safetyFeatures.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-rivian flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      <span className="text-text-primary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="card">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.amenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-compass fill-current flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                      </svg>
                      <span className="text-text-primary">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="card">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Customer Reviews</h2>
                <div className="space-y-4">
                  {[
                    {
                      author: 'John D.',
                      rating: 5,
                      text: 'Excellent condition! The car is pristine and drives beautifully. Highly recommend!',
                      date: '2 weeks ago',
                    },
                    {
                      author: 'Sarah M.',
                      rating: 4,
                      text: 'Great experience renting this vehicle. Very responsive seller.',
                      date: '1 month ago',
                    },
                  ].map((review, idx) => (
                    <div key={idx} className="pb-4 border-b border-border last:pb-0 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-text-primary">{review.author}</p>
                          <p className="text-sm text-text-secondary">{review.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-border'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Pricing & CTA */}
            <div>
              {/* Pricing Card */}
              <div className="card sticky top-24 space-y-6">
                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    {vehicle.listingType === 'both' || vehicle.listingType === 'sale' ? (
                      <>
                        <span className="text-4xl font-bold text-text-primary">${vehicle.price.toLocaleString()}</span>
                        <span className="text-text-secondary">to buy</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-text-primary">${vehicle.dailyRentalPrice}</span>
                        <span className="text-text-secondary">/day</span>
                      </>
                    )}
                  </div>
                  {vehicle.listingType === 'both' && (
                    <p className="text-text-secondary">or ${vehicle.dailyRentalPrice}/day to rent</p>
                  )}
                </div>

                <div className="space-y-3">
                  {(vehicle.listingType === 'both' || vehicle.listingType === 'sale') && (
                    <Button asChild className="w-full btn-primary py-6 text-lg">
                      <Link href={`/checkout/buy/${vehicle.id}`}>Buy Now</Link>
                    </Button>
                  )}
                  {(vehicle.listingType === 'both' || vehicle.listingType === 'rent') && (
                    <Button asChild className="w-full btn-secondary py-6 text-lg">
                      <Link href={`/checkout/rent/${vehicle.id}`}>Rent Now</Link>
                    </Button>
                  )}
                </div>

                {/* Seller Info */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-bold text-text-primary mb-4">Seller Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-text-primary flex items-center gap-2">
                        {vehicle.seller.name}
                        {vehicle.seller.verified && (
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-rivian text-white rounded-full text-xs">
                            ✓
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-text-secondary">Verified Seller</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-400">★</span>
                      <span className="font-bold text-text-primary">{vehicle.seller.rating}</span>
                      <span className="text-text-secondary">({vehicle.seller.reviews} reviews)</span>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/seller/${vehicle.seller.name}`}>View Seller Profile</Link>
                    </Button>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="border-t border-border pt-6 space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl">🛡️</div>
                    <div>
                      <p className="font-bold text-text-primary text-sm">30-Day Guarantee</p>
                      <p className="text-xs text-text-secondary">Satisfaction guaranteed or money back</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">🚚</div>
                    <div>
                      <p className="font-bold text-text-primary text-sm">Flexible Delivery</p>
                      <p className="text-xs text-text-secondary">Pickup or delivery available</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">💳</div>
                    <div>
                      <p className="font-bold text-text-primary text-sm">Secure Payment</p>
                      <p className="text-xs text-text-secondary">Escrow protection included</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
