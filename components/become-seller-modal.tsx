'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Car,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  ArrowRight,
  Zap,
  Users,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'

interface BecomeSellerModalProps {
  open: boolean
  onClose: () => void
  userId: string
  userName?: string
}

const BENEFITS = [
  {
    icon: Car,
    color: 'text-rivian',
    bg: 'bg-rivian/10',
    title: 'List Unlimited Vehicles',
    desc: 'Sell or rent out your cars with zero listing fees.',
  },
  {
    icon: TrendingUp,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    title: 'Earn Real Income',
    desc: 'Turn your idle vehicles into a steady revenue stream.',
  },
  {
    icon: Users,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    title: 'Reach Thousands of Buyers',
    desc: 'Instantly tap into our network of verified buyers & renters.',
  },
  {
    icon: ShieldCheck,
    color: 'text-compass',
    bg: 'bg-compass/10',
    title: 'Secure & Transparent',
    desc: 'Payments and contracts handled safely on the platform.',
  },
]

export function BecomeSellerModal({ open, onClose, userId, userName }: BecomeSellerModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  if (!open) return null

  const handleApply = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ user_type: 'seller', verification_status: 'pending' })
        .eq('id', userId)

      if (error) throw error

      setSuccess(true)
      toast.success('Seller application submitted! Complete your profile to get approved.')
    } catch (err: any) {
      toast.error('Something went wrong: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoToDashboard = () => {
    onClose()
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-black/20 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header gradient bar */}
          <div className="relative h-2 bg-gradient-to-r from-rivian via-compass to-rivian-light" />

          <div className="p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-midnight/60" />
            </button>

            {!success ? (
              <>
                {/* Title */}
                <div className="space-y-1 mb-8">
                  <div className="inline-flex items-center gap-2 bg-rivian/10 text-rivian text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                    <Zap className="w-3 h-3" />
                    One-click upgrade
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter text-midnight">
                    Become a Seller
                  </h2>
                  <p className="text-text-secondary font-medium">
                    Hey {userName?.split(' ')[0] || 'there'}, you're one click away from listing your vehicles.
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {BENEFITS.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-glacier-white border border-border/50 hover:border-rivian/30 transition-colors"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${b.bg}`}>
                        <b.icon className={`w-4.5 h-4.5 ${b.color}`} size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-midnight">{b.title}</p>
                        <p className="text-[11px] text-text-secondary font-medium mt-0.5">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notice */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100 mb-6">
                  <ShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] text-amber-700 font-medium">
                    Your application will be reviewed by our team. You'll be able to list vehicles once approved — usually within 24 hours.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 font-bold border-border/50"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Maybe Later
                  </Button>
                  <Button
                    className="flex-1 h-12 btn-primary flex items-center gap-2 group"
                    onClick={handleApply}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Apply Now
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="py-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter text-midnight">
                    Application Sent! 🎉
                  </h2>
                  <p className="text-text-secondary font-medium max-w-sm mx-auto">
                    Your seller account is under review. Complete your profile to speed up approval.
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  {['Review', 'Approval', 'List Vehicles'].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
                        i === 0 ? 'bg-rivian text-white' : 'bg-black/5 text-text-light'
                      }`}>
                        <span>{i + 1}</span>
                        <span>{step}</span>
                      </div>
                      {i < 2 && <div className="w-4 h-px bg-border" />}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 font-bold border-border/50"
                    onClick={onClose}
                  >
                    Stay Here
                  </Button>
                  <Button
                    className="flex-1 h-12 btn-primary flex items-center gap-2 group"
                    onClick={handleGoToDashboard}
                  >
                    Complete Profile
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
