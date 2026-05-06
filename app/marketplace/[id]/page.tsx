'use client'

import { use, useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Settings, MessageSquare, Mail, Calendar as CalendarIcon } from 'lucide-react'
import { Calendar as CalendarUI } from '@/components/ui/calendar'
import { toast } from 'sonner'

export default function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedImage, setSelectedImage] = useState(0)
  const [vehicle, setVehicle] = useState<any>(null)
   const [reviews, setReviews] = useState<any[]>([])
   const [bookedDates, setBookedDates] = useState<any[]>([])
   const [isLoading, setIsLoading] = useState(true)
   const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicleAndReviews = async () => {
      setIsLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, seller:seller_id(*)')
        .eq('id', id)
        .single()
        
      if (!error && data) {
        setVehicle({
          id: data.id,
          title: data.title || `${data.year} ${data.make} ${data.model}`,
          price: data.price || 0,
          dailyRentalPrice: data.daily_rental_price || 0,
          images: data.image_urls?.length ? data.image_urls : (data.primary_image_url ? [data.primary_image_url] : ['https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=800&h=600&fit=crop']),
          category: data.category,
          year: data.year,
          mileage: data.mileage,
          location: data.location || 'Unknown Location',
          listingType: data.listing_type || 'both',
          rating: 4.8,
          reviewsCount: 24,
          seller: {
            id: data.seller?.id || data.seller_id,
            name: data.seller?.full_name || 'Anonymous Seller',
            email: data.seller?.email || 'N/A',
            verified: data.seller?.is_verified || false,
            rating: data.seller?.seller_rating || 4.9,
            reviews: 156,
          },
          specs: data.specs || {
            engine: data.engine_type || 'N/A',
            transmission: data.transmission || 'N/A',
            drivetrain: data.drivetrain || 'N/A',
            fuelType: data.fuel_type || 'N/A',
            color: data.color || 'N/A',
            condition: data.condition || 'N/A',
            numberPlate: data.number_plate || 'N/A',
          },
          safetyFeatures: data.safety_features || [],
          amenities: data.amenities || [],
          description: data.description || 'No description provided.',
        })

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*, reviewer:reviewer_id(id, full_name, profile_picture_url)')
          .eq('vehicle_id', id)
          .order('created_at', { ascending: false })
        
        if (reviewsData) {
          setReviews(reviewsData)
        }

        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('start_date, end_date')
          .eq('vehicle_id', id)
          .not('status', 'eq', 'cancelled')
        
        if (bookingsData) {
          console.log("Fetched Bookings for Calendar:", bookingsData)
          setBookedDates(bookingsData)
        }
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)
      
      setIsLoading(false)
    }
    
    fetchVehicleAndReviews()
  }, [id])

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-12 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-rivian animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-text-primary">Loading vehicle details...</h2>
        </main>
      </>
    )
  }

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-12 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Vehicle Not Found</h2>
          <p className="text-text-secondary mb-6">The vehicle you are looking for does not exist or has been removed.</p>
          <Button asChild>
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </main>
      </>
    )
  }

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
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-text-primary">Customer Reviews</h2>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-text-primary">{(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}</span>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? 'fill-current' : 'text-border'}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-text-secondary">({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  {/* Review Submission Form */}
                  {currentUserId && currentUserId !== vehicle.seller.id && (
                    <div className="bg-glacier-white rounded-3xl p-8 border border-border/50 mb-12 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-rivian/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-rivian" />
                        </div>
                        <h3 className="text-xl font-bold text-midnight tracking-tight">Rate Your Experience</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-bold text-text-light uppercase tracking-widest">Select Rating</span>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setVehicle({ ...vehicle, userRating: star })}
                                className={`text-3xl transition-all duration-300 transform hover:scale-110 ${
                                  (vehicle.userRating || 0) >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-border grayscale'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-bold text-text-light uppercase tracking-widest">Your Review</span>
                          <textarea
                            placeholder="Tell us about the car and your experience with the seller..."
                            className="w-full rounded-2xl border border-border bg-white px-5 py-4 text-sm text-midnight font-medium placeholder:text-text-light outline-none focus:ring-2 focus:ring-rivian/20 focus:border-rivian transition-all resize-none"
                            rows={4}
                            id="review-comment"
                          />
                        </div>

                        <Button 
                          onClick={async () => {
                            const comment = (document.getElementById('review-comment') as HTMLTextAreaElement).value;
                            if (!vehicle.userRating) return toast.error('Please select a rating');
                            if (!comment.trim()) return toast.error('Please write a comment');
                            
                            const supabase = createClient();
                            const { error } = await supabase.from('reviews').insert({
                              vehicle_id: id,
                              seller_id: vehicle.seller.id,
                              reviewer_id: currentUserId,
                              rating: vehicle.userRating,
                              comment: comment.trim(),
                              title: 'Verified Experience'
                            });

                            if (!error) {
                              toast.success('Review submitted successfully!');
                              window.location.reload();
                            } else {
                              toast.error('Failed to submit review');
                            }
                          }}
                          className="btn-primary h-12 px-8"
                        >
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  )}

                  {reviews.length > 0 ? (
                    reviews.map((review, idx) => (
                      <div key={review.id} className="pb-8 border-b border-border last:pb-0 last:border-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                              <img 
                                src={review.reviewer?.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer?.id}`} 
                                alt={review.reviewer?.full_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-text-primary">{review.reviewer?.full_name || 'Anonymous'}</p>
                              <p className="text-xs text-text-secondary">
                                {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-border'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        {review.title && <p className="font-bold text-text-primary mb-1">{review.title}</p>}
                        <p className="text-text-secondary leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center bg-glacier-white rounded-2xl border border-dashed border-border">
                      <div className="text-4xl mb-4">💬</div>
                      <p className="text-text-secondary font-medium">No reviews yet for this vehicle.</p>
                      <p className="text-sm text-text-light mt-1">Be the first to share your experience!</p>
                    </div>
                  )}
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
                        <span className="text-4xl font-bold text-text-primary">৳{vehicle.price.toLocaleString()}</span>
                        <span className="text-text-secondary">to buy</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-text-primary">৳{vehicle.dailyRentalPrice}</span>
                        <span className="text-text-secondary">/day</span>
                      </>
                    )}
                  </div>
                  {vehicle.listingType === 'both' && (
                    <p className="text-text-secondary">or ৳{vehicle.dailyRentalPrice}/day to rent</p>
                  )}
                </div>

                <div className="space-y-3">
                  {currentUserId === vehicle.seller.id ? (
                    <div className="bg-glacier-white rounded-2xl p-6 border border-border/50 space-y-4">
                       <div className="flex items-center gap-3 text-rivian">
                          <Settings className="w-5 h-5" />
                          <p className="text-sm font-bold uppercase tracking-tight">Your Listing</p>
                       </div>
                       <p className="text-xs text-text-secondary font-medium leading-relaxed">
                          You cannot purchase or rent your own vehicle. Use the button below to make updates.
                       </p>
                       <Button asChild className="w-full btn-primary h-12">
                          <Link href={`/dashboard/listings/edit/${vehicle.id}`}>Edit Details</Link>
                       </Button>
                    </div>
                  ) : (
                    <>
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
                    </>
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
                    {vehicle.seller.email && (
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">{vehicle.seller.email}</span>
                      </div>
                    )}
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/seller/${vehicle.seller.id}`}>View Seller Profile</Link>
                    </Button>
                  </div>
                </div>

                {/* Reserved Dates & Calendar Section */}
                {bookedDates.length > 0 && (
                  <div className="border-t border-border pt-6">
                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-rivian" />
                      Availability Calendar
                    </h3>
                    
                    <div className="bg-white rounded-3xl border border-border/50 p-2 shadow-sm mb-6">
                       <CalendarUI
                         mode="multiple"
                         modifiers={{
                           booked: bookedDates.map(b => {
                             const start = b.start_date.includes('T') ? new Date(b.start_date) : new Date(b.start_date + 'T00:00:00')
                             const end = b.end_date.includes('T') ? new Date(b.end_date) : new Date(b.end_date + 'T00:00:00')
                             return { from: start, to: end }
                           })
                         }}
                         modifiersClassNames={{
                           booked: "bg-rivian/10 text-rivian font-black line-through"
                         }}
                         disabled={bookedDates.map(b => {
                           // Force local time parsing by adding T00:00:00 if it's just a date string
                           const start = b.start_date.includes('T') ? new Date(b.start_date) : new Date(b.start_date + 'T00:00:00')
                           const end = b.end_date.includes('T') ? new Date(b.end_date) : new Date(b.end_date + 'T00:00:00')
                           return { from: start, to: end }
                         })}
                         className="w-full"
                       />
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-2">Upcoming Reservations</p>
                      {bookedDates.map((b, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-bold text-text-secondary bg-glacier-white px-4 py-3 rounded-2xl border border-border/50">
                          <span className="text-midnight">{new Date(b.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                          <span className="opacity-30">→</span>
                          <span className="text-midnight">{new Date(b.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                          <Badge variant="outline" className="text-[9px] h-5 border-amber-200 bg-amber-50 text-amber-600 ml-2">Booked</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
