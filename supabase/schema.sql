-- CampusLink Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT CHECK (char_length(bio) <= 160),
  university TEXT NOT NULL,
  faculty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  content TEXT CHECK (char_length(content) <= 280),
  image_url TEXT,
  post_type TEXT NOT NULL CHECK (post_type IN ('text', 'image')),
  university TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes table
CREATE TABLE IF NOT EXISTS public.likes (
  post_id UUID REFERENCES public.posts ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

-- Followers table
CREATE TABLE IF NOT EXISTS public.followers (
  follower_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- Marketplace listings table
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  description TEXT CHECK (char_length(description) <= 1000),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('books', 'electronics', 'services', 'housing', 'other')),
  university TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing favorites table
CREATE TABLE IF NOT EXISTS public.listing_favorites (
  listing_id UUID REFERENCES public.marketplace_listings ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  PRIMARY KEY (listing_id, user_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('follow', 'like', 'comment', 'marketplace')),
  actor_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts ON DELETE CASCADE,
  listing_id UUID REFERENCES public.marketplace_listings ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_university ON public.posts(university);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_followers_following ON public.followers(following_id);
CREATE INDEX IF NOT EXISTS idx_listings_university ON public.marketplace_listings(university);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Safety checks for policy creation
DO $$ 
BEGIN
    -- Profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Profiles are viewable by everyone') THEN
        CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;

    -- Posts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Posts are viewable by campus members') THEN
        CREATE POLICY "Posts are viewable by campus members" ON public.posts FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create posts') THEN
        CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Notifications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own notifications') THEN
        CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true), ('posts', 'posts', true), ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Upload') THEN
        CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
    END IF;
END $$;

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username, university)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', 'user' || SUBSTRING(NEW.id::text, 1, 8)), ' ', '')),
    COALESCE(NEW.raw_user_meta_data->>'university', 'Unknown University')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
