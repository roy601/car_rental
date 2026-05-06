'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  CreditCard,
  Loader2,
  Edit2,
  Trash2,
  AlertCircle,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [sellerBookings, setSellerBookings] = useState<any[]>([])
  const [buyerBookings, setBuyerBookings] = useState<any[]>([])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/auth/login'); return }
        setUser(user)

        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        setUserProfile(profile)

        // Redirect admins to the admin panel
        if (profile?.user_type === 'admin') {
          router.push('/admin')
          return
        }

        // 1. AS SELLER: Fetch my vehicles and their bookings
        const { data: vehiclesData } = await supabase
          .from('vehicles')
          .select('*')
          .eq('seller_id', user.id)
        setVehicles(vehiclesData || [])

        if (vehiclesData && vehiclesData.length > 0) {
          const vehicleIds = vehiclesData.map(v => v.id)
          const { data: sBookings } = await supabase
            .from('bookings')
            .select('*, vehicles(title, make, model, primary_image_url)')
            .in('vehicle_id', vehicleIds)
          setSellerBookings(sBookings || [])
        }

        // 2. AS BUYER: Fetch bookings I have made
        const { data: bBookings } = await supabase
          .from('bookings')
          .select('*, vehicles(*)')
          .eq('buyer_id', user.id)
        setBuyerBookings(bBookings || [])

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  const handleDeleteVehicle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        const { error } = await supabase.from('vehicles').delete().eq('id', id)
        if (error) throw error
        toast.success("Vehicle deleted successfully")
        setVehicles(v => v.filter(vec => vec.id !== id))
      } catch (error: any) {
        toast.error("Failed to delete vehicle: " + error.message)
      }
    }
  }

  const stats = useMemo(() => {
    const activeListings = vehicles.filter(v => v.status === 'active').length
    const totalSellerBookings = sellerBookings.length
    const totalRevenue = sellerBookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + Number(b.total_price || 0), 0)

    // Buyer stats
    const activeRentals = buyerBookings.filter(b => b.status === 'confirmed' && b.booking_type === 'rental').length
    const totalSpent = buyerBookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + Number(b.total_price || 0), 0)

    const vehicleStats = vehicles.map(v => {
      const vBookings = sellerBookings.filter(b => b.vehicle_id === v.id)
      const vRevenue = vBookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.total_price || 0), 0)
        
      return {
        id: v.id,
        name: v.title || `${v.year} ${v.make} ${v.model}`,
        bookings: vBookings.length,
        revenue: vRevenue,
        image: v.primary_image_url
      }
    })
    
    const topVehicles = vehicleStats
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)

    return {
      activeListings,
      totalSellerBookings,
      totalRevenue,
      topVehicles,
      activeRentals,
      totalSpent
    }
  }, [vehicles, sellerBookings, buyerBookings])

  // Chart data calculation (last 10 days)
  const handleRequestDeletion = async (id: string) => {
    if (!confirm("Are you sure you want to request deletion for this vehicle? It will be hidden from the marketplace until an admin approves.")) return
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status: 'pending_delete' })
        .eq('id', id)
      
      if (error) throw error
      toast.success("Deletion request sent to admin")
      // Refresh local state
      setVehicles(vehicles.map(v => v.id === id ? { ...v, status: 'pending_delete' } : v))
    } catch (err: any) {
      toast.error("Failed to request deletion")
    }
  }

  const chartData = useMemo(() => {
    const data = []
    const today = new Date()
    
    for (let i = 9; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      data.push({
        date: d.toISOString().split('T')[0],
        revenue: 0,
        spending: 0,
        height: 0
      })
    }
    
    sellerBookings.forEach(b => {
      if (b.status === 'completed' || b.status === 'confirmed') {
        const bDate = b.created_at ? b.created_at.split('T')[0] : ''
        const dayMatch = data.find(d => d.date === bDate)
        if (dayMatch) {
          dayMatch.revenue += Number(b.total_price || 0)
        }
      }
    })

    buyerBookings.forEach(b => {
      if (b.status === 'completed' || b.status === 'confirmed') {
        const bDate = b.created_at ? b.created_at.split('T')[0] : ''
        const dayMatch = data.find(d => d.date === bDate)
        if (dayMatch) {
          dayMatch.spending += Number(b.total_price || 0)
        }
      }
    })
    
    const maxVal = Math.max(...data.map(d => Math.max(d.revenue, d.spending)), 1000) 
    
    return data.map(d => ({
      ...d,
      height: Math.max((d.revenue / maxVal) * 100, 5),
      spendHeight: Math.max((d.spending / maxVal) * 100, 5)
    }))
  }, [sellerBookings, buyerBookings])

  const upcomingEvents = useMemo(() => {
    const sellerEvents = sellerBookings
      .filter(b => b.status === 'pending' || (b.status === 'confirmed' && b.payment_status === 'submitted'))
      .map(b => ({
        label: `Action Required: ${b.vehicles?.title || 'Vehicle'}`,
        time: b.payment_status === 'submitted' ? 'Payment Submitted' : 'Pending Request',
        icon: b.payment_status === 'submitted' ? CreditCard : Clock,
        color: b.payment_status === 'submitted' ? 'text-indigo-500' : 'text-amber-500',
        type: 'selling'
      }))

    const buyerEvents = buyerBookings
      .filter(b => b.status === 'confirmed' || b.status === 'pending')
      .map(b => ({
        label: `${b.status === 'confirmed' ? 'Confirmed' : 'Pending'}: ${b.vehicles?.title || 'Vehicle'}`,
        time: b.status === 'confirmed' ? 'Ready for pickup' : 'Waiting for seller',
        icon: b.status === 'confirmed' ? CheckCircle2 : Clock,
        color: b.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500',
        type: 'buying'
      }))

    const allEvents = [...sellerEvents, ...buyerEvents].slice(0, 5)
      
    if (allEvents.length === 0) {
       return [
         { label: 'Welcome to Marketplace', time: 'Active', icon: CheckCircle2, color: 'text-emerald-500' },
       ]
    }
    return allEvents
  }, [sellerBookings, buyerBookings])

  const userType = userProfile?.user_type || 'buyer'
  const isBuyer = userType === 'buyer'

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
      
      <main className="container-max pt-32 pb-20 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-midnight">
              {isBuyer ? 'Buyer Dashboard' : 'Dashboard'}
            </h1>
            <p className="text-text-secondary font-medium italic">
              Welcome back, {user?.user_metadata?.full_name || 'User'}. 
              {isBuyer ? " Manage your rentals and find your next ride." : " Manage your unified marketplace activity."}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button asChild variant="outline" className="h-12 px-6 flex items-center gap-2">
                <Link href="/marketplace">
                  <Eye className="w-5 h-5" />
                  Browse Vehicles
                </Link>
             </Button>
             {isBuyer && (
               <Button
                 className="btn-primary h-12 px-8 flex items-center gap-2 group"
                 onClick={async () => {
                   const { error } = await supabase.from('users').update({ user_type: 'seller', verification_status: 'pending' }).eq('id', user?.id)
                   if (!error) { toast.success('Seller application submitted! Complete your profile.'); router.push('/dashboard/settings') }
                   else toast.error('Failed to switch role')
                 }}
               >
                 <Plus className="w-5 h-5" />
                 Become a Seller
               </Button>
             )}
             {!isBuyer && userProfile?.verification_status === 'approved' && (
               <Button asChild className="btn-primary h-12 px-8 flex items-center gap-2 group">
                  <Link href="/dashboard/listings/new">
                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                    List a Vehicle
                  </Link>
               </Button>
             )}
          </div>
        </div>

        {/* Seller pending approval banner */}
        {!isBuyer && userProfile?.verification_status === 'pending' && (
          <div className="flex items-center gap-4 bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-midnight font-black">Account Pending Admin Approval</p>
              <p className="text-amber-700 text-sm">Complete your profile below. Once the admin approves your seller account, you can list vehicles.</p>
            </div>
            <Button asChild variant="outline" className="flex-shrink-0 border-amber-200 text-amber-700 hover:bg-amber-100">
              <Link href="/dashboard/settings">Complete Profile</Link>
            </Button>
          </div>
        )}

        {/* Seller rejected banner */}
        {!isBuyer && userProfile?.verification_status === 'rejected' && (
          <div className="flex items-center gap-4 bg-rose-50 border border-rose-100 rounded-2xl p-5">
            <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
            <div>
              <p className="text-midnight font-black">Seller Application Rejected</p>
              <p className="text-rose-600 text-sm">Your seller account was rejected. Please contact the admin for more information.</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isBuyer ? (
            // BUYER STATS
            <>
              {[
                { label: 'Active Rentals', value: stats.activeRentals.toString(), sub: 'Currently using', icon: Clock, color: 'text-rivian' },
                { label: 'Total Bookings', value: buyerBookings.length.toString(), sub: 'All time', icon: Calendar, color: 'text-compass' },
                { label: 'Total Spent', value: `৳${stats.totalSpent.toLocaleString()}`, sub: 'Lifetime spending', icon: CreditCard, color: 'text-indigo-500' },
                { label: 'Account Status', value: 'Active', sub: userProfile?.is_verified ? 'Verified' : 'Basic', icon: ShieldCheck, color: 'text-emerald-500' },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden group hover:scale-[1.02] transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light">{stat.label}</CardTitle>
                    <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center">
                       <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black tracking-tighter text-midnight">{stat.value}</div>
                    <p className="text-xs font-bold mt-1 text-text-secondary">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            // SELLER / UNIFIED STATS
            <>
              {[
                { label: 'Total Earned', value: `৳${stats.totalRevenue.toLocaleString()}`, sub: 'As Seller', icon: TrendingUp, color: 'text-emerald-500' },
                { label: 'Total Spent', value: `৳${stats.totalSpent.toLocaleString()}`, sub: 'As Buyer', icon: CreditCard, color: 'text-indigo-500' },
                { label: 'Active Rentals', value: stats.activeRentals.toString(), sub: 'Current Bookings', icon: Clock, color: 'text-compass' },
                { label: 'My Listings', value: stats.activeListings.toString(), sub: 'In Marketplace', icon: Car, color: 'text-rivian' },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden group hover:scale-[1.02] transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light">{stat.label}</CardTitle>
                    <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center">
                       <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black tracking-tighter text-midnight">{stat.value}</div>
                    <p className="text-xs font-bold mt-1 text-text-secondary">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Financial Activity Chart (Buyer sees spending, Seller sees both) */}
            <Card className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
                <div>
                  <CardTitle className="text-xl font-black tracking-tighter">
                    {isBuyer ? 'Spending History' : 'Financial Activity'}
                  </CardTitle>
                  <CardDescription className="font-medium text-text-light">
                    {isBuyer ? 'Visual spending over the last 10 days.' : 'Revenue (Green) vs Spending (Blue) over the last 10 days.'}
                  </CardDescription>
                </div>
                {!isBuyer && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rivian"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-light">Earnings</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-light">Spending</span>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-10">
                 <div className="flex items-end justify-between h-[240px] gap-2 md:gap-4 px-2">
                    {chartData.map((day, i) => (
                      <div key={i} className="flex-1 flex gap-0.5 items-end group h-full">
                         {!isBuyer && (
                           <div 
                             className="flex-1 bg-rivian/10 rounded-t-lg group-hover:bg-rivian transition-all duration-500 relative" 
                             style={{ height: `${day.height}%` }}
                           >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-midnight text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold whitespace-nowrap z-10">
                                 E: ৳{day.revenue.toLocaleString()}
                              </div>
                           </div>
                         )}
                         <div 
                           className={`${isBuyer ? 'w-full' : 'flex-1'} bg-indigo-500/10 rounded-t-lg group-hover:bg-indigo-500 transition-all duration-500 relative`} 
                           style={{ height: `${day.spendHeight}%` }}
                         >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-midnight text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold whitespace-nowrap z-10">
                               S: ৳{day.spending.toLocaleString()}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
            </Card>

            {/* Buyer: Recent Bookings / Seller: Top Vehicles */}
            {isBuyer ? (
              <Card className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-6">
                  <CardTitle className="text-xl font-black tracking-tighter">My Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {buyerBookings.length > 0 ? buyerBookings.slice(0, 5).map((booking, i) => (
                      <div key={i} className="p-6 flex items-center justify-between hover:bg-glacier-white transition-colors group cursor-pointer">
                        <Link href={`/my-bookings`} className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center overflow-hidden">
                            <img src={booking.vehicles?.primary_image_url} alt="Car" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-midnight tracking-tight group-hover:text-rivian transition-colors">
                              {booking.vehicles?.title}
                            </h4>
                            <p className="text-xs text-text-light font-medium">{new Date(booking.created_at).toLocaleDateString()}</p>
                          </div>
                        </Link>
                        <div className="text-right">
                           <div className="text-lg font-black tracking-tighter text-midnight">৳{booking.total_price}</div>
                           <Badge variant="outline" className="text-[10px] uppercase">{booking.status}</Badge>
                        </div>
                      </div>
                    )) : (
                      <div className="p-12 text-center text-text-light">No bookings found.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-black tracking-tighter">Top Performing Vehicles</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        {stats.topVehicles.length > 0 ? stats.topVehicles.map((car, i) => (
                            <div key={i} className="p-6 flex items-center justify-between hover:bg-glacier-white transition-colors group gap-4 border-b border-border/50 last:border-0">
                                <Link href={`/marketplace/${car.id}`} className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-rivian/10 flex items-center justify-center overflow-hidden">
                                        {car.image ? <img src={car.image} alt={car.name} className="w-full h-full object-cover" /> : <Car className="w-6 h-6 text-rivian" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-midnight tracking-tight group-hover:text-rivian transition-colors">{car.name}</h4>
                                        <p className="text-xs text-text-light font-medium">{car.bookings} bookings · <span className={`capitalize ${
                                          car.status === 'pending_delete' ? 'text-amber-500' :
                                          car.status === 'pending_approval' ? 'text-amber-500' :
                                          car.status === 'active' ? 'text-emerald-500' : 'text-text-light'
                                        }`}>{car.status === 'pending_approval' ? '⏳ Awaiting Approval' : car.status === 'pending_delete' ? '🗑 Deletion Pending' : car.status}</span></p>
                                    </div>
                                </Link>
                                <div className="flex items-center gap-3">
                                    <div className="text-right mr-4 hidden md:block">
                                        <div className="text-lg font-black tracking-tighter text-midnight">৳{car.revenue.toLocaleString()}</div>
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Revenue</p>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="h-9 px-4 font-bold border-border/50 hover:bg-white hover:text-rivian">
                                        <Link href={`/dashboard/listings/edit/${car.id}`}>Edit</Link>
                                    </Button>
                                    {car.status !== 'pending_delete' && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-9 px-4 font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                            onClick={() => handleRequestDeletion(car.id)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-text-light">No listings found.</div>
                        )}
                    </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-none shadow-xl shadow-black/5 bg-white">
               <CardHeader><CardTitle className="text-lg font-black tracking-tighter">Quick Actions</CardTitle></CardHeader>
               <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full h-12 justify-between group font-bold">
                     <Link href={isBuyer ? "/my-bookings" : "/dashboard/bookings"} className="flex w-full items-center justify-between">
                        {isBuyer ? "Track My Bookings" : "Manage Sales/Rentals"}
                        <ChevronRight className="w-4 h-4 text-text-light group-hover:text-rivian transition-transform group-hover:translate-x-1" />
                     </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-12 justify-between group font-bold">
                     <Link href="/messages" className="flex w-full items-center justify-between">
                        Inbox / Messages
                        <MessageSquare className="w-4 h-4 text-text-light group-hover:text-rivian transition-transform group-hover:translate-x-1" />
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
                <CardHeader><CardTitle className="text-lg font-black tracking-tighter">Account</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-glacier-white border border-border/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-light">Account Type</p>
                        <p className="text-sm font-black text-midnight mt-1 uppercase">{userType}</p>
                    </div>
                    {isBuyer && (
                      <div className="p-4 rounded-xl bg-rivian/5 border border-rivian/20">
                        <p className="text-xs font-bold text-rivian">Become a Seller</p>
                        <p className="text-[10px] text-rivian/70 mt-1">Want to list your own vehicle? Upgrade your account in settings.</p>
                      </div>
                    )}
                </CardContent>
            </Card>

            {/* Upcoming Feed */}
            <Card className="border-none shadow-xl shadow-black/5 bg-white">
               <CardHeader><CardTitle className="text-lg font-black tracking-tighter">Activity Feed</CardTitle></CardHeader>
               <CardContent className="space-y-6">
                   {upcomingEvents.map((event: any, i) => (
                     <div key={i} className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center">
                             <event.icon className={`w-5 h-5 ${event.color}`} />
                         </div>
                         <div className="overflow-hidden flex-1">
                             <p className="text-sm font-bold text-midnight truncate">{event.label}</p>
                             <p className="text-[10px] text-text-light font-medium mt-0.5 uppercase tracking-widest">{event.time}</p>
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
            <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary">Last 10 Days</span>
            <ChevronRight className="w-3 h-3 rotate-90 text-text-light" />
        </div>
    )
}
