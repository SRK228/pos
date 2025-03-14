-- Add multi-tenant support to the database schema

-- Create organizations table to store client information
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#db2777',
  secondary_color TEXT DEFAULT '#f472b6',
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  phone TEXT,
  email TEXT,
  website TEXT,
  tax_id TEXT,
  currency TEXT DEFAULT 'INR',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  is_active BOOLEAN DEFAULT TRUE,
  subscription_plan TEXT DEFAULT 'basic',
  subscription_status TEXT DEFAULT 'active',
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add organization_id to all existing tables
ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE categories ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE products ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE customers ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE vendors ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE orders ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE inventory_transactions ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE purchase_orders ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE bills ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE payments ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE reports ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE scheduled_reports ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE report_history ADD COLUMN organization_id UUID REFERENCES organizations(id);

-- Create indexes for organization_id on all tables
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_categories_organization_id ON categories(organization_id);
CREATE INDEX idx_products_organization_id ON products(organization_id);
CREATE INDEX idx_customers_organization_id ON customers(organization_id);
CREATE INDEX idx_vendors_organization_id ON vendors(organization_id);
CREATE INDEX idx_orders_organization_id ON orders(organization_id);
CREATE INDEX idx_inventory_transactions_organization_id ON inventory_transactions(organization_id);
CREATE INDEX idx_purchase_orders_organization_id ON purchase_orders(organization_id);
CREATE INDEX idx_bills_organization_id ON bills(organization_id);
CREATE INDEX idx_payments_organization_id ON payments(organization_id);
CREATE INDEX idx_reports_organization_id ON reports(organization_id);
CREATE INDEX idx_scheduled_reports_organization_id ON scheduled_reports(organization_id);
CREATE INDEX idx_report_history_organization_id ON report_history(organization_id);

-- Create organization_settings table for additional customization
CREATE TABLE organization_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, setting_key)
);

-- Create subscription_plans table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2) NOT NULL,
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_transactions table
CREATE TABLE subscription_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table for organizations with multiple locations
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  phone TEXT,
  email TEXT,
  manager_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Add store_id to relevant tables
ALTER TABLE users ADD COLUMN store_id UUID REFERENCES stores(id);
ALTER TABLE orders ADD COLUMN store_id UUID REFERENCES stores(id);
ALTER TABLE inventory_transactions ADD COLUMN store_id UUID REFERENCES stores(id);
ALTER TABLE purchase_orders ADD COLUMN store_id UUID REFERENCES stores(id);

-- Create indexes for store_id
CREATE INDEX idx_users_store_id ON users(store_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_inventory_transactions_store_id ON inventory_transactions(store_id);
CREATE INDEX idx_purchase_orders_store_id ON purchase_orders(store_id);

-- Create product_inventory table to track inventory by store
CREATE TABLE product_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  store_id UUID REFERENCES stores(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, product_id)
);

