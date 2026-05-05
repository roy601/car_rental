'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { MessageSquare, Loader2, User, Clock } from 'lucide-react'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Fetch all messages involving this user
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (!msgs || msgs.length === 0) { setLoading(false); return }

      // Group by the other person's ID
      const convMap: Record<string, any> = {}
      msgs.forEach(m => {
        const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id
        if (!convMap[otherId]) {
          convMap[otherId] = { otherId, latestMessage: m, unread: 0 }
        }
        if (!m.is_read && m.receiver_id === user.id) {
          convMap[otherId].unread++
        }
      })

      // Fetch other users' profiles
      const otherIds = Object.keys(convMap)
      const { data: profiles } = await supabase
        .from('users')
        .select('id, full_name')
        .in('id', otherIds)

      const convList = otherIds.map(id => ({
        ...convMap[id],
        profile: profiles?.find(p => p.id === id) || { full_name: 'Unknown User' }
      }))

      setConversations(convList)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-glacier-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rivian animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />
      <main className="container-max pt-32 pb-20">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-midnight">Messages</h1>
            <p className="text-text-secondary font-medium italic mt-1">Your conversations with buyers and sellers.</p>
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-border/50">
              <div className="w-16 h-16 rounded-full bg-glacier-white flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-text-light" />
              </div>
              <h3 className="text-xl font-bold text-midnight mb-2">No conversations yet</h3>
              <p className="text-text-secondary text-sm">Browse the marketplace and contact a seller to start chatting!</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-border/50 overflow-hidden shadow-xl shadow-black/5 divide-y divide-border/50">
              {conversations.map(conv => (
                <Link
                  key={conv.otherId}
                  href={`/messages/${conv.otherId}`}
                  className="flex items-center gap-4 p-5 hover:bg-glacier-white transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rivian/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-rivian" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-black text-midnight group-hover:text-rivian transition-colors truncate">
                        {conv.profile?.full_name || 'Unknown User'}
                      </p>
                      <span className="text-[10px] font-bold text-text-light uppercase tracking-widest flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {new Date(conv.latestMessage.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary font-medium truncate mt-0.5">
                      {conv.latestMessage.content}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="bg-rivian text-white border-none flex-shrink-0 h-6 w-6 flex items-center justify-center p-0 rounded-full text-xs font-black">
                      {conv.unread}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
