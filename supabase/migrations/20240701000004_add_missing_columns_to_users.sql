-- Add missing columns to users table if they don't exist
DO $$ 
BEGIN
    -- Check if store_id column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'store_id') THEN
        ALTER TABLE users ADD COLUMN store_id UUID REFERENCES stores(id);
    END IF;
    
    -- Check if tenant_id column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tenant_id') THEN
        ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES tenants(id);
    END IF;
    
    -- Check if is_active column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;
