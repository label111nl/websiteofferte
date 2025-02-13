/*
  # Create initial users

  1. Changes
    - Insert initial admin user
    - Insert initial marketer user
  
  2. Security
    - Users are created with hashed passwords
    - Admin role is set for admin user
    - Marketer role is set for marketer user
*/

-- Create admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@websiteoffertes.nl',
  crypt('admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  false,
  'authenticated'
);

-- Create marketer user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'marketer@websiteoffertes.nl',
  crypt('marketer123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"marketer"}',
  false,
  'authenticated'
);

-- Insert corresponding records in the users table
INSERT INTO public.users (id, email, role, subscription_type)
SELECT 
  id,
  email,
  CASE 
    WHEN email = 'admin@websiteoffertes.nl' THEN 'admin'
    ELSE 'marketer'
  END as role,
  'free' as subscription_type
FROM auth.users
WHERE email IN ('admin@websiteoffertes.nl', 'marketer@websiteoffertes.nl');