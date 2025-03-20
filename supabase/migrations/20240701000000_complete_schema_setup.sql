-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tenants table if not exists
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#db2777',
  secondary_color TEXT NOT NULL DEFAULT '#f472b6',
  subscription_plan TEXT NOT NULL DEFAULT 'basic',
  subscription_status TEXT NOT NULL DEFAULT 'active',
  max_users INTEGER NOT NULL DEFAULT 5,
  max_stores INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create stores table if not exists
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  store_id UUID REFERENCES stores(id),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table if not exists
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  price NUMERIC(10, 2) NOT NULL,
  cost_price NUMERIC(10, 2) NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 5,
  image_url TEXT,
  barcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, sku)
);

-- Create customers table if not exists
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table if not exists
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  pan TEXT,
  is_msme BOOLEAN DEFAULT FALSE,
  currency TEXT DEFAULT 'INR',
  payment_terms TEXT DEFAULT 'Net 30',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table if not exists
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  order_number TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id),
  user_id UUID REFERENCES users(id),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10, 2) NOT NULL,
  tax_amount NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  delivery_method TEXT,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, order_number)
);

-- Create order_items table if not exists
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_orders table if not exists
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  po_number TEXT NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  user_id UUID REFERENCES users(id),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal NUMERIC(10, 2) NOT NULL,
  tax_amount NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, po_number)
);

-- Create purchase_order_items table if not exists
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bills table if not exists
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  bill_number TEXT NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  bill_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10, 2) NOT NULL,
  tax_amount NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, bill_number)
);

-- Create bill_items table if not exists
CREATE TABLE IF NOT EXISTS bill_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID NOT NULL REFERENCES bills(id),
  product_id UUID REFERENCES products(id),
  account TEXT NOT NULL DEFAULT 'inventory',
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table if not exists
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  payment_number TEXT NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  bill_id UUID REFERENCES bills(id),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  amount NUMERIC(10, 2) NOT NULL,
  payment_mode TEXT NOT NULL,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, payment_number)
);

-- Create inventory_transactions table if not exists
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  product_id UUID REFERENCES products(id),
  transaction_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table if not exists
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL,
  fields JSONB NOT NULL,
  filters JSONB,
  sorting JSONB,
  is_custom BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_reports table if not exists
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  report_id UUID NOT NULL REFERENCES reports(id),
  frequency TEXT NOT NULL,
  day_of_week INTEGER,
  day_of_month INTEGER,
  time_of_day TEXT,
  recipients JSONB,
  format TEXT NOT NULL DEFAULT 'pdf',
  is_active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create report_history table if not exists
CREATE TABLE IF NOT EXISTS report_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  report_id UUID NOT NULL REFERENCES reports(id),
  user_id UUID REFERENCES users(id),
  parameters JSONB,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create views for analytics

-- Sales by product view
CREATE OR REPLACE VIEW sales_by_product AS
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  p.sku,
  c.name AS category_name,
  SUM(oi.quantity) AS total_quantity_sold,
  SUM(oi.total_price) AS total_revenue,
  COUNT(DISTINCT o.id) AS order_count,
  p.tenant_id
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
LEFT JOIN categories c ON p.category_id = c.id
GROUP BY p.id, p.name, p.sku, c.name, p.tenant_id;

-- Sales by category view
CREATE OR REPLACE VIEW sales_by_category AS
SELECT 
  c.id AS category_id,
  c.name AS category_name,
  SUM(oi.quantity) AS total_quantity_sold,
  SUM(oi.total_price) AS total_revenue,
  COUNT(DISTINCT p.id) AS product_count,
  c.tenant_id
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
GROUP BY c.id, c.name, c.tenant_id;

-- Inventory summary view
CREATE OR REPLACE VIEW inventory_summary AS
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  p.sku,
  c.name AS category_name,
  p.current_stock,
  p.reorder_level,
  p.price,
  p.cost_price,
  (p.current_stock * p.cost_price) AS inventory_value,
  CASE 
    WHEN p.current_stock <= 0 THEN 'Out of Stock'
    WHEN p.current_stock <= p.reorder_level THEN 'Low Stock'
    ELSE 'In Stock'
  END AS stock_status,
  p.tenant_id
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Vendor payment summary view
CREATE OR REPLACE VIEW vendor_payment_summary AS
SELECT 
  v.id AS vendor_id,
  v.name AS vendor_name,
  COUNT(DISTINCT b.id) AS bill_count,
  COALESCE(SUM(b.total_amount), 0) AS total_billed,
  COALESCE(SUM(p.amount), 0) AS total_paid,
  COALESCE(SUM(b.total_amount), 0) - COALESCE(SUM(p.amount), 0) AS total_outstanding,
  v.tenant_id
FROM vendors v
LEFT JOIN bills b ON v.id = b.vendor_id
LEFT JOIN payments p ON b.id = p.bill_id
GROUP BY v.id, v.name, v.tenant_id;

-- Create functions for analytics

-- Function to get sales summary
CREATE OR REPLACE FUNCTION get_sales_summary(p_tenant_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_sales', COALESCE(SUM(total_amount), 0),
    'order_count', COUNT(*),
    'average_order_value', CASE WHEN COUNT(*) > 0 THEN COALESCE(SUM(total_amount), 0) / COUNT(*) ELSE 0 END
  ) INTO result
  FROM orders
  WHERE tenant_id = p_tenant_id AND status != 'cancelled';
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get inventory summary
CREATE OR REPLACE FUNCTION get_inventory_summary(p_tenant_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_products', COUNT(*),
    'total_stock', COALESCE(SUM(current_stock), 0),
    'inventory_value', COALESCE(SUM(current_stock * cost_price), 0),
    'low_stock_count', COUNT(*) FILTER (WHERE current_stock <= reorder_level)
  ) INTO result
  FROM products
  WHERE tenant_id = p_tenant_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_history ENABLE ROW LEVEL SECURITY;

