-- Update existing user to admin role
UPDATE public.users 
SET 
  role = 'admin',
  subscription_type = 'premium'
WHERE email = 'dylaannp@hotmail.com';

-- Update auth metadata to include admin role
UPDATE auth.users 
SET 
  raw_app_meta_data = raw_app_meta_data || 
    jsonb_build_object('role', 'admin'),
  raw_user_meta_data = raw_user_meta_data || 
    jsonb_build_object('role', 'admin'),
  is_super_admin = true
WHERE email = 'dylaannp@hotmail.com';