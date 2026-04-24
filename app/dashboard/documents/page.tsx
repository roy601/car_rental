'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  X
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const existingDocs = [
  { name: 'Driver License Front.jpg', status: 'approved', date: 'Oct 12, 2025' },
  { name: 'Business Permit 2026.pdf', status: 'pending', date: 'Mar 10, 2026' }
]

export default function DocumentsPage() {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      toast.success("Document uploaded successfully! Our team will review it within 24 hours.")
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Approved</Badge>
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>
      default: return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Under Review</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />
      
      <main className="container-max pt-32 pb-20 space-y-10">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="space-y-1">
             <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-text-light hover:text-rivian transition-colors mb-4 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
             </Link>
             <h1 className="text-4xl font-black tracking-tighter text-midnight">Seller Verification</h1>
             <p className="text-text-secondary font-medium italic">Upload your identity documents to unlock higher selling limits and trust badges.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left: Upload Area */}
             <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8">
                   <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-2xl font-black tracking-tighter">New Document</CardTitle>
                      <CardDescription className="font-medium text-text-light">Select the document type and upload a clear photo or PDF.</CardDescription>
                   </CardHeader>
                   <CardContent className="px-0 space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                         {['ID Card', 'License', 'Passport', 'Insurance'].map((type) => (
                            <button key={type} className="p-4 rounded-2xl border-2 border-border/50 hover:border-rivian hover:bg-rivian/5 transition-all text-left group">
                               <p className="text-xs font-black uppercase tracking-widest text-text-light group-hover:text-rivian mb-1">{type}</p>
                               <p className="font-bold text-midnight text-sm">Select Category</p>
                            </button>
                         ))}
                      </div>

                      <div className="relative group">
                         <div className="w-full h-48 border-2 border-dashed border-border group-hover:border-rivian/50 rounded-3xl bg-glacier-white flex flex-col items-center justify-center transition-all cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-rivian/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                               <Upload className="w-6 h-6 text-rivian" />
                            </div>
                            <p className="font-bold text-midnight">Drag & drop files here</p>
                            <p className="text-xs text-text-light font-medium mt-1">PNG, JPG, or PDF up to 10MB</p>
                         </div>
                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} disabled={isUploading} />
                      </div>

                      <div className="flex justify-end">
                         <Button onClick={handleUpload} disabled={isUploading} className="btn-primary h-14 px-10">
                            {isUploading ? 'Uploading...' : 'Submit for Review'}
                         </Button>
                      </div>
                   </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
                   <CardHeader className="pb-6">
                      <CardTitle className="text-xl font-black tracking-tighter">Upload History</CardTitle>
                   </CardHeader>
                   <CardContent className="p-0">
                      <div className="divide-y divide-border/50">
                         {existingDocs.map((doc, i) => (
                            <div key={i} className="p-6 flex items-center justify-between hover:bg-glacier-white transition-colors">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center">
                                     <FileText className="w-5 h-5 text-text-light" />
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-midnight tracking-tight">{doc.name}</h4>
                                     <p className="text-xs text-text-light font-medium flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        Uploaded on {doc.date}
                                     </p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  {getStatusBadge(doc.status)}
                                  <Button variant="ghost" className="h-9 w-9 p-0 rounded-full">
                                     <X className="w-4 h-4 text-text-light" />
                                  </Button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
             </div>

             {/* Right: Requirements Sidebar */}
             <div className="space-y-6">
                <Card className="border-none shadow-xl shadow-black/5 bg-midnight text-white">
                   <CardHeader>
                      <CardTitle className="text-lg font-black tracking-tighter">Requirements</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-rivian" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">Clear Visibility</p>
                            <p className="text-xs text-white/40 mt-1">Ensure all text and photos are legible without glare.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-rivian" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">Valid Expiry</p>
                            <p className="text-xs text-white/40 mt-1">Documents must be current and not expired.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-rivian" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">Matching Identity</p>
                            <p className="text-xs text-white/40 mt-1">Name on documents must match your account name.</p>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                <div className="p-6 rounded-[32px] bg-compass/10 border border-compass/20 flex gap-4">
                   <AlertCircle className="w-6 h-6 text-compass flex-shrink-0" />
                   <p className="text-xs font-medium text-midnight leading-relaxed">
                      Verification usually takes **24-48 hours**. You will receive an email once your status is updated.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
