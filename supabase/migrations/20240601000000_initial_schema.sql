-- Create schema for Meera Maternity & Fertility Store POS System

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'cashier')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2) NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 5,
  image_url TEXT,
  barcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  payment_terms TEXT DEFAULT 'due-on-receipt',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  user_id UUID REFERENCES users(id),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'delivered', 'cancelled')),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'pending', 'partial')),
  delivery_method TEXT CHECK (delivery_method IN ('pickup', 'delivery')),
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory_transactions table
CREATE TABLE inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  reference_id UUID,  -- Can be order_id, purchase_order_id, etc.
  reference_type TEXT,  -- 'order', 'purchase_order', etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_orders table
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_number TEXT UNIQUE NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  user_id UUID REFERENCES users(id),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'received', 'cancelled', 'closed')),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_order_items table
CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bills table
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_number TEXT UNIQUE NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  bill_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('open', 'paid', 'partial', 'overdue')),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bill_items table
CREATE TABLE bill_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  account TEXT NOT NULL,  -- 'inventory', 'expense', 'cogs', etc.
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_number TEXT UNIQUE NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  bill_id UUID REFERENCES bills(id),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  amount DECIMAL(10, 2) NOT NULL,
  payment_mode TEXT NOT NULL,  -- 'cash', 'bank-transfer', 'check', 'credit-card', 'upi'
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL,  -- 'sales', 'inventory', 'receivables', 'payments'
  fields JSONB NOT NULL,
  filters JSONB,
  sorting JSONB,
  is_custom BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_reports table
CREATE TABLE scheduled_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  day_of_week INTEGER,  -- For weekly reports (1-7, where 1 is Monday)
  day_of_month INTEGER,  -- For monthly reports (1-31)
  time_of_day TIME,
  recipients JSONB,  -- Array of email addresses
  format TEXT NOT NULL CHECK (format IN ('pdf', 'excel', 'csv')),
  is_active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create report_history table
CREATE TABLE report_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  parameters JSONB,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_categories_modtime
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_customers_modtime
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_vendors_modtime
    BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_modtime
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_order_items_modtime
    BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_inventory_transactions_modtime
    BEFORE UPDATE ON inventory_transactions
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_purchase_orders_modtime
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_purchase_order_items_modtime
    BEFORE UPDATE ON purchase_order_items
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_bills_modtime
    BEFORE UPDATE ON bills
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_bill_items_modtime
    BEFORE UPDATE ON bill_items
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_payments_modtime
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_reports_modtime
    BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_scheduled_reports_modtime
    BEFORE UPDATE ON scheduled_reports
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Create inventory update trigger
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transaction_type = 'purchase' OR NEW.transaction_type = 'adjustment' THEN
        UPDATE products SET current_stock = current_stock + NEW.quantity WHERE id = NEW.product_id;
    ELSIF NEW.transaction_type = 'sale' THEN
        UPDATE products SET current_stock = current_stock - NEW.quantity WHERE id = NEW.product_id;
    ELSIF NEW.transaction_type = 'return' THEN
        UPDATE products SET current_stock = current_stock + NEW.quantity WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_after_transaction
    AFTER INSERT ON inventory_transactions
    FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- Create views for reporting
CREATE VIEW sales_by_product AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.sku,
    c.name AS category_name,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.total_price) AS total_revenue,
    COUNT(DISTINCT o.id) AS order_count
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE o.status != 'cancelled'
GROUP BY p.id, p.name, p.sku, c.name;

CREATE VIEW sales_by_category AS
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.total_price) AS total_revenue,
    COUNT(DISTINCT p.id) AS product_count
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled'
GROUP BY c.id, c.name;

CREATE VIEW inventory_summary AS
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
    END AS stock_status
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

