'use client'

import { useState, useEffect } from 'react'
import { Save, Image, Globe, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function AdminContentPage() {
  const [heroUrl, setHeroUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const fetchSetting = async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('id', 'hero_image')
        .single()
        
      if (data && !error && data.value?.url) {
        setHeroUrl(data.value.url)
      } else {
        setHeroUrl('/images/hero-car.jpg')
      }
    }
    fetchSetting()
  }, [])

  const save = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('platform_settings')
      .upsert({ id: 'hero_image', value: { url: heroUrl } }, { onConflict: 'id' })
      
    setSaving(false)
    if (error) {
      toast.error('Failed to save hero image: ' + error.message)
    } else {
      toast.success('Hero image updated globally!')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Hero Image Editor */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Image className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-white/90 font-black tracking-tight">Homepage Hero Image</h2>
            <p className="text-white/30 text-xs">Update the main background image on the landing page</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Preview */}
          <div className="aspect-video rounded-xl overflow-hidden relative bg-white/[0.04] border border-white/[0.06]">
            {heroUrl && (
              <img src={heroUrl} alt="Hero Preview" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <div>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Preview</p>
                <p className="text-white/80 font-bold text-sm">Homepage Hero Section</p>
              </div>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-[10px] text-white/30 font-black uppercase tracking-widest">Image URL</label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 focus-within:border-violet-500/50 transition-colors">
                <Globe className="w-4 h-4 text-white/20 flex-shrink-0" />
                <input
                  value={heroUrl}
                  onChange={e => setHeroUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-transparent text-white/70 text-sm placeholder:text-white/20 outline-none flex-1"
                />
              </div>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-sm transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Apply'}
              </button>
            </div>
            <p className="text-white/15 text-xs">Recommended: 1920×1080px JPG or WebP for best quality</p>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center gap-3 p-6 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white/90 font-black tracking-tight">Platform Status</h2>
            <p className="text-white/30 text-xs">Current operating state of the platform</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {[
            { label: 'Marketplace', status: 'Live', color: 'text-emerald-400 bg-emerald-500/10' },
            { label: 'User Registration', status: 'Open', color: 'text-emerald-400 bg-emerald-500/10' },
            { label: 'Payment Processing', status: 'Active', color: 'text-emerald-400 bg-emerald-500/10' },
            { label: 'Maintenance Mode', status: 'Off', color: 'text-white/30 bg-white/[0.04]' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-2">
              <span className="text-white/50 text-sm font-medium">{s.label}</span>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${s.color}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
