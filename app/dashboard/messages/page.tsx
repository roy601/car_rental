'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function DashboardMessagesRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/messages')
  }, [router])

  return (
    <div className="min-h-screen bg-glacier-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-rivian animate-spin" />
    </div>
  )
}
