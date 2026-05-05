'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star, MessageSquare, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  reviewer: {
    full_name: string
    profile_picture_url: string | null
    id: string
  }
}

interface SellerReviewsProps {
  sellerId: string
}

export function SellerReviews({ sellerId }: SellerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [myRating, setMyRating] = useState(5)
  const [myComment, setMyComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const supabase = createClient()

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, reviewer:reviewer_id(id, full_name, profile_picture_url)')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (!error && data) setReviews(data as any)
    setLoading(false)
  }

  useEffect(() => {
    fetchReviews()
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user))
  }, [sellerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      toast.error('Please log in to leave a review')
      return
    }
    if (currentUser.id === sellerId) {
      toast.error('You cannot review yourself')
      return
    }
    if (!myComment.trim()) {
      toast.error('Please write a comment')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert({
      seller_id: sellerId,
      reviewer_id: currentUser.id,
      rating: myRating,
      comment: myComment.trim(),
    })

    if (error) {
      toast.error('Failed to submit review')
    } else {
      toast.success('Review submitted!')
      setMyComment('')
      setMyRating(5)
      fetchReviews()
    }
    setSubmitting(false)
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-midnight">Customer Reviews</h2>
          {avgRating && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${Number(avgRating) >= s ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                ))}
              </div>
              <span className="font-bold text-midnight">{avgRating}</span>
              <span className="text-text-light text-sm">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      {currentUser && currentUser.id !== sellerId && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-border/50 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rivian/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-rivian" />
            </div>
            <h3 className="font-black text-midnight">Leave a Review</h3>
          </div>

          {/* Star Rating */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-text-light mb-2 block">Your Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setMyRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${(hoveredStar || myRating) >= star ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-text-light mb-2 block">Your Comment</label>
            <textarea
              value={myComment}
              onChange={e => setMyComment(e.target.value)}
              placeholder="Share your experience with this seller..."
              rows={4}
              className="w-full rounded-2xl border border-border bg-glacier-white px-4 py-3 text-sm text-midnight font-medium placeholder:text-text-light outline-none focus:border-rivian transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rivian text-white font-black text-sm hover:bg-rivian-light transition-all hover:shadow-lg hover:shadow-rivian/30 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-rivian animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-border/50">
          <div className="w-14 h-14 rounded-full bg-glacier-white flex items-center justify-center mx-auto mb-4">
            <Star className="w-7 h-7 text-text-light" />
          </div>
          <h3 className="font-bold text-midnight mb-1">No reviews yet</h3>
          <p className="text-text-secondary text-sm">Be the first to leave a review for this seller.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-3xl border border-border/50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-glacier-white border border-border flex-shrink-0">
                  <img
                    src={review.reviewer?.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer?.id}`}
                    alt={review.reviewer?.full_name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h4 className="font-bold text-midnight">{review.reviewer?.full_name || 'Anonymous'}</h4>
                      <p className="text-[11px] text-text-light font-medium mt-0.5">
                        {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${review.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-text-secondary font-medium leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
