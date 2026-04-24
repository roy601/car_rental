'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  TrendingUp, 
  Car, 
  Calendar, 
  Users, 
  Plus, 
  Eye, 
  FileText, 
  ShieldCheck, 
  Star, 
  Zap, 
  Clock,
  ChevronRight,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleAction = (action: string) => {
    toast.info(`${action} feature coming soon!`)
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />
      
      <main className="container-max pt-32 pb-20 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-midnight">Seller Dashboard</h1>
            <p className="text-text-secondary font-medium italic">Welcome back, {user?.user_metadata?.full_name || 'Partner'}. Here's your performance overview.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button asChild className="btn-primary h-12 px-8 flex items-center gap-2 group">
                <Link href="/dashboard/listings/new">
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  Add New Listing
                </Link>
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: '$125,400', trend: '+12%', icon: TrendingUp, color: 'text-emerald-500' },
            { label: 'Active Listings', value: '24', trend: '+3%', icon: Car, color: 'text-rivian' },
            { label: 'Total Bookings', value: '156', trend: '+8%', icon: Calendar, color: 'text-compass' },
            { label: 'Visitor Analytics', value: '12.5K', trend: '-2%', icon: Users, color: 'text-destructive', isDown: true },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden group hover:scale-[1.02] transition-transform">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light">{stat.label}</CardTitle>
                <div className={`w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center transition-colors group-hover:bg-black/5`}>
                   <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter text-midnight">{stat.value}</div>
                <p className={`text-xs font-bold mt-1 ${stat.isDown ? 'text-destructive' : 'text-emerald-500'}`}>
                    {stat.trend} <span className="text-text-light font-medium ml-1 text-[10px]">vs last month</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Trend Chart Card */}
            <Card className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
                <div>
                  <CardTitle className="text-xl font-black tracking-tighter">Revenue Trend</CardTitle>
                  <CardDescription className="font-medium text-text-light">Visual performance over the last 30 days.</CardDescription>
                </div>
                <SelectPeriod />
              </CardHeader>
              <CardContent className="pt-10">
                 <div className="flex items-end justify-between h-[240px] gap-2 md:gap-4 px-2">
                    {[45, 62, 54, 78, 65, 88, 72, 92, 85, 98].map((h, i) => (
                      <div key={i} className="flex-1 space-y-2 group">
                         <div 
                           className="w-full bg-rivian/10 rounded-t-xl group-hover:bg-rivian transition-all duration-500 relative" 
                           style={{ height: `${h}%` }}
                         >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-midnight text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                               ${h}k
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-6 px-2">
                    <span className="text-[10px] font-bold text-text-light uppercase tracking-widest">March 01</span>
                    <span className="text-[10px] font-bold text-text-light uppercase tracking-widest text-center">Revenue in thousands (Last 10 Days)</span>
                    <span className="text-[10px] font-bold text-text-light uppercase tracking-widest">Today</span>
                 </div>
              </CardContent>
            </Card>

            {/* Top Vehicles */}
            <Card className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-6">
                    <CardTitle className="text-xl font-black tracking-tighter">Top Performing Vehicles</CardTitle>
                    <CardDescription className="font-medium text-text-light">Ranked by revenue generation and user engagement.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        {[
                            { name: '2023 Tesla Model 3', stats: '1,250 views • 45 bookings', revenue: '$4,005' },
                            { name: '2023 Range Rover', stats: '980 views • 32 bookings', revenue: '$5,760' },
                            { name: '2022 Rivian R1T', stats: '750 views • 28 bookings', revenue: '$4,172' }
                        ].map((car, i) => (
                            <div key={i} className="p-6 flex items-center justify-between hover:bg-glacier-white transition-colors group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-rivian/10 flex items-center justify-center">
                                        <Car className="w-6 h-6 text-rivian" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-midnight tracking-tight group-hover:text-rivian transition-colors">{car.name}</h4>
                                        <p className="text-xs text-text-light font-medium">{car.stats}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black tracking-tighter text-midnight">{car.revenue}</div>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Revenue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-none shadow-xl shadow-black/5 bg-white">
               <CardHeader>
                  <CardTitle className="text-lg font-black tracking-tighter">Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full h-12 justify-between group font-bold">
                     <Link href="/dashboard/bookings" className="flex w-full items-center justify-between">
                        View All Bookings
                        <ChevronRight className="w-4 h-4 text-text-light group-hover:text-rivian transition-transform group-hover:translate-x-1" />
                     </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-12 justify-between group font-bold">
                     <Link href="/dashboard/documents" className="flex w-full items-center justify-between">
                        Upload Documents
                        <FileText className="w-4 h-4 text-text-light group-hover:text-rivian transition-transform group-hover:translate-x-1" />
                     </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-12 justify-between group font-bold">
                     <Link href="/dashboard/settings" className="flex w-full items-center justify-between">
                        Account Settings
                        <Zap className="w-4 h-4 text-text-light group-hover:text-rivian transition-transform group-hover:translate-x-1" />
                     </Link>
                  </Button>
               </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="border-none shadow-xl shadow-black/5 bg-white">
                <CardHeader>
                    <CardTitle className="text-lg font-black tracking-tighter">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <div>
                                <p className="text-sm font-bold text-emerald-900">Verified Seller</p>
                                <p className="text-[10px] font-medium text-emerald-700">All documents approved</p>
                            </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-bold text-blue-900">Seller Rating</p>
                                <p className="text-[10px] font-medium text-blue-700">4.8 / 5.0 stars</p>
                            </div>
                        </div>
                        <Star className="w-4 h-4 text-blue-600 fill-current" />
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="text-sm font-bold text-amber-900">Response Rate</p>
                                <p className="text-[10px] font-medium text-amber-700">98% within 1 hour</p>
                            </div>
                        </div>
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-none shadow-xl shadow-black/5 bg-white">
               <CardHeader>
                  <CardTitle className="text-lg font-black tracking-tighter">Upcoming</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  {[
                    { label: 'Vehicle Inspection', time: 'Tomorrow, 2:00 PM', icon: Eye, color: 'text-rivian' },
                    { label: 'Booking Confirmation', time: 'March 15, 2026', icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'Payment Settlement', time: 'March 20, 2026', icon: CreditCard, color: 'text-blue-500' },
                  ].map((event, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center flex-shrink-0`}>
                            <event.icon className={`w-5 h-5 ${event.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-midnight">{event.label}</p>
                            <p className="text-xs text-text-light font-medium flex items-center gap-1.5">
                                <Clock className="w-3 h-3" />
                                {event.time}
                            </p>
                        </div>
                    </div>
                  ))}
               </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function SelectPeriod() {
    return (
        <div className="flex items-center gap-2 bg-glacier-white px-3 py-1.5 rounded-lg border border-border cursor-pointer hover:bg-white transition-colors">
            <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary">Last 30 Days</span>
            <ChevronRight className="w-3 h-3 rotate-90 text-text-light" />
        </div>
    )
}
