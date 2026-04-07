'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { AnalyticsCard } from '@/components/analytics-card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [supabase])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <p className="text-text-secondary">Loading...</p>
        </main>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-text-secondary">Please log in to view your dashboard</p>
            <Button asChild className="btn-primary">
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-background to-white/5 pt-20 pb-12">
        <div className="container-max">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">
              Seller Dashboard
            </h1>
            <p className="text-xl text-text-secondary">
              Manage your listings and track performance
            </p>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <AnalyticsCard
              title="Total Revenue"
              value="$125,400"
              change={12}
              icon="💰"
              trend="up"
            />
            <AnalyticsCard
              title="Active Listings"
              value="24"
              change={3}
              icon="📋"
              trend="up"
            />
            <AnalyticsCard
              title="Total Bookings"
              value="156"
              change={8}
              icon="📅"
              trend="up"
            />
            <AnalyticsCard
              title="Visitor Analytics"
              value="12.5K"
              change={-2}
              icon="👥"
              trend="down"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts & Stats */}
            <div className="lg:col-span-2 space-y-8">
              {/* Revenue Trend */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text-primary">Revenue Trend</h2>
                  <select className="px-4 py-2 border border-input rounded-lg text-sm">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Last Year</option>
                  </select>
                </div>
                
                {/* Simple Chart Visualization */}
                <div className="h-64 flex items-end justify-around gap-2 p-4 bg-white/50 rounded-lg">
                  {[45, 52, 48, 61, 55, 67, 58, 70, 65, 72].map((value, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-rivian to-rivian-light rounded-t-lg transition-all hover:opacity-80"
                      style={{
                        height: `${(value / 72) * 100}%`,
                        minHeight: '20px',
                      }}
                      title={`${value}K`}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-text-secondary mt-4">
                  Revenue in thousands - Last 10 days
                </p>
              </div>

              {/* Vehicle Performance */}
              <div className="card">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Top Performing Vehicles</h2>
                <div className="space-y-4">
                  {[
                    {
                      name: '2023 Tesla Model 3',
                      views: 1250,
                      bookings: 45,
                      revenue: '$4,005',
                    },
                    {
                      name: '2023 Range Rover',
                      views: 980,
                      bookings: 32,
                      revenue: '$5,760',
                    },
                    {
                      name: '2022 Rivian R1T',
                      views: 750,
                      bookings: 28,
                      revenue: '$4,172',
                    },
                  ].map((vehicle, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-border-light"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-text-primary">{vehicle.name}</p>
                        <p className="text-sm text-text-secondary">
                          {vehicle.views} views • {vehicle.bookings} bookings
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-text-primary">{vehicle.revenue}</p>
                        <p className="text-sm text-text-secondary">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions & Status */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="card space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">Quick Actions</h2>
                <Button asChild className="w-full btn-primary">
                  <Link href="/dashboard/vehicles/new">Add New Listing</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/bookings">View Bookings</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/documents">Upload Documents</Link>
                </Button>
              </div>

              {/* Account Status */}
              <div className="card space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">Account Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-bold text-green-900 text-sm">Verified Seller</p>
                      <p className="text-xs text-green-700">All documents approved</p>
                    </div>
                    <span className="text-xl">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-bold text-blue-900 text-sm">Seller Rating</p>
                      <p className="text-xs text-blue-700">4.8 / 5.0 stars</p>
                    </div>
                    <span className="text-xl">⭐</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-bold text-yellow-900 text-sm">Response Rate</p>
                      <p className="text-xs text-yellow-700">98% within 1 hour</p>
                    </div>
                    <span className="text-xl">⚡</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="card space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">Upcoming</h2>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Vehicle Inspection',
                      date: 'Tomorrow, 2:00 PM',
                      icon: '🔍',
                    },
                    {
                      title: 'Booking Confirmation',
                      date: 'March 15, 2026',
                      icon: '✅',
                    },
                    {
                      title: 'Payment Settlement',
                      date: 'March 20, 2026',
                      icon: '💳',
                    },
                  ].map((event, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-white/50 rounded-lg">
                      <span className="text-xl">{event.icon}</span>
                      <div>
                        <p className="font-bold text-text-primary text-sm">{event.title}</p>
                        <p className="text-xs text-text-secondary">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
