-- Ensure tenants table exists with proper structure
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT UNIQUE,
  primary_color TEXT DEFAULT '#db2777',
  secondary_color TEXT DEFAULT '#f472b6',
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure stores table exists with proper structure
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure users table has tenant_id and store_id columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);

-- Enable realtime for these tables
alter publication supabase_realtime add table tenants;
alter publication supabase_realtime add table stores;
alter publication supabase_realtime add table users;

-- Create RLS policies for tenants
DROP POLICY IF EXISTS "Tenants are viewable by users who belong to the tenant" ON tenants;
CREATE POLICY "Tenants are viewable by users who belong to the tenant"
  ON tenants FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM users WHERE tenant_id = tenants.id
  ));

-- Create RLS policies for stores
DROP POLICY IF EXISTS "Stores are viewable by users who belong to the tenant" ON stores;
CREATE POLICY "Stores are viewable by users who belong to the tenant"
  ON stores FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Enable RLS on these tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
