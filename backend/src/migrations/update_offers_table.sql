-- Migration to add missing columns to offers table
ALTER TABLE offers ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS buy_link TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS discount_type VARCHAR(50);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS discount_label VARCHAR(255);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS discount_value_numeric DECIMAL(10, 2);
ALTER TABLE offers ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
