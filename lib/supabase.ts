import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
  Database Schema (to be created in Supabase):

  -- AI Tools Directory
  CREATE TABLE tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    rating NUMERIC(2,1),
    badge TEXT,
    color TEXT,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Curated Prompts
  CREATE TABLE prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    uses INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Podcast Episodes
  CREATE TABLE episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    date DATE,
    featured BOOLEAN DEFAULT FALSE,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Newsletter / Contact Submissions
  CREATE TABLE submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT,
    bio TEXT,
    type TEXT DEFAULT 'guest', -- 'guest' | 'contact'
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
*/
