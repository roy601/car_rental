'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const DOCUMENT_TYPES = [
  { id: 'driver_license', label: 'Driver License', required: true },
  { id: 'passport', label: 'Passport', required: false },
  { id: 'national_id', label: 'National ID', required: false },
  { id: 'business_license', label: 'Business License', required: false },
  { id: 'insurance', label: 'Insurance', required: false },
]

export default function VerificationPage() {
  const [documents, setDocuments] = useState<Record<string, { file?: File; status?: string }>>({})
  const [uploading, setUploading] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, any>>({
    driver_license: { status: 'approved', verified_at: '2026-02-15' },
  })

  const handleFileChange = (docType: string, file: File) => {
    setDocuments((prev) => ({ ...prev, [docType]: { ...prev[docType], file } }))
  }

  const handleUpload = async (docType: string) => {
    const file = documents[docType]?.file
    if (!file) return

    setUploading(true)

    try {
      // TODO: Upload to Vercel Blob or Supabase Storage
      console.log('[v0] Uploading document:', docType, file.name)

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setUploadedDocuments((prev) => ({
        ...prev,
        [docType]: { status: 'pending', uploaded_at: new Date().toISOString() },
      }))

      setDocuments((prev) => ({ ...prev, [docType]: { file: undefined } }))
      alert('Document uploaded successfully! Awaiting verification.')
    } catch (error) {
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span>✓</span> Verified
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <span>⏳</span> Pending
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <span>✕</span> Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            <span>○</span> Not Uploaded
          </span>
        )
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20 pb-12">
        <div className="container-max">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-light mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-text-primary mb-2">Document Verification</h1>
            <p className="text-xl text-text-secondary">
              Upload and verify your identity documents to become a trusted seller
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Info Card */}
              <div className="card border-2 border-blue-200 bg-blue-50">
                <div className="flex gap-4">
                  <span className="text-4xl">🔐</span>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">Why We Need Verification</h3>
                    <p className="text-blue-700">
                      Verification builds trust in our community. Your documents are encrypted and stored securely. We
                      verify identity to prevent fraud and protect all users.
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-4">
                {DOCUMENT_TYPES.map((docType) => {
                  const isUploaded = uploadedDocuments[docType.id]
                  const currentFile = documents[docType.id]?.file

                  return (
                    <div key={docType.id} className="card space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-text-primary flex items-center gap-2">
                            {docType.label}
                            {docType.required && <span className="text-red-600">*</span>}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {docType.id === 'driver_license' &&
                              'Front and back clear photos or scan of your driver license'}
                            {docType.id === 'passport' && 'Clear photo or scan of your passport'}
                            {docType.id === 'national_id' && 'Clear photo or scan of your national ID'}
                            {docType.id === 'business_license' &&
                              'Clear photo or scan of your business license'}
                            {docType.id === 'insurance' && 'Current insurance certificate'}
                          </p>
                        </div>
                        {isUploaded && getStatusBadge(isUploaded.status)}
                      </div>

                      {!isUploaded || isUploaded.status === 'rejected' ? (
                        <div className="space-y-3">
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <input
                              type="file"
                              id={docType.id}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileChange(docType.id, file)
                              }}
                              accept="image/*,.pdf"
                              className="hidden"
                            />
                            <label htmlFor={docType.id} className="cursor-pointer block">
                              <div className="text-4xl mb-2">📄</div>
                              <p className="font-bold text-text-primary">
                                {currentFile?.name || 'Click to upload or drag and drop'}
                              </p>
                              <p className="text-sm text-text-secondary">PNG, JPG, PDF (max 10MB)</p>
                            </label>
                          </div>

                          <Button
                            onClick={() => handleUpload(docType.id)}
                            disabled={!currentFile || uploading}
                            className="w-full btn-primary"
                          >
                            {uploading ? 'Uploading...' : 'Upload Document'}
                          </Button>

                          {isUploaded?.status === 'rejected' && isUploaded.rejection_reason && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                              <p className="font-bold text-red-900">Rejection Reason:</p>
                              <p className="text-red-700">{isUploaded.rejection_reason}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">✓</span>
                            <p className="font-bold text-green-900">Document Verified</p>
                          </div>
                          <p className="text-sm text-green-700">
                            Verified on {new Date(isUploaded.verified_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column - Status & Info */}
            <div className="lg:col-span-1">
              {/* Verification Status */}
              <div className="card sticky top-24 space-y-6">
                <h2 className="text-2xl font-bold text-text-primary">Verification Status</h2>

                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-text-primary">Overall Progress</span>
                      <span className="text-sm font-bold text-rivian">40%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div className="bg-rivian h-2 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  {/* Status Items */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      <span className="text-sm text-text-primary">Driver License Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-gray-400">○</span>
                      <span className="text-sm text-text-secondary">2 more documents pending</span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="border-t border-border pt-6 space-y-3">
                  <h3 className="font-bold text-text-primary">Verified Seller Benefits</h3>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex gap-2">
                      <span>✓</span>
                      <span>Appear in featured listings</span>
                    </div>
                    <div className="flex gap-2">
                      <span>✓</span>
                      <span>Higher booking conversion</span>
                    </div>
                    <div className="flex gap-2">
                      <span>✓</span>
                      <span>Priority support</span>
                    </div>
                    <div className="flex gap-2">
                      <span>✓</span>
                      <span>Trust badge on listings</span>
                    </div>
                    <div className="flex gap-2">
                      <span>✓</span>
                      <span>Access to seller analytics</span>
                    </div>
                  </div>
                </div>

                {/* Help Section */}
                <div className="border-t border-border pt-6 space-y-3">
                  <h3 className="font-bold text-text-primary">Need Help?</h3>
                  <Button asChild variant="outline" className="w-full text-sm">
                    <Link href="/help/verification">View FAQ</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full text-sm">
                    <Link href="/support">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
