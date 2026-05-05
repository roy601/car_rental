'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Users, Car, Trash2, Settings, Image, LogOut,
  ShieldCheck, Bell, ChevronRight
} from 'lucide-react'

const navItems = [
  { label: 'Overview',        href: '/admin',           icon: LayoutDashboard },
  { label: 'Seller Approvals',href: '/admin/users',     icon: Users },
  { label: 'Vehicle Approvals',href: '/admin/vehicles', icon: Car },
  { label: 'Deletion Queue',  href: '/admin/deletions', icon: Trash2 },
  { label: 'Site Content',    href: '/admin/content',   icon: Image },
  { label: 'Settings',        href: '/admin/settings',  icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [admin, setAdmin] = useState<any>(null)
  const [pendingSellers, setPendingSellers] = useState(0)
  const [pendingVehicles, setPendingVehicles] = useState(0)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/admin/login'); return }
      const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (!profile || profile.user_type !== 'admin') { router.push('/admin/login'); return }
      setAdmin(profile)

      const [{ count: sc }, { count: vc }] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true })
          .eq('user_type', 'seller').eq('verification_status', 'pending'),
        supabase.from('vehicles').select('*', { count: 'exact', head: true })
          .eq('status', 'pending_approval'),
      ])
      setPendingSellers(sc || 0)
      setPendingVehicles(vc || 0)
    }
    init()
  }, [])

  const signOut = async () => { await supabase.auth.signOut(); router.push('/') }

  return (
    <div className="flex h-screen bg-glacier-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-midnight flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rivian flex items-center justify-center shadow-lg shadow-rivian/30">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm tracking-tight">AutoFleet<span className="text-rivian">Pro</span></p>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href
            const badge = item.label === 'Seller Approvals' ? pendingSellers
              : item.label === 'Vehicle Approvals' ? pendingVehicles : 0
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  active ? 'bg-rivian/20 text-rivian' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.06]'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-rivian' : 'text-white/30 group-hover:text-white/60'}`} />
                <span className="flex-1">{item.label}</span>
                {badge > 0 && (
                  <span className="bg-rivian text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">{badge}</span>
                )}
                {active && <ChevronRight className="w-3 h-3 text-rivian" />}
              </Link>
            )
          })}
        </nav>

        {/* Admin profile */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.05] mb-1">
            <div className="w-8 h-8 rounded-full bg-rivian flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">{admin?.full_name?.[0] || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs font-bold truncate">{admin?.full_name || 'Administrator'}</p>
              <p className="text-white/30 text-[10px] truncate">{admin?.email}</p>
            </div>
          </div>
          <button onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-glacier-white">
        {/* Top bar */}
        <div className="h-16 border-b border-border/50 flex items-center justify-between px-8 sticky top-0 bg-white/80 backdrop-blur-xl z-10 shadow-sm">
          <div>
            <h1 className="text-midnight font-black text-lg tracking-tight">
              {navItems.find(n => n.href === pathname)?.label || 'Admin Console'}
            </h1>
            <p className="text-text-light text-xs">AutoFleet Pro · Superadmin View</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-text-light hover:text-rivian font-bold transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5">
              View Site ↗
            </Link>
            <div className="relative">
              <Bell className="w-5 h-5 text-text-light hover:text-rivian cursor-pointer transition-colors" />
              {(pendingSellers + pendingVehicles) > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rivian rounded-full text-[9px] text-white font-black flex items-center justify-center">
                  {pendingSellers + pendingVehicles}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
