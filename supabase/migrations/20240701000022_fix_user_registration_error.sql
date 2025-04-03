-- Make sure the users table exists with proper constraints
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT,
  tenant_id UUID,
  store_id UUID,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  phone TEXT,
  job_title TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create or replace the function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, tenant_id, store_id, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    (NEW.raw_user_meta_data->>'tenant_id')::uuid,
    (NEW.raw_user_meta_data->>'store_id')::uuid,
    COALESCE((NEW.raw_user_meta_data->>'is_active')::boolean, true)
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    tenant_id = EXCLUDED.tenant_id,
    store_id = EXCLUDED.store_id,
    is_active = EXCLUDED.is_active,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for the users table
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Add RLS policies for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
DROP POLICY IF EXISTS "Users can view their own user data." ON public.users;
CREATE POLICY "Users can view their own user data."
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own data
DROP POLICY IF EXISTS "Users can update their own user data." ON public.users;
CREATE POLICY "Users can update their own user data."
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- Allow service role to manage all users
DROP POLICY IF EXISTS "Service role can do all." ON public.users;
CREATE POLICY "Service role can do all."
ON public.users
USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
