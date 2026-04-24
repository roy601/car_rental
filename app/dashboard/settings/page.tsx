'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  ArrowLeft,
  Save,
  Mail,
  Phone,
  Camera
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setTimeout(() => {
      setUpdating(false)
      toast.success("Profile updated successfully!")
    }, 1500)
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-glacier-white">
      <Navbar />
      
      <main className="container-max pt-32 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="space-y-1">
             <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-text-light hover:text-rivian transition-colors mb-4 group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
             </Link>
             <h1 className="text-4xl font-black tracking-tighter text-midnight">Account Settings</h1>
             <p className="text-text-secondary font-medium italic">Manage your personal information, security, and notification preferences.</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-white p-1 h-auto rounded-xl border border-border shadow-sm">
              <TabsTrigger value="profile" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-rivian data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                Profile Info
              </TabsTrigger>
              <TabsTrigger value="security" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-rivian data-[state=active]:text-white">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-rivian data-[state=active]:text-white">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* PROFILE TAB */}
            <TabsContent value="profile" className="space-y-8">
              <form onSubmit={handleUpdateProfile}>
                <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8">
                  <CardHeader className="px-0 pt-0 pb-8 border-b border-border/50 mb-8">
                     <CardTitle className="text-2xl font-black tracking-tighter">Public Profile</CardTitle>
                     <CardDescription className="font-medium text-text-light">This information will be visible on your listings.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-border/50">
                       <div className="relative group">
                          <div className="w-32 h-32 rounded-[40px] bg-glacier-white border-4 border-white shadow-xl overflow-hidden">
                             <img 
                               src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                               alt="Profile" 
                               className="w-full h-full object-cover"
                             />
                          </div>
                          <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-midnight text-white flex items-center justify-center border-4 border-white hover:bg-rivian transition-colors shadow-lg">
                             <Camera className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="space-y-1 text-center md:text-left">
                          <h4 className="text-xl font-black text-midnight">{user?.user_metadata?.full_name || 'Your Name'}</h4>
                          <p className="text-sm font-medium text-text-light">{user?.email}</p>
                          <Badge variant="outline" className="mt-2 bg-emerald-50 text-emerald-600 border-emerald-100">Verified Seller</Badge>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-text-light">Full Name</Label>
                          <div className="relative">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                             <Input 
                               defaultValue={user?.user_metadata?.full_name} 
                               className="h-14 pl-12 font-bold border-border/50" 
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-text-light">Phone Number</Label>
                          <div className="relative">
                             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                             <Input 
                               placeholder="+1 (555) 000-0000" 
                               className="h-14 pl-12 font-bold border-border/50" 
                             />
                          </div>
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-text-light">Email Address</Label>
                          <div className="relative">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                             <Input 
                               value={user?.email} 
                               disabled 
                               className="h-14 pl-12 font-bold bg-glacier-white border-border/50" 
                             />
                          </div>
                          <p className="text-[10px] font-bold text-text-light italic mt-1">To change your email, please contact support.</p>
                       </div>
                    </div>

                    <div className="flex justify-end pt-6">
                       <Button type="submit" disabled={updating} className="btn-primary h-14 px-12 flex items-center gap-2">
                          <Save className="w-5 h-5" />
                          {updating ? 'Saving...' : 'Save Profile Changes'}
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            {/* SECURITY TAB */}
            <TabsContent value="security" className="space-y-8">
               <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8">
                  <CardHeader className="px-0 pt-0 pb-8 border-b border-border/50 mb-8">
                     <CardTitle className="text-2xl font-black tracking-tighter">Login & Security</CardTitle>
                     <CardDescription className="font-medium text-text-light">Update your password and protect your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-8">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <Label className="text-xs font-black uppercase tracking-widest text-text-light">Current Password</Label>
                           <Input type="password" placeholder="••••••••" className="h-14 font-bold border-border/50" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label className="text-xs font-black uppercase tracking-widest text-text-light">New Password</Label>
                              <Input type="password" placeholder="••••••••" className="h-14 font-bold border-border/50" />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-xs font-black uppercase tracking-widest text-text-light">Confirm New Password</Label>
                              <Input type="password" placeholder="••••••••" className="h-14 font-bold border-border/50" />
                           </div>
                        </div>
                     </div>

                     <div className="p-6 rounded-2xl bg-midnight text-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              <Shield className="w-5 h-5 text-rivian" />
                           </div>
                           <div>
                              <p className="font-bold">Two-Factor Authentication</p>
                              <p className="text-xs text-white/40">Add an extra layer of security to your account.</p>
                           </div>
                        </div>
                        <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">Enable 2FA</Button>
                     </div>

                     <div className="flex justify-end pt-6">
                        <Button className="btn-primary h-14 px-12">Update Password</Button>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* NOTIFICATIONS TAB */}
            <TabsContent value="notifications" className="space-y-8">
               <Card className="border-none shadow-2xl shadow-black/5 bg-white p-8">
                  <CardHeader className="px-0 pt-0 pb-8 border-b border-border/50 mb-8">
                     <CardTitle className="text-2xl font-black tracking-tighter">Notifications</CardTitle>
                     <CardDescription className="font-medium text-text-light">Choose how and when you want to be notified.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-6">
                     {[
                        { title: 'New Booking Requests', desc: 'Get notified when someone wants to rent or buy your vehicle.' },
                        { title: 'Payment Alerts', desc: 'Receive updates on successful payments and settlements.' },
                        { title: 'System Updates', desc: 'Stay informed about platform changes and new features.' },
                        { title: 'Marketing Emails', desc: 'Periodic tips on how to increase your sales and rentals.' }
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border/50 hover:bg-glacier-white transition-colors">
                           <div>
                              <p className="font-bold text-midnight">{item.title}</p>
                              <p className="text-xs text-text-light font-medium">{item.desc}</p>
                           </div>
                           <div className="w-12 h-6 bg-rivian rounded-full relative cursor-pointer">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                           </div>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
