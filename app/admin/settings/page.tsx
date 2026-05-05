'use client'

import { useState } from 'react'
import { UserPlus, Eye, EyeOff, CheckCircle2, AlertCircle, Shield, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', full_name: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create admin')

      setSuccess(`Admin account created for ${form.email}. They can now log in at /admin/login.`)
      setForm({ email: '', password: '', confirmPassword: '', full_name: '' })
      toast.success('New admin account created successfully!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header info */}
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-midnight/90 font-black tracking-tight">Admin Account Management</h2>
            <p className="text-midnight/30 text-sm mt-1 leading-relaxed">
              Create new administrator accounts. Admin accounts bypass email confirmation and have full access to this control panel.
              Share credentials securely — never via email or chat.
            </p>
          </div>
        </div>
      </div>

      {/* Create Admin Form */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-3 p-6 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-midnight/[0.04] flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-midnight/40" />
          </div>
          <div>
            <h2 className="text-midnight/90 font-black tracking-tight">Create New Admin</h2>
            <p className="text-midnight/30 text-xs">Account will be immediately active — no email verification required</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-5">
          {/* Success message */}
          {success && (
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-emerald-400 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-rose-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] text-midnight/30 font-black uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              placeholder="e.g. John Smith"
              required
              className="w-full bg-midnight/[0.03] border border-midnight/[0.06] rounded-xl px-4 py-3 text-midnight/80 text-sm placeholder:text-midnight/15 outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] text-midnight/30 font-black uppercase tracking-widest">Admin Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              required
              className="w-full bg-midnight/[0.03] border border-midnight/[0.06] rounded-xl px-4 py-3 text-midnight/80 text-sm placeholder:text-midnight/15 outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] text-midnight/30 font-black uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full bg-midnight/[0.03] border border-midnight/[0.06] rounded-xl px-4 py-3 pr-10 text-midnight/80 text-sm placeholder:text-midnight/15 outline-none focus:border-violet-500/50 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-midnight/30 font-black uppercase tracking-widest">Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                required
                className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-white/80 text-sm placeholder:text-midnight/15 outline-none transition-colors ${form.confirmPassword && form.password !== form.confirmPassword
                  ? 'border-rose-500/40 focus:border-rose-500/60'
                  : 'border-midnight/[0.06] focus:border-violet-500/50'
                  }`}
              />
            </div>
          </div>

          {/* Strength hint */}
          {form.password.length > 0 && (
            <div className="flex gap-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${form.password.length >= [1, 6, 10, 14][i]
                  ? ['bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-emerald-500'][i]
                  : 'bg-midnight/[0.06]'
                  }`} />
              ))}
              <span className="text-midnight/20 text-[10px] ml-1">
                {form.password.length < 6 ? 'Weak' : form.password.length < 10 ? 'Fair' : form.password.length < 14 ? 'Good' : 'Strong'}
              </span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-midnight font-black text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <><UserPlus className="w-4 h-4" /> Create Admin Account</>}
            </button>
          </div>
        </form>
      </div>

      {/* Login info card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="text-midnight/70 font-black text-sm mb-3 tracking-tight">Admin Login Portal</h3>
        <p className="text-white/30 text-sm mb-4">All admins must use the dedicated admin login page, not the public signup/login flow.</p>
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
          <span className="text-midnight/20 text-xs font-bold uppercase tracking-widest">URL</span>
          <code className="text-violet-400 text-sm font-mono flex-1">/admin/login</code>
          <a
            href="/admin/login"
            target="_blank"
            className="text-[10px] font-black uppercase text-midnight/20 hover:text-violet-400 transition-colors px-2 py-1 rounded-lg hover:bg-violet-500/10"
          >
            Open ↗
          </a>
        </div>
      </div>
    </div>
  )
}
