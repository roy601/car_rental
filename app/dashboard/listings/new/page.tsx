'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Car, 
  Tag, 
  ImageIcon, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NewListingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    price: '',
    listingType: 'sale',
    description: '',
    location: '',
  })

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Listing created successfully! It will appear after review.")
      // Redirect would go here
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />
      
      <main className="container-max pt-32 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter text-midnight">Create New Listing</h1>
              <p className="text-text-secondary font-medium italic">Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Details & Specs' : 'Review & Publish'}</p>
            </div>
            <Link href="/dashboard" className="text-sm font-bold text-text-light hover:text-rivian transition-colors">
              Cancel & Exit
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
             <div 
               className="h-full bg-rivian transition-all duration-500" 
               style={{ width: `${(step / 3) * 100}%` }}
             />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8">
                <CardHeader className="px-0 pt-0 pb-8 border-b border-border/50 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rivian/10 flex items-center justify-center">
                       <Car className="w-5 h-5 text-rivian" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter">Vehicle Basics</CardTitle>
                      <CardDescription className="font-medium text-text-light text-sm">Tell us the core details of your vehicle.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                       <Label className="text-xs font-black uppercase tracking-widest text-text-light">Listing Title</Label>
                       <Input 
                         placeholder="e.g. 2023 Tesla Model 3 Performance" 
                         className="h-14 font-bold border-border/50"
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-black uppercase tracking-widest text-text-light">Manufacturer (Make)</Label>
                       <Input placeholder="e.g. Tesla" className="h-14 font-bold border-border/50" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-black uppercase tracking-widest text-text-light">Model</Label>
                       <Input placeholder="e.g. Model 3" className="h-14 font-bold border-border/50" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-6">
                    <Button type="button" onClick={handleNext} className="btn-primary h-14 px-10 flex items-center gap-2 group">
                      Continue to Details
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8">
                <CardHeader className="px-0 pt-0 pb-8 border-b border-border/50 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-compass/10 flex items-center justify-center">
                       <Settings className="w-5 h-5 text-compass" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter">Specifications & Pricing</CardTitle>
                      <CardDescription className="font-medium text-text-light text-sm">Set your price and list your vehicle specs.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-text-light">Listing Type</Label>
                        <Select value={formData.listingType} onValueChange={(v) => setFormData({...formData, listingType: v})}>
                           <SelectTrigger className="h-14 font-bold border-border/50">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="sale">For Sale</SelectItem>
                              <SelectItem value="rent">For Rent</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                           </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-text-light">Price ($)</Label>
                        <Input placeholder="e.g. 45000" className="h-14 font-bold border-border/50" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-text-light">Vehicle Description</Label>
                        <Textarea placeholder="Describe the condition, history, and features..." className="min-h-[120px] font-medium border-border/50" />
                      </div>
                   </div>
                   <div className="flex justify-between pt-6">
                    <Button type="button" onClick={handleBack} variant="outline" className="h-14 px-10 flex items-center gap-2 group">
                      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      Back
                    </Button>
                    <Button type="button" onClick={handleNext} className="btn-primary h-14 px-10 flex items-center gap-2 group">
                      Review Listing
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8">
                <CardHeader className="px-0 pt-0 pb-8 border-b border-border/50 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter">Ready to Launch?</CardTitle>
                      <CardDescription className="font-medium text-text-light text-sm">Review your details before going live.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 space-y-8">
                   <div className="bg-glacier-white rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-border/50 pb-4">
                         <span className="text-xs font-black uppercase tracking-widest text-text-light">Vehicle</span>
                         <span className="font-bold text-midnight">{formData.title || 'Untitled Vehicle'}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/50 pb-4">
                         <span className="text-xs font-black uppercase tracking-widest text-text-light">Type</span>
                         <span className="font-bold text-midnight capitalize">{formData.listingType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-black uppercase tracking-widest text-text-light">Visibility</span>
                         <span className="font-bold text-emerald-500">Public after review</span>
                      </div>
                   </div>

                   <div className="flex items-start gap-4 bg-amber-50 rounded-2xl p-6 border border-amber-100">
                      <ShieldCheck className="w-6 h-6 text-amber-600 flex-shrink-0" />
                      <div>
                         <p className="text-sm font-bold text-amber-900">Final Verification</p>
                         <p className="text-xs text-amber-700 font-medium leading-relaxed mt-1">
                            By publishing, you confirm that all details are accurate and you possess the legal rights to sell or rent this vehicle.
                         </p>
                      </div>
                   </div>

                   <div className="flex justify-between pt-6">
                    <Button type="button" onClick={handleBack} variant="outline" className="h-14 px-10 flex items-center gap-2 group">
                      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      Back to Edit
                    </Button>
                    <Button type="submit" disabled={loading} className="btn-primary h-14 px-10 flex items-center gap-2 group">
                      {loading ? 'Creating...' : 'Publish Listing Now'}
                      {!loading && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}
