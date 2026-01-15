-- Add columns for password reset functionality
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS reset_password_token TEXT,
ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP;

-- Add index for token lookups
CREATE INDEX IF NOT EXISTS idx_vendors_reset_token ON vendors(reset_password_token);
