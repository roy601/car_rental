'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  X,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('ID Card')
  const [file, setFile] = useState<File | null>(null)
  
  const supabase = createClient()

  const fetchDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('seller_documents')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.")
      return
    }

    setIsUploading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Authentication failed")

      // 1. Upload to storage bucket
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('seller_documents')
        .upload(filePath, file)

      if (uploadError) throw new Error("Storage upload failed: " + uploadError.message)

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('seller_documents')
        .getPublicUrl(filePath)

      // 3. Insert record into database
      const { error: dbError } = await supabase.from('seller_documents').insert({
        seller_id: user.id,
        document_type: selectedCategory,
        file_name: file.name,
        file_url: publicUrl,
        status: 'pending'
      })

      if (dbError) throw new Error("Database insert failed: " + dbError.message)

      // 4. Update user's verification status to pending if it was rejected or missing
      await supabase.from('users')
        .update({ verification_status: 'pending' })
        .eq('id', user.id)
        .neq('verification_status', 'approved')

      toast.success("Document uploaded successfully! Our team will review it within 24 hours.")
      setFile(null)
      fetchDocuments()

    } catch (error: any) {
      toast.error(error.message || "Failed to upload document")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string, fileUrl: string) => {
    try {
      // Extract the path from the public URL if possible (optional, but good for cleanup)
      const pathParts = fileUrl.split('/seller_documents/')
      if (pathParts.length > 1) {
         const path = pathParts[1]
         await supabase.storage.from('seller_documents').remove([path])
      }

      // Delete from DB
      const { error } = await supabase.from('seller_documents').delete().eq('id', id)
      if (error) throw error

      toast.success("Document removed.")
      setDocuments(docs => docs.filter(d => d.id !== id))
    } catch (error: any) {
      toast.error("Failed to remove document: " + error.message)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Approved</Badge>
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>
      default: return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Under Review</Badge>
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
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                         {['ID Card', 'License', 'Passport', 'Insurance'].map((type) => (
                            <button 
                              key={type} 
                              onClick={() => setSelectedCategory(type)}
                              type="button"
                              className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                                selectedCategory === type 
                                  ? 'border-rivian bg-rivian/5' 
                                  : 'border-border/50 hover:border-rivian/50 hover:bg-glacier-white'
                              }`}
                            >
                               <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedCategory === type ? 'text-rivian' : 'text-text-light group-hover:text-rivian/70'}`}>
                                 {type}
                               </p>
                               <CheckCircle2 className={`w-4 h-4 ${selectedCategory === type ? 'text-rivian opacity-100' : 'opacity-0'}`} />
                            </button>
                         ))}
                      </div>

                      <div className="relative group">
                         <div className={`w-full h-48 border-2 border-dashed rounded-3xl bg-glacier-white flex flex-col items-center justify-center transition-all cursor-pointer ${file ? 'border-rivian bg-rivian/5' : 'border-border group-hover:border-rivian/50'}`}>
                            <div className="w-12 h-12 rounded-full bg-rivian/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                               <Upload className="w-6 h-6 text-rivian" />
                            </div>
                            <p className="font-bold text-midnight">{file ? file.name : "Drag & drop files here"}</p>
                            <p className="text-xs text-text-light font-medium mt-1">{file ? 'Ready to upload' : 'PNG, JPG, or PDF up to 10MB'}</p>
                         </div>
                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} disabled={isUploading} accept="image/*,.pdf" />
                      </div>

                      <div className="flex justify-end">
                         <Button onClick={handleUpload} disabled={isUploading || !file} className="btn-primary h-14 px-10">
                            {isUploading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Uploading...
                              </>
                            ) : 'Submit for Review'}
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
                         {documents.length > 0 ? documents.map((doc, i) => (
                            <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-glacier-white transition-colors gap-4">
                               <div className="flex items-center gap-4 flex-1">
                                  <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center flex-shrink-0">
                                     <FileText className="w-5 h-5 text-text-light" />
                                  </div>
                                  <div className="overflow-hidden">
                                     <h4 className="font-bold text-midnight tracking-tight truncate">{doc.document_type}</h4>
                                     <p className="text-xs text-text-light font-medium flex items-center gap-2 mt-0.5">
                                        <Clock className="w-3 h-3" />
                                        {new Date(doc.created_at).toLocaleDateString()}
                                     </p>
                                  </div>
                               </div>
                               <div className="flex items-center justify-between sm:justify-end gap-4">
                                  {getStatusBadge(doc.status)}
                                  <Button 
                                    onClick={() => handleDelete(doc.id, doc.file_url)}
                                    variant="ghost" 
                                    className="h-9 w-9 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                  >
                                     <X className="w-4 h-4" />
                                  </Button>
                               </div>
                            </div>
                         )) : (
                            <div className="p-12 text-center text-text-light font-medium text-sm">
                               No documents uploaded yet.
                            </div>
                         )}
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