-- Create policies for each table

-- Tenants policies
CREATE POLICY "Users can view their own tenant" ON tenants
  FOR SELECT USING (id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Stores policies
CREATE POLICY "Users can view stores in their tenant" ON stores
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Users policies
CREATE POLICY "Users can view users in their tenant" ON users
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Categories policies
CREATE POLICY "Users can view categories in their tenant" ON categories
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Products policies
CREATE POLICY "Users can view products in their tenant" ON products
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Customers policies
CREATE POLICY "Users can view customers in their tenant" ON customers
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Vendors policies
CREATE POLICY "Users can view vendors in their tenant" ON vendors
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Orders policies
CREATE POLICY "Users can view orders in their tenant" ON orders
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Order items policies
CREATE POLICY "Users can view order items for orders in their tenant" ON order_items
  FOR SELECT USING (order_id IN (
    SELECT id FROM orders WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  ));

-- Purchase orders policies
CREATE POLICY "Users can view purchase orders in their tenant" ON purchase_orders
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Purchase order items policies
CREATE POLICY "Users can view purchase order items for purchase orders in their tenant" ON purchase_order_items
  FOR SELECT USING (purchase_order_id IN (
    SELECT id FROM purchase_orders WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  ));

-- Bills policies
CREATE POLICY "Users can view bills in their tenant" ON bills
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Bill items policies
CREATE POLICY "Users can view bill items for bills in their tenant" ON bill_items
  FOR SELECT USING (bill_id IN (
    SELECT id FROM bills WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE id = auth.uid()
    )
  ));

-- Payments policies
CREATE POLICY "Users can view payments in their tenant" ON payments
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Inventory transactions policies
CREATE POLICY "Users can view inventory transactions in their tenant" ON inventory_transactions
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Reports policies
CREATE POLICY "Users can view reports in their tenant" ON reports
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Scheduled reports policies
CREATE POLICY "Users can view scheduled reports in their tenant" ON scheduled_reports
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Report history policies
CREATE POLICY "Users can view report history in their tenant" ON report_history
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_transactions;

-- Seed default tenant and store
INSERT INTO tenants (id, name, slug, primary_color, secondary_color)
VALUES ('00000000-0000-0000-0000-000000000001', 'Meera Maternity & Fertility Store', 'meera', '#db2777', '#f472b6')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO stores (id, tenant_id, name, code, country)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Main Store', 'STORE01', 'India')
ON CONFLICT (id) DO NOTHING;

-- Seed default categories
INSERT INTO categories (tenant_id, name, description)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Toys', 'Baby and children toys'),
('00000000-0000-0000-0000-000000000001', 'Clothes', 'Baby and maternity clothing'),
('00000000-0000-0000-0000-000000000001', 'Essentials', 'Baby care essentials')
ON CONFLICT DO NOTHING;

-- Seed sample products
INSERT INTO products (tenant_id, sku, name, description, category_id, price, cost_price, current_stock, reorder_level, image_url)
VALUES 
('00000000-0000-0000-0000-000000000001', 'TOY-001', 'Soft Teddy Bear', 'Cuddly soft teddy bear for babies', (SELECT id FROM categories WHERE name = 'Toys' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), 899, 550, 25, 10, '/products/teddy-bear.jpg'),
('00000000-0000-0000-0000-000000000001', 'TOY-002', 'Building Blocks', 'Educational building blocks set', (SELECT id FROM categories WHERE name = 'Toys' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), 1299, 800, 15, 5, '/products/building-blocks.jpg'),
('00000000-0000-0000-0000-000000000001', 'TOY-003', 'Art Set', 'Creative art set for kids', (SELECT id FROM categories WHERE name = 'Toys' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), 599, 350, 20, 8, '/products/art-set.jpg'),
('00000000-0000-0000-0000-000000000001', 'CLO-001', 'Baby Onesie', 'Comfortable cotton onesie', (SELECT id FROM categories WHERE name = 'Clothes' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), 499, 300, 30, 10, '/products/baby-onesie.jpg'),
('00000000-0000-0000-0000-000000000001', 'CLO-002', 'Kids T-Shirt', 'Colorful kids t-shirt', (SELECT id FROM categories WHERE name = 'Clothes' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), 399, 250, 20, 8, '/products/kids-tshirt.jpg'),
('00000000-0000-0000-0000-000000000001', 'CLO-003', 'Baby Shoes', 'Soft sole baby shoes', (SELECT id FROM categories WHERE name = 'Clothes' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), 699, 450, 12, 5, '/products/baby-shoes.jpg'),
('00000000-0000-0000-0000-000000000001', 'ESS-001', 'Baby Wipes', 'Gentle baby wipes pack', (SELECT id FROM categories WHERE name = 'Essentials' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), 199, 120, 50, 20, '/products/baby-wipes.jpg'),
('00000000-0000-0000-0000-000000000001', 'ESS-002', 'Diapers Pack', 'Premium baby diapers pack', (SELECT id FROM categories WHERE name = 'Essentials' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), 899, 600, 40, 15, '/products/diapers.jpg'),
('00000000-0000-0000-0000-000000000001', 'ESS-003', 'Baby Lotion', 'Moisturizing baby lotion', (SELECT id FROM categories WHERE name = 'Essentials' AND tenant_id = '00000000-0000-0000-0000-000000000001' LIMIT 1), 299, 180, 35, 10, '/products/baby-lotion.jpg')
ON CONFLICT DO NOTHING;