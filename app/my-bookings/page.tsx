'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Car, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Loader2,
  Calendar,
  CreditCard,
  MapPin,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function MyBookingsPage() {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { data, error } = await supabase
          .from('bookings')
          .select('*, vehicles(*)')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBookings(data || [])
      } catch (err: any) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMyBookings()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Confirmed</Badge>
      case 'completed': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Completed</Badge>
      case 'cancelled': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>
      default: return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'submitted': return <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Payment Submitted</Badge>
      case 'paid': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Paid</Badge>
      default: return <Badge variant="outline" className="text-text-light border-border/50">Unpaid</Badge>
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
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-1">
             <Link href="/marketplace" className="flex items-center gap-2 text-sm font-bold text-text-light hover:text-rivian transition-colors mb-4 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Marketplace
             </Link>
             <h1 className="text-4xl font-black tracking-tighter text-midnight">My Bookings</h1>
             <p className="text-text-secondary font-medium italic">Track the status of your rental and purchase requests.</p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[40px] border border-border/50 shadow-xl shadow-black/5">
              <div className="w-16 h-16 rounded-full bg-glacier-white flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-text-light" />
              </div>
              <h3 className="text-xl font-bold text-midnight mb-2">No bookings yet</h3>
              <p className="text-text-secondary text-sm mb-8">You haven't made any rental or purchase requests yet.</p>
              <Button asChild className="btn-primary h-12 px-8">
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden rounded-[32px] group hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Vehicle Image */}
                      <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden">
                        <img 
                          src={booking.vehicles?.primary_image_url || 'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=400&h=300&fit=crop'} 
                          alt={booking.vehicles?.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">
                              {booking.booking_type === 'rent' ? 'Rental Booking' : 'Purchase Request'}
                            </p>
                            <h3 className="text-2xl font-black text-midnight tracking-tighter leading-none group-hover:text-rivian transition-colors">
                              {booking.vehicles?.title || `${booking.vehicles?.year} ${booking.vehicles?.model}`}
                            </h3>
                            <div className="flex items-center gap-4 mt-3 text-xs font-bold text-text-light uppercase tracking-widest">
                               <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {booking.vehicles?.location || 'Unknown'}</span>
                               <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> ৳{Number(booking.total_price).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                             {getPaymentBadge(booking.payment_status)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-light">Booked On</p>
                            <p className="font-bold text-midnight text-sm">{new Date(booking.created_at).toLocaleDateString()}</p>
                          </div>
                          {booking.booking_type === 'rent' && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-text-light">Rental Period</p>
                              <p className="font-bold text-midnight text-sm">
                                {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-light">TrxID</p>
                            <p className="font-bold text-rivian text-sm font-mono">{booking.transaction_id || 'Not Submitted'}</p>
                          </div>
                        </div>

                         <div className="flex justify-end gap-3 pt-2">
                           {booking.payment_status === 'unpaid' && (
                              <Button asChild className="btn-primary h-11 px-6">
                                <Link href={`/payment/${booking.id}`}>Complete Payment</Link>
                              </Button>
                           )}
                           {(booking.status === 'confirmed' || booking.status === 'completed') && (
                              <Button asChild variant="outline" className="h-11 px-6 flex items-center gap-2">
                                <Link href={`/invoice/${booking.id}`}>
                                  <FileText className="w-4 h-4" />
                                  Invoice
                                </Link>
                              </Button>
                           )}
                           <Button asChild variant="outline" className="h-11 px-6">
                              <Link href={`/marketplace/${booking.vehicle_id}`}>View Vehicle</Link>
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
