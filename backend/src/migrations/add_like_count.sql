-- Migration to add like_count column to offers table
ALTER TABLE offers ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
