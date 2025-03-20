-- First, alter the users table to make password nullable if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'password'
  ) THEN
    ALTER TABLE public.users ALTER COLUMN password DROP NOT NULL;
  END IF;
END $$;

-- If the password column doesn't exist, add it as nullable
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'password'
  ) THEN
    ALTER TABLE public.users ADD COLUMN password TEXT;
  END IF;
END $$;

-- Make sure the users table has all required fields
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Enable realtime for users table
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
