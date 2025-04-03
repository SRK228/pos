-- Fix the full_name not-null constraint issue in users table
ALTER TABLE public.users ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN full_name SET DEFAULT '';

-- Update any existing null values
UPDATE public.users SET full_name = '' WHERE full_name IS NULL;

-- Add a trigger to ensure full_name is never null
CREATE OR REPLACE FUNCTION public.ensure_full_name_not_null()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.full_name IS NULL THEN
    NEW.full_name := '';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_full_name_not_null_trigger ON public.users;
CREATE TRIGGER ensure_full_name_not_null_trigger
BEFORE INSERT OR UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.ensure_full_name_not_null();
