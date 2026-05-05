'use client'

import { use, useState, useEffect } from 'react'
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
  Loader2,
  Save
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'minivan', 'wagon']

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
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
    numberPlate: '',
    engineType: '',
    transmission: '',
    drivetrain: '',
    fuelType: '',
    color: '',
    condition: 'good',
    mileage: '',
  })

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (data) {
          setFormData({
            title: data.title || '',
            make: data.make || '',
            model: data.model || '',
            year: data.year?.toString() || '',
            category: data.category || '',
            vin: data.vin || '',
            price: data.price?.toString() || '',
            dailyRentalPrice: data.daily_rental_price?.toString() || '',
            listingType: data.listing_type || 'sale',
            description: data.description || '',
            location: data.location || '',
            numberPlate: data.number_plate || '',
            engineType: data.engine_type || '',
            transmission: data.transmission || '',
            drivetrain: data.drivetrain || '',
            fuelType: data.fuel_type || '',
            color: data.color || '',
            condition: data.condition || 'good',
            mileage: data.mileage?.toString() || '',
          })
          if (data.primary_image_url) {
            setImagePreview(data.primary_image_url)
          }
        }
      } catch (error: any) {
        toast.error("Failed to load vehicle details")
        router.push('/dashboard')
      } finally {
        setFetching(false)
      }
    }

    fetchVehicle()
  }, [id])

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
    setLoading(true)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      
      let primaryImageUrl = imagePreview
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('vehicles')
          .upload(filePath, imageFile, { upsert: true })
          
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('vehicles')
            .getPublicUrl(filePath)
          primaryImageUrl = publicUrl
        }
      }
      
      const { error: updateError } = await supabase.from('vehicles').update({
        title: formData.title,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        category: formData.category,
        vin: formData.vin || null,
        price: parseFloat(formData.price) || 0,
        daily_rental_price: formData.listingType !== 'sale' ? (parseFloat(formData.dailyRentalPrice) || 0) : null,
        listing_type: formData.listingType,
        description: formData.description,
        location: formData.location,
        primary_image_url: primaryImageUrl,
        number_plate: formData.numberPlate,
        engine_type: formData.engineType,
        transmission: formData.transmission,
        drivetrain: formData.drivetrain,
        fuel_type: formData.fuelType,
        color: formData.color,
        condition: formData.condition,
        mileage: parseInt(formData.mileage) || null,
      }).eq('id', id)
      
      if (updateError) throw updateError
      
      toast.success("Listing updated successfully!")
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
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
              <p className="text-text-secondary font-medium">Update your vehicle details. Changes are saved instantly upon publishing.</p>
            </div>
            <Link href="/dashboard" className="text-sm font-bold text-text-light hover:text-rivian transition-colors">
              Cancel & Exit
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  <Card className="border-none shadow-xl bg-white p-8">
                    <CardHeader className="px-0 pt-0 pb-6 border-b border-border/50 mb-6">
                       <CardTitle className="text-xl font-black tracking-tighter">Basic Info</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Listing Title</Label>
                                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Make</Label>
                                <Input value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Model</Label>
                                <Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Year</Label>
                                <Input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Category</Label>
                                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                                    <SelectTrigger className="h-12 font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Number Plate</Label>
                                <Input value={formData.numberPlate} onChange={(e) => setFormData({...formData, numberPlate: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Location</Label>
                                <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="h-12 font-bold" />
                            </div>
                        </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl bg-white p-8">
                    <CardHeader className="px-0 pt-0 pb-6 border-b border-border/50 mb-6">
                       <CardTitle className="text-xl font-black tracking-tighter">Technical Details</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Engine</Label>
                                <Input value={formData.engineType} onChange={(e) => setFormData({...formData, engineType: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Transmission</Label>
                                <Input value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Drivetrain</Label>
                                <Input value={formData.drivetrain} onChange={(e) => setFormData({...formData, drivetrain: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Fuel Type</Label>
                                <Input value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Color</Label>
                                <Input value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="h-12 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Condition</Label>
                                <Select value={formData.condition} onValueChange={(v) => setFormData({...formData, condition: v})}>
                                    <SelectTrigger className="h-12 font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="excellent">Excellent</SelectItem>
                                        <SelectItem value="good">Good</SelectItem>
                                        <SelectItem value="fair">Fair</SelectItem>
                                        <SelectItem value="needs_work">Needs Work</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl bg-white p-8">
                    <CardHeader className="px-0 pt-0 pb-6 border-b border-border/50 mb-6">
                       <CardTitle className="text-xl font-black tracking-tighter">Description</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Textarea 
                          value={formData.description} 
                          onChange={(e) => setFormData({...formData, description: e.target.value})} 
                          className="min-h-[150px] font-medium"
                          placeholder="Describe the condition, history, and features..."
                        />
                    </CardContent>
                  </Card>
               </div>

               <div className="space-y-8">
                  <Card className="border-none shadow-xl bg-white p-6">
                    <CardHeader className="px-0 pt-0 pb-4 border-b border-border/50 mb-4">
                       <CardTitle className="text-lg font-black tracking-tighter">Pricing & Type</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Listing Type</Label>
                            <Select value={formData.listingType} onValueChange={(v) => setFormData({...formData, listingType: v})}>
                                <SelectTrigger className="h-12 font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sale">For Sale</SelectItem>
                                    <SelectItem value="rent">For Rent</SelectItem>
                                    <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {['sale', 'both'].includes(formData.listingType) && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Purchase Price ($)</Label>
                                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="h-12 font-bold" />
                            </div>
                        )}
                        {['rent', 'both'].includes(formData.listingType) && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-text-light">Daily Rent ($)</Label>
                                <Input type="number" value={formData.dailyRentalPrice} onChange={(e) => setFormData({...formData, dailyRentalPrice: e.target.value})} className="h-12 font-bold" />
                            </div>
                        )}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl bg-white p-6">
                    <CardHeader className="px-0 pt-0 pb-4 border-b border-border/50 mb-4">
                       <CardTitle className="text-lg font-black tracking-tighter">Primary Image</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 space-y-4">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-glacier-white border-2 border-dashed border-border flex items-center justify-center group">
                            {imagePreview ? (
                                <img src={imagePreview} className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="w-8 h-8 text-text-light" />
                            )}
                            <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <p className="text-white text-xs font-bold">Change Image</p>
                            </div>
                        </div>
                    </CardContent>
                  </Card>

                  <Button type="submit" disabled={loading} className="w-full h-16 btn-primary flex items-center justify-center gap-3 shadow-xl shadow-rivian/20">
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                     {loading ? 'Saving Changes...' : 'Save All Changes'}
                  </Button>
               </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
