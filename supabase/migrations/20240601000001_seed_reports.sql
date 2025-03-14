-- Seed data for reports

-- Insert system-generated reports
INSERT INTO reports (name, description, module, fields, filters, is_custom, created_by)
VALUES
-- Sales reports
('Sales by Customer', 'Detailed report of sales grouped by customer', 'sales', 
  '{"fields": ["customer_name", "order_id", "order_date", "total_amount", "payment_method", "status"]}', 
  '{"date_range": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('Sales by Item', 'Detailed report of sales grouped by product', 'sales', 
  '{"fields": ["product_name", "sku", "category", "quantity_sold", "unit_price", "total_revenue"]}', 
  '{"date_range": true, "category": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('Order Fulfillment By Item', 'Report showing order fulfillment status by product', 'sales', 
  '{"fields": ["order_id", "product_name", "quantity", "order_date", "status", "delivery_method"]}', 
  '{"date_range": true, "status": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('Sales Order Return History', 'History of all returned sales orders', 'sales', 
  '{"fields": ["order_id", "customer_name", "return_date", "product_name", "quantity", "return_reason"]}', 
  '{"date_range": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('Sales by Category', 'Summary of sales grouped by product category', 'sales', 
  '{"fields": ["category", "total_quantity", "total_revenue", "product_count"]}', 
  '{"date_range": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('Sales by Sales Person', 'Summary of sales grouped by sales person', 'sales', 
  '{"fields": ["sales_person", "order_count", "total_revenue", "average_order_value"]}', 
  '{"date_range": true, "sales_person": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

-- Inventory reports
('Inventory Summary', 'Summary of current inventory levels', 'inventory', 
  '{"fields": ["product_name", "sku", "category", "current_stock", "reorder_level", "stock_status", "inventory_value"]}', 
  '{"category": true, "stock_status": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('Committed Stock Details', 'Details of stock committed to orders but not yet fulfilled', 'inventory', 
  '{"fields": ["product_name", "sku", "order_id", "quantity", "order_date", "expected_delivery_date"]}', 
  '{"date_range": true, "product": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('Inventory Valuation Summary', 'Summary of inventory value by category', 'inventory', 
  '{"fields": ["category", "product_count", "total_stock", "total_value"]}', 
  '{"category": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('FIFO Cost Lot Tracking', 'Tracking of inventory costs using FIFO method', 'inventory', 
  '{"fields": ["product_name", "sku", "lot_number", "purchase_date", "quantity", "unit_cost", "total_cost"]}', 
  '{"date_range": true, "product": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('Inventory Aging Summary', 'Summary of inventory age by product', 'inventory', 
  '{"fields": ["product_name", "sku", "category", "current_stock", "days_in_inventory", "value"]}', 
  '{"category": true, "age_range": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

-- Receivables reports
('Invoice Details', 'Detailed report of all invoices', 'receivables', 
  '{"fields": ["invoice_id", "customer_name", "invoice_date", "due_date", "total_amount", "status"]}', 
  '{"date_range": true, "status": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

('Customer Balance Summary', 'Summary of customer balances', 'receivables', 
  '{"fields": ["customer_name", "total_invoiced", "total_paid", "balance", "overdue_amount"]}', 
  '{"customer": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com')),

-- Payments reports
('Payments Received', 'Report of all payments received', 'payments', 
  '{"fields": ["payment_id", "customer_name", "payment_date", "amount", "payment_method", "reference_number"]}', 
  '{"date_range": true, "payment_method": true}', 
  false, (SELECT id FROM users WHERE email = 'admin@meera.com'));