-- Create audit_logs table for tracking changes
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update organization_id in related tables
CREATE OR REPLACE FUNCTION set_organization_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.organization_id := (SELECT organization_id FROM users WHERE id = NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically set organization_id
CREATE TRIGGER set_order_organization_id
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.organization_id IS NULL AND NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION set_organization_id();

CREATE TRIGGER set_purchase_order_organization_id
  BEFORE INSERT ON purchase_orders
  FOR EACH ROW
  WHEN (NEW.organization_id IS NULL AND NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION set_organization_id();

-- Create function to update store_id in related tables
CREATE OR REPLACE FUNCTION set_store_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.store_id := (SELECT store_id FROM users WHERE id = NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically set store_id
CREATE TRIGGER set_order_store_id
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.store_id IS NULL AND NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION set_store_id();

CREATE TRIGGER set_purchase_order_store_id
  BEFORE INSERT ON purchase_orders
  FOR EACH ROW
  WHEN (NEW.store_id IS NULL AND NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION set_store_id();

-- Create RLS policies for multi-tenant security
-- Users can only see data from their organization
CREATE POLICY "Users can only view their organization's data" ON users
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON categories
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON products
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON customers
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON vendors
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON orders
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON inventory_transactions
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON purchase_orders
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON bills
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON payments
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON reports
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON scheduled_reports
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON report_history
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON stores
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON product_inventory
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON organization_settings
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

CREATE POLICY "Users can only view their organization's data" ON audit_logs
  FOR ALL USING (organization_id = auth.jwt() -> 'organization_id');

-- Insert Meera as the first organization
INSERT INTO organizations (name, slug, primary_color, secondary_color, currency, subscription_plan, subscription_status)
VALUES ('Meera Maternity & Fertility Store', 'meera', '#db2777', '#f472b6', 'INR', 'premium', 'active');

-- Update existing data to associate with Meera organization
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE categories SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE products SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE customers SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE vendors SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE orders SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE inventory_transactions SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE purchase_orders SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE bills SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE payments SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');
UPDATE reports SET organization_id = (SELECT id FROM organizations WHERE slug = 'meera');

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features)
VALUES 
('basic', 'Basic plan for small businesses', 999, 9990, '{"max_products": 100, "max_users": 3, "max_stores": 1, "features": ["inventory", "pos", "basic_reports"]}'),
('standard', 'Standard plan for growing businesses', 1999, 19990, '{"max_products": 500, "max_users": 10, "max_stores": 3, "features": ["inventory", "pos", "advanced_reports", "multi_store", "customer_management"]}'),
('premium', 'Premium plan for established businesses', 3999, 39990, '{"max_products": -1, "max_users": -1, "max_stores": -1, "features": ["inventory", "pos", "advanced_reports", "multi_store", "customer_management", "analytics", "api_access", "priority_support"]}');

-- Create main store for Meera
INSERT INTO stores (organization_id, name, code, address, city, state, country)
VALUES ((SELECT id FROM organizations WHERE slug = 'meera'), 'Meera Main Store', 'MAIN', '123 Main Street', 'Chennai', 'Tamil Nadu', 'India');

-- Update users to associate with the main store
UPDATE users SET store_id = (SELECT id FROM stores WHERE code = 'MAIN' AND organization_id = (SELECT id FROM organizations WHERE slug = 'meera'));

-- Create function to generate audit logs
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
DECLARE
  organization_id_val UUID;
  user_id_val UUID;
  action_val TEXT;
  old_row JSONB := '{}'::JSONB;
  new_row JSONB := '{}'::JSONB;
BEGIN
  -- Determine the action
  IF (TG_OP = 'INSERT') THEN
    action_val := 'INSERT';
    new_row := to_jsonb(NEW);
    -- Get organization_id from the new row
    organization_id_val := NEW.organization_id;
  ELSIF (TG_OP = 'UPDATE') THEN
    action_val := 'UPDATE';
    old_row := to_jsonb(OLD);
    new_row := to_jsonb(NEW);
    -- Get organization_id from the new row
    organization_id_val := NEW.organization_id;
  ELSIF (TG_OP = 'DELETE') THEN
    action_val := 'DELETE';
    old_row := to_jsonb(OLD);
    -- Get organization_id from the old row
    organization_id_val := OLD.organization_id;
  END IF;

  -- Get current user ID from session
  user_id_val := auth.uid();

  -- Insert audit log
  INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    organization_id_val,
    user_id_val,
    action_val,
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    old_row,
    new_row,
    current_setting('request.headers', true)::json->>'x-forwarded-for'
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit log trigger to important tables
CREATE TRIGGER audit_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_products_changes
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_orders_changes
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_purchase_orders_changes
  AFTER INSERT OR UPDATE OR DELETE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE organizations;
ALTER PUBLICATION supabase_realtime ADD TABLE organization_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE subscription_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE subscription_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE stores;
ALTER PUBLICATION supabase_realtime ADD TABLE product_inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
