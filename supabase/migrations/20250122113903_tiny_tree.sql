/*
  # Add roles table and improve user management

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `permissions` (jsonb)
      - `created_at` (timestamptz)

  2. Changes
    - Add foreign key from users to roles
    - Insert default roles
    - Update existing users with role references
    
  3. Security
    - Enable RLS on roles table
    - Add policies for role management
*/

-- Create roles table
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Add role_id to users table
ALTER TABLE users ADD COLUMN role_id uuid REFERENCES roles(id);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
  ('admin', 'Administrator with full system access', '{
    "users": ["create", "read", "update", "delete"],
    "leads": ["create", "read", "update", "delete"],
    "quotes": ["read", "delete"],
    "settings": ["read", "update"]
  }'),
  ('marketer', 'Marketing professional who can submit quotes', '{
    "leads": ["read"],
    "quotes": ["create", "read", "update"],
    "profile": ["read", "update"]
  }');

-- Update existing users with role references
UPDATE users SET role_id = (
  SELECT id FROM roles WHERE name = users.role
);

-- Update existing policies to use role_id instead of role
DROP POLICY IF EXISTS "Admins can manage all leads" ON leads;
CREATE POLICY "Admins can manage all leads" ON leads
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() AND r.name = 'admin'
  )
);

DROP POLICY IF EXISTS "Marketers can view approved leads" ON leads;
CREATE POLICY "Marketers can view approved leads" ON leads
FOR SELECT USING (
  status = 'approved' AND EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() AND r.name = 'marketer'
  )
);

DROP POLICY IF EXISTS "Admins can view all quotes" ON quotes;
CREATE POLICY "Admins can view all quotes" ON quotes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() AND r.name = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON subscriptions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() AND r.name = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can view all payments" ON lead_payments;
CREATE POLICY "Admins can view all payments" ON lead_payments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() AND r.name = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can read all users" ON users;
CREATE POLICY "Admins can read all users" ON users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() AND r.name = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can delete users" ON users;
CREATE POLICY "Admins can delete users" ON users
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() AND r.name = 'admin'
  )
);

-- Make role_id required after data migration
ALTER TABLE users ALTER COLUMN role_id SET NOT NULL;

-- Now we can safely drop the old role column
ALTER TABLE users DROP COLUMN role;

-- Create policies for roles table
CREATE POLICY "Admins can manage roles" ON roles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() AND r.name = 'admin'
  )
);

CREATE POLICY "Users can view roles" ON roles
FOR SELECT USING (true);

-- Function to get user role name
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT r.name
  FROM users u
  JOIN roles r ON r.id = u.role_id
  WHERE u.id = user_id;
$$;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION has_permission(
  user_id uuid,
  resource text,
  action text
)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = user_id
    AND r.permissions->resource ? action
  );
$$;

COMMENT ON FUNCTION get_user_role IS 'Get the role name for a user';
COMMENT ON FUNCTION has_permission IS 'Check if a user has a specific permission';