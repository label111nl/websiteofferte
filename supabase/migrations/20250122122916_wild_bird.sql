-- Drop problematic policies and views
DROP POLICY IF EXISTS "Only super admin can modify roles" ON roles;
DROP POLICY IF EXISTS "Anyone can read roles" ON roles;
DROP MATERIALIZED VIEW IF EXISTS user_role_lookup;

-- Simplify roles policies
CREATE POLICY "Read roles"
ON roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin manage roles"
ON roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role_id IN (SELECT id FROM roles WHERE name = 'admin')
  )
);

-- Fix role_id constraint by ensuring it's set properly
DO $$ 
DECLARE
  admin_role_id uuid;
  marketer_role_id uuid;
BEGIN
  -- Get or create roles
  INSERT INTO roles (name, description, permissions)
  VALUES ('admin', 'Administrator with full system access', '{
    "users": ["create", "read", "update", "delete"],
    "leads": ["create", "read", "update", "delete"],
    "quotes": ["read", "delete"],
    "settings": ["read", "update"]
  }')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO admin_role_id;

  INSERT INTO roles (name, description, permissions)
  VALUES ('marketer', 'Marketing professional who can submit quotes', '{
    "leads": ["read"],
    "quotes": ["create", "read", "update"],
    "profile": ["read", "update"]
  }')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO marketer_role_id;

  -- Get role IDs if they weren't returned from the inserts
  IF admin_role_id IS NULL THEN
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
  END IF;
  
  IF marketer_role_id IS NULL THEN
    SELECT id INTO marketer_role_id FROM roles WHERE name = 'marketer';
  END IF;

  -- Update any users without role_id
  UPDATE users 
  SET role_id = marketer_role_id 
  WHERE role_id IS NULL;
END $$;