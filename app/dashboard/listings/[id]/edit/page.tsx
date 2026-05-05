'use client'

import { useState, useEffect, use } from 'react'
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
  Settings,
  CheckCircle2,
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'minivan', 'wagon']

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: '',
    category: '',
    vin: '',
    price: '',
    dailyRentalPrice: '',
    listingType: 'sale',
    description: '',
    location: '',
  })

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const supabase = createClient()
        const { data: vehicle, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', resolvedParams.id)
          .single()
          
        if (error) throw error
        
        setFormData({
          title: vehicle.title || '',
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year?.toString() || '',
          category: vehicle.category || '',
          vin: vehicle.vin || '',
          price: vehicle.price?.toString() || '',
          dailyRentalPrice: vehicle.daily_rental_price?.toString() || '',
          listingType: vehicle.listing_type || 'sale',
          description: vehicle.description || '',
          location: vehicle.location || '',
        })
        
        if (vehicle.primary_image_url) {
           setImagePreview(vehicle.primary_image_url)
        }
      } catch (error) {
        console.error("Failed to load vehicle", error)
        toast.error("Could not load vehicle details.")
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [resolvedParams.id, router])

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error("You must be logged in to edit a listing")
      
      let primaryImageUrl = imagePreview // keep existing URL if no new file is selected
      
      if (imageFile) {
        // Upload to 'vehicles' bucket
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('vehicles')
          .upload(filePath, imageFile, { upsert: true })
          
        if (uploadError) {
          console.error("Storage Error:", uploadError)
          if (uploadError.message.toLowerCase().includes('bucket not found') || uploadError.statusCode === '404') {
             toast.error("The 'vehicles' storage bucket does not exist. Image upload skipped.")
          } else {
             throw new Error("Image upload failed: " + uploadError.message)
          }
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('vehicles')
            .getPublicUrl(filePath)
            
          primaryImageUrl = publicUrl
        }
      }
      
      const { data: updatedData, error: updateError } = await supabase.from('vehicles').update({
        title: formData.title || `${formData.year} ${formData.make} ${formData.model}`,
        make: formData.make || 'Unknown Make',
        model: formData.model || 'Unknown Model',
        year: parseInt(formData.year) || new Date().getFullYear(),
        category: formData.category || 'sedan',
        vin: formData.vin || null,
        price: parseFloat(formData.price) || 0,
        daily_rental_price: formData.listingType !== 'sale' ? (parseFloat(formData.dailyRentalPrice) || 0) : null,
        listing_type: formData.listingType,
        description: formData.description,
        location: formData.location,
        primary_image_url: primaryImageUrl,
      }).eq('id', resolvedParams.id).select()
      
      if (updateError) throw new Error("Failed to update listing: " + updateError.message)
      if (!updatedData || updatedData.length === 0) throw new Error("Update succeeded but no data was returned. Check RLS policies.")
      
      toast.success("Listing updated successfully!")
      router.push('/dashboard')
    } catch (error: any) {
      console.error("Submission error:", error)
      toast.error(error.message || "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-glacier-white flex items-center justify-center">
         <Loader2 className="w-8 h-8 text-rivian animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />
      
      <main className="container-max pt-32 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter text-midnight">Edit Listing</h1>
              <p className="text-text-secondary font-medium italic">Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Details & Media' : 'Review & Publish'}</p>
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
              <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8 animate-in fade-in slide-in-from-bottom-4">
                <CardHeader className="px-0 pt-0 pb-8 border-b border-border/50 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rivian/10 flex items-center justify-center">
                       <Car className="w-5 h-5 text-rivian" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter">Vehicle Basics</CardTitle>
                      <CardDescription className="font-medium text-text-light text-sm">Update the core details of your vehicle.</CardDescription>
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
                       <Input 
                         placeholder="e.g. Tesla" 
                         className="h-14 font-bold border-border/50" 
                         value={formData.make}
                         onChange={(e) => setFormData({...formData, make: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-black uppercase tracking-widest text-text-light">Model</Label>
                       <Input 
                         placeholder="e.g. Model 3" 
                         className="h-14 font-bold border-border/50" 
                         value={formData.model}
                         onChange={(e) => setFormData({...formData, model: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-black uppercase tracking-widest text-text-light">Year</Label>
                       <Input 
                         type="number"
                         placeholder="e.g. 2023" 
                         className="h-14 font-bold border-border/50" 
                         value={formData.year}
                         onChange={(e) => setFormData({...formData, year: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-black uppercase tracking-widest text-text-light">Category</Label>
                       <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                          <SelectTrigger className="h-14 font-bold border-border/50 capitalize">
                             <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                             {CATEGORIES.map(cat => (
                               <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
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
              <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8 animate-in fade-in slide-in-from-bottom-4">
                <CardHeader className="px-0 pt-0 pb-8 border-b border-border/50 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-compass/10 flex items-center justify-center">
                       <Settings className="w-5 h-5 text-compass" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter">Details & Media</CardTitle>
                      <CardDescription className="font-medium text-text-light text-sm">Update your price, location, and photos.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-text-light">Listing Type</Label>
                        <Select value={formData.listingType} onValueChange={(v) => setFormData({...formData, listingType: v})}>
                           <SelectTrigger className="h-14 font-bold border-border/50">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="sale">For Sale (Only)</SelectItem>
                              <SelectItem value="rent">For Rent (Only)</SelectItem>
                              <SelectItem value="both">Both (Sale & Rent)</SelectItem>
                           </SelectContent>
                        </Select>
                      </div>
                      
                      {['sale', 'both'].includes(formData.listingType) && (
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-text-light">Purchase Price (৳)</Label>
                          <Input 
                            type="number"
                            placeholder="e.g. 45000" 
                            className="h-14 font-bold border-border/50" 
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                          />
                        </div>
                      )}

                      {['rent', 'both'].includes(formData.listingType) && (
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-text-light">Daily Rental Price (৳)</Label>
                          <Input 
                            type="number"
                            placeholder="e.g. 89" 
                            className="h-14 font-bold border-border/50" 
                            value={formData.dailyRentalPrice}
                            onChange={(e) => setFormData({...formData, dailyRentalPrice: e.target.value})}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-text-light">Location (City, State)</Label>
                        <Input 
                          placeholder="e.g. Los Angeles, CA" 
                          className="h-14 font-bold border-border/50" 
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-text-light">Vehicle Description</Label>
                        <Textarea 
                          placeholder="Describe the condition, history, and features..." 
                          className="min-h-[120px] font-medium border-border/50" 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-3 md:col-span-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-text-light">Primary Vehicle Photo</Label>
                        
                        <div className="relative border-2 border-dashed border-border/60 rounded-2xl overflow-hidden hover:bg-black/5 transition-colors group">
                           {imagePreview ? (
                             <div className="relative aspect-video">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <ImageIcon className="w-8 h-8 text-white mb-2" />
                                   <p className="text-white font-bold text-sm">Click to change photo</p>
                                </div>
                             </div>
                           ) : (
                             <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="w-12 h-12 rounded-full bg-rivian/10 flex items-center justify-center mb-4">
                                   <Upload className="w-5 h-5 text-rivian" />
                                </div>
                                <h4 className="font-bold text-midnight mb-1">Upload an image</h4>
                                <p className="text-xs text-text-light font-medium max-w-xs">Drag and drop or click to browse. Max size 5MB (JPG, PNG).</p>
                             </div>
                           )}
                           <input 
                             type="file" 
                             accept="image/*" 
                             className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                             onChange={handleImageChange}
                           />
                        </div>
                      </div>
                   </div>
                   <div className="flex justify-between pt-6">
                    <Button type="button" onClick={handleBack} variant="outline" className="h-14 px-10 flex items-center gap-2 group">
                      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      Back
                    </Button>
                    <Button type="button" onClick={handleNext} className="btn-primary h-14 px-10 flex items-center gap-2 group">
                      Review Changes
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8 animate-in fade-in slide-in-from-bottom-4">
                <CardHeader className="px-0 pt-0 pb-8 border-b border-border/50 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter">Ready to Save?</CardTitle>
                      <CardDescription className="font-medium text-text-light text-sm">Review your updated details before going live.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 space-y-8">
                   <div className="bg-glacier-white rounded-2xl p-6 space-y-4">
                      {imagePreview && (
                         <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 border border-border/50">
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Vehicle preview" />
                         </div>
                      )}
                      <div className="flex justify-between items-center border-b border-border/50 pb-4">
                         <span className="text-xs font-black uppercase tracking-widest text-text-light">Vehicle</span>
                         <span className="font-bold text-midnight">{formData.title || `${formData.year} ${formData.make} ${formData.model}` || 'Untitled Vehicle'}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/50 pb-4">
                         <span className="text-xs font-black uppercase tracking-widest text-text-light">Type</span>
                         <span className="font-bold text-midnight capitalize">{formData.listingType}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/50 pb-4">
                         <span className="text-xs font-black uppercase tracking-widest text-text-light">Location</span>
                         <span className="font-bold text-midnight">{formData.location || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-black uppercase tracking-widest text-text-light">Visibility</span>
                         <span className="font-bold text-emerald-500">Public Immediately</span>
                      </div>
                   </div>

                   <div className="flex justify-between pt-6">
                    <Button type="button" onClick={handleBack} variant="outline" className="h-14 px-10 flex items-center gap-2 group" disabled={saving}>
                      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      Back to Edit
                    </Button>
                    <Button type="submit" disabled={saving} className="btn-primary h-14 px-10 flex items-center gap-2 group">
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Save Changes Now
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
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
