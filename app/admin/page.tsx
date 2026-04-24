'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  Edit2, 
  Users, 
  LayoutDashboard, 
  Image as ImageIcon, 
  TrendingUp, 
  Car,
  Search,
  Save
} from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  email: string
  full_name: string
  user_type: 'buyer' | 'seller' | 'admin'
  verification_status: 'pending' | 'approved' | 'rejected'
  is_verified: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [heroUrl, setHeroUrl] = useState('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80')
  
  const supabase = createClient()

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      toast.error('Failed to fetch users: ' + error.message)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
    // Load hero image from localStorage for demo persistence, or fetch from DB if table exists
    const savedHero = localStorage.getItem('admin_hero_url')
    if (savedHero) setHeroUrl(savedHero)
  }, [])

  const handleStatusUpdate = async (userId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('users')
      .update({ 
        verification_status: status,
        is_verified: status === 'approved'
      })
      .eq('id', userId)

    if (error) {
      toast.error('Update failed: ' + error.message)
    } else {
      toast.success(`User ${status} successfully`)
      fetchUsers()
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setUpdateLoading(true)
    const { error } = await supabase
      .from('users')
      .update({
        full_name: editingUser.full_name,
        user_type: editingUser.user_type,
        verification_status: editingUser.verification_status,
        is_verified: editingUser.verification_status === 'approved'
      })
      .eq('id', editingUser.id)

    if (error) {
      toast.error('Update failed: ' + error.message)
    } else {
      toast.success('Profile updated successfully')
      setIsEditOpen(false)
      fetchUsers()
    }
    setUpdateLoading(false)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      toast.error('Delete failed: ' + error.message)
    } else {
      toast.success('User deleted from database')
      fetchUsers()
    }
  }

  const saveHeroImage = () => {
    localStorage.setItem('admin_hero_url', heroUrl)
    toast.success('Hero image updated successfully!')
    // In a real app, you would also update the 'platform_settings' table in Supabase here
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-3">Approved</Badge>
      case 'rejected': return <Badge variant="destructive" className="px-3">Rejected</Badge>
      default: return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3">Pending</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-glacier-white pt-24 pb-12">
      <div className="container-max space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-midnight">Control Panel</h1>
            <p className="text-text-secondary font-medium mt-1">Global platform oversight and management.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button onClick={fetchUsers} variant="outline" className="h-11 px-6">Refresh Data</Button>
             <Button className="btn-primary h-11 px-6">Generate Reports</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white p-1 h-auto rounded-xl border border-border shadow-sm">
            <TabsTrigger value="overview" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-rivian data-[state=active]:text-white">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-rivian data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              User Directory
            </TabsTrigger>
            <TabsTrigger value="content" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-rivian data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4 mr-2" />
              Site Content
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: '$124,500', icon: TrendingUp, color: 'text-emerald-500' },
                { label: 'Platform Users', value: users.length, icon: Users, color: 'text-rivian' },
                { label: 'Active Listings', value: '3,240', icon: Car, color: 'text-compass' },
                { label: 'Pending Reviews', value: users.filter(u => u.verification_status === 'pending').length, icon: CheckCircle, color: 'text-amber-500' },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-text-light">{stat.label}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color} transition-transform group-hover:scale-110`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black tracking-tighter text-midnight">{stat.value}</div>
                    <p className="text-xs text-emerald-500 font-bold mt-1">+12% from last month</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none shadow-xl shadow-black/5 bg-white">
               <CardHeader>
                 <CardTitle className="text-xl font-black tracking-tighter">System Activity</CardTitle>
                 <CardDescription>Real-time platform logs and events.</CardDescription>
               </CardHeader>
               <CardContent className="h-[300px] flex items-center justify-center text-text-light italic font-medium">
                  Activity graph loading...
               </CardContent>
            </Card>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
                <Search className="w-5 h-5 text-text-light" />
                <Input 
                  placeholder="Search by name or email..." 
                  className="border-none bg-transparent focus-visible:ring-0 text-base font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Card className="border-none shadow-xl shadow-black/5 bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-glacier-white">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-bold py-4">Identity</TableHead>
                      <TableHead className="font-bold py-4">Platform Role</TableHead>
                      <TableHead className="font-bold py-4">Status</TableHead>
                      <TableHead className="font-bold py-4">Joined</TableHead>
                      <TableHead className="text-right font-bold py-4 px-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-20 font-medium italic text-text-light">Fetching user records...</TableCell></TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-20 font-medium italic text-text-light">No users match your search.</TableCell></TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell className="py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-midnight leading-tight">{user.full_name || 'Anonymous User'}</span>
                              <span className="text-xs text-text-light font-medium tracking-tight mt-0.5">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize font-bold px-3 py-0.5 rounded-md border-border">
                              {user.user_type === 'seller' ? '🏷️ Seller' : '🚘 Renter'}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.verification_status)}</TableCell>
                          <TableCell className="text-text-light text-sm font-medium">
                            {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-black/5">
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[200px] p-2">
                                <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-text-light">Management</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(user.id, 'approved')} className="rounded-md">
                                  <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                                  Quick Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(user.id, 'rejected')} className="rounded-md">
                                  <XCircle className="mr-2 h-4 w-4 text-destructive" />
                                  Quick Reject
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { setEditingUser(user); setIsEditOpen(true); }} className="rounded-md">
                                  <Edit2 className="mr-2 h-4 w-4 text-rivian" />
                                  Full Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive rounded-md">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Delete Permanently
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTENT TAB */}
          <TabsContent value="content" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-xl shadow-black/5 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-black tracking-tighter">Homepage Customization</CardTitle>
                <CardDescription>Update the primary visual assets of your landing page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-sm font-bold uppercase tracking-widest text-text-light">Hero Background Image</Label>
                  <div className="aspect-video relative rounded-2xl overflow-hidden border-2 border-dashed border-border bg-glacier-white">
                    <img src={heroUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                       <p className="text-white font-bold text-sm">Visual Preview</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input 
                        value={heroUrl} 
                        onChange={(e) => setHeroUrl(e.target.value)}
                        placeholder="Enter direct image URL..." 
                        className="h-12 text-sm"
                      />
                    </div>
                    <Button onClick={saveHeroImage} className="btn-primary h-12 px-8 flex items-center gap-2">
                       <Save className="w-4 h-4" />
                       Apply Image
                    </Button>
                  </div>
                  <p className="text-xs text-text-light font-medium italic">Supports JPG, PNG, and WebP. Best results with 1920x1080 resolution.</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="border-none shadow-xl shadow-black/5 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-black tracking-tighter">Site Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-text-secondary">Maintenance Mode</span>
                       <Badge variant="outline" className="text-[10px] uppercase font-black">OFF</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-text-secondary">Signup Access</span>
                       <Badge variant="outline" className="text-[10px] uppercase font-black text-emerald-500">OPEN</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-text-secondary">Marketplace</span>
                       <Badge variant="outline" className="text-[10px] uppercase font-black text-emerald-500">LIVE</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-black/5 bg-white border-l-4 border-l-compass">
                  <CardHeader>
                    <CardTitle className="text-lg font-black tracking-tighter">Storage Note</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed">
                       Direct image URL updates are instantaneous. For file uploads, ensure your Supabase Storage bucket is set to "Public".
                    </p>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit User Sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="sm:max-w-[440px] border-l-border">
          <SheetHeader className="pb-8 border-b border-border">
            <SheetTitle className="text-2xl font-black tracking-tighter text-midnight">Edit User Profile</SheetTitle>
            <SheetDescription className="font-medium text-text-light">
              Make changes to the user's platform permissions and identity.
            </SheetDescription>
          </SheetHeader>

          {editingUser && (
            <form onSubmit={handleUpdateUser} className="space-y-8 py-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-text-light">Email Address</Label>
                <Input id="email" value={editingUser.email} disabled className="bg-glacier-white h-12 font-medium" />
                <p className="text-[9px] text-text-light uppercase font-black tracking-tight">System Unique ID: {editingUser.id}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-text-light">Full Name</Label>
                <Input 
                  id="name" 
                  value={editingUser.full_name} 
                  onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                  className="h-12 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-text-light">Platform Role</Label>
                <Select 
                  value={editingUser.user_type} 
                  onValueChange={(val: any) => setEditingUser({...editingUser, user_type: val})}
                >
                  <SelectTrigger className="h-12 font-medium">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer" className="font-medium">Buyer (Rent Only)</SelectItem>
                    <SelectItem value="seller" className="font-medium">Seller (List & Rent)</SelectItem>
                    <SelectItem value="admin" className="font-medium">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-text-light">Verification Status</Label>
                <Select 
                  value={editingUser.verification_status} 
                  onValueChange={(val: any) => setEditingUser({...editingUser, verification_status: val})}
                >
                  <SelectTrigger className="h-12 font-medium">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending" className="font-medium text-amber-600">Pending Review</SelectItem>
                    <SelectItem value="approved" className="font-medium text-emerald-600">Approved / Verified</SelectItem>
                    <SelectItem value="rejected" className="font-medium text-destructive">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <SheetFooter className="pt-8 border-t border-border">
                <Button type="submit" className="w-full btn-primary h-14 text-lg" disabled={updateLoading}>
                  {updateLoading ? 'Applying Changes...' : 'Save Profile Changes'}
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
