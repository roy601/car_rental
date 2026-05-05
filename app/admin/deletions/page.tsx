'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Search, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminDeletionsPage() {
  const supabase = createClient()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('vehicles')
      .select('*, seller:seller_id(full_name, email)')
      .eq('status', 'pending_delete')
      .order('created_at', { ascending: false })
    setVehicles(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const approve = async (id: string) => {
    if (!confirm('Permanently delete this vehicle? This cannot be undone.')) return
    const { error } = await supabase.from('vehicles').delete().eq('id', id)
    if (error) { toast.error('Failed to delete'); return }
    toast.success('Vehicle deleted permanently')
    load()
  }

  const reject = async (id: string) => {
    const { error } = await supabase.from('vehicles').update({ status: 'active' }).eq('id', id)
    if (error) { toast.error('Failed to restore'); return }
    toast.success('Listing restored to active')
    load()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-white/90 font-black tracking-tight">Deletion Queue</h2>
            <p className="text-white/30 text-sm mt-1">
              Sellers have requested to remove these vehicles. Review each request carefully before taking action.
              Approving permanently deletes the listing — rejecting restores it to active.
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-20 text-center text-white/20 text-sm italic">
            Loading requests...
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-20 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
            <p className="text-white/30 font-bold">No pending deletion requests</p>
            <p className="text-white/15 text-sm mt-1">All caught up! Sellers haven't requested any deletions.</p>
          </div>
        ) : vehicles.map(v => (
          <div key={v.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex items-center gap-5 hover:bg-white/[0.03] transition-colors">
            {/* Image */}
            <div className="w-20 h-16 rounded-xl overflow-hidden bg-white/[0.04] flex-shrink-0">
              {v.primary_image_url ? (
                <img src={v.primary_image_url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">No Image</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/80 font-bold truncate">{v.title}</p>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                  Delete Requested
                </span>
              </div>
              <p className="text-white/30 text-xs">
                {v.year} {v.make} {v.model} · {v.category}
                {v.number_plate && ` · Plate: ${v.number_plate}`}
              </p>
              <p className="text-white/20 text-xs mt-1">
                Seller: <span className="text-white/40 font-bold">{v.seller?.full_name || 'Unknown'}</span>
                {v.seller?.email && ` (${v.seller.email})`}
              </p>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0 hidden md:block">
              <p className="text-white/80 font-black text-lg">${v.price?.toLocaleString() || 0}</p>
              <p className="text-white/20 text-xs">Sale Price</p>
              {v.daily_rental_price && (
                <p className="text-white/20 text-xs">${v.daily_rental_price}/day</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link
                href={`/marketplace/${v.id}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] text-xs font-bold transition-all"
              >
                <ExternalLink className="w-3 h-3" /> View
              </Link>
              <button
                onClick={() => reject(v.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
              >
                Keep Listing
              </button>
              <button
                onClick={() => approve(v.id)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors"
              >
                Delete Forever
              </button>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length > 0 && (
        <p className="text-white/20 text-xs text-center">
          {vehicles.length} pending request{vehicles.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
