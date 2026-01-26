
-- Fix vendors table
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT '';
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS reset_password_token TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Fix offers table
ALTER TABLE offers ADD COLUMN IF NOT EXISTS shop_address TEXT DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS map_link TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Ensure constraints (optional, but good practice if columns were just added)
-- If we just added password_hash, it might be empty string for existing users, which is bad for login but fixes the "column does not exist" error.
-- Users with empty password hash will need to reset password or be deleted.
