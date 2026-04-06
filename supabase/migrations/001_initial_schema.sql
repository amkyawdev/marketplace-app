-- C2C Marketplace Database Schema
-- Supabase Migration Script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom enum types
DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('open', 'pending', 'sold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    nrc_number TEXT UNIQUE NOT NULL,
    nrc_photo_url TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    gps_location GEOGRAPHY(POINT, 4326),
    kpay_no TEXT,
    wave_no TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    images TEXT[] DEFAULT '{}',
    status product_status DEFAULT 'open',
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    payment_screenshot TEXT,
    last_4_digits TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    down_payment_amount DECIMAL(12, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('nrc-photos', 'nrc-photos', false),
       ('product-images', 'product-images', true),
       ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- Row Level Security Policies

-- Profiles: Everyone can read (for verification display), users can only update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Products: Everyone can read (public marketplace), only verified users can create
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT USING (true);

CREATE POLICY "Verified users can create products" 
ON products FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_verified = true
    )
);

CREATE POLICY "Sellers can update own products" 
ON products FOR UPDATE USING (auth.uid() = seller_id);

-- Orders: Only buyer and seller can view their own orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers and sellers can view their orders" 
ON orders FOR SELECT USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id
);

CREATE POLICY "Buyers can create orders" 
ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can confirm orders" 
ON orders FOR UPDATE USING (auth.uid() = seller_id);

-- Storage Policies

-- NRC Photos: Only owner can upload/view their own
CREATE POLICY "Users can upload own NRC photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'nrc-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own NRC photos"
ON storage.objects FOR SELECT
WITH CHECK (bucket_id = 'nrc-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Product Images: Everyone can view, only verified users can upload
CREATE POLICY "Everyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Verified users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_verified = true
    )
);

-- Payment Screenshots: Only buyer can upload, only parties can view
CREATE POLICY "Buyers can upload payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Parties can view payment screenshots"
ON storage.objects FOR SELECT
WITH CHECK (
    bucket_id = 'payment-screenshots' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Helper function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_gps_location ON profiles USING GIST(gps_location);

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();