'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Shield, Zap, Info, Car, Settings2, Calendar, MapPin, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export function VINSearch() {
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [decodedData, setDecodedData] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vin) {
      toast.error("Please enter a VIN")
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`)
      const data = await res.json()
      
      if (data && data.Results && data.Results.length > 0) {
        const result = data.Results[0]
        if (!result.Make && !result.Model) {
           toast.error("Invalid VIN or no manufacturer data found")
           return
        }
        setDecodedData(result)
        setIsModalOpen(true)
      } else {
        toast.error("No data found for this VIN")
      }
    } catch (err) {
      toast.error("Failed to decode VIN. Please try again.")
    } finally {
      setLoading(false)
    }
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

      {/* Results Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white border-none shadow-2xl rounded-3xl overflow-hidden p-0">
          <div className="bg-midnight p-8 text-white">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-rivian/20 text-rivian text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-rivian/30">
                  NHTSA Certified
                </span>
                <span className="text-white/40 text-xs font-mono">{vin.toUpperCase()}</span>
              </div>
              <DialogTitle className="text-3xl font-black tracking-tighter">
                {decodedData?.ModelYear} {decodedData?.Make} {decodedData?.Model}
              </DialogTitle>
              <DialogDescription className="text-white/60 text-base mt-2">
                Official manufacturer specifications decoded from vehicle identification number.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {decodedData && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-glacier-white">
              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">Body & Trim</p>
                    <p className="font-bold text-midnight">{decodedData.BodyClass || 'N/A'}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{decodedData.Trim || 'Standard Trim'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                    <Settings2 className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">Drivetrain</p>
                    <p className="font-bold text-midnight">{decodedData.DriveType || 'N/A'}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{decodedData.TransmissionStyle || 'Auto'} • {decodedData.FuelTypePrimary || 'Gas'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">Engine Specs</p>
                    <p className="font-bold text-midnight">{decodedData.EngineCylinders ? `${decodedData.EngineCylinders} Cylinders` : 'N/A'}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{decodedData.DisplacementL ? `${decodedData.DisplacementL}L` : ''} {decodedData.EngineHP ? `• ${decodedData.EngineHP} HP` : ''}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">Manufacturing</p>
                    <p className="font-bold text-midnight">{decodedData.Manufacturer || 'N/A'}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{decodedData.PlantCity ? `${decodedData.PlantCity}, ` : ''}{decodedData.PlantCountry || ''}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
