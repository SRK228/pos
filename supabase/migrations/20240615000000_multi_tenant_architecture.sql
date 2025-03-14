-- Create tenants table to store organization information
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#db2777',
  secondary_color TEXT DEFAULT '#f472b6',
  subscription_plan TEXT DEFAULT 'basic',
  subscription_status TEXT DEFAULT 'active',
  max_users INTEGER DEFAULT 5,
  max_stores INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create stores table with tenant relationship
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(tenant_id, code)
);

-- Add tenant_id to all existing tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE bills ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Create unique constraints for tenant data isolation
ALTER TABLE categories ADD CONSTRAINT categories_tenant_name_key UNIQUE (tenant_id, name);
ALTER TABLE products ADD CONSTRAINT products_tenant_sku_key UNIQUE (tenant_id, sku);
ALTER TABLE customers ADD CONSTRAINT customers_tenant_email_key UNIQUE (tenant_id, email);
ALTER TABLE vendors ADD CONSTRAINT vendors_tenant_name_key UNIQUE (tenant_id, name);

-- Create Row Level Security (RLS) policies for tenant isolation
-- Users table RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_tenant_isolation ON users;
CREATE POLICY users_tenant_isolation ON users
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Categories table RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS categories_tenant_isolation ON categories;
CREATE POLICY categories_tenant_isolation ON categories
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Products table RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS products_tenant_isolation ON products;
CREATE POLICY products_tenant_isolation ON products
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Customers table RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS customers_tenant_isolation ON customers;
CREATE POLICY customers_tenant_isolation ON customers
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Vendors table RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vendors_tenant_isolation ON vendors;
CREATE POLICY vendors_tenant_isolation ON vendors
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Orders table RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS orders_tenant_isolation ON orders;
CREATE POLICY orders_tenant_isolation ON orders
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Bills table RLS
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bills_tenant_isolation ON bills;
CREATE POLICY bills_tenant_isolation ON bills
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Purchase Orders table RLS
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS purchase_orders_tenant_isolation ON purchase_orders;
CREATE POLICY purchase_orders_tenant_isolation ON purchase_orders
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Reports table RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS reports_tenant_isolation ON reports;
CREATE POLICY reports_tenant_isolation ON reports
  USING (tenant_id = auth.jwt() -> 'tenant_id');

-- Create tenant-specific roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff', 'cashier', 'readonly');
ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'staff';

-- Create function to get current tenant ID
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (auth.jwt() -> 'tenant_id')::UUID;
END;
$$;

-- Create function to check if user has admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (auth.jwt() -> 'role')::TEXT = 'admin';
END;
$$;

-- Add realtime publication for multi-tenant tables
alter publication supabase_realtime add table tenants;
alter publication supabase_realtime add table stores;
