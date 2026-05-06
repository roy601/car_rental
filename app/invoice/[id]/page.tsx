'use client'

import { use, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Printer, ArrowLeft, Download, ShieldCheck, Car } from 'lucide-react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            vehicles(*, seller:seller_id(*)),
            buyer:buyer_id(*)
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        setBooking(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-glacier-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rivian animate-spin" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-glacier-white flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-black text-midnight">Invoice Not Found</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/bookings">Back to Bookings</Link>
        </Button>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const basePrice = Number(booking.base_price || 0)
  const insurance = Number(booking.insurance_price || 0)
  const total = Number(booking.total_price || 0)
  const tax = Math.ceil((basePrice + insurance) * 0.08)
  const lateFees = total - (basePrice + insurance + tax)

  return (
    <div className="min-h-screen bg-glacier-white pb-20 print:bg-white print:pb-0">
      {/* Navbar - Hidden on print */}
      <nav className="h-20 bg-white border-b border-border/50 flex items-center justify-between px-8 sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="h-10 w-10 p-0">
            <Link href="/dashboard/bookings">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <span className="font-black text-midnight tracking-tighter text-xl">Invoice <span className="text-rivian">#{booking.id.substring(0, 8).toUpperCase()}</span></span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 h-11 px-6 font-bold">
            <Printer className="w-4 h-4" />
            Print Invoice
          </Button>
          <Button onClick={handlePrint} className="btn-primary flex items-center gap-2 h-11 px-6 font-bold">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </nav>

      <main className="container-max py-12">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 overflow-hidden print:shadow-none print:rounded-none border border-border/50 print:border-none">
          {/* Header */}
          <div className="bg-midnight p-12 text-white flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-rivian flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter">AutoFleet<span className="text-compass">Pro</span></span>
              </div>
              <div className="space-y-1 opacity-70 text-sm font-medium">
                <p>123 Automotive Plaza</p>
                <p>Dhaka, Bangladesh</p>
                <p>support@autofleetpro.com</p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <h1 className="text-5xl font-black tracking-tighter uppercase opacity-20">Invoice</h1>
              <div className="space-y-1 font-bold text-sm">
                <p>Date: {new Date(booking.created_at).toLocaleDateString()}</p>
                <p>Invoice #: {booking.id.toUpperCase()}</p>
                <p className="text-rivian uppercase tracking-widest text-[10px] mt-4">Status: {booking.status.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="p-12 space-y-12">
            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-text-light">Bill To</h3>
                <div className="space-y-1">
                  <p className="text-xl font-black text-midnight">{booking.buyer?.full_name || 'Customer'}</p>
                  <p className="text-text-secondary font-medium">{booking.buyer?.email}</p>
                  <p className="text-text-secondary font-medium">{booking.buyer?.phone || 'No phone provided'}</p>
                </div>
              </div>
              <div className="space-y-4 md:text-right">
                <h3 className="text-xs font-black uppercase tracking-widest text-text-light">Issued By</h3>
                <div className="space-y-1">
                  <p className="text-xl font-black text-midnight">{booking.vehicles?.seller?.full_name || 'Verified Seller'}</p>
                  <p className="text-text-secondary font-medium">{booking.vehicles?.seller?.email || 'AutoFleet Pro Partner'}</p>
                  <p className="text-text-secondary font-medium">AutoFleet Pro Marketplace Partner</p>
                  <div className="flex items-center gap-2 md:justify-end text-emerald-500 mt-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Verified Merchant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="bg-glacier-white rounded-3xl p-8 border border-border/50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-white border border-border/50 overflow-hidden flex-shrink-0">
                    <img 
                      src={booking.vehicles?.primary_image_url || 'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=200&h=200&fit=crop'} 
                      className="w-full h-full object-cover" 
                      alt="Vehicle"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-midnight tracking-tight">
                      {booking.vehicles?.title || `${booking.vehicles?.year} ${booking.vehicles?.model}`}
                    </h2>
                    <p className="text-text-secondary font-medium italic">
                      {booking.booking_type === 'rental' ? 'Rental Period' : 'Vehicle Purchase'}
                    </p>
                    {booking.booking_type === 'rental' && (
                      <div className="flex items-center gap-3 mt-2 text-sm font-bold text-rivian">
                        <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                        <span className="opacity-40">→</span>
                        <span>{new Date(booking.end_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">Total Amount Due</p>
                  <p className="text-4xl font-black text-midnight tracking-tighter">৳{total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="py-6 text-xs font-black uppercase tracking-widest text-text-light">Description</th>
                  <th className="py-6 text-xs font-black uppercase tracking-widest text-text-light text-center">Qty/Duration</th>
                  <th className="py-6 text-xs font-black uppercase tracking-widest text-text-light text-right">Unit Price</th>
                  <th className="py-6 text-xs font-black uppercase tracking-widest text-text-light text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr>
                  <td className="py-6">
                    <p className="font-black text-midnight">{booking.booking_type === 'rental' ? 'Vehicle Rental' : 'Vehicle Purchase'}</p>
                    <p className="text-xs text-text-light font-medium">{booking.vehicles?.title}</p>
                  </td>
                  <td className="py-6 text-center font-bold text-midnight">
                    {booking.booking_type === 'rental' ? '1 Period' : '1 Unit'}
                  </td>
                  <td className="py-6 text-right font-bold text-midnight">
                    ৳{basePrice.toLocaleString()}
                  </td>
                  <td className="py-6 text-right font-black text-midnight">
                    ৳{basePrice.toLocaleString()}
                  </td>
                </tr>
                {insurance > 0 && (
                  <tr>
                    <td className="py-6">
                      <p className="font-black text-midnight">Damage Waiver / Insurance</p>
                      <p className="text-xs text-text-light font-medium">Standard protection plan</p>
                    </td>
                    <td className="py-6 text-center font-bold text-midnight">1</td>
                    <td className="py-6 text-right font-bold text-midnight">৳{insurance.toLocaleString()}</td>
                    <td className="py-6 text-right font-black text-midnight">৳{insurance.toLocaleString()}</td>
                  </tr>
                )}
                {lateFees > 0 && (
                  <tr className="text-destructive">
                    <td className="py-6">
                      <p className="font-black">Late Return Surcharge</p>
                      <p className="text-xs font-medium">Calculated at ৳1,000/hour</p>
                    </td>
                    <td className="py-6 text-center font-bold">Surcharge</td>
                    <td className="py-6 text-right font-bold">৳{lateFees.toLocaleString()}</td>
                    <td className="py-6 text-right font-black">৳{lateFees.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end pt-6">
              <div className="w-full max-w-xs space-y-4">
                <div className="flex justify-between text-sm font-bold text-text-secondary">
                  <span>Subtotal</span>
                  <span>৳{(basePrice + insurance + (lateFees > 0 ? lateFees : 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-text-secondary">
                  <span>Tax & VAT (8%)</span>
                  <span>৳{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <span className="text-lg font-black text-midnight uppercase tracking-tighter">Total Due</span>
                  <span className="text-3xl font-black text-rivian tracking-tighter">৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="pt-20 border-t border-border/50 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-emerald-500">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">Payment Verified</span>
              </div>
              <p className="text-xs text-text-light font-medium max-w-md mx-auto leading-relaxed italic">
                This is a computer-generated invoice. For any inquiries regarding this transaction, please contact AutoFleet Pro support with your invoice number.
              </p>
              <div className="pt-8">
                <div className="inline-block px-6 py-2 bg-glacier-white rounded-full text-[10px] font-black text-text-light uppercase tracking-[0.2em]">
                  Thank you for using AutoFleet Pro
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
