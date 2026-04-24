'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { VehicleCard } from '@/components/vehicle-card'
import { Search, X, Car, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK_VEHICLES = [
  {
    id: '1',
    title: '2023 Tesla Model 3',
    price: 45000,
    dailyRentalPrice: 89,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a63019b29c?w=600&h=400&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1618146267230-a87ad5ad5e6e?w=600&h=400&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=400&fit=crop',
    category: 'coupe',
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
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-35b0c54178aa?w=600&h=400&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1569552346869-2f03b55541d0?w=600&h=400&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1514162545848-a24eaf1d2641?w=600&h=400&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1590890255295-4d9d53a69ee8?w=600&h=400&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1606611013016-969c19f27081?w=600&h=400&fit=crop',
    category: 'suv',
    year: 2023,
    mileage: 6000,
    location: 'Denver, CO',
    listingType: 'both' as const,
    rating: 4.8,
  },
]

const CATEGORIES = ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van'] as const

const PRICE_RANGES = [
  { label: 'Any price', min: 0, max: Infinity },
  { label: 'Under $30K', min: 0, max: 30000 },
  { label: '$30K – $50K', min: 30000, max: 50000 },
  { label: '$50K – $75K', min: 50000, max: 75000 },
  { label: '$75K+', min: 75000, max: Infinity },
]

type ListingMode = 'all' | 'rent' | 'buy'
type SortKey = 'newest' | 'price-low' | 'price-high' | 'rating'

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [listingMode, setListingMode] = useState<ListingMode>('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity })
  const [sortBy, setSortBy] = useState<SortKey>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleCategory = (cat: string) =>
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )

  const activeFilterCount =
    selectedCategories.length +
    (listingMode !== 'all' ? 1 : 0) +
    (priceRange.min !== 0 || priceRange.max !== Infinity ? 1 : 0)

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setListingMode('all')
    setPriceRange({ min: 0, max: Infinity })
  }

  const filteredVehicles = useMemo(() => {
    let result = MOCK_VEHICLES

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        v => v.title.toLowerCase().includes(q) || v.location.toLowerCase().includes(q)
      )
    }

    if (selectedCategories.length > 0) {
      result = result.filter(v => selectedCategories.includes(v.category))
    }

    if (listingMode === 'rent') {
      result = result.filter(v => v.listingType === 'rent' || v.listingType === 'both')
    } else if (listingMode === 'buy') {
      result = result.filter(v => v.listingType === 'sale' || v.listingType === 'both')
    }

    result = result.filter(v => v.price >= priceRange.min && v.price <= priceRange.max)

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':  return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating':     return (b.rating ?? 0) - (a.rating ?? 0)
        default:           return 0
      }
    })
  }, [searchQuery, selectedCategories, listingMode, priceRange, sortBy])

  const FilterPanel = () => (
    <div className="space-y-7">
      {/* Availability */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-text-light mb-3">
          Availability
        </p>
        <div className="flex gap-2">
          {(['all', 'rent', 'buy'] as ListingMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setListingMode(mode)}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-lg border transition-all duration-150',
                listingMode === mode
                  ? 'bg-midnight text-white border-midnight'
                  : 'bg-white text-text-secondary border-border-light hover:border-midnight/30 hover:text-text-primary'
              )}
            >
              {mode === 'all' ? 'All' : mode === 'rent' ? 'Rent' : 'Buy'}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-text-light mb-3">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg border capitalize transition-all duration-150',
                selectedCategories.includes(cat)
                  ? 'bg-midnight text-white border-midnight'
                  : 'bg-white text-text-secondary border-border-light hover:border-midnight/30 hover:text-text-primary'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-text-light mb-3">
          Price Range
        </p>
        <div className="space-y-0.5">
          {PRICE_RANGES.map(range => {
            const isSelected = priceRange.min === range.min && priceRange.max === range.max
            return (
              <button
                key={range.label}
                onClick={() => setPriceRange({ min: range.min, max: range.max })}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-150',
                  isSelected
                    ? 'bg-midnight text-white font-medium'
                    : 'text-text-secondary hover:bg-background-dark hover:text-text-primary'
                )}
              >
                {range.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-text-secondary border border-border-light rounded-lg hover:border-midnight/30 hover:text-text-primary transition-all duration-150"
        >
          <X className="w-3.5 h-3.5" />
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">

        {/* ── Hero Search Band ────────────────────────────── */}
        <section className="bg-midnight pt-20">
          <div className="container-max py-10 md:py-14">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-rivian mb-3">
              {MOCK_VEHICLES.length} vehicles available
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-7">
              Find your next vehicle
            </h1>

            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40 pointer-events-none" />
              <input
                type="search"
                placeholder="Search by make, model, or location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-10 bg-white/[0.08] border border-white/[0.14] text-white placeholder:text-white/35 rounded-xl text-sm focus:outline-none focus:bg-white/[0.12] focus:border-white/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────────── */}
        <div className="container-max py-8">

          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-5">
            <button
              onClick={() => setMobileFiltersOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 border border-border-light rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:border-midnight/30 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 bg-midnight text-white text-xs rounded-full leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {mobileFiltersOpen && (
              <div className="mt-4 p-5 border border-border-light rounded-xl bg-card animate-fade-in">
                <FilterPanel />
              </div>
            )}
          </div>

          <div className="flex gap-8">

            {/* ── Sidebar (desktop) ───────────────────────── */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </aside>

            {/* ── Results ─────────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Results header row */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-text-secondary">
                    <span className="font-semibold text-text-primary font-mono">
                      {filteredVehicles.length}
                    </span>
                    {' '}vehicle{filteredVehicles.length !== 1 ? 's' : ''}
                  </span>

                  {/* Active filter chips */}
                  {selectedCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-midnight text-white text-xs rounded-full capitalize font-medium hover:bg-midnight/80 transition-colors"
                    >
                      {cat}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  {listingMode !== 'all' && (
                    <button
                      onClick={() => setListingMode('all')}
                      className="flex items-center gap-1 px-2.5 py-1 bg-midnight text-white text-xs rounded-full capitalize font-medium hover:bg-midnight/80 transition-colors"
                    >
                      {listingMode}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortKey)}
                  className="text-sm border border-border-light rounded-lg px-3 py-2 bg-white text-text-primary focus:outline-none focus:border-midnight/40 transition-colors cursor-pointer flex-shrink-0"
                >
                  <option value="newest">Newest first</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="rating">Highest rated</option>
                </select>
              </div>

              {/* Vehicle grid */}
              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredVehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} {...vehicle} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-background-dark flex items-center justify-center mb-4">
                    <Car className="w-7 h-7 text-text-light" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1.5">No vehicles found</h3>
                  <p className="text-sm text-text-secondary mb-6 max-w-xs leading-relaxed">
                    Try adjusting your filters or broadening your search.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-accent hover:text-accent-light font-medium transition-colors"
                  >
                    Clear all filters →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
