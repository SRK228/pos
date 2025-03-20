-- Fix permissions for auth and user creation

-- Drop the existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved auth webhook function to sync user data with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle NULL values and type conversions safely
  INSERT INTO public.users (id, email, full_name, role, tenant_id, store_id, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'tenant_id' IS NULL THEN NULL
      ELSE (NEW.raw_user_meta_data->>'tenant_id')::uuid
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'store_id' IS NULL THEN NULL
      ELSE (NEW.raw_user_meta_data->>'store_id')::uuid
    END,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    tenant_id = EXCLUDED.tenant_id,
    store_id = EXCLUDED.store_id,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error and continue without failing
  RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure RLS is enabled but with proper policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and create more permissive ones for development
DROP POLICY IF EXISTS "Users are viewable by users in the same tenant" ON users;
DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON users;
CREATE POLICY "Users are viewable by authenticated users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can be updated by themselves or admins" ON users;
CREATE POLICY "Users can be updated by themselves or admins"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR 
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can be inserted by service role" ON users;
CREATE POLICY "Users can be inserted by service role"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Fix foreign key constraints to be more lenient
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_tenant_id_fkey;
ALTER TABLE public.users ADD CONSTRAINT users_tenant_id_fkey
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL;

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_store_id_fkey;
ALTER TABLE public.users ADD CONSTRAINT users_store_id_fkey
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL;
