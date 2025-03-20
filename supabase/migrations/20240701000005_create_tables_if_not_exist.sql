-- Create tenants table if it doesn't exist
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  primary_color TEXT,
  secondary_color TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table if it doesn't exist
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to users table if they don't exist
DO $$ 
BEGIN
    -- Check if tenant_id column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tenant_id') THEN
        ALTER TABLE users ADD COLUMN tenant_id UUID;
    END IF;
    
    -- Check if store_id column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'store_id') THEN
        ALTER TABLE users ADD COLUMN store_id UUID;
    END IF;
    
    -- Check if is_active column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Add foreign key constraints if tables exist
DO $$
BEGIN
    -- Check if both tables exist before adding foreign key constraints
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') AND 
       EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tenants') THEN
        -- Check if the constraint doesn't already exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                      WHERE constraint_name = 'users_tenant_id_fkey' AND table_name = 'users') THEN
            ALTER TABLE users ADD CONSTRAINT users_tenant_id_fkey 
            FOREIGN KEY (tenant_id) REFERENCES tenants(id);
        END IF;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') AND 
       EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stores') THEN
        -- Check if the constraint doesn't already exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                      WHERE constraint_name = 'users_store_id_fkey' AND table_name = 'users') THEN
            ALTER TABLE users ADD CONSTRAINT users_store_id_fkey 
            FOREIGN KEY (store_id) REFERENCES stores(id);
        END IF;
    END IF;
END $$;
