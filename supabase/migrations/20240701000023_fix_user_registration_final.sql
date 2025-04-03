-- Make sure the full_name column is nullable
ALTER TABLE IF EXISTS public.users ALTER COLUMN full_name DROP NOT NULL;

-- Add realtime publication for users table
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
