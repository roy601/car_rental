import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We sent you a link to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your email inbox and click the verification link to complete your account setup. The link will expire in 24 hours.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder.
              </p>
              <Button asChild className="w-full btn-primary">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
