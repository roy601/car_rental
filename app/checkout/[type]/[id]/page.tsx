'use client'

import { use, useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Calendar,
  ShieldCheck,
  CreditCard,
  FileText,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Car,
  MapPin,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface BookingProps {
  params: Promise<{
    type: 'rent' | 'buy'
    id: string
  }>
}

export default function CheckoutPage({ params }: BookingProps) {
  const { type, id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [vehicle, setVehicle] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    insurance: true,
    notes: '',
    termsAgreed: false,
    cancellationAgreed: false,
  })

  const isBuying = type === 'buy'
  const isRenting = type === 'rent'
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          toast.error("Please log in to continue.")
          router.push('/auth/login')
          return
        }
        setUser(user)

        const { data: vehicleData, error } = await supabase
          .from('vehicles')
          .select('*, seller:seller_id(full_name, phone)')
          .eq('id', id)
          .single()

        if (error || !vehicleData) throw new Error("Vehicle not found")
        
        if (vehicleData.seller_id === user.id) {
          toast.error("You cannot buy or rent your own vehicle.")
          router.push(`/marketplace/${id}`)
          return
        }

        setVehicle(vehicleData)
      } catch (err: any) {
        toast.error(err.message || "Failed to load vehicle")
        router.push('/marketplace')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const pricing = useMemo(() => {
    if (isRenting && formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      // If same day, count as 1 day. Otherwise calculate difference.
      const diffTime = end.getTime() - start.getTime()
      const days = diffTime <= 0 ? 1 : Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      const dailyRate = vehicle?.daily_rental_price || 0
      const basePrice = days * dailyRate
      const insurance = formData.insurance ? Math.ceil(basePrice * 0.1) : 0
      const tax = Math.ceil((basePrice + insurance) * 0.08)
      return { days, dailyRate, basePrice, insurance, tax, total: basePrice + insurance + tax }
    }

    if (isBuying && vehicle) {
      const basePrice = vehicle.price || 0
      const tax = Math.ceil(basePrice * 0.08)
      return { basePrice, tax, total: basePrice + tax }
    }

    return null
  }, [formData.startDate, formData.endDate, formData.insurance, vehicle, isRenting, isBuying])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.termsAgreed || !formData.cancellationAgreed) {
      toast.error("Please agree to the terms and cancellation policy.")
      return
    }
    if (isRenting && !pricing) {
      toast.error("Please select valid rental dates.")
      return
    }

    const payload = {
      vehicle_id: id,
      buyer_id: user.id,
      booking_type: type === 'rent' ? 'rental' : 'purchase',
      start_date: isRenting ? formData.startDate : null,
      end_date: isRenting ? formData.endDate : null,
      base_price: pricing?.base || (isBuying ? vehicle?.price : 0),
      insurance_price: pricing?.insurance || 0,
      total_price: pricing?.total || (isBuying ? vehicle?.price : 0),
      status: 'pending',
      payment_status: 'pending',
      notes: formData.notes || null,
    }

    console.log("Attempting Booking Insertion:", payload)

    setIsSubmitting(true)
    try {
      const { data: insertData, error: insertError } = await supabase.from('bookings').insert(payload).select()

      if (insertError) {
        console.error("Supabase Insertion Error Message:", insertError.message)
        console.error("Supabase Insertion Error Details:", insertError.details)
        console.error("Supabase Insertion Error Hint:", insertError.hint)
        throw insertError
      }

      if (!insertData || insertData.length === 0) {
        throw new Error("Booking created but could not be retrieved. Please check your RLS 'SELECT' policies.")
      }

      toast.success("Booking submitted successfully!")
      router.push(`/payment/${insertData[0].id}`)
    } catch (err: any) {
      console.error("Full Catch Error Object:", err)
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-glacier-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rivian animate-spin" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-glacier-white">
        <Navbar />
        <main className="container-max pt-32 pb-20 flex flex-col items-center justify-center text-center">
          <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-black/5 max-w-lg w-full space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-midnight mb-2">
                {isBuying ? 'Purchase Request Sent!' : 'Rental Booked!'}
              </h1>
              <p className="text-text-secondary font-medium">
                Your request has been submitted to the seller. They will confirm shortly and you will receive a notification.
              </p>
            </div>
            {pricing && (
              <div className="bg-glacier-white rounded-2xl p-6 border border-border/50 text-left space-y-3">
                <div className="flex justify-between text-sm font-medium text-text-secondary">
                  <span>{isRenting ? `${pricing.days} days rental` : 'Vehicle price'}</span>
                  <span>${pricing.basePrice.toLocaleString()}</span>
                </div>
                {'insurance' in pricing && pricing.insurance > 0 && (
                  <div className="flex justify-between text-sm font-medium text-text-secondary">
                    <span>Damage Waiver</span>
                    <span>${pricing.insurance.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium text-text-secondary">
                  <span>Tax & Fees (8%)</span>
                  <span>${pricing.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-midnight border-t border-border/50 pt-3">
                  <span>Total</span>
                  <span>${pricing.total.toLocaleString()}</span>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1 h-12">
                <Link href="/marketplace">Back to Marketplace</Link>
              </Button>
              <Button asChild className="flex-1 h-12 btn-primary">
                <Link href="/dashboard/bookings">My Bookings</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />
      <main className="container-max pt-32 pb-20">
        {/* Header */}
        <div className="mb-10 space-y-2">
          <Link href={`/marketplace/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-text-light hover:text-rivian transition-colors group mb-4">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Vehicle
          </Link>
          <h1 className="text-4xl font-black tracking-tighter text-midnight">
            {isBuying ? 'Complete Your Purchase' : 'Book Your Rental'}
          </h1>
          <p className="text-text-secondary font-medium italic">
            {isBuying ? 'Secure checkout with escrow protection.' : 'Select your rental dates and confirm your booking.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle Summary */}
              <Card className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
                    <img
                      src={vehicle?.primary_image_url || 'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=200&h=200&fit=crop'}
                      alt={vehicle?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-midnight text-lg tracking-tight">
                      {vehicle?.title || `${vehicle?.year} ${vehicle?.make} ${vehicle?.model}`}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {vehicle?.location && (
                        <span className="flex items-center gap-1 text-xs font-medium text-text-light">
                          <MapPin className="w-3 h-3" />{vehicle.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs font-medium text-text-light">
                        <Car className="w-3 h-3 capitalize" />{vehicle?.category}
                      </span>
                    </div>
                    <p className="text-rivian font-black mt-2">
                      {isBuying
                        ? `$${vehicle?.price?.toLocaleString()} purchase price`
                        : `$${vehicle?.daily_rental_price}/day rental rate`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Rental Dates */}
              {isRenting && (
                <Card className="border-none shadow-xl shadow-black/5 bg-white">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                      <div className="w-10 h-10 rounded-xl bg-rivian/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-rivian" />
                      </div>
                      <div>
                        <p className="font-black text-midnight">Rental Period</p>
                        <p className="text-xs text-text-light font-medium">Choose your pick-up and return dates</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-text-light">Pick-up Date</Label>
                        <Input
                          type="date"
                          className="h-14 font-bold border-border/50"
                          value={formData.startDate}
                          min={today}
                          onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-text-light">Return Date</Label>
                        <Input
                          type="date"
                          className="h-14 font-bold border-border/50"
                          value={formData.endDate}
                          min={formData.startDate || today}
                          onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Duration badge */}
                    {pricing && 'days' in pricing && pricing.days > 0 && (
                      <div className="flex items-center gap-2 bg-rivian/5 border border-rivian/20 rounded-xl px-4 py-3">
                        <Clock className="w-4 h-4 text-rivian" />
                        <p className="text-sm font-bold text-rivian">
                          {pricing.days} day{pricing.days > 1 ? 's' : ''} rental — ${pricing.basePrice.toLocaleString()} base price
                        </p>
                      </div>
                    )}

                    {/* Damage Waiver */}
                    <div
                      onClick={() => setFormData(f => ({ ...f, insurance: !f.insurance }))}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.insurance ? 'border-rivian bg-rivian/5' : 'border-border/50 hover:border-rivian/30'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        formData.insurance ? 'border-rivian bg-rivian' : 'border-border'
                      }`}>
                        {formData.insurance && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-bold text-midnight">Add Damage Waiver</p>
                        <p className="text-xs text-text-secondary font-medium">Protects you from unexpected damage costs (10% of rental price)</p>
                      </div>
                      {pricing && 'insurance' in pricing && pricing.insurance > 0 && (
                        <span className="ml-auto font-black text-midnight">${pricing.insurance}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              <Card className="border-none shadow-xl shadow-black/5 bg-white">
                <CardContent className="p-8 space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-text-light">Special Requests (Optional)</Label>
                  <Textarea
                    placeholder="Any requests for the seller, preferred pick-up location, etc."
                    className="min-h-[100px] font-medium border-border/50 resize-none"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                </CardContent>
              </Card>

              {/* Terms */}
              <Card className="border-none shadow-xl shadow-black/5 bg-white">
                <CardContent className="p-8 space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-text-light">Agreement</p>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-1 accent-rivian"
                      checked={formData.termsAgreed}
                      onChange={e => setFormData({ ...formData, termsAgreed: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-text-secondary">
                      I agree to the <a href="#" className="font-bold text-rivian hover:underline">Terms & Conditions</a> and understand this is a binding agreement with the seller.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-1 accent-rivian"
                      checked={formData.cancellationAgreed}
                      onChange={e => setFormData({ ...formData, cancellationAgreed: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-text-secondary">
                      I acknowledge and accept the <a href="#" className="font-bold text-rivian hover:underline">Cancellation Policy</a>.
                    </span>
                  </label>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={isSubmitting || (isRenting && !pricing) || !formData.termsAgreed || !formData.cancellationAgreed}
                className="w-full btn-primary h-16 text-lg font-black flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isBuying ? 'Submit Purchase Request' : 'Confirm Rental Booking'}
                    {pricing ? ` — $${pricing.total.toLocaleString()}` : ''}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right: Price Breakdown */}
          <div>
            <div className="sticky top-28 space-y-6">
              <Card className="border-none shadow-2xl shadow-black/5 bg-white overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <h2 className="text-xl font-black tracking-tighter text-midnight">Price Summary</h2>

                  {pricing ? (
                    <div className="space-y-4">
                      {isRenting && 'days' in pricing && (
                        <div className="flex justify-between text-sm text-text-secondary font-medium">
                          <span>{pricing.days} days × ${pricing.dailyRate}/day</span>
                          <span>${pricing.basePrice.toLocaleString()}</span>
                        </div>
                      )}
                      {isBuying && (
                        <div className="flex justify-between text-sm text-text-secondary font-medium">
                          <span>Vehicle Price</span>
                          <span>${pricing.basePrice.toLocaleString()}</span>
                        </div>
                      )}
                      {'insurance' in pricing && pricing.insurance > 0 && (
                        <div className="flex justify-between text-sm text-text-secondary font-medium">
                          <span>Damage Waiver</span>
                          <span>${pricing.insurance.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-text-secondary font-medium">
                        <span>Tax & Fees (8%)</span>
                        <span>${pricing.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xl font-black text-midnight border-t border-border/50 pt-4">
                        <span>Total</span>
                        <span className="text-rivian">${pricing.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-text-light text-sm font-medium">
                      {isRenting ? 'Select rental dates to see pricing.' : 'Loading price...'}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card className="border-none shadow-xl shadow-black/5 bg-white">
                <CardContent className="p-6 space-y-4">
                  {[
                    { icon: ShieldCheck, label: 'Escrow Protection', desc: 'Payment held safely until delivery' },
                    { icon: CreditCard, label: 'Secure Payment', desc: 'Encrypted & safe checkout' },
                    { icon: FileText, label: 'Clear Agreement', desc: 'No hidden fees or surprises' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-black/[0.03] flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-text-light" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-midnight">{item.label}</p>
                        <p className="text-xs text-text-secondary">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
