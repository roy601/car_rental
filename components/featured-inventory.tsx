import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin, Settings2, Gauge, Tag } from 'lucide-react'

export async function FeaturedInventory() {
  const supabase = await createClient()
  
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*, seller:seller_id(full_name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  if (!vehicles || vehicles.length === 0) return null

  return (
    <section id="featured" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-glacier-white to-transparent pointer-events-none" />
      
      <div className="container-max relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="badge-highlight mx-auto">Fresh Arrivals</span>
          <h2 className="text-4xl md:text-5xl font-black text-midnight tracking-tighter">
            Featured <span className="text-rivian">Inventory.</span>
          </h2>
          <p className="text-text-secondary font-medium max-w-2xl mx-auto text-lg">
            Discover the latest and most sought-after vehicles just listed by our top sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((car) => (
            <Link key={car.id} href={`/marketplace/${car.id}`} className="group block">
              <div className="card p-0 overflow-hidden bg-white hover:shadow-2xl hover:shadow-rivian/10 transition-all duration-500 border-none">
                {/* Image Area */}
                <div className="relative aspect-[16/10] overflow-hidden bg-glacier-white">
                  {car.primary_image_url ? (
                    <img 
                      src={car.primary_image_url} 
                      alt={car.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-light/50 font-black tracking-widest uppercase text-sm">
                      No Image
                    </div>
                  )}
                  
                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-midnight/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10">
                      {car.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-md text-midnight text-xs font-black px-3 py-1.5 rounded-lg shadow-lg">
                      {car.year}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-midnight tracking-tight group-hover:text-rivian transition-colors">
                        {car.title || `${car.year} ${car.make} ${car.model}`}
                      </h3>
                      <div className="flex items-center gap-1.5 text-text-light text-xs font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {car.location || 'Nationwide'}
                      </div>
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-glacier-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                      <Gauge className="w-4 h-4 text-text-light mb-1" />
                      <span className="text-[10px] font-black text-midnight truncate w-full">{car.mileage ? `${(car.mileage/1000).toFixed(1)}k mi` : 'New'}</span>
                    </div>
                    <div className="bg-glacier-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                      <Settings2 className="w-4 h-4 text-text-light mb-1" />
                      <span className="text-[10px] font-black text-midnight capitalize truncate w-full">{car.transmission || 'Auto'}</span>
                    </div>
                    <div className="bg-glacier-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                      <Tag className="w-4 h-4 text-text-light mb-1" />
                      <span className="text-[10px] font-black text-midnight capitalize truncate w-full">{car.fuel_type || 'Gas'}</span>
                    </div>
                  </div>

                  {/* Pricing Footer */}
                  <div className="pt-5 border-t border-border flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black text-text-light uppercase tracking-widest mb-0.5">
                        {car.listing_type === 'rent' ? 'Rental Rate' : car.listing_type === 'sale' ? 'Purchase Price' : 'Buy or Rent'}
                      </p>
                      <p className="text-2xl font-black text-midnight tracking-tighter">
                        ৳{car.listing_type === 'rent' ? (car.daily_rental_price || 0).toLocaleString() : (car.price || 0).toLocaleString()}
                        {car.listing_type === 'rent' && <span className="text-sm text-text-light font-bold tracking-normal">/day</span>}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-rivian/10 flex items-center justify-center group-hover:bg-rivian transition-colors">
                      <span className="text-rivian group-hover:text-white transition-colors">&rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/marketplace" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-midnight text-white font-black hover:bg-midnight/90 transition-colors shadow-lg shadow-midnight/20">
            Browse Entire Inventory
          </Link>
        </div>
      </div>
    </section>
  )
}
