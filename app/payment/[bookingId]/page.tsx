'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  CreditCard, 
  Copy, 
  Check, 
  Loader2, 
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [booking, setBooking] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [transactionId, setTransactionId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*, vehicles(seller_id, title)')
          .eq('id', bookingId)
          .single()

        if (bookingError || !bookingData) throw new Error("Booking not found")
        setBooking(bookingData)

        const { data: sellerData, error: sellerError } = await supabase
          .from('users')
          .select('full_name, bkash_number, nagad_number')
          .eq('id', bookingData.vehicles.seller_id)
          .single()

        if (sellerError || !sellerData) throw new Error("Seller info not found")
        setSeller(sellerData)
      } catch (err: any) {
        toast.error(err.message)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [bookingId])

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    toast.success(`${type} number copied!`)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transactionId.trim()) {
      toast.error("Please enter the Transaction ID")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          transaction_id: transactionId.trim(),
          payment_status: 'submitted'
        })
        .eq('id', bookingId)

      if (error) throw error

      toast.success("Payment details submitted! Seller will confirm shortly.")
      router.push('/my-bookings')
    } catch (err: any) {
      toast.error("Failed to submit payment: " + err.message)
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

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />
      <main className="container-max pt-32 pb-20">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-text-light hover:text-rivian transition-colors group mb-4">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Cancel & Return
            </Link>
            <h1 className="text-4xl font-black tracking-tighter text-midnight">Complete Payment</h1>
            <p className="text-text-secondary font-medium italic">Follow the steps below to secure your booking.</p>
          </div>

          <Card className="border-none shadow-2xl shadow-black/5 bg-white overflow-hidden">
            <CardHeader className="bg-midnight text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tighter">Amount to Pay</CardTitle>
                  <CardDescription className="text-white/60 font-bold text-lg mt-1">
                    ৳{booking?.total_price?.toLocaleString()}
                  </CardDescription>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Smartphone className="w-6 h-6 text-rivian" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Step 1: Send Money */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-midnight text-white text-xs font-black flex items-center justify-center">1</div>
                  <h3 className="font-black text-midnight uppercase tracking-widest text-xs">Send Money to Seller</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {seller?.bkash_number && (
                    <div className="p-4 rounded-2xl border-2 border-border/50 bg-glacier-white flex items-center justify-between group hover:border-rivian/30 transition-all">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">bKash Personal</p>
                        <p className="font-black text-midnight">{seller.bkash_number}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleCopy(seller.bkash_number, 'bKash')}
                      >
                        {copied === 'bKash' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-text-light" />}
                      </Button>
                    </div>
                  )}
                  {seller?.nagad_number && (
                    <div className="p-4 rounded-2xl border-2 border-border/50 bg-glacier-white flex items-center justify-between group hover:border-rivian/30 transition-all">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">Nagad Personal</p>
                        <p className="font-black text-midnight">{seller.nagad_number}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleCopy(seller.nagad_number, 'Nagad')}
                      >
                        {copied === 'Nagad' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-text-light" />}
                      </Button>
                    </div>
                  )}
                  {!seller?.bkash_number && !seller?.nagad_number && (
                    <div className="col-span-full p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">Seller hasn't provided mobile payment numbers. Please contact them via chat.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Submit TrxID */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-midnight text-white text-xs font-black flex items-center justify-center">2</div>
                    <h3 className="font-black text-midnight uppercase tracking-widest text-xs">Verify Transaction</h3>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-text-light">Transaction ID (TrxID)</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                      <Input 
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 8N7X2P9K" 
                        className="h-14 pl-12 font-bold border-border/50" 
                        required
                      />
                    </div>
                    <p className="text-[10px] font-bold text-text-light italic">Enter the unique ID received after sending the payment.</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || (!seller?.bkash_number && !seller?.nagad_number)} 
                  className="w-full btn-primary h-16 text-lg font-black"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Submit Payment for Confirmation"
                  )}
                </Button>
              </form>

              <div className="pt-6 border-t border-border/50 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <p className="text-xs font-medium text-text-light">
                  Your payment is protected by our escrow system. Funds are only released to the seller after they confirm the booking.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
