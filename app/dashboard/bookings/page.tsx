'use client'

import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  ChevronRight, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const bookings = [
  {
    id: 'BK-8802',
    vehicle: '2023 Tesla Model 3',
    customer: 'John Doe',
    type: 'rental',
    status: 'confirmed',
    date: 'Mar 12, 2026',
    amount: '$445.00'
  },
  {
    id: 'BK-8805',
    vehicle: '2023 Range Rover',
    customer: 'Sarah Smith',
    type: 'purchase',
    status: 'pending',
    date: 'Mar 15, 2026',
    amount: '$54,200.00'
  },
  {
    id: 'BK-8809',
    vehicle: '2022 Rivian R1T',
    customer: 'Michael Brown',
    type: 'rental',
    status: 'completed',
    date: 'Mar 10, 2026',
    amount: '$890.00'
  }
]

export default function BookingsPage() {
  const handleAction = (id: string, action: string) => {
    toast.success(`Booking ${id} ${action} successfully.`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Confirmed</Badge>
      case 'completed': return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Completed</Badge>
      default: return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Pending</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />
      
      <main className="container-max pt-32 pb-20 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-text-light hover:text-rivian transition-colors mb-4 group">
                 <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                 Back to Dashboard
              </Link>
              <h1 className="text-4xl font-black tracking-tighter text-midnight">Manage Bookings</h1>
              <p className="text-text-secondary font-medium italic">Track and manage your vehicle rental and sale requests.</p>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="h-12 px-6">Export CSV</Button>
           </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="border-none shadow-xl shadow-black/5 bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-rivian/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-rivian" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-widest">Pending</p>
                    <p className="text-2xl font-black text-midnight">12 Requests</p>
                 </div>
              </CardContent>
           </Card>
           <Card className="border-none shadow-xl shadow-black/5 bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-widest">Confirmed</p>
                    <p className="text-2xl font-black text-midnight">45 Active</p>
                 </div>
              </CardContent>
           </Card>
           <Card className="border-none shadow-xl shadow-black/5 bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-compass/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-compass" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-widest">Total Value</p>
                    <p className="text-2xl font-black text-midnight">$84,200.00</p>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Table */}
        <Card className="border-none shadow-2xl shadow-black/5 bg-white overflow-hidden">
           <CardContent className="p-0">
              <Table>
                 <TableHeader className="bg-glacier-white">
                    <TableRow className="hover:bg-transparent">
                       <TableHead className="font-bold py-6 px-6">ID & Vehicle</TableHead>
                       <TableHead className="font-bold py-6">Customer</TableHead>
                       <TableHead className="font-bold py-6">Status</TableHead>
                       <TableHead className="font-bold py-6">Date</TableHead>
                       <TableHead className="font-bold py-6">Amount</TableHead>
                       <TableHead className="text-right font-bold py-6 px-6">Actions</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {bookings.map((booking) => (
                       <TableRow key={booking.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="py-6 px-6">
                             <div className="flex flex-col">
                                <span className="text-xs font-black text-text-light uppercase tracking-widest leading-none mb-1">{booking.id}</span>
                                <span className="font-bold text-midnight tracking-tight group-hover:text-rivian transition-colors">{booking.vehicle}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <span className="font-medium text-text-secondary">{booking.customer}</span>
                          </TableCell>
                          <TableCell>
                             {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-text-light">
                             {booking.date}
                          </TableCell>
                          <TableCell className="font-black text-midnight">
                             {booking.amount}
                          </TableCell>
                          <TableCell className="text-right px-6">
                             <div className="flex items-center justify-end gap-2">
                                <Button onClick={() => handleAction(booking.id, 'confirmed')} variant="ghost" className="h-9 w-9 p-0 hover:bg-emerald-50 hover:text-emerald-600">
                                   <CheckCircle className="h-5 w-5" />
                                </Button>
                                <Button onClick={() => handleAction(booking.id, 'cancelled')} variant="ghost" className="h-9 w-9 p-0 hover:bg-destructive/5 hover:text-destructive">
                                   <XCircle className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-black/5">
                                   <MoreHorizontal className="h-5 w-5" />
                                </Button>
                             </div>
                          </TableCell>
                       </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </CardContent>
        </Card>
      </main>
    </div>
  )
}
