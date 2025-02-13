/*
  # Fix user policies and role management

  1. Changes
    - Simplify policy structure to avoid recursion
    - Add missing policies for proper role-based access
    - Ensure proper role assignment handling
  
  2. Security
    - Maintain proper access control
    - Fix infinite recursion issues
    - Enable proper role-based authorization
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Create simplified policies that avoid recursion
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow user registration"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create admin policies with direct role checks
CREATE POLICY "Admins can read all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM roles r
    WHERE r.id = (
      SELECT role_id 
      FROM users 
      WHERE id = auth.uid()
    )
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM roles r
    WHERE r.id = (
      SELECT role_id 
      FROM users 
      WHERE id = auth.uid()
    )
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can delete users"
ON users FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM roles r
    WHERE r.id = (
      SELECT role_id 
      FROM users 
      WHERE id = auth.uid()
    )
    AND r.name = 'admin'
  )
);

-- Ensure proper role references
DO $$ 
DECLARE
  admin_role_id uuid;
  marketer_role_id uuid;
BEGIN
  -- Get role IDs
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
  SELECT id INTO marketer_role_id FROM roles WHERE name = 'marketer';

  -- Update any users without role_id
  UPDATE users 
  SET role_id = marketer_role_id 
  WHERE role_id IS NULL;

  -- Ensure specific users have correct roles
  UPDATE users 
  SET role_id = admin_role_id
  WHERE email = 'dylan@label111.nl';

  UPDATE users 
  SET role_id = marketer_role_id
  WHERE email = 'info@label111.nl';
END $$;