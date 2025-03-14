-- Create a default tenant
INSERT INTO tenants (id, name, slug, primary_color, secondary_color, subscription_plan, subscription_status, max_users, max_stores, is_active)
VALUES 
  ('tenant-meera', 'Meera Maternity & Fertility Store', 'meera', '#db2777', '#f472b6', 'basic', 'active', 5, 2, true)
ON CONFLICT (slug) DO NOTHING;

-- Create a default store
INSERT INTO stores (id, tenant_id, name, code, country, is_active)
VALUES 
  ('store-main', 'tenant-meera', 'Main Store', 'STORE01', 'India', true)
ON CONFLICT (id) DO NOTHING;

-- Create a default admin user
INSERT INTO users (id, email, full_name, role, tenant_id, store_id)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@meerastore.com', 'Admin User', 'admin', 'tenant-meera', 'store-main')
ON CONFLICT (id) DO NOTHING;

-- Seed some product categories
INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES 
  ('cat-toys', 'Toys', 'Baby and children toys', NOW(), NOW()),
  ('cat-clothes', 'Clothes', 'Baby and maternity clothing', NOW(), NOW()),
  ('cat-essentials', 'Essentials', 'Baby care essentials', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed some products
INSERT INTO products (id, sku, name, description, category_id, price, cost_price, current_stock, reorder_level, image_url, created_at, updated_at)
VALUES
  ('prod-001', 'TOY-001', 'Soft Teddy Bear', 'Cuddly soft teddy bear for babies', 'cat-toys', 899, 500, 25, 10, '/products/teddy-bear.jpg', NOW(), NOW()),
  ('prod-002', 'TOY-002', 'Building Blocks', 'Educational building blocks set', 'cat-toys', 1299, 700, 15, 5, '/products/building-blocks.jpg', NOW(), NOW()),
  ('prod-003', 'TOY-003', 'Art Set', 'Creative art set for kids', 'cat-toys', 599, 300, 20, 8, '/products/art-set.jpg', NOW(), NOW()),
  ('prod-004', 'CLO-001', 'Baby Onesie', 'Comfortable cotton baby onesie', 'cat-clothes', 499, 250, 30, 10, '/products/baby-onesie.jpg', NOW(), NOW()),
  ('prod-005', 'CLO-002', 'Kids T-Shirt', 'Colorful kids t-shirt', 'cat-clothes', 399, 200, 20, 8, '/products/kids-tshirt.jpg', NOW(), NOW()),
  ('prod-006', 'CLO-003', 'Baby Shoes', 'Soft sole baby shoes', 'cat-clothes', 699, 350, 12, 5, '/products/baby-shoes.jpg', NOW(), NOW()),
  ('prod-007', 'ESS-001', 'Baby Wipes', 'Gentle baby wipes pack', 'cat-essentials', 199, 100, 50, 20, '/products/baby-wipes.jpg', NOW(), NOW()),
  ('prod-008', 'ESS-002', 'Diapers Pack', 'Premium baby diapers pack', 'cat-essentials', 899, 450, 40, 15, '/products/diapers.jpg', NOW(), NOW()),
  ('prod-009', 'ESS-003', 'Baby Lotion', 'Moisturizing baby lotion', 'cat-essentials', 299, 150, 35, 10, '/products/baby-lotion.jpg', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed some vendors
INSERT INTO vendors (id, name, company, email, phone, country, currency, payment_terms, is_msme, created_at, updated_at)
VALUES
  ('vendor-001', 'Kids Toys Inc.', 'Kids Toys Inc.', 'contact@kidstoys.com', '9876543210', 'India', 'INR', 'net-30', false, NOW(), NOW()),
  ('vendor-002', 'Baby Essentials Ltd.', 'Baby Essentials Ltd.', 'orders@babyessentials.com', '9876543211', 'India', 'INR', 'net-15', true, NOW(), NOW()),
  ('vendor-003', 'Kids Clothing Co.', 'Kids Clothing Co.', 'sales@kidsclothing.com', '9876543212', 'India', 'INR', 'due-on-receipt', false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
