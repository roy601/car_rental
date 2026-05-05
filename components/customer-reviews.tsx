import { createClient } from '@/lib/supabase/server'
import { Star, Quote } from 'lucide-react'
import Link from 'next/link'

export async function CustomerReviews() {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:reviewer_id(id, full_name, profile_picture_url), seller:seller_id(id, full_name)')
    .order('created_at', { ascending: false })
    .limit(4)

  if (!reviews || reviews.length === 0) return null

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden border-t border-border/50">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rivian/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="badge-accent mb-4 inline-block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-midnight">
            What our customers <span className="text-rivian">say.</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary font-medium">
            Real reviews from real buyers and renters on AutoFleet Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review: any, i: number) => (
            <div
              key={review.id}
              className={`relative bg-white rounded-3xl p-8 border border-border/50 shadow-xl shadow-black/5 flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rivian/10 ${i % 2 === 1 ? 'lg:translate-y-8' : ''}`}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-rivian/10">
                <Quote className="w-10 h-10 rotate-180" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${review.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                ))}
              </div>

              {/* Comment */}
              <p className="text-midnight font-medium leading-relaxed flex-1 mb-8 relative z-10 line-clamp-4">
                "{review.comment}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-glacier-white border-2 border-white shadow-sm flex-shrink-0">
                  <img
                    src={review.reviewer?.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer?.id}`}
                    alt={review.reviewer?.full_name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-midnight text-sm">{review.reviewer?.full_name || 'Anonymous'}</h4>
                  {review.seller?.id && (
                    <Link href={`/seller/${review.seller.id}`} className="text-[11px] text-rivian font-bold uppercase tracking-wider mt-0.5 hover:underline block">
                      Reviewed {review.seller.full_name}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
