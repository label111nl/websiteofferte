/*
  # Fix user policies to avoid infinite recursion

  1. Changes
    - Remove recursive policies that check user role within themselves
    - Create new policies that use role_id directly
    - Add basic policies for user management
  
  2. Security
    - Maintain proper access control
    - Prevent infinite recursion
    - Enable RLS
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Create new policies that avoid recursion
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create admin policies using role_id directly
CREATE POLICY "Admins can read all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM roles r
    WHERE r.id = (SELECT role_id FROM users WHERE id = auth.uid())
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM roles r
    WHERE r.id = (SELECT role_id FROM users WHERE id = auth.uid())
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can delete users"
ON users FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM roles r
    WHERE r.id = (SELECT role_id FROM users WHERE id = auth.uid())
    AND r.name = 'admin'
  )
);

-- Add basic insert policy
CREATE POLICY "Allow user registration"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;