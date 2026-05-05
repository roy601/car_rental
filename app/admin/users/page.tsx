'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Search, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const STATUS_COLORS: Record<string, string> = {
  approved: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  rejected: 'text-rose-500 bg-rose-50 border-rose-100',
  pending:  'text-amber-600 bg-amber-50 border-amber-100',
}

export default function AdminSellersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('pending')
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const { data } = await supabase.from('users').select('*').eq('user_type', 'seller').order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const filtered = users.filter(u => {
    const matchSearch = u.email?.toLowerCase().includes(search.toLowerCase()) || (u.full_name || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || u.verification_status === filterStatus
    return matchSearch && matchStatus
  })

  const quickUpdate = async (id: string, status: 'approved' | 'rejected') => {
    const { data, error } = await supabase.from('users').update({ verification_status: status, is_verified: status === 'approved' }).eq('id', id).select()
    if (error) { toast.error('Failed'); return }
    if (!data || data.length === 0) {
      toast.error('Permission denied: You cannot update this seller.')
      return
    }
    toast.success(`Seller ${status}`)
    fetch()
  }

  const saveEdit = async () => {
    setSaving(true)
    const { data, error } = await supabase.from('users').update({
      full_name: editing.full_name,
      verification_status: editing.verification_status,
      is_verified: editing.verification_status === 'approved',
    }).eq('id', editing.id).select()
    setSaving(false)
    if (error) { toast.error('Failed to save'); return }
    if (!data || data.length === 0) {
      toast.error('Permission denied: You cannot update this seller.')
      return
    }
    toast.success('Seller updated')
    setEditing(null)
    fetch()
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Permanently delete this seller account?')) return
    await supabase.from('users').delete().eq('id', id)
    toast.success('Seller deleted')
    fetch()
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-60 flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-text-light flex-shrink-0" />
          <input
            placeholder="Search sellers by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-midnight text-sm placeholder:text-text-light outline-none flex-1 font-medium"
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-white border border-border text-text-secondary text-sm rounded-xl px-4 py-2.5 outline-none font-medium shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <span className="text-text-light text-xs font-bold">{filtered.length} sellers</span>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-glacier-white border-b border-border">
              {['Seller', 'Contact', 'Status', 'Joined', 'Actions'].map((h, i) => (
                <th key={h} className={`px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-text-light ${i === 4 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-20 text-text-light text-sm italic">Loading sellers...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-20 text-text-light text-sm italic">No sellers found</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id} className="hover:bg-glacier-white transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rivian/10 flex items-center justify-center text-rivian text-sm font-black flex-shrink-0">
                      {u.full_name?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-midnight text-sm font-bold">{u.full_name || 'Anonymous'}</p>
                      <p className="text-text-light text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-text-secondary text-sm">{u.phone || <span className="italic text-text-light">No phone</span>}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${STATUS_COLORS[u.verification_status] || 'text-text-light bg-glacier-white border-border'}`}>
                    {u.verification_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-light text-xs font-medium">
                  {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {u.verification_status === 'pending' && (
                      <>
                        <button onClick={() => quickUpdate(u.id, 'approved')} className="p-1.5 rounded-lg text-text-light hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => quickUpdate(u.id, 'rejected')} className="p-1.5 rounded-lg text-text-light hover:text-rose-500 hover:bg-rose-50 transition-all" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {u.verification_status !== 'pending' && (
                      <button onClick={() => quickUpdate(u.id, u.verification_status === 'approved' ? 'rejected' : 'approved')}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-border hover:bg-glacier-white transition-colors text-text-secondary"
                      >
                        {u.verification_status === 'approved' ? 'Revoke' : 'Re-approve'}
                      </button>
                    )}
                    <button onClick={() => setEditing({ ...u })} className="p-1.5 rounded-lg text-text-light hover:text-rivian hover:bg-rivian/10 transition-all" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg text-text-light hover:text-rose-500 hover:bg-rose-50 transition-all" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Sheet */}
      <Sheet open={!!editing} onOpenChange={o => !o && setEditing(null)}>
        <SheetContent className="bg-white border-l border-border">
          <SheetHeader className="pb-6 border-b border-border">
            <SheetTitle className="text-midnight font-black tracking-tight">Edit Seller</SheetTitle>
          </SheetHeader>
          {editing && (
            <div className="py-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] text-text-light font-black uppercase tracking-widest">Email</label>
                <div className="bg-glacier-white border border-border rounded-xl px-4 py-3 text-text-secondary text-sm">{editing.email}</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-text-light font-black uppercase tracking-widest">Full Name</label>
                <input value={editing.full_name || ''} onChange={e => setEditing({ ...editing, full_name: e.target.value })}
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 text-midnight text-sm outline-none focus:border-rivian transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-text-light font-black uppercase tracking-widest">Verification Status</label>
                <select value={editing.verification_status} onChange={e => setEditing({ ...editing, verification_status: e.target.value })}
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 text-midnight text-sm outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <button onClick={saveEdit} disabled={saving}
                className="w-full py-3 rounded-xl btn-primary font-black text-sm disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
