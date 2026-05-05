-- Create the platform settings table
CREATE TABLE public.platform_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  setting_key character varying NOT NULL UNIQUE,
  setting_value text NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT platform_settings_pkey PRIMARY KEY (id)
);

-- Insert the default hero image
INSERT INTO public.platform_settings (setting_key, setting_value)
VALUES ('hero_image_url', '/images/hero-car.jpg')
ON CONFLICT (setting_key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access so the homepage can load the image
CREATE POLICY "Allow public read access" 
ON public.platform_settings FOR SELECT 
USING (true);

-- Allow authenticated users to update settings (we will enforce admin check in the frontend/backend)
CREATE POLICY "Allow authenticated updates" 
ON public.platform_settings FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated inserts" 
ON public.platform_settings FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
