-- FreePremium Supabase Schema
-- Run this entire script in the Supabase SQL Editor

-- 1. Create Videos Table
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  categories TEXT[] DEFAULT '{}',
  duration TEXT DEFAULT '0:00',
  views TEXT DEFAULT '0 views',
  thumbnail TEXT NOT NULL,
  creator TEXT DEFAULT 'Unknown',
  "embedUrl" TEXT DEFAULT '',
  date TEXT,
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Premium Items Table
CREATE TABLE IF NOT EXISTS public.premium_items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  thumbnail TEXT NOT NULL,
  description TEXT DEFAULT '',
  "downloadUrl" TEXT DEFAULT '',
  categories TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_items ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Videos
-- Allow anyone to read videos (Public access)
CREATE POLICY "Allow public read access for videos" 
ON public.videos FOR SELECT USING (true);

-- Allow inserts (For now, since we use anon key on frontend admin panel, we must allow anon inserts. In a real prod environment, you would use authentication.)
CREATE POLICY "Allow anon insert for videos" 
ON public.videos FOR INSERT WITH CHECK (true);

-- Allow deletes
CREATE POLICY "Allow anon delete for videos" 
ON public.videos FOR DELETE USING (true);

-- 5. Create Policies for Premium Items
-- Allow anyone to read premium items
CREATE POLICY "Allow public read access for premium_items" 
ON public.premium_items FOR SELECT USING (true);

-- Allow inserts
CREATE POLICY "Allow anon insert for premium_items" 
ON public.premium_items FOR INSERT WITH CHECK (true);

-- Allow deletes
CREATE POLICY "Allow anon delete for premium_items" 
ON public.premium_items FOR DELETE USING (true);

-- 6. Create Site Settings Table (For SEO Keywords & Categories)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for site_settings" 
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Allow anon insert for site_settings" 
ON public.site_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon update for site_settings" 
ON public.site_settings FOR UPDATE USING (true);
