-- Run this SQL in your Supabase SQL Editor
-- Sets up the reviews table with the right columns

-- Add columns if they don't exist
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS reviewer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS rating integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS comment text,
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews
CREATE POLICY "Allow public read" ON public.reviews
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own reviews
CREATE POLICY "Allow authenticated insert" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
