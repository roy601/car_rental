'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowLeft,
  Loader2,
  Printer,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function BookingsPage() {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) throw new Error("Authentication failed")

        const { data: vehicles } = await supabase
          .from('vehicles')
          .select('id')
          .eq('seller_id', user.id)

        const vehicleIds = vehicles?.map(v => v.id) || []

        if (vehicleIds.length > 0) {
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select('*, vehicles(title, model, year)')
            .in('vehicle_id', vehicleIds)
            .order('created_at', { ascending: false })

          if (bookingsError) throw bookingsError

          const buyerIds = [...new Set(bookingsData?.map(b => b.buyer_id) || [])]
          if (buyerIds.length > 0) {
            const { data: usersData } = await supabase
              .from('users')
              .select('id, full_name')
              .in('id', buyerIds)

            const enrichedBookings = bookingsData?.map(b => ({
              ...b,
              customer: usersData?.find(u => u.id === b.buyer_id)?.full_name || 'Unknown Customer'
            }))
            setBookings(enrichedBookings || [])
          } else {
            setBookings(bookingsData || [])
          }
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleAction = async (id: string, action: string) => {
    try {
      const updateData: any = { status: action }
      if (action === 'confirmed') {
        updateData.payment_status = 'paid'
      }

      const { error } = await supabase.from('bookings').update(updateData).eq('id', id)
      if (error) throw error

      toast.success(`Booking ${action} successfully.`)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updateData } : b))
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message)
    }
  }

  const handleExport = () => {
    window.print()
  }

  const stats = useMemo(() => {
    return {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      totalValue: bookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.total_price || 0), 0)
    }
  }, [bookings])

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
    <div className="min-h-screen bg-glacier-white print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <main className="container-max pt-32 pb-20 space-y-10 print:pt-10">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <div className="print:hidden">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-text-light hover:text-rivian transition-colors mb-4 group">
                   <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                   Back to Dashboard
                </Link>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-midnight">Manage Bookings</h1>
              <p className="text-text-secondary font-medium italic">Track and manage your vehicle rental and sale requests.</p>
           </div>
           <div className="flex gap-3 print:hidden">
              <Button variant="outline" className="h-12 px-6 flex items-center gap-2" onClick={handleExport}>
                 <Printer className="w-4 h-4" />
                 Print / Export PDF
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="border-none shadow-xl shadow-black/5 bg-white print:border">
              <CardContent className="p-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-rivian/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-rivian" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-widest">Pending</p>
                    <p className="text-2xl font-black text-midnight">{stats.pending} Requests</p>
                 </div>
              </CardContent>
           </Card>
           <Card className="border-none shadow-xl shadow-black/5 bg-white print:border">
              <CardContent className="p-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-widest">Confirmed</p>
                    <p className="text-2xl font-black text-midnight">{stats.confirmed} Active</p>
                 </div>
              </CardContent>
           </Card>
           <Card className="border-none shadow-xl shadow-black/5 bg-white print:border">
              <CardContent className="p-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-compass/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-compass" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-widest">Total Value</p>
                    <p className="text-2xl font-black text-midnight">${stats.totalValue.toLocaleString()}</p>
                 </div>
              </CardContent>
           </Card>
        </div>

        <Card className="border-none shadow-2xl shadow-black/5 bg-white overflow-hidden print:border">
           <CardContent className="p-0">
              <Table>
                 <TableHeader className="bg-glacier-white">
                    <TableRow className="hover:bg-transparent">
                       <TableHead className="font-bold py-6 px-6">ID & Vehicle</TableHead>
                       <TableHead className="font-bold py-6">Customer</TableHead>
                       <TableHead className="font-bold py-6">Payment</TableHead>
                       <TableHead className="font-bold py-6">TrxID</TableHead>
                       <TableHead className="font-bold py-6">Status</TableHead>
                       <TableHead className="font-bold py-6">Date</TableHead>
                       <TableHead className="font-bold py-6">Amount</TableHead>
                       <TableHead className="text-right font-bold py-6 px-6 print:hidden">Actions</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {bookings.length > 0 ? bookings.map((booking) => (
                       <TableRow key={booking.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="py-6 px-6">
                             <div className="flex flex-col">
                                <span className="text-xs font-black text-text-light uppercase tracking-widest leading-none mb-1">
                                   {booking.id.substring(0, 8).toUpperCase()}
                                </span>
                                <span className="font-bold text-midnight tracking-tight group-hover:text-rivian transition-colors">
                                   {booking.vehicles?.title || `${booking.vehicles?.year || ''} ${booking.vehicles?.model || 'Vehicle'}`}
                                </span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <span className="font-medium text-text-secondary">{booking.customer}</span>
                          </TableCell>
                          <TableCell>
                             {getPaymentBadge(booking.payment_status)}
                          </TableCell>
                          <TableCell>
                             {booking.transaction_id ? (
                               <code className="bg-glacier-white px-2 py-1 rounded text-xs font-black text-rivian border border-rivian/10">
                                 {booking.transaction_id}
                               </code>
                             ) : (
                               <span className="text-xs text-text-light italic">None</span>
                             )}
                          </TableCell>
                          <TableCell>
                             {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-text-light">
                             {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className="font-black text-midnight">
                             ${Number(booking.total_price).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right px-6 print:hidden">
                             {booking.status === 'pending' && (
                                <div className="flex items-center justify-end gap-2">
                                   <Button onClick={() => handleAction(booking.id, 'confirmed')} variant="ghost" className="h-9 w-9 p-0 hover:bg-emerald-50 hover:text-emerald-600" title="Confirm Booking">
                                      <CheckCircle className="h-5 w-5" />
                                   </Button>
                                   <Button onClick={() => handleAction(booking.id, 'cancelled')} variant="ghost" className="h-9 w-9 p-0 hover:bg-destructive/5 hover:text-destructive" title="Reject Booking">
                                      <XCircle className="h-5 w-5" />
                                   </Button>
                                </div>
                             )}
                          </TableCell>
                       </TableRow>
                    )) : (
                       <TableRow>
                         <TableCell colSpan={8} className="h-48 text-center text-text-light font-medium">
                            No bookings found for your vehicles.
                         </TableCell>
                       </TableRow>
                    )}
                 </TableBody>
              </Table>
           </CardContent>
        </Card>
      </main>
    </div>
  )
}
