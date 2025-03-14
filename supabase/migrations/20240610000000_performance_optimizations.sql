-- Add missing indexes for performance optimization

-- Indexes for products table
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_current_stock ON products(current_stock);

-- Indexes for customers table
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Indexes for vendors table
CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(name);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);

-- Indexes for orders table
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Indexes for order_items table
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Indexes for inventory_transactions table
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_transaction_type ON inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_reference_id ON inventory_transactions(reference_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON inventory_transactions(created_at);

-- Indexes for purchase_orders table
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_date ON purchase_orders(order_date);

-- Indexes for bills table
CREATE INDEX IF NOT EXISTS idx_bills_vendor_id ON bills(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bills_purchase_order_id ON bills(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_bill_date ON bills(bill_date);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date);

-- Indexes for payments table
CREATE INDEX IF NOT EXISTS idx_payments_vendor_id ON payments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_payments_bill_id ON payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

-- Indexes for reports table
CREATE INDEX IF NOT EXISTS idx_reports_module ON reports(module);
CREATE INDEX IF NOT EXISTS idx_reports_is_favorite ON reports(is_favorite);
CREATE INDEX IF NOT EXISTS idx_reports_is_custom ON reports(is_custom);

-- Indexes for scheduled_reports table
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_report_id ON scheduled_reports(report_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_is_active ON scheduled_reports(is_active);

-- Indexes for report_history table
CREATE INDEX IF NOT EXISTS idx_report_history_report_id ON report_history(report_id);
CREATE INDEX IF NOT EXISTS idx_report_history_user_id ON report_history(user_id);
CREATE INDEX IF NOT EXISTS idx_report_history_created_at ON report_history(created_at);

-- Add missing database functions

-- Function to get sales summary for dashboard
CREATE OR REPLACE FUNCTION get_sales_summary()
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
    WHERE status != 'cancelled'
    AND order_date >= (CURRENT_DATE - INTERVAL '30 days');
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get inventory summary for dashboard
CREATE OR REPLACE FUNCTION get_inventory_summary()
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
    FROM products;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to compare two values and return the smaller one
CREATE OR REPLACE FUNCTION least(a text, b numeric)
RETURNS numeric AS $$
BEGIN
    RETURN LEAST(CAST(a AS numeric), b);
EXCEPTION WHEN OTHERS THEN
    RETURN b;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    last_order_number TEXT;
    new_order_number TEXT;
    order_count INTEGER;
BEGIN
    -- Get the last order number
    SELECT order_number INTO last_order_number FROM orders ORDER BY created_at DESC LIMIT 1;
    
    -- If no orders exist, start with ORD-00001
    IF last_order_number IS NULL THEN
        new_order_number := 'ORD-00001';
    ELSE
        -- Extract the numeric part and increment
        order_count := CAST(SUBSTRING(last_order_number FROM 5) AS INTEGER) + 1;
        new_order_number := 'ORD-' || LPAD(order_count::TEXT, 5, '0');
    END IF;
    
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically generate purchase order numbers
CREATE OR REPLACE FUNCTION generate_po_number()
RETURNS TEXT AS $$
DECLARE
    last_po_number TEXT;
    new_po_number TEXT;
    po_count INTEGER;
BEGIN
    -- Get the last PO number
    SELECT po_number INTO last_po_number FROM purchase_orders ORDER BY created_at DESC LIMIT 1;
    
    -- If no POs exist, start with PO-00001
    IF last_po_number IS NULL THEN
        new_po_number := 'PO-00001';
    ELSE
        -- Extract the numeric part and increment
        po_count := CAST(SUBSTRING(last_po_number FROM 4) AS INTEGER) + 1;
        new_po_number := 'PO-' || LPAD(po_count::TEXT, 5, '0');
    END IF;
    
    RETURN new_po_number;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically generate bill numbers
CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS TEXT AS $$
DECLARE
    last_bill_number TEXT;
    new_bill_number TEXT;
    bill_count INTEGER;
BEGIN
    -- Get the last bill number
    SELECT bill_number INTO last_bill_number FROM bills ORDER BY created_at DESC LIMIT 1;
    
    -- If no bills exist, start with BILL-00001
    IF last_bill_number IS NULL THEN
        new_bill_number := 'BILL-00001';
    ELSE
        -- Extract the numeric part and increment
        bill_count := CAST(SUBSTRING(last_bill_number FROM 6) AS INTEGER) + 1;
        new_bill_number := 'BILL-' || LPAD(bill_count::TEXT, 5, '0');
    END IF;
    
    RETURN new_bill_number;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically generate payment numbers
CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS TEXT AS $$
DECLARE
    last_payment_number TEXT;
    new_payment_number TEXT;
    payment_count INTEGER;
BEGIN
    -- Get the last payment number
    SELECT payment_number INTO last_payment_number FROM payments ORDER BY created_at DESC LIMIT 1;
    
    -- If no payments exist, start with PAY-00001
    IF last_payment_number IS NULL THEN
        new_payment_number := 'PAY-00001';
    ELSE
        -- Extract the numeric part and increment
        payment_count := CAST(SUBSTRING(last_payment_number FROM 5) AS INTEGER) + 1;
        new_payment_number := 'PAY-' || LPAD(payment_count::TEXT, 5, '0');
    END IF;
    
    RETURN new_payment_number;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for auto-generating reference numbers

-- Trigger for order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION set_order_number();

-- Trigger for purchase order numbers
CREATE OR REPLACE FUNCTION set_po_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.po_number IS NULL THEN
        NEW.po_number := generate_po_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_po_number_trigger
    BEFORE INSERT ON purchase_orders
    FOR EACH ROW
    WHEN (NEW.po_number IS NULL)
    EXECUTE FUNCTION set_po_number();

-- Trigger for bill numbers
CREATE OR REPLACE FUNCTION set_bill_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.bill_number IS NULL THEN
        NEW.bill_number := generate_bill_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bill_number_trigger
    BEFORE INSERT ON bills
    FOR EACH ROW
    WHEN (NEW.bill_number IS NULL)
    EXECUTE FUNCTION set_bill_number();

-- Trigger for payment numbers
CREATE OR REPLACE FUNCTION set_payment_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_number IS NULL THEN
        NEW.payment_number := generate_payment_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_payment_number_trigger
    BEFORE INSERT ON payments
    FOR EACH ROW
    WHEN (NEW.payment_number IS NULL)
    EXECUTE FUNCTION set_payment_number();

-- Add materialized views for frequently accessed reports
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_sales_summary AS
SELECT 
    DATE_TRUNC('day', o.order_date) AS sale_date,
    COUNT(DISTINCT o.id) AS order_count,
    SUM(o.total_amount) AS total_sales,
    AVG(o.total_amount) AS average_order_value
FROM orders o
WHERE o.status != 'cancelled'
GROUP BY DATE_TRUNC('day', o.order_date);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_sales_summary_date ON mv_sales_summary(sale_date);

-- Create a function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_sales_summary;
    -- Add more materialized views to refresh as needed
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Add a function to calculate product profitability
CREATE OR REPLACE FUNCTION calculate_product_profitability(product_id UUID)
RETURNS TABLE (
    product_name TEXT,
    total_sales DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    gross_profit DECIMAL(10,2),
    profit_margin DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name AS product_name,
        COALESCE(SUM(oi.total_price), 0) AS total_sales,
        COALESCE(SUM(oi.quantity * p.cost_price), 0) AS total_cost,
        COALESCE(SUM(oi.total_price) - SUM(oi.quantity * p.cost_price), 0) AS gross_profit,
        CASE 
            WHEN COALESCE(SUM(oi.total_price), 0) = 0 THEN 0
            ELSE (COALESCE(SUM(oi.total_price) - SUM(oi.quantity * p.cost_price), 0) / COALESCE(SUM(oi.total_price), 0)) * 100
        END AS profit_margin
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
    WHERE p.id = product_id
    GROUP BY p.name;
END;
$$ LANGUAGE plpgsql;

-- Add a function to get low stock alerts
CREATE OR REPLACE FUNCTION get_low_stock_alerts()
RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    sku TEXT,
    current_stock INTEGER,
    reorder_level INTEGER,
    category_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.sku,
        p.current_stock,
        p.reorder_level,
        c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.current_stock <= p.reorder_level
    ORDER BY (p.current_stock::float / p.reorder_level::float) ASC;
END;
$$ LANGUAGE plpgsql;

-- Add a function to calculate customer lifetime value
CREATE OR REPLACE FUNCTION calculate_customer_ltv(customer_id UUID)
RETURNS TABLE (
    customer_name TEXT,
    total_orders INTEGER,
    total_spent DECIMAL(10,2),
    first_order_date TIMESTAMP WITH TIME ZONE,
    last_order_date TIMESTAMP WITH TIME ZONE,
    average_order_value DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.name AS customer_name,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.total_amount), 0) AS total_spent,
        MIN(o.order_date) AS first_order_date,
        MAX(o.order_date) AS last_order_date,
        CASE 
            WHEN COUNT(o.id) = 0 THEN 0
            ELSE COALESCE(SUM(o.total_amount), 0) / COUNT(o.id)
        END AS average_order_value
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id AND o.status != 'cancelled'
    WHERE c.id = customer_id
    GROUP BY c.name;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for the materialized view
ALTER PUBLICATION supabase_realtime ADD TABLE mv_sales_summary;
