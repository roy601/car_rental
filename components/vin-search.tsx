'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function VINSearch() {
  const [vin, setVin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!vin.trim() || vin.length < 17) {
      setError('Please enter a valid 17-character VIN')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Call n8n webhook to fetch vehicle specs
      console.log('[v0] Fetching specs for VIN:', vin)
      // const response = await fetch('/api/vehicles/fetch-specs', {
      //   method: 'POST',
      //   body: JSON.stringify({ vin }),
      // })
      // const data = await response.json()
    } catch (err) {
      setError('Failed to fetch vehicle specs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-white">
      <div className="container-max">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Section Title */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
              <span className="text-balance">Analyze Any Vehicle</span>
            </h2>
            <p className="text-xl text-text-secondary">
              Enter a VIN to instantly get vehicle specifications, history, and estimated value.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Enter VIN (e.g., 1HGBH41JXMN109186)"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  className="w-full h-12 px-4 text-base border-2 border-border rounded-full focus:border-rivian focus:ring-0"
                  maxLength={17}
                />
                {vin.length > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light text-sm">
                    {vin.length}/17
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading || vin.length < 17}
                className="btn-primary h-12 px-8 whitespace-nowrap"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    Fetching...
                  </span>
                ) : (
                  'Auto-Fetch Specs'
                )}
              </Button>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm animate-pulse">
                Fetching vehicle specs from NHTSA, SerpAPI, and Unsplash...
              </div>
            )}
          </form>

          {/* Info Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
            <div className="text-center space-y-2">
              <div className="text-3xl">📋</div>
              <h3 className="font-bold text-text-primary">Full Specs</h3>
              <p className="text-sm text-text-secondary">Engine, transmission, safety features</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl">💰</div>
              <h3 className="font-bold text-text-primary">Market Value</h3>
              <p className="text-sm text-text-secondary">Estimated price and comparables</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl">🖼️</div>
              <h3 className="font-bold text-text-primary">High-Quality Images</h3>
              <p className="text-sm text-text-secondary">Professional photos from Unsplash</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
