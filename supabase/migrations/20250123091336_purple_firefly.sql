-- First check if admin exists
DO $$ 
DECLARE
  admin_id uuid := gen_random_uuid();
BEGIN
  -- Create auth user if doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dylaannp@hotmail.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      aud
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'dylaannp@hotmail.com',
      crypt('HollanD2020!!', gen_salt('bf')),
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
      true,
      'authenticated',
      'authenticated'
    );

    -- Create public user
    INSERT INTO public.users (
      id,
      email,
      role,
      subscription_type
    ) VALUES (
      admin_id,
      'dylaannp@hotmail.com',
      'admin',
      'premium'
    );
  END IF;
END $$;