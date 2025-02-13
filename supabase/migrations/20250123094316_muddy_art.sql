-- Insert unpublished test leads for admin dashboard
INSERT INTO leads (
  company_name,
  contact_name,
  email,
  phone,
  project_description,
  budget_range,
  timeline,
  max_quotes,
  status,
  published,
  call_status,
  created_at,
  additional_services,
  required_expertise
) VALUES
  (
    'Digital Agency XYZ',
    'Michael Brown',
    'michael@digitalxyz.nl',
    '+31690123456',
    'We need a complete rebrand of our agency website with modern design, portfolio showcase, and case studies section.',
    '10000-20000',
    '2-3 maanden',
    3,
    'pending',
    false,
    'not_called',
    now() - interval '12 hours',
    '{
      "logo_design": true,
      "branding": true,
      "seo": true,
      "google_ads": true,
      "social_media": true,
      "content_creation": true,
      "copywriting": true,
      "email_marketing": false,
      "maintenance": false
    }'::jsonb,
    ARRAY['React', 'Next.js', 'GraphQL']
  ),
  (
    'Restaurant Bella Italia',
    'Maria Romano',
    'maria@bellaitalia.nl',
    '+31690234567',
    'Looking for a new website with online reservation system, menu management, and integration with delivery services.',
    '5000-10000',
    'Zo snel mogelijk',
    3,
    'pending',
    false,
    'not_called',
    now() - interval '8 hours',
    '{
      "logo_design": false,
      "branding": true,
      "seo": true,
      "google_ads": true,
      "social_media": true,
      "content_creation": false,
      "copywriting": false,
      "email_marketing": true,
      "maintenance": true
    }'::jsonb,
    ARRAY['WordPress', 'PHP', 'JavaScript']
  ),
  (
    'Medical Center West',
    'Dr. Jan de Boer',
    'jan@medicalwest.nl',
    '+31690345678',
    'Healthcare portal with patient management system, appointment scheduling, and secure document sharing.',
    '20000+',
    '3-6 maanden',
    5,
    'pending',
    false,
    'not_called',
    now() - interval '4 hours',
    '{
      "logo_design": false,
      "branding": false,
      "seo": true,
      "google_ads": false,
      "social_media": false,
      "content_creation": true,
      "copywriting": true,
      "email_marketing": false,
      "maintenance": true
    }'::jsonb,
    ARRAY['React', 'Node.js', 'PostgreSQL']
  ),
  (
    'Pet Shop Paradise',
    'Sophie van Dam',
    'sophie@petparadise.nl',
    '+31690456789',
    'E-commerce website for pet supplies with subscription service, loyalty program, and pet care blog.',
    '5000-10000',
    '1-2 maanden',
    3,
    'pending',
    false,
    'not_called',
    now() - interval '2 hours',
    '{
      "logo_design": true,
      "branding": true,
      "seo": true,
      "google_ads": true,
      "social_media": true,
      "content_creation": true,
      "copywriting": false,
      "email_marketing": true,
      "maintenance": false
    }'::jsonb,
    ARRAY['Shopify', 'React', 'Node.js']
  ),
  (
    'Local Real Estate',
    'Thomas Bakker',
    'thomas@localestate.nl',
    '+31690567890',
    'Property listing website with advanced search, virtual tours, and agent dashboard.',
    '10000-20000',
    '2-3 maanden',
    3,
    'pending',
    false,
    'not_called',
    now() - interval '1 hour',
    '{
      "logo_design": false,
      "branding": true,
      "seo": true,
      "google_ads": true,
      "social_media": true,
      "content_creation": false,
      "copywriting": true,
      "email_marketing": true,
      "maintenance": true
    }'::jsonb,
    ARRAY['Vue.js', 'Laravel', 'MySQL']
  );

-- Add complexity scores and AI verification status
UPDATE leads
SET 
  complexity_score = CASE 
    WHEN budget_range = '20000+' THEN 0.9
    WHEN budget_range = '10000-20000' THEN 0.7
    WHEN budget_range = '5000-10000' THEN 0.5
    ELSE 0.3
  END,
  ai_verified = false,
  ai_verification_date = NULL
WHERE published = false AND status = 'pending';