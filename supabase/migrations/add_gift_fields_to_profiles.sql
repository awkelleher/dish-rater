-- Add gift tracking fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS first_rating_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS current_gift TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.first_rating_completed IS 'Tracks if user has completed their first rating';
COMMENT ON COLUMN profiles.current_gift IS 'Stores the current gift type (egg, chick, etc.)';