CREATE VIEW vendor_payment_summary AS
SELECT 
    v.id AS vendor_id,
    v.name AS vendor_name,
    COUNT(DISTINCT b.id) AS bill_count,
    SUM(b.total_amount) AS total_billed,
    SUM(CASE WHEN b.status = 'paid' THEN b.total_amount ELSE 0 END) AS total_paid,
    SUM(CASE WHEN b.status IN ('open', 'partial', 'overdue') THEN b.total_amount ELSE 0 END) - 
    SUM(CASE WHEN b.status = 'partial' THEN (SELECT SUM(amount) FROM payments WHERE bill_id = b.id) ELSE 0 END) AS total_outstanding
FROM vendors v
LEFT JOIN bills b ON v.id = b.vendor_id
GROUP BY v.id, v.name;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_history ENABLE ROW LEVEL SECURITY;

-- Create policies for development (allow all operations)
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON vendors FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON inventory_transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON purchase_orders FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON purchase_order_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON bills FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON bill_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON payments FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON reports FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON scheduled_reports FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON report_history FOR ALL USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE customers;
ALTER PUBLICATION supabase_realtime ADD TABLE vendors;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE purchase_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE purchase_order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE bills;
ALTER PUBLICATION supabase_realtime ADD TABLE bill_items;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
ALTER PUBLICATION supabase_realtime ADD TABLE scheduled_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE report_history;

-- Insert initial data
-- Insert default admin user
INSERT INTO users (email, password, full_name, role) 
VALUES ('admin@meera.com', '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9imQXMS', 'Admin User', 'admin');

-- Insert categories
INSERT INTO categories (name, description) VALUES 
('Toys', 'Children toys and games'),
('Clothes', 'Baby and maternity clothing'),
('Essentials', 'Baby care essentials');

-- Insert sample products
INSERT INTO products (sku, name, description, category_id, price, cost_price, current_stock, reorder_level, image_url) VALUES 
('TOY001', 'Soft Teddy Bear', 'Soft plush teddy bear for babies', (SELECT id FROM categories WHERE name = 'Toys'), 899, 450, 15, 5, '/products/teddy-bear.jpg'),
('TOY002', 'Building Blocks', 'Educational building blocks set', (SELECT id FROM categories WHERE name = 'Toys'), 1299, 650, 25, 8, '/products/building-blocks.jpg'),
('TOY003', 'Art Set', 'Children art and craft set', (SELECT id FROM categories WHERE name = 'Toys'), 599, 300, 8, 5, '/products/art-set.jpg'),
('CLO001', 'Baby Onesie', 'Comfortable cotton onesie for babies', (SELECT id FROM categories WHERE name = 'Clothes'), 499, 250, 30, 10, '/products/baby-onesie.jpg'),
('CLO002', 'Kids T-Shirt', 'Colorful t-shirts for kids', (SELECT id FROM categories WHERE name = 'Clothes'), 399, 200, 22, 8, '/products/kids-tshirt.jpg'),
('CLO003', 'Baby Shoes', 'Soft sole baby shoes', (SELECT id FROM categories WHERE name = 'Clothes'), 699, 350, 12, 5, '/products/baby-shoes.jpg'),
('ESS001', 'Baby Wipes', 'Gentle baby wipes pack', (SELECT id FROM categories WHERE name = 'Essentials'), 199, 100, 45, 15, '/products/baby-wipes.jpg'),
('ESS002', 'Diapers Pack', 'Pack of 40 diapers', (SELECT id FROM categories WHERE name = 'Essentials'), 899, 450, 18, 10, '/products/diapers.jpg'),
('ESS003', 'Baby Lotion', 'Gentle moisturizing baby lotion', (SELECT id FROM categories WHERE name = 'Essentials'), 299, 150, 3, 5, '/products/baby-lotion.jpg');

-- Insert sample vendor
INSERT INTO vendors (name, company, email, phone, payment_terms) VALUES 
('Anantham', 'Anantham', 'contact@anantham.com', '9876543210', 'due-on-receipt');
