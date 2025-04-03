-- Ensure the users table exists with proper structure
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  tenant_id UUID,
  store_id UUID,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  phone TEXT,
  job_title TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  password TEXT
);

-- Disable RLS for development
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Add the users table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
