-- Add is_active column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_active') THEN
    ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Create index on is_active column for better query performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_is_active') THEN
    CREATE INDEX idx_users_is_active ON public.users(is_active);
  END IF;
END $$;
