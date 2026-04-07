'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface BookingProps {
  params: {
    type: 'rent' | 'buy'
    id: string
  }
}

export default function CheckoutPage({ params }: BookingProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    insurance: true,
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock vehicle data
  const vehicle = {
    id: params.id,
    title: '2023 Tesla Model 3',
    price: 45000,
    dailyRentalPrice: 89,
    image: 'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=400&h=300&fit=crop',
  }

  const isBuying = params.type === 'buy'
  const isRenting = params.type === 'rent'

  // Calculate rental pricing
  const calculatePricing = () => {
    if (isRenting && formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      if (days < 0) return null

      const dailyRate = vehicle.dailyRentalPrice
      const basePrice = days * dailyRate
      const insurance = formData.insurance ? Math.ceil(basePrice * 0.1) : 0
      const tax = Math.ceil((basePrice + insurance) * 0.08)
      const total = basePrice + insurance + tax

      return {
        days,
        basePrice,
        insurance,
        tax,
        total,
      }
    }

    if (isBuying) {
      const basePrice = vehicle.price
      const tax = Math.ceil(basePrice * 0.08)
      const total = basePrice + tax

      return {
        basePrice,
        tax,
        total,
      }
    }

    return null
  }

  const pricing = calculatePricing()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Submit booking to backend
    console.log('[v0] Booking submission:', { type: params.type, vehicleId: params.id, ...formData })

    // Simulate API call
    setTimeout(() => {
      alert('Booking submitted! Redirecting to payment...')
      // window.location.href = `/payment/${params.id}`
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20 pb-12">
        <div className="container-max">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/marketplace/${params.id}`} className="inline-flex items-center gap-2 text-accent hover:text-accent-light mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Vehicle
            </Link>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              {isBuying ? 'Complete Your Purchase' : 'Book Your Rental'}
            </h1>
            <p className="text-xl text-text-secondary">
              {isBuying
                ? 'Secure checkout with escrow protection'
                : 'Select your rental dates and confirm your booking'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="card space-y-6">
                {/* Vehicle Summary */}
                <div className="flex gap-4 p-4 bg-white/50 rounded-lg border border-border-light">
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    className="w-24 h-24 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-text-primary">{vehicle.title}</h3>
                    <p className="text-text-secondary">
                      {isBuying
                        ? `$${vehicle.price.toLocaleString()} to purchase`
                        : `$${vehicle.dailyRentalPrice}/day rental rate`}
                    </p>
                  </div>
                </div>

                {/* Rental Dates - Only for rentals */}
                {isRenting && (
                  <>
                    <div>
                      <label className="block font-bold text-text-primary mb-2">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required={isRenting}
                        className="w-full"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-text-primary mb-2">
                        End Date
                      </label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required={isRenting}
                        className="w-full"
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Insurance Option */}
                    <div className="space-y-3">
                      <label className="font-bold text-text-primary">Insurance</label>
                      <label className="flex items-center gap-3 p-3 border border-border-light rounded-lg cursor-pointer hover:bg-white/50">
                        <input
                          type="checkbox"
                          checked={formData.insurance}
                          onChange={(e) => setFormData({ ...formData, insurance: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-text-primary">Damage Waiver</p>
                          <p className="text-sm text-text-secondary">
                            Protects you from vehicle damage (10% of rental price)
                          </p>
                        </div>
                      </label>
                    </div>
                  </>
                )}

                {/* Additional Notes */}
                <div>
                  <label className="block font-bold text-text-primary mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special requests or information for the seller..."
                    className="w-full h-24 px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-rivian focus:border-transparent"
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="w-4 h-4 mt-1" />
                    <span className="text-sm text-blue-900">
                      I agree to the <a href="#" className="font-bold hover:underline">Terms & Conditions</a> and understand that I'm entering a binding agreement
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="w-4 h-4 mt-1" />
                    <span className="text-sm text-blue-900">
                      I acknowledge the <a href="#" className="font-bold hover:underline">cancellation policy</a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || (isRenting && !pricing)}
                  className="w-full btn-primary py-6 text-lg"
                >
                  {isSubmitting ? 'Processing...' : `Proceed to Payment - ${pricing ? `$${pricing.total}` : 'Select dates'}`}
                </Button>
              </form>
            </div>

            {/* Right Column - Price Breakdown */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24 space-y-6">
                <h2 className="text-2xl font-bold text-text-primary">Price Breakdown</h2>

                <div className="space-y-3 border-b border-border pb-6">
                  {isRenting && pricing && 'days' in pricing && (
                    <>
                      <div className="flex justify-between text-text-secondary">
                        <span>{pricing.days} days @ ${vehicle.dailyRentalPrice}/day</span>
                        <span>${pricing.basePrice.toLocaleString()}</span>
                      </div>
                      {pricing.insurance > 0 && (
                        <div className="flex justify-between text-text-secondary">
                          <span>Damage Waiver</span>
                          <span>${pricing.insurance.toLocaleString()}</span>
                        </div>
                      )}
                    </>
                  )}

                  {isBuying && pricing && (
                    <div className="flex justify-between text-text-secondary">
                      <span>Vehicle Price</span>
                      <span>${pricing.basePrice.toLocaleString()}</span>
                    </div>
                  )}

                  {pricing && (
                    <div className="flex justify-between text-text-secondary">
                      <span>Tax & Fees</span>
                      <span>${pricing.tax.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {pricing && (
                  <div className="flex justify-between text-2xl font-bold text-text-primary">
                    <span>Total</span>
                    <span>${pricing.total.toLocaleString()}</span>
                  </div>
                )}

                {/* Protection Info */}
                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="flex gap-3">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <p className="font-bold text-text-primary text-sm">Escrow Protection</p>
                      <p className="text-xs text-text-secondary">
                        Payment held safely until completion
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xl">💳</span>
                    <div>
                      <p className="font-bold text-text-primary text-sm">Secure Payment</p>
                      <p className="text-xs text-text-secondary">
                        All major credit cards accepted
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xl">📋</span>
                    <div>
                      <p className="font-bold text-text-primary text-sm">Clear Terms</p>
                      <p className="text-xs text-text-secondary">
                        No hidden fees or surprises
                      </p>
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
