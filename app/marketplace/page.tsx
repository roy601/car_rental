'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { VehicleCard } from '@/components/vehicle-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Mock vehicle data - replace with real data from Supabase
const MOCK_VEHICLES = [
  {
    id: '1',
    title: '2023 Tesla Model 3',
    price: 45000,
    dailyRentalPrice: 89,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=500&h=400&fit=crop',
    category: 'sedan',
    year: 2023,
    mileage: 5000,
    location: 'San Francisco, CA',
    listingType: 'both' as const,
    rating: 4.8,
  },
  {
    id: '2',
    title: '2022 Rivian R1T',
    price: 75000,
    dailyRentalPrice: 149,
    imageUrl: 'https://images.unsplash.com/photo-1618146267230-a87ad5ad5e6e?w=500&h=400&fit=crop',
    category: 'truck',
    year: 2022,
    mileage: 8000,
    location: 'Los Angeles, CA',
    listingType: 'both' as const,
    rating: 4.9,
  },
  {
    id: '3',
    title: '2024 BMW M440i',
    price: 68000,
    dailyRentalPrice: 125,
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop',
    category: 'sedan',
    year: 2024,
    mileage: 2000,
    location: 'New York, NY',
    listingType: 'sale' as const,
    rating: 4.7,
  },
  {
    id: '4',
    title: '2023 Toyota Highlander',
    price: 38000,
    dailyRentalPrice: 75,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-35b0c54178aa?w=500&h=400&fit=crop',
    category: 'suv',
    year: 2023,
    mileage: 12000,
    location: 'Austin, TX',
    listingType: 'both' as const,
    rating: 4.6,
  },
  {
    id: '5',
    title: '2021 Mercedes-Benz GLE',
    price: 58000,
    dailyRentalPrice: 110,
    imageUrl: 'https://images.unsplash.com/photo-1569552346869-2f03b55541d0?w=500&h=400&fit=crop',
    category: 'suv',
    year: 2021,
    mileage: 25000,
    location: 'Miami, FL',
    listingType: 'sale' as const,
    rating: 4.5,
  },
  {
    id: '6',
    title: '2023 Porsche 911',
    price: 98000,
    dailyRentalPrice: 250,
    imageUrl: 'https://images.unsplash.com/photo-1514162545848-a24eaf1d2641?w=500&h=400&fit=crop',
    category: 'coupe',
    year: 2023,
    mileage: 3000,
    location: 'Beverly Hills, CA',
    listingType: 'rent' as const,
    rating: 4.9,
  },
  {
    id: '7',
    title: '2022 Honda Civic',
    price: 28000,
    dailyRentalPrice: 55,
    imageUrl: 'https://images.unsplash.com/photo-1590890255295-4d9d53a69ee8?w=500&h=400&fit=crop',
    category: 'sedan',
    year: 2022,
    mileage: 18000,
    location: 'Seattle, WA',
    listingType: 'both' as const,
    rating: 4.4,
  },
  {
    id: '8',
    title: '2023 Range Rover',
    price: 85000,
    dailyRentalPrice: 180,
    imageUrl: 'https://images.unsplash.com/photo-1606611013016-969c19f27081?w=500&h=400&fit=crop',
    category: 'suv',
    year: 2023,
    mileage: 6000,
    location: 'Denver, CO',
    listingType: 'both' as const,
    rating: 4.8,
  },
]

const CATEGORIES = ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'minivan', 'wagon']
const LISTING_TYPES = ['both', 'rent', 'sale']
const PRICE_RANGES = [
  { label: 'Under $30K', min: 0, max: 30000 },
  { label: '$30K - $50K', min: 30000, max: 50000 },
  { label: '$50K - $75K', min: 50000, max: 75000 },
  { label: '$75K+', min: 75000, max: Infinity },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedListingTypes, setSelectedListingTypes] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, Infinity])
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest')

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let result = MOCK_VEHICLES

    // Text search
    if (searchQuery) {
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((v) => selectedCategories.includes(v.category))
    }

    // Listing type filter
    if (selectedListingTypes.length > 0) {
      result = result.filter((v) =>
        selectedListingTypes.some(
          (type) => v.listingType === type || v.listingType === 'both'
        )
      )
    }

    // Price filter
    result = result.filter(
      (v) => v.price >= selectedPriceRange[0] && v.price <= selectedPriceRange[1]
    )

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0)
        case 'newest':
        default:
          return 0
      }
    })

    return result
  }, [searchQuery, selectedCategories, selectedListingTypes, selectedPriceRange, sortBy])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20">
        <div className="container-max py-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Marketplace
            </h1>
            <p className="text-xl text-text-secondary">
              Browse {MOCK_VEHICLES.length} vehicles available to rent or buy
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <Input
              type="search"
              placeholder="Search by model, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 text-base"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-24">
                {/* Category Filter */}
                <div className="card">
                  <h3 className="font-bold text-text-primary mb-4">Category</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={(e) => {
                            setSelectedCategories((prev) =>
                              e.target.checked
                                ? [...prev, cat]
                                : prev.filter((c) => c !== cat)
                            )
                          }}
                          className="w-4 h-4 rounded border-input"
                        />
                        <span className="text-text-secondary capitalize">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Listing Type Filter */}
                <div className="card">
                  <h3 className="font-bold text-text-primary mb-4">Type</h3>
                  <div className="space-y-2">
                    {LISTING_TYPES.map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedListingTypes.includes(type)}
                          onChange={(e) => {
                            setSelectedListingTypes((prev) =>
                              e.target.checked
                                ? [...prev, type]
                                : prev.filter((t) => t !== type)
                            )
                          }}
                          className="w-4 h-4 rounded border-input"
                        />
                        <span className="text-text-secondary capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="card">
                  <h3 className="font-bold text-text-primary mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.label} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          checked={
                            selectedPriceRange[0] === range.min &&
                            selectedPriceRange[1] === range.max
                          }
                          onChange={() => setSelectedPriceRange([range.min, range.max])}
                          className="w-4 h-4"
                        />
                        <span className="text-text-secondary">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategories([])
                    setSelectedListingTypes([])
                    setSelectedPriceRange([0, Infinity])
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Vehicles Grid */}
            <div className="lg:col-span-3">
              {/* Sort Controls */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-text-secondary">
                  Showing {filteredVehicles.length} result{filteredVehicles.length !== 1 ? 's' : ''}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-input rounded-lg text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Vehicles Grid */}
              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} {...vehicle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary text-lg">
                    No vehicles found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
