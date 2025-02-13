/*
  # Add Marketeer Profile Fields

  1. New Fields
    - Add service-related fields to users table
    - Add company information fields
    - Add contact details

  2. Security
    - Update RLS policies for new fields
*/

-- Add new fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_kvk text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_address text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_city text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_postal text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS services jsonb DEFAULT '[]';
ALTER TABLE users ADD COLUMN IF NOT EXISTS hourly_rate integer;
ALTER TABLE users ADD COLUMN IF NOT EXISTS min_project_size integer;
ALTER TABLE users ADD COLUMN IF NOT EXISTS max_project_size integer;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Update RLS policies
CREATE POLICY "Users can update own profile fields"
ON users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);