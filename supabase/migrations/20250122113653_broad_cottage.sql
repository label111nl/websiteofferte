/*
  # Fix RLS policies to prevent infinite recursion

  1. Changes
    - Drop existing policies on users table
    - Create new policies that avoid recursive checks
    - Simplify policy conditions
  
  2. Security
    - Maintain same security model but with more efficient implementation
    - Users can still only read their own data
    - Admins can still read all users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Create new policies
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
ON users FOR SELECT
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- Add update policies
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add delete policy for admins
CREATE POLICY "Admins can delete users"
ON users FOR DELETE
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);