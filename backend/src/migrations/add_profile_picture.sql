-- Add profile_picture_url column to vendors table
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vendors_profile_picture 
ON vendors(profile_picture_url);
