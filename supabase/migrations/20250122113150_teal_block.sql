/*
  # Create admin and marketer users if they don't exist

  1. Changes
    - Checks for existing users before creation
    - Creates users in both auth and public schemas if needed
    - Sets correct roles and metadata
  
  2. Security
    - Uses proper password hashing
    - Maintains referential integrity
    - Prevents duplicate entries
*/

DO $$ 
DECLARE
  admin_id uuid;
  marketer_id uuid;
BEGIN
  -- Check if admin exists
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@websiteoffertes.nl';
  
  -- Create admin if not exists
  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
    
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
      aud
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@websiteoffertes.nl',
      crypt('admin123!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      false,
      'authenticated',
      'authenticated'
    );

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
  END IF;

  -- Check if marketer exists
  SELECT id INTO marketer_id FROM auth.users WHERE email = 'marketer@websiteoffertes.nl';
  
  -- Create marketer if not exists
  IF marketer_id IS NULL THEN
    marketer_id := gen_random_uuid();
    
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
      aud
    ) VALUES (
      marketer_id,
      '00000000-0000-0000-0000-000000000000',
      'marketer@websiteoffertes.nl',
      crypt('marketer123!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"marketer"}',
      false,
      'authenticated',
      'authenticated'
    );

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
  END IF;
END $$;