/*
  # Fix authentication setup
  
  1. Changes
    - Properly creates users in auth schema with correct metadata
    - Ensures users exist in public schema with correct roles
    - Sets up proper authentication fields
  
  2. Security
    - Uses proper password hashing
    - Sets correct user roles and metadata
    - Enables immediate login capability
*/

-- First, clean up any existing user data to avoid conflicts
DELETE FROM auth.users 
WHERE email IN ('admin@websiteoffertes.nl', 'marketer@websiteoffertes.nl');

DELETE FROM public.users 
WHERE email IN ('admin@websiteoffertes.nl', 'marketer@websiteoffertes.nl');

DO $$ 
DECLARE
  admin_id uuid := gen_random_uuid();
  marketer_id uuid := gen_random_uuid();
BEGIN
  -- Create admin user in auth schema
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
    role,
    aud,
    confirmation_token
  ) VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@websiteoffertes.nl',
    crypt('admin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', ARRAY['email']::text[],
      'role', 'admin'
    ),
    jsonb_build_object(
      'role', 'admin'
    ),
    false,
    'authenticated',
    'authenticated',
    encode(gen_random_bytes(32), 'hex')
  );

  -- Create marketer user in auth schema
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
    role,
    aud,
    confirmation_token
  ) VALUES (
    marketer_id,
    '00000000-0000-0000-0000-000000000000',
    'marketer@websiteoffertes.nl',
    crypt('marketer123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', ARRAY['email']::text[],
      'role', 'marketer'
    ),
    jsonb_build_object(
      'role', 'marketer'
    ),
    false,
    'authenticated',
    'authenticated',
    encode(gen_random_bytes(32), 'hex')
  );

  -- Create admin user in public schema
  INSERT INTO public.users (
    id,
    email,
    role,
    subscription_type
  ) VALUES (
    admin_id,
    'admin@websiteoffertes.nl',
    'admin',
    'free'
  );

  -- Create marketer user in public schema
  INSERT INTO public.users (
    id,
    email,
    role,
    subscription_type
  ) VALUES (
    marketer_id,
    'marketer@websiteoffertes.nl',
    'marketer',
    'free'
  );
END $$;