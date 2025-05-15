-- Add user_id column to ideas table
ALTER TABLE ideas ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update the existing ideas table schema in supabase.sql
-- You'll need to manually update your supabase.sql file to include this column
-- in the CREATE TABLE statement for future reference
