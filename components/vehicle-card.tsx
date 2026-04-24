import Link from 'next/link'
import { MapPin, Star, Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VehicleCardProps {
  id: string
  title: string
  price: number
  dailyRentalPrice?: number
  imageUrl?: string
  category: string
  year: number
  mileage: number
  location: string
  listingType: 'rent' | 'sale' | 'both'
  rating?: number
}

export function VehicleCard({
  id,
  title,
  price,
  dailyRentalPrice,
  imageUrl,
  category,
  year,
  mileage,
  location,
  listingType,
  rating,
}: VehicleCardProps) {
  return (
    <Link href={`/marketplace/${id}`} className="group block">
      <article className="bg-card border border-border-light rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">

        {/* ── Image ──────────────────────────────────────── */}
        <div className="relative h-52 bg-muted overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-border-light to-muted flex items-center justify-center">
              <svg className="w-10 h-10 text-text-light" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Listing type badges — top left */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {(listingType === 'rent' || listingType === 'both') && (
              <span className="bg-rivian text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md leading-none">
                Rent
              </span>
            )}
            {(listingType === 'sale' || listingType === 'both') && (
              <span className="bg-compass text-midnight text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md leading-none">
                Buy
              </span>
            )}
          </div>

          {/* Rating pill — top right */}
          {rating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-midnight/75 backdrop-blur-sm text-white rounded-full px-2 py-1">
              <Star className="w-3 h-3 fill-compass text-compass" />
              <span className="text-xs font-semibold font-mono leading-none">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* ── Body ───────────────────────────────────────── */}
        <div className="p-4">

          {/* Title */}
          <h3 className="font-semibold text-text-primary text-base leading-snug mb-2.5 group-hover:text-accent transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-text-secondary mb-2">
            <span className="font-mono">{year}</span>
            <span className="text-border-light select-none">·</span>
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 flex-shrink-0" />
              {mileage.toLocaleString()} mi
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-4">
            <MapPin className="w-3 h-3 flex-shrink-0 text-text-light" />
            <span className="truncate">{location}</span>
          </div>

          {/* ── Pricing ──────────────────────────────────── */}
          <div className="pt-3.5 border-t border-border-light">
            {listingType === 'rent' && dailyRentalPrice && (
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-text-primary">
                  ${dailyRentalPrice}
                </span>
                <span className="text-sm text-text-secondary">/day</span>
              </div>
            )}

            {listingType === 'sale' && (
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-text-primary">
                  ${price.toLocaleString()}
                </span>
              </div>
            )}

            {listingType === 'both' && dailyRentalPrice && (
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-text-primary">
                    ${dailyRentalPrice}
                  </span>
                  <span className="text-xs text-text-secondary">/day</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-text-light uppercase tracking-wider leading-none mb-0.5">or buy</p>
                  <p className="text-sm font-semibold font-mono text-text-primary">
                    ${price.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
