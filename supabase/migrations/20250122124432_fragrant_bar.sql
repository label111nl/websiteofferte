-- First, clean up existing problematic policies and tables
DROP POLICY IF EXISTS "Read roles" ON roles;
DROP POLICY IF EXISTS "Admin manage roles" ON roles;
DROP TABLE IF EXISTS roles CASCADE;

-- Remove role_id from users table and add simple role column
ALTER TABLE users DROP COLUMN IF EXISTS role_id;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'marketer'
  CHECK (role IN ('admin', 'marketer'));

-- Update existing policies to use simple role check
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role = 'admin'
  FROM users
  WHERE id = auth.uid();
$$;

-- Update users policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

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

CREATE POLICY "Admins can read all users"
ON users FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete users"
ON users FOR DELETE
USING (is_admin());

-- Update leads policies
DROP POLICY IF EXISTS "Admins can manage all leads" ON leads;
DROP POLICY IF EXISTS "Marketers can view approved leads" ON leads;

CREATE POLICY "Admins can manage all leads"
ON leads FOR ALL
USING (is_admin());

CREATE POLICY "Marketers can view approved leads"
ON leads FOR SELECT
USING (
  status = 'approved' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'marketer'
  )
);

-- Update quotes policies
DROP POLICY IF EXISTS "Admins can view all quotes" ON quotes;

CREATE POLICY "Admins can view all quotes"
ON quotes FOR SELECT
USING (is_admin());

-- Update existing users
UPDATE users SET role = 'admin' WHERE email = 'dylaannp@hotmail.com';