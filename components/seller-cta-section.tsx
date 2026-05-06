'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BecomeSellerModal } from '@/components/become-seller-modal'
import { toast } from 'sonner'

export function SellerCTASection() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { data: profile } = await supabase
        .from('users')
        .select('user_type, verification_status')
        .eq('id', user.id)
        .single()
      if (profile) setUserProfile(profile)
    }
    fetchUser()
  }, [])

  const handleBecomeSeller = () => {
    if (!user) {
      router.push('/auth/signup?type=seller&intent=list-vehicle')
      return
    }

    const userType = userProfile?.user_type
    const verificationStatus = userProfile?.verification_status

    if (userType === 'buyer') {
      setModalOpen(true)
      return
    }

    if (userType === 'seller' && verificationStatus === 'approved') {
      router.push('/dashboard/listings/new')
      return
    }

    toast.info('Your seller account is pending approval. Check your dashboard.')
    router.push('/dashboard')
  }

  return (
    <>
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rivian to-midnight text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-compass/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container-max relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
              Ready to Find Your<br />
              <span className="text-compass">Perfect Vehicle?</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium">
              Join 100,000+ satisfied customers who have found their ideal car on AutoFleet Pro. Secure, fast, and transparent.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
              <Button asChild className="btn-accent h-14 px-12 text-base">
                <Link href="/marketplace">
                  Start Browsing
                </Link>
              </Button>
              <Button
                className="btn-secondary h-14 px-12 text-base bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                onClick={handleBecomeSeller}
              >
                {user && userProfile?.user_type === 'seller' && userProfile?.verification_status === 'approved'
                  ? 'List a Vehicle'
                  : 'Become a Seller'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BecomeSellerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={user?.id}
        userName={user?.user_metadata?.full_name}
      />
    </>
  )
}
