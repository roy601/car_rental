-- AutoFleet Pro: Admin RLS Policies Fix
-- Copy and run this in your Supabase SQL Editor

-- 1. Allow Admins to see all vehicles (not just active ones)
-- We use a check on the 'users' table to verify the requester's type
CREATE POLICY "Admins can view all vehicles" ON public.vehicles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.user_type = 'admin'
    )
  );

-- 2. Allow Admins to update any vehicle (needed for approval/rejection)
CREATE POLICY "Admins can update all vehicles" ON public.vehicles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.user_type = 'admin'
    )
  );

-- 3. Allow Admins to see all users (needed for management dashboard)
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.user_type = 'admin'
    )
  );

-- 4. Allow Admins to update any user (needed for seller verification)
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.user_type = 'admin'
    )
  );

-- 5. Allow Admins to delete vehicles if needed
CREATE POLICY "Admins can delete vehicles" ON public.vehicles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.user_type = 'admin'
    )
  );
