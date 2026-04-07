# AutoFleet Pro - Database Setup Instructions

## Overview
This document provides step-by-step instructions to set up the AutoFleet Pro database schema in Supabase.

## Prerequisites
- Supabase project created and connected
- Environment variables configured (.env.local)
- Access to Supabase dashboard

## Database Schema Setup

### Step 1: Create Extensions
Copy and paste this into the Supabase SQL Editor (SQL > New Query):

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Step 2: Create Tables
Copy each of the following SQL blocks into separate queries in the Supabase SQL Editor:

#### Users Table
```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  profile_picture_url TEXT,
  user_type VARCHAR(50) NOT NULL DEFAULT 'buyer' CHECK (user_type IN ('buyer', 'seller', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Vehicles Table
```sql
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vin VARCHAR(17) UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL CHECK (category IN ('sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'minivan', 'wagon')),
  year INT NOT NULL,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  trim VARCHAR(100),
  color VARCHAR(100),
  mileage INT,
  transmission VARCHAR(50),
  engine_type VARCHAR(100),
  fuel_type VARCHAR(50),
  drivetrain VARCHAR(50),
  listing_type VARCHAR(50) NOT NULL CHECK (listing_type IN ('rent', 'sale', 'both')),
  price DECIMAL(12, 2) NOT NULL,
  daily_rental_price DECIMAL(12, 2),
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  condition VARCHAR(50) CHECK (condition IN ('excellent', 'good', 'fair', 'needs_work')),
  odometer INT,
  insurance_included BOOLEAN DEFAULT FALSE,
  with_driver BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'delisted', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  specs JSONB,
  safety_features TEXT[],
  amenities TEXT[],
  primary_image_url TEXT,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_mileage CHECK (mileage IS NULL OR mileage >= 0)
);
```

#### Bookings Table
```sql
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_type VARCHAR(50) NOT NULL CHECK (booking_type IN ('rental', 'purchase')),
  start_date DATE,
  end_date DATE,
  base_price DECIMAL(12, 2) NOT NULL,
  insurance_price DECIMAL(12, 2) DEFAULT 0,
  additional_fees DECIMAL(12, 2) DEFAULT 0,
  total_price DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'disputed')),
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT rental_dates CHECK (booking_type != 'rental' OR (start_date IS NOT NULL AND end_date IS NOT NULL AND end_date > start_date))
);
```

#### Documents Table
```sql
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL CHECK (document_type IN ('driver_license', 'passport', 'national_id', 'business_license', 'insurance')),
  document_url TEXT NOT NULL,
  document_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at DATE
);
```

#### Reviews Table
```sql
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  condition_rating INT CHECK (condition_rating IS NULL OR (condition_rating >= 1 AND condition_rating <= 5)),
  cleanliness_rating INT CHECK (cleanliness_rating IS NULL OR (cleanliness_rating >= 1 AND cleanliness_rating <= 5)),
  accuracy_rating INT CHECK (accuracy_rating IS NULL OR (accuracy_rating >= 1 AND accuracy_rating <= 5)),
  communication_rating INT CHECK (communication_rating IS NULL OR (communication_rating >= 1 AND communication_rating <= 5)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Analytics Table
```sql
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL CHECK (event_type IN ('view', 'favorite', 'inquiry', 'booking', 'purchase')),
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Favorites Table
```sql
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);
```

### Step 3: Create Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_vehicles_seller_id ON public.vehicles(seller_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_listing_type ON public.vehicles(listing_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON public.vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON public.bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_buyer_id ON public.bookings(buyer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_reviews_vehicle_id ON public.reviews(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_vehicle_id ON public.analytics(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at DESC);
```

### Step 4: Enable Row Level Security (RLS)
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
```

### Step 5: Create RLS Policies

#### Users Policies
```sql
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

#### Vehicles Policies
```sql
CREATE POLICY "Vehicles are viewable by everyone" ON public.vehicles
  FOR SELECT USING (status = 'active');

CREATE POLICY "Sellers can insert vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = seller_id);
```

#### Bookings Policies
```sql
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() IN (SELECT seller_id FROM public.vehicles WHERE id = vehicle_id));

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);
```

#### Documents Policies
```sql
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Favorites Policies
```sql
CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);
```

#### Analytics Policies
```sql
CREATE POLICY "Anyone can create analytics" ON public.analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Analytics are private" ON public.analytics
  FOR SELECT USING (false);
```

### Step 6: Create Auto-create User Profile Trigger

This trigger automatically creates a user profile when someone signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, user_type, is_verified, verification_status)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'user_type', 'buyer'),
    false,
    'pending'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## n8n Webhook Configuration

### Vehicle Spec Auto-Fetch Webhook Handler

Create an n8n workflow with the following setup:

**Webhook Trigger:**
- Method: POST
- Path: `/autofleet/fetch-vehicle-specs`

**Input:**
```json
{
  "vin": "1HGBH41JXMN109186",
  "make": "Honda",
  "model": "Accord",
  "year": 2012
}
```

**Processing Steps:**
1. **VIN Lookup (NHTSA API):**
   - Endpoint: `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{vin}?format=json`
   - Extract: engine_type, transmission, drivetrain, fuel_type

2. **Image Search (Unsplash API):**
   - Query: `{year} {make} {model} car`
   - Extract: 5-10 high-quality images

3. **Pricing Data (SerpAPI):**
   - Search: `{year} {make} {model} car value price`
   - Extract: average market price, listing examples

**Output Response:**
```json
{
  "success": true,
  "data": {
    "specs": {
      "engine_type": "V6 3.5L",
      "transmission": "Automatic 6-speed",
      "drivetrain": "FWD",
      "fuel_type": "Regular Unleaded"
    },
    "images": ["url1", "url2", ...],
    "estimated_value": 18500,
    "market_comparables": [...]
  }
}
```

**Fallback Response (when APIs fail):**
```json
{
  "success": true,
  "data": {
    "specs": {
      "engine_type": "Unknown",
      "transmission": "Unknown",
      "drivetrain": "Unknown",
      "fuel_type": "Unknown"
    },
    "images": [],
    "estimated_value": null,
    "market_comparables": []
  }
}
```

## Testing the Setup

1. **Test User Creation:** Sign up at `/auth/signup`
2. **Verify Email:** Check email for verification link
3. **Login:** Use credentials at `/auth/login`
4. **Check Database:** View your user profile in Supabase dashboard

## Troubleshooting

**RLS Errors:** If you see "new row violates row-level security policy", ensure:
- User is authenticated
- User ID matches the row's user_id field
- Policies are correctly configured

**Missing Tables:** If tables don't exist:
- Check Supabase SQL editor history for errors
- Verify schema is in "public" schema
- Ensure no typos in table names

**Webhook Issues:** If n8n webhook isn't firing:
- Verify endpoint URL is correct
- Check n8n execution logs
- Ensure API keys are valid (NHTSA is free, Unsplash/SerpAPI need keys)
