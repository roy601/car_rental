import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Star, ShieldCheck, MapPin } from 'lucide-react'

export async function TopSellers() {
  const supabase = await createClient()
  
  // Fetch top 4 verified sellers
  const { data: sellers } = await supabase
    .from('users')
    .select('id, full_name, profile_picture_url, seller_rating, response_rate, created_at')
    .eq('user_type', 'seller')
    .eq('verification_status', 'approved')
    .order('seller_rating', { ascending: false })
    .limit(4)

  if (!sellers || sellers.length === 0) return null

  // Fetch active listing counts for these sellers
  const sellerIds = sellers.map(s => s.id)
  const { data: vehicleCounts } = await supabase
    .from('vehicles')
    .select('seller_id')
    .in('seller_id', sellerIds)
    .eq('status', 'active')

  const countMap = vehicleCounts?.reduce((acc: Record<string, number>, v) => {
    acc[v.seller_id] = (acc[v.seller_id] || 0) + 1
    return acc
  }, {}) || {}

  return (
    <section id="top-sellers" className="py-24 px-4 sm:px-6 lg:px-8 bg-glacier-white border-t border-border/50">
      <div className="container-max">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="badge-highlight">Trusted Dealerships</span>
            <h2 className="text-4xl md:text-5xl font-black text-midnight tracking-tighter">
              Meet Our Top <span className="text-compass">Verified Sellers.</span>
            </h2>
            <p className="text-text-secondary font-medium max-w-xl text-lg">
              Buy and rent with confidence from our highest-rated community members. Every seller here is fully vetted and maintains exceptional service.
            </p>
          </div>
          <Link href="/marketplace" className="text-sm font-bold text-compass hover:text-compass/80 transition-colors flex items-center gap-1">
            View All Deals &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellers.map((seller) => (
            <div key={seller.id} className="card bg-white border-none shadow-xl shadow-black/5 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col items-center text-center p-6 space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[32px] bg-glacier-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                    {seller.profile_picture_url ? (
                      <img src={seller.profile_picture_url} alt={seller.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-compass/30">{seller.full_name?.[0] || 'S'}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 border-[3px] border-white shadow-sm" title="Verified Seller">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-lg text-midnight tracking-tight truncate w-full px-2">{seller.full_name || 'Verified Dealership'}</h3>
                  <p className="text-xs text-text-light font-bold mt-1 uppercase tracking-widest">Joined {new Date(seller.created_at).getFullYear()}</p>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm font-bold border border-amber-100">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  {Number(seller.seller_rating || 5).toFixed(1)}
                </div>

                <div className="w-full pt-4 border-t border-border/50 flex justify-between items-center px-2">
                  <div className="text-left">
                    <p className="text-[10px] text-text-light font-bold uppercase tracking-widest">Response</p>
                    <p className="text-sm font-black text-midnight">{seller.response_rate || 100}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-text-light font-bold uppercase tracking-widest">Active Cars</p>
                    <p className="text-sm font-black text-midnight">{countMap[seller.id] || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
