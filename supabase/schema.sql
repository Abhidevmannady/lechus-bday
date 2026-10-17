-- ==========================================================
-- ETERNITY — A Cinematic Birthday Experience
-- Supabase PostgreSQL Schema & Storage Configuration
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Configuration Table
CREATE TABLE IF NOT EXISTS public.site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_name TEXT NOT NULL DEFAULT 'LECHU',
    birthday_date TEXT NOT NULL DEFAULT 'Celebrate Today',
    tagline TEXT NOT NULL DEFAULT 'Every beautiful story has a person who makes it unforgettable.',
    intro_quote TEXT NOT NULL DEFAULT 'For someone who makes ordinary moments extraordinary.',
    intro_title TEXT NOT NULL DEFAULT 'A Story Called You',
    hero_headline TEXT NOT NULL DEFAULT 'Today, the world gets to celebrate you.',
    hero_subheadline TEXT NOT NULL DEFAULT 'Your smile, your little quirks, your unforgettable moments, and all the memories that make you who you are.',
    hero_image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    music_url TEXT DEFAULT '',
    music_title TEXT DEFAULT 'Cinematic Atmosphere — Celestial Peace',
    final_quote TEXT NOT NULL DEFAULT 'If there''s one thing I hope you carry with you, it''s this: you make the world a little more beautiful simply by being in it.',
    final_subtext TEXT NOT NULL DEFAULT 'Here''s to more laughter, more adventures, more memories, and a thousand little reasons to smile.',
    show_gallery BOOLEAN NOT NULL DEFAULT TRUE,
    show_videos BOOLEAN NOT NULL DEFAULT TRUE,
    show_timeline BOOLEAN NOT NULL DEFAULT TRUE,
    show_letter BOOLEAN NOT NULL DEFAULT TRUE,
    show_cake BOOLEAN NOT NULL DEFAULT TRUE,
    show_quirks BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Gallery Images Table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    date TEXT,
    location TEXT,
    personal_note TEXT,
    aspect_ratio TEXT DEFAULT 'portrait',
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Video Memories Table
CREATE TABLE IF NOT EXISTS public.video_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    poster_url TEXT,
    title TEXT NOT NULL DEFAULT '',
    caption TEXT NOT NULL DEFAULT '',
    date TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Timeline Entries Table
CREATE TABLE IF NOT EXISTS public.timeline_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    story TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    video_url TEXT,
    location TEXT,
    personal_note TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Letter Content Table
CREATE TABLE IF NOT EXISTS public.letter_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading TEXT NOT NULL DEFAULT 'One Thing I Never Want You to Forget',
    seal_text TEXT NOT NULL DEFAULT 'For Your Eyes Only',
    instruction_text TEXT NOT NULL DEFAULT 'There''s something I''d like you to read.',
    greeting TEXT NOT NULL DEFAULT 'Dearest Lechu,',
    paragraphs TEXT[] NOT NULL DEFAULT '{}',
    closing TEXT NOT NULL DEFAULT 'With warmth and gratitude,',
    signature TEXT NOT NULL DEFAULT 'Always, Someone Who Appreciates You',
    date TEXT NOT NULL DEFAULT 'On this special day',
    photo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Surprise Content Table
CREATE TABLE IF NOT EXISTS public.surprise_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wish_prompt TEXT NOT NULL DEFAULT 'Make a wish. This moment is yours.',
    cake_title TEXT NOT NULL DEFAULT 'A Wish For Your New Year',
    revealed_message TEXT NOT NULL DEFAULT 'May every wish you whisper into the universe today come back to you as joy, health, peace, and unforgettable adventures.',
    secret_title TEXT NOT NULL DEFAULT 'A Hidden Surprise Just For You',
    secret_photo_url TEXT,
    secret_video_url TEXT,
    secret_note TEXT,
    secret_wish TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Personal Quirks / Details Table
CREATE TABLE IF NOT EXISTS public.personal_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'A Special Detail',
    message TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'sparkles',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
-- Public can read content to view the cinematic gift
-- Authenticated users (the Admin) can insert, update, delete

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letter_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surprise_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;

-- 1. Read Policies (Public SELECT)
CREATE POLICY "Public can view site config" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Public can view videos" ON public.video_memories FOR SELECT USING (true);
CREATE POLICY "Public can view timeline" ON public.timeline_entries FOR SELECT USING (true);
CREATE POLICY "Public can view letter" ON public.letter_content FOR SELECT USING (true);
CREATE POLICY "Public can view surprise" ON public.surprise_content FOR SELECT USING (true);
CREATE POLICY "Public can view quirks" ON public.personal_details FOR SELECT USING (true);

-- 2. Write Policies (Authenticated Admin ALL)
CREATE POLICY "Admin manage site config" ON public.site_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage videos" ON public.video_memories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage timeline" ON public.timeline_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage letter" ON public.letter_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage surprise" ON public.surprise_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage quirks" ON public.personal_details FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================================
-- STORAGE BUCKET CONFIGURATION
-- ==========================================================
-- Insert 'eternity-media' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('eternity-media', 'eternity-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view media, authenticated admin can upload/delete
CREATE POLICY "Public Media Access" ON storage.objects
FOR SELECT USING (bucket_id = 'eternity-media');

CREATE POLICY "Admin Media Upload" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'eternity-media');

CREATE POLICY "Admin Media Update" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'eternity-media');

CREATE POLICY "Admin Media Delete" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'eternity-media');
