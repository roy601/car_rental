'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  useEffect(() => {
    // 1. Try to get error from search params
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (errorDescription || error) {
      setErrorMsg(errorDescription || error)
      return
    }

    // 2. Try to get error from hash fragment (Supabase often uses this)
    const hash = window.location.hash.substring(1)
    if (hash) {
      const params = new URLSearchParams(hash)
      const hashError = params.get('error')
      const hashDescription = params.get('error_description')
      const hashErrorCode = params.get('error_code')
      
      if (hashDescription || hashError) {
        setErrorMsg(decodeURIComponent(hashDescription || hashError || ''))
        setErrorCode(hashErrorCode)
      }
    }
  }, [searchParams])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-destructive">
                Authentication Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMsg ? (
                <div className="rounded-md bg-destructive/10 p-4">
                  <p className="text-sm font-medium text-destructive">
                    {errorCode ? `${errorCode}: ` : ''}{errorMsg}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred during the authentication process.
                </p>
              )}
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Common reasons for this error:
                </p>
                <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                  <li>The link in the email has already been used.</li>
                  <li>The link has expired (they are usually valid for 24 hours).</li>
                  <li>Your email provider previewed the link, which consumed the one-time token.</li>
                </ul>
              </div>

              <div className="pt-4">
                <Link 
                  href="/auth/signup"
                  className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Back to Sign Up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
