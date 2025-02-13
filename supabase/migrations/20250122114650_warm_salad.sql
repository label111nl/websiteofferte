/*
  # Final fix for user policies and role management

  1. Changes
    - Remove all recursive policy checks
    - Implement simplified role-based access
    - Fix infinite recursion issues
    - Update role assignments
  
  2. Security
    - Maintain proper access control
    - Ensure secure role-based authorization
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Create base policies for all authenticated users
CREATE POLICY "Users can read own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow initial user creation"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create a secure view for role checking
CREATE OR REPLACE VIEW user_roles AS
SELECT u.id as user_id, r.name as role_name
FROM users u
JOIN roles r ON r.id = u.role_id;

-- Create admin policies using the view
CREATE POLICY "Admins can read all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role_name = 'admin'
  )
);

CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role_name = 'admin'
  )
);

CREATE POLICY "Admins can delete users"
ON users FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role_name = 'admin'
  )
);

-- Ensure proper role assignments
DO $$ 
DECLARE
  admin_role_id uuid;
  marketer_role_id uuid;
BEGIN
  -- Get role IDs
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
  SELECT id INTO marketer_role_id FROM roles WHERE name = 'marketer';

  -- Update specific users
  UPDATE users 
  SET role_id = admin_role_id
  WHERE email = 'dylan@label111.nl';

  UPDATE users 
  SET role_id = marketer_role_id
  WHERE email = 'info@label111.nl';

  -- Set default role for any users without a role
  UPDATE users 
  SET role_id = marketer_role_id 
  WHERE role_id IS NULL;
END $$;