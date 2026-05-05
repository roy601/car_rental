'use client'

import { use, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { SellerReviews } from '@/components/seller-reviews'
import { 
  Star, 
  MapPin,
  CheckCircle2, 
  MessageSquare, 
  Loader2,
  Car,
  TrendingUp,
  Zap,
  Phone
} from 'lucide-react'
import { toast } from 'sonner'

export default function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [seller, setSeller] = useState<any>(null)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSellerAndVehicles = async () => {
      try {
        const { data: sellerData, error: sellerError } = await supabase
          .from('users')
          .select('*')
          .eq('id', resolvedParams.id)
          .single()
          
        if (sellerError) throw sellerError
        setSeller(sellerData)

        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('seller_id', resolvedParams.id)
          
        if (vehicleError) throw vehicleError
        setVehicles(vehicleData || [])

      } catch (error) {
        console.error("Failed to load seller profile", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSellerAndVehicles()
  }, [resolvedParams.id])

  const handleCopyPhone = () => {
    if (seller?.phone) {
      navigator.clipboard.writeText(seller.phone)
      toast.success("Phone number copied!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-glacier-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rivian animate-spin" />
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-glacier-white">
        <Navbar />
        <main className="container-max pt-32 flex flex-col items-center text-center">
           <h2 className="text-3xl font-black text-midnight">Seller Not Found</h2>
           <p className="text-text-secondary mt-2 mb-6">The profile you are looking for does not exist.</p>
           <Button asChild className="btn-primary"><Link href="/marketplace">Back to Marketplace</Link></Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />

      <main className="container-max pt-32 pb-20">
        <div className="max-w-6xl mx-auto space-y-10">
           
           {/* Profile Header Card */}
           <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-black/5 border border-border/50 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-rivian/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-40 h-40 rounded-[40px] bg-glacier-white border-4 border-white shadow-xl flex-shrink-0 overflow-hidden relative z-10">
                 <img 
                   src={seller.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.id}`} 
                   alt={seller.full_name || 'Seller'} 
                   className="w-full h-full object-cover"
                 />
              </div>

              <div className="flex-1 space-y-6 text-center md:text-left relative z-10 w-full">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                       <h1 className="text-4xl font-black tracking-tighter text-midnight flex items-center justify-center md:justify-start gap-3">
                         {seller.full_name || 'Anonymous Seller'}
                         {seller.is_verified && (
                           <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                         )}
                       </h1>
                       <p className="text-text-secondary font-medium mt-1">
                         Member since {new Date(seller.created_at).getFullYear()}
                       </p>
                    </div>
                    
                    <Button asChild className="btn-primary h-14 px-8 flex items-center gap-2">
                       <Link href={`/messages/${resolvedParams.id}`}>
                          <MessageSquare className="w-5 h-5" />
                          Contact Seller
                       </Link>
                    </Button>
                 </div>

                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-xl border border-yellow-100">
                       <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                       <div>
                          <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider">Rating</p>
                          <p className="font-black text-yellow-900">{seller.seller_rating || '5.0'} / 5.0</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                       <Zap className="w-5 h-5 text-blue-500" />
                       <div>
                          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Response Rate</p>
                          <p className="font-black text-blue-900">{seller.response_rate || '100'}%</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                       <Car className="w-5 h-5 text-slate-500" />
                       <div>
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Listings</p>
                          <p className="font-black text-slate-900">{vehicles.length}</p>
                       </div>
                    </div>

                    {seller.phone && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-rivian/5 rounded-xl border border-rivian/20">
                         <Phone className="w-5 h-5 text-rivian" />
                         <div>
                            <p className="text-xs font-bold text-rivian/70 uppercase tracking-wider">Phone</p>
                            <p className="font-black text-midnight">{seller.phone}</p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Listings Section */}
           <div className="space-y-6">
              <h2 className="text-2xl font-black tracking-tighter text-midnight">Current Listings</h2>
              
              {vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <Link key={vehicle.id} href={`/marketplace/${vehicle.id}`} className="group block h-full">
                      <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                          <img
                            src={vehicle.primary_image_url || 'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=800&h=600&fit=crop'}
                            alt={vehicle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            {vehicle.listing_type === 'both' ? (
                              <>
                                <Badge className="bg-rivian/90 hover:bg-rivian text-white backdrop-blur-md border-none">Rent</Badge>
                                <Badge className="bg-compass/90 hover:bg-compass text-white backdrop-blur-md border-none">Sale</Badge>
                              </>
                            ) : (
                              <Badge className={`${vehicle.listing_type === 'sale' ? 'bg-compass/90 hover:bg-compass' : 'bg-rivian/90 hover:bg-rivian'} text-white backdrop-blur-md border-none capitalize`}>
                                For {vehicle.listing_type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-text-light uppercase tracking-widest">{vehicle.category}</span>
                            <div className="flex items-center gap-1 text-text-light text-xs font-medium">
                              <MapPin className="w-3 h-3" />
                              {vehicle.location || 'Unknown'}
                            </div>
                          </div>
                          
                          <h3 className="font-bold text-lg text-midnight mb-2 line-clamp-1 group-hover:text-rivian transition-colors">
                            {vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          </h3>
                          
                          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-text-light uppercase tracking-widest">
                                {vehicle.listing_type === 'rent' ? 'Daily Rate' : 'Price'}
                              </span>
                              <span className="text-xl font-black text-midnight">
                                ৳{vehicle.listing_type === 'rent' ? vehicle.daily_rental_price : vehicle.price?.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-glacier-white flex items-center justify-center group-hover:bg-rivian group-hover:text-white transition-colors">
                               <TrendingUp className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-border/50">
                  <div className="w-16 h-16 rounded-full bg-glacier-white flex items-center justify-center mx-auto mb-4">
                     <Car className="w-8 h-8 text-text-light" />
                  </div>
                  <h3 className="text-xl font-bold text-midnight mb-2">No Active Listings</h3>
                  <p className="text-text-secondary">This seller does not currently have any vehicles listed.</p>
                </div>
              )}
           </div>

           {/* Reviews Section */}
           <SellerReviews sellerId={resolvedParams.id} />

        </div>
      </main>
    </div>
  )
}
