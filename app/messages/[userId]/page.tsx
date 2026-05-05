'use client'

import { use, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Send, Loader2, User, Phone } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ThreadPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: otherId } = use(params)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [otherProfile, setOtherProfile] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setCurrentUser(user)

      // Fetch other user's profile
      const { data: profile } = await supabase
        .from('users')
        .select('id, full_name, phone')
        .eq('id', otherId)
        .single()
      setOtherProfile(profile)

      // Fetch thread messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true })
      setMessages(msgs || [])

      // Mark incoming messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', otherId)
        .eq('receiver_id', user.id)
        .eq('is_read', false)

      setLoading(false)
    }
    load()
  }, [otherId])

  // Scroll to bottom when messages load or update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!content.trim() || !currentUser) return
    setSending(true)
    try {
      const { data, error } = await supabase.from('messages').insert({
        sender_id: currentUser.id,
        receiver_id: otherId,
        content: content.trim(),
        is_read: false,
      }).select().single()

      if (error) throw new Error(error.message)

      setMessages(prev => [...prev, data])
      setContent('')
    } catch (err: any) {
      toast.error("Failed to send: " + err.message)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-glacier-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rivian animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-glacier-white flex flex-col">
      <Navbar />

      <div className="container-max pt-24 pb-4 flex flex-col flex-1 max-w-3xl mx-auto w-full">
        
        {/* Thread Header */}
        <div className="bg-white rounded-t-3xl border border-border/50 border-b-0 px-6 py-5 flex items-center gap-4 shadow-sm">
          <Link href="/messages" className="p-2 rounded-xl hover:bg-glacier-white transition-colors group">
            <ArrowLeft className="w-5 h-5 text-text-light group-hover:text-rivian transition-colors" />
          </Link>
          <div className="w-10 h-10 rounded-2xl bg-rivian/10 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-rivian" />
          </div>
          <div className="flex-1">
            <p className="font-black text-midnight tracking-tight">
              {otherProfile?.full_name || 'Unknown User'}
            </p>
            {otherProfile?.phone && (
              <p className="text-xs text-text-light font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {otherProfile.phone}
              </p>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white border-x border-border/50 overflow-y-auto px-6 py-6 space-y-4 min-h-[400px] max-h-[calc(100vh-320px)]">
          {messages.length === 0 && (
            <div className="text-center text-text-light py-12">
              <p className="font-medium text-sm">No messages yet. Say hello!</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isMine = msg.sender_id === currentUser?.id
            return (
              <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  isMine
                    ? 'bg-rivian text-white rounded-br-md'
                    : 'bg-glacier-white text-midnight border border-border/50 rounded-bl-md'
                }`}>
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[10px] font-bold mt-1 ${isMine ? 'text-white/60' : 'text-text-light'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply Box */}
        <div className="bg-white rounded-b-3xl border border-border/50 border-t-0 px-6 py-4 flex items-end gap-3 shadow-sm">
          <div className="flex-1">
            <Textarea
              placeholder="Type a message... (Enter to send)"
              className="min-h-[52px] max-h-32 resize-none border-border/50 font-medium text-sm"
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={sending || !content.trim()}
            className="btn-primary h-[52px] w-[52px] p-0 flex items-center justify-center flex-shrink-0 rounded-2xl"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
