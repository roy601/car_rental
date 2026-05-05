'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Search, CheckCircle, XCircle, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const STATUS_STYLES: Record<string, string> = {
  pending_approval: 'text-amber-600 bg-amber-50 border-amber-100',
  active:           'text-emerald-600 bg-emerald-50 border-emerald-100',
  inactive:         'text-text-light bg-glacier-white border-border',
  sold:             'text-sky-600 bg-sky-50 border-sky-100',
  rented:           'text-compass bg-compass/10 border-compass/20',
  pending_delete:   'text-rose-500 bg-rose-50 border-rose-100',
}

export default function AdminVehiclesPage() {
  const supabase = createClient()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('pending_approval')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('vehicles').select('*, seller:seller_id(full_name, email)').order('created_at', { ascending: false })
    setVehicles(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = vehicles.filter(v => {
    const matchSearch = (v.title || '').toLowerCase().includes(search.toLowerCase()) || (v.make || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || v.status === filterStatus
    return matchSearch && matchStatus
  })

  const pendingCount = vehicles.filter(v => v.status === 'pending_approval').length

  const approveVehicle = async (id: string) => {
    const { data, error } = await supabase.from('vehicles').update({ status: 'active' }).eq('id', id).select()
    if (error) { toast.error('Failed to approve'); return }
    if (!data || data.length === 0) {
      toast.error('Permission denied: You cannot approve this vehicle.')
      return
    }
    toast.success('Vehicle approved and now live!')
    load()
  }

  const rejectVehicle = async (id: string) => {
    const { data, error } = await supabase.from('vehicles').update({ status: 'inactive' }).eq('id', id).select()
    if (error) { toast.error('Failed'); return }
    if (!data || data.length === 0) {
      toast.error('Permission denied: You cannot reject this vehicle.')
      return
    }
    toast.success('Vehicle rejected')
    load()
  }

  const toggleStatus = async (v: any) => {
    const next = v.status === 'active' ? 'inactive' : 'active'
    await supabase.from('vehicles').update({ status: next }).eq('id', v.id)
    toast.success(`Listing set to ${next}`)
    load()
  }

  return (
    <div className="space-y-6">
      {/* Pending Banner */}
      {pendingCount > 0 && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-midnight font-black">{pendingCount} vehicle{pendingCount !== 1 ? 's' : ''} awaiting approval</p>
              <p className="text-amber-600 text-xs font-medium">Review and approve before they go live on the marketplace</p>
            </div>
          </div>
          <button onClick={() => setFilterStatus('pending_approval')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition-colors"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-60 flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-text-light flex-shrink-0" />
          <input
            placeholder="Search by title or make..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-midnight text-sm placeholder:text-text-light outline-none flex-1 font-medium"
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-white border border-border text-text-secondary text-sm rounded-xl px-4 py-2.5 outline-none font-medium shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="sold">Sold</option>
          <option value="pending_delete">Deletion Pending</option>
        </select>
        <span className="text-text-light text-xs font-bold">{filtered.length} vehicles</span>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-glacier-white border-b border-border">
              {['Vehicle', 'Seller', 'Price', 'Status', 'Actions'].map((h, i) => (
                <th key={h} className={`px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-text-light ${i === 4 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-20 text-text-light text-sm italic">Loading vehicles...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-20 text-text-light text-sm italic">No vehicles found</td></tr>
            ) : filtered.map(v => (
              <tr key={v.id} className="hover:bg-glacier-white transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-glacier-white flex-shrink-0 border border-border">
                      {v.primary_image_url ? <img src={v.primary_image_url} className="w-full h-full object-cover" /> : null}
                    </div>
                    <div>
                      <p className="text-midnight text-sm font-bold truncate max-w-[160px]">{v.title || `${v.year} ${v.make} ${v.model}`}</p>
                      <p className="text-text-light text-xs">{v.year} · {v.category} · {v.number_plate || 'No plate'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-text-secondary text-sm font-medium">{v.seller?.full_name || '—'}</p>
                  <p className="text-text-light text-xs">{v.seller?.email}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-midnight text-sm font-bold">{v.price ? `$${v.price.toLocaleString()}` : '—'}</p>
                  {v.daily_rental_price && <p className="text-text-light text-xs">${v.daily_rental_price}/day</p>}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${STATUS_STYLES[v.status] || 'text-text-light bg-glacier-white border-border'}`}>
                    {v.status?.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {v.status === 'pending_approval' ? (
                      <>
                        <button onClick={() => approveVehicle(v.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100"
                        >
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => rejectVehicle(v.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-500 text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100"
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href={`/marketplace/${v.id}`} target="_blank"
                          className="p-1.5 rounded-lg text-text-light hover:text-rivian hover:bg-rivian/10 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {!['pending_delete','sold','rented'].includes(v.status) && (
                          <button onClick={() => toggleStatus(v)}
                            className="p-1.5 rounded-lg text-text-light hover:text-amber-600 hover:bg-amber-50 transition-all"
                          >
                            {v.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
