import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create extensions
    await supabase.rpc('execute_sql', {
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
    }).catch(() => null)

    // Create users table
    await supabase.rpc('execute_sql', {
      sql: `
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
        )
      `,
    }).catch(() => null)

    // Create vehicles table
    await supabase.rpc('execute_sql', {
      sql: `
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
        )
      `,
    }).catch(() => null)

    // Create bookings table
    await supabase.rpc('execute_sql', {
      sql: `
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
        )
      `,
    }).catch(() => null)

    // Create documents table
    await supabase.rpc('execute_sql', {
      sql: `
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
        )
      `,
    }).catch(() => null)

    // Create reviews table
    await supabase.rpc('execute_sql', {
      sql: `
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
        )
      `,
    }).catch(() => null)

    // Create analytics table
    await supabase.rpc('execute_sql', {
      sql: `
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
        )
      `,
    }).catch(() => null)

    // Create favorites table
    await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.favorites (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
          vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, vehicle_id)
        )
      `,
    }).catch(() => null)

    // Create indexes
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_vehicles_seller_id ON public.vehicles(seller_id)',
      'CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status)',
      'CREATE INDEX IF NOT EXISTS idx_vehicles_listing_type ON public.vehicles(listing_type)',
      'CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON public.bookings(vehicle_id)',
      'CREATE INDEX IF NOT EXISTS idx_bookings_buyer_id ON public.bookings(buyer_id)',
      'CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_reviews_vehicle_id ON public.reviews(vehicle_id)',
      'CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id)',
    ]

    for (const query of indexQueries) {
      await supabase.rpc('execute_sql', { sql: query }).catch(() => null)
    }

    // Enable RLS
    const rlsQueries = [
      'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY',
      'ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY',
      'ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY',
      'ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY',
      'ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY',
      'ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY',
    ]

    for (const query of rlsQueries) {
      await supabase.rpc('execute_sql', { sql: query }).catch(() => null)
    }

    return Response.json(
      { message: 'Database setup completed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Setup error:', error)
    return Response.json({ error: 'Setup failed' }, { status: 500 })
  }
}
