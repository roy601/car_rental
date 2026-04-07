import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

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
    <Link href={`/marketplace/${id}`}>
      <div className="card-hover group">
        {/* Image Container */}
        <div className="relative w-full h-48 bg-muted overflow-hidden rounded-lg mb-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-border-light to-muted flex items-center justify-center">
              <svg className="w-12 h-12 text-text-light" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75-3.54c-.3-.38-.77-.62-1.3-.62-.9 0-1.66.75-1.66 1.68 0 .93.75 1.68 1.66 1.68.53 0 1-.24 1.3-.62l2.75-3.54c.3-.38.77-.62 1.3-.62.9 0 1.66.75 1.66 1.68 0 .93-.75 1.68-1.66 1.68-.53 0-1-.24-1.3-.62z" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {listingType === 'both' && (
              <>
                <Badge className="badge-accent">Rent</Badge>
                <Badge className="badge-highlight">Sale</Badge>
              </>
            )}
            {listingType === 'rent' && (
              <Badge className="badge-accent">For Rent</Badge>
            )}
            {listingType === 'sale' && (
              <Badge className="badge-highlight">For Sale</Badge>
            )}
          </div>

          {/* Rating */}
          {rating && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
              {rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-bold text-lg text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>{year}</span>
            <span>•</span>
            <span>{mileage.toLocaleString()} mi</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Pricing */}
          <div className="border-t border-border-light pt-3 mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary">
                ${listingType === 'rent' ? dailyRentalPrice?.toLocaleString() : price.toLocaleString()}
              </span>
              {listingType === 'rent' && (
                <span className="text-text-secondary">/day</span>
              )}
            </div>
            {listingType === 'both' && dailyRentalPrice && (
              <div className="text-sm text-text-secondary">
                or ${price.toLocaleString()} to buy
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
