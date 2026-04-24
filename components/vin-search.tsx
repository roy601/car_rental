'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Shield, Zap, Info } from 'lucide-react'
import { toast } from 'sonner'

export function VINSearch() {
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vin) return
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.info("Vehicle data fetched! Redirecting to listing...")
    }, 1500)
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rivian/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container-max">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Content */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="badge-accent">Intelligence Tool</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-midnight leading-[0.95]">
                Uncover the <br />
                <span className="text-rivian">Vehicle's DNA.</span>
              </h2>
              <p className="text-lg text-text-secondary font-medium max-w-xl leading-relaxed">
                Enter any VIN to instantly extract manufacturer specifications, ownership history, and real-time market valuation. Powered by AutoFleet Intelligence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-rivian/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-rivian" />
                </div>
                <div>
                  <h4 className="font-bold text-midnight">Instant Specs</h4>
                  <p className="text-xs text-text-light font-medium mt-1">Engine, trim, and features</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-compass/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-compass" />
                </div>
                <div>
                  <h4 className="font-bold text-midnight">Safety Audit</h4>
                  <p className="text-xs text-text-light font-medium mt-1">NHTSA recall & crash data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Scanner UI */}
          <div className="flex-1 w-full max-w-xl">
            <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 border-t-4 border-l-4 border-rivian/20 rounded-tl-2xl" />
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-4 border-r-4 border-rivian/20 rounded-br-2xl" />
                
                <div className="bg-midnight rounded-[32px] p-8 md:p-12 shadow-2xl shadow-rivian/20 relative overflow-hidden">
                    {/* Interior Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rivian/20 blur-[60px] -z-0" />
                    
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/10 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-rivian animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ready to Scan</span>
                            </div>
                            <Info className="w-4 h-4 text-white/20 hover:text-white transition-colors cursor-pointer" />
                        </div>

                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Global VIN Access</label>
                                <div className="relative group">
                                    <Input 
                                        className="bg-white/5 border-white/10 h-16 rounded-2xl text-white font-bold text-lg px-6 focus:bg-white/10 focus:border-rivian transition-all"
                                        placeholder="1HGBH41JXMN..."
                                        value={vin}
                                        onChange={(e) => setVin(e.target.value)}
                                    />
                                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-hover:text-rivian transition-colors" />
                                </div>
                            </div>
                            
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-16 rounded-2xl bg-gradient-to-br from-rivian to-rivian-light hover:shadow-lg hover:shadow-rivian/40 transition-all text-white font-black text-lg tracking-tight flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing Data...
                                    </>
                                ) : (
                                    <>Analyze Vehicle</>
                                )}
                            </Button>
                        </form>
                        
                        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <Search className="w-4 h-4 text-white/40" />
                            </div>
                            <p className="text-[11px] text-white/40 font-medium leading-snug">
                                By entering a VIN, you agree to our data processing terms. Most lookups complete in under 2 seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
