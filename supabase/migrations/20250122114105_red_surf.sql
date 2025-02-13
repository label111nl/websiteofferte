/*
  # Update user roles for existing users

  1. Changes
    - Update role for dylan@label111.nl to admin
    - Update role for info@label111.nl to marketer
    
  2. Security
    - Maintains existing security policies
    - Uses role_id references
*/

DO $$ 
DECLARE
  admin_role_id uuid;
  marketer_role_id uuid;
BEGIN
  -- Get role IDs
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
  SELECT id INTO marketer_role_id FROM roles WHERE name = 'marketer';

  -- Update dylan@label111.nl to admin
  UPDATE users 
  SET role_id = admin_role_id
  WHERE email = 'dylan@label111.nl';

  -- Update info@label111.nl to marketer
  UPDATE users 
  SET role_id = marketer_role_id
  WHERE email = 'info@label111.nl';
END $$;