'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { TrendingUp, Users, Car, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function AdminOverview() {
  const supabase = createClient()
  const [stats, setStats] = useState({ revenue: 0, users: 0, listings: 0, pendingSellers: 0, pendingVehicles: 0 })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [pendingSellers, setPendingSellers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [
        { data: bookings },
        { count: userCount },
        { count: listingCount },
        { data: sellers },
        { count: pendingSellerCount },
        { count: pendingVehicleCount },
      ] = await Promise.all([
        supabase.from('bookings').select('total_price, status, created_at, vehicle:vehicle_id(title), buyer:buyer_id(full_name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('users').select('id, full_name, email, user_type, created_at, phone').eq('user_type', 'seller').eq('verification_status', 'pending').order('created_at', { ascending: false }).limit(4),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'seller').eq('verification_status', 'pending'),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('status', 'pending_approval'),
      ])
      const revenue = bookings?.filter(b => ['paid','confirmed'].includes(b.status)).reduce((s, b) => s + (b.total_price || 0), 0) || 0
      setStats({ revenue, users: userCount || 0, listings: listingCount || 0, pendingSellers: pendingSellerCount || 0, pendingVehicles: pendingVehicleCount || 0 })
      setRecentBookings(bookings || [])
      setPendingSellers(sellers || [])
      setLoading(false)
    }
    load()
  }, [])

  const approve = async (id: string) => {
    await supabase.from('users').update({ verification_status: 'approved', is_verified: true }).eq('id', id)
    toast.success('Seller approved!')
    setPendingSellers(p => p.filter(u => u.id !== id))
    setStats(s => ({ ...s, pendingSellers: Math.max(0, s.pendingSellers - 1) }))
  }

  const reject = async (id: string) => {
    await supabase.from('users').update({ verification_status: 'rejected', is_verified: false }).eq('id', id)
    toast.success('Seller rejected')
    setPendingSellers(p => p.filter(u => u.id !== id))
    setStats(s => ({ ...s, pendingSellers: Math.max(0, s.pendingSellers - 1) }))
  }

  const statCards = [
    { label: 'Total Revenue', value: `৳${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-rivian', bg: 'bg-rivian/5', border: 'border-rivian/10' },
    { label: 'Active Listings', value: stats.listings, icon: Car, color: 'text-compass', bg: 'bg-compass/5', border: 'border-compass/10' },
    { label: 'Pending Sellers', value: stats.pendingSellers, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Pending Vehicles', value: stats.pendingVehicles, icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  ]

  const statusColor: Record<string, string> = {
    paid: 'text-emerald-600 bg-emerald-50', confirmed: 'text-emerald-600 bg-emerald-50',
    pending: 'text-amber-600 bg-amber-50', cancelled: 'text-rose-500 bg-rose-50',
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className={`card border ${s.border} hover:shadow-xl transition-all group`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-light text-xs font-bold uppercase tracking-widest">{s.label}</p>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className={`text-3xl font-black tracking-tighter ${s.color}`}>{loading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-midnight font-black tracking-tight">Recent Bookings</h2>
              <p className="text-text-light text-xs mt-0.5">Latest platform activity</p>
            </div>
            <Link href="/admin/vehicles" className="text-rivian text-xs font-bold hover:text-rivian-light flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {loading ? (
              <div className="py-12 text-center text-text-light text-sm italic">Loading...</div>
            ) : recentBookings.length === 0 ? (
              <div className="py-12 text-center text-text-light text-sm italic">No bookings yet</div>
            ) : recentBookings.map((b, i) => (
              <div key={i} className="flex items-center justify-between py-4 hover:bg-glacier-white transition-colors rounded-xl px-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rivian/10 flex items-center justify-center">
                    <Car className="w-4 h-4 text-rivian" />
                  </div>
                  <div>
                    <p className="text-midnight text-sm font-bold truncate max-w-[180px]">{b.vehicle?.title || 'Vehicle'}</p>
                    <p className="text-text-light text-xs">{b.buyer?.full_name || 'Anonymous'} · {new Date(b.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${statusColor[b.status] || 'text-text-light bg-glacier-white'}`}>{b.status}</span>
                  <p className="text-midnight font-black text-sm">৳{b.total_price?.toLocaleString() || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Seller Approvals */}
        <div className="lg:col-span-2 card border-l-4 border-l-amber-400">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-midnight font-black tracking-tight">Seller Approvals</h2>
              <p className="text-text-light text-xs mt-0.5">Sellers awaiting verification</p>
            </div>
            {stats.pendingSellers > 0 && (
              <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-full animate-pulse">{stats.pendingSellers}</span>
            )}
          </div>
          <div className="divide-y divide-border/50">
            {loading ? (
              <div className="py-12 text-center text-text-light text-sm italic">Loading...</div>
            ) : pendingSellers.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <p className="text-text-light font-bold text-sm">All sellers approved!</p>
              </div>
            ) : pendingSellers.map(u => (
              <div key={u.id} className="py-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-rivian/10 flex items-center justify-center text-rivian text-sm font-black flex-shrink-0">
                    {u.full_name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-midnight text-sm font-bold truncate">{u.full_name || 'Unnamed'}</p>
                    <p className="text-text-light text-xs truncate">{u.email}</p>
                    {u.phone && <p className="text-text-light text-xs">{u.phone}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(u.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100">
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button onClick={() => reject(u.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-rose-50 text-rose-500 text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100">
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
          {stats.pendingSellers > 4 && (
            <Link href="/admin/users" className="block text-center text-rivian text-xs font-bold mt-4 hover:text-rivian-light">
              View all {stats.pendingSellers} pending →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
