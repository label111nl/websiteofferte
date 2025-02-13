-- Insert test leads with different statuses and details
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
  required_expertise
) VALUES
  (
    'Tech Innovators BV',
    'John Smith',
    'john@techinnovators.nl',
    '+31612345678',
    'We need a modern website for our tech consultancy firm. The website should showcase our services, include a blog section, and have a client portal.',
    '10000-20000',
    '2-3 maanden',
    3,
    'approved',
    true,
    'called',
    now() - interval '2 days',
    ARRAY['React', 'TypeScript', 'Node.js']
  ),
  (
    'Green Gardens',
    'Emma de Vries',
    'emma@greengardens.nl',
    '+31623456789',
    'Looking for an e-commerce website to sell our garden supplies and plants. Need inventory management and order tracking.',
    '5000-10000',
    '1-2 maanden',
    3,
    'pending',
    false,
    'not_called',
    now() - interval '1 day',
    ARRAY['E-commerce', 'WordPress', 'WooCommerce']
  ),
  (
    'City Cafe',
    'Lucas Bakker',
    'lucas@citycafe.nl',
    '+31634567890',
    'Need a website for our cafe with online reservation system, menu display, and integration with food delivery platforms.',
    '2500-5000',
    'Zo snel mogelijk',
    5,
    'approved',
    true,
    'called',
    now() - interval '3 days',
    ARRAY['PHP', 'MySQL', 'JavaScript']
  ),
  (
    'Legal Solutions',
    'Sarah van Dijk',
    'sarah@legalsolutions.nl',
    '+31645678901',
    'Professional website needed for our law firm. Must include appointment booking, secure client portal, and blog section.',
    '5000-10000',
    '3-6 maanden',
    3,
    'rejected',
    false,
    'unreachable',
    now() - interval '4 days',
    ARRAY['React', 'Node.js', 'PostgreSQL']
  ),
  (
    'Fitness First',
    'Mark Jansen',
    'mark@fitnessfirst.nl',
    '+31656789012',
    'Website for our fitness center with class scheduling, membership management, and online payment integration.',
    '5000-10000',
    '2-3 maanden',
    3,
    'pending',
    false,
    'not_called',
    now(),
    ARRAY['Vue.js', 'Laravel', 'MySQL']
  ),
  (
    'Dutch Design Studio',
    'Lisa de Groot',
    'lisa@dutchdesign.nl',
    '+31667890123',
    'Portfolio website for our design studio. Need a modern, responsive design with project showcase and contact form.',
    '2500-5000',
    '1-2 maanden',
    3,
    'approved',
    true,
    'called',
    now() - interval '5 days',
    ARRAY['React', 'Next.js', 'Tailwind']
  ),
  (
    'Smart Education',
    'Peter van der Berg',
    'peter@smarteducation.nl',
    '+31678901234',
    'E-learning platform for our educational institute. Need user authentication, course management, and progress tracking.',
    '20000+',
    '3-6 maanden',
    5,
    'approved',
    true,
    'called',
    now() - interval '6 days',
    ARRAY['React', 'Node.js', 'MongoDB']
  ),
  (
    'Fresh Foods Market',
    'Anna Visser',
    'anna@freshfoods.nl',
    '+31689012345',
    'E-commerce website for our organic food market. Need product management, shopping cart, and delivery scheduling.',
    '10000-20000',
    '2-3 maanden',
    3,
    'pending',
    false,
    'not_called',
    now() - interval '1 hour',
    ARRAY['Shopify', 'JavaScript', 'React']
  );

-- Add some complexity scores and AI verification
UPDATE leads
SET 
  complexity_score = CASE 
    WHEN budget_range = '20000+' THEN 0.9
    WHEN budget_range = '10000-20000' THEN 0.7
    WHEN budget_range = '5000-10000' THEN 0.5
    ELSE 0.3
  END,
  ai_verified = CASE 
    WHEN status = 'approved' THEN true
    ELSE false
  END,
  ai_verification_date = CASE 
    WHEN status = 'approved' THEN created_at + interval '1 hour'
    ELSE NULL
  END;

-- Update additional services for each lead
UPDATE leads SET additional_services = '{
  "logo_design": true,
  "branding": true,
  "seo": true,
  "google_ads": false,
  "social_media": false,
  "content_creation": false,
  "copywriting": false,
  "email_marketing": false,
  "maintenance": true
}'::jsonb WHERE company_name = 'Tech Innovators BV';

UPDATE leads SET additional_services = '{
  "logo_design": false,
  "branding": false,
  "seo": true,
  "google_ads": true,
  "social_media": false,
  "content_creation": true,
  "copywriting": false,
  "email_marketing": false,
  "maintenance": false
}'::jsonb WHERE company_name = 'Green Gardens';

UPDATE leads SET additional_services = '{
  "logo_design": true,
  "branding": false,
  "seo": false,
  "google_ads": false,
  "social_media": true,
  "content_creation": true,
  "copywriting": false,
  "email_marketing": false,
  "maintenance": false
}'::jsonb WHERE company_name = 'City Cafe';

UPDATE leads SET additional_services = '{
  "logo_design": false,
  "branding": false,
  "seo": true,
  "google_ads": false,
  "social_media": false,
  "content_creation": false,
  "copywriting": true,
  "email_marketing": false,
  "maintenance": true
}'::jsonb WHERE company_name = 'Legal Solutions';

UPDATE leads SET additional_services = '{
  "logo_design": false,
  "branding": true,
  "seo": false,
  "google_ads": false,
  "social_media": true,
  "content_creation": false,
  "copywriting": false,
  "email_marketing": true,
  "maintenance": false
}'::jsonb WHERE company_name = 'Fitness First';

UPDATE leads SET additional_services = '{
  "logo_design": true,
  "branding": true,
  "seo": false,
  "google_ads": false,
  "social_media": false,
  "content_creation": false,
  "copywriting": false,
  "email_marketing": false,
  "maintenance": false
}'::jsonb WHERE company_name = 'Dutch Design Studio';

UPDATE leads SET additional_services = '{
  "logo_design": false,
  "branding": false,
  "seo": false,
  "google_ads": false,
  "social_media": false,
  "content_creation": true,
  "copywriting": false,
  "email_marketing": true,
  "maintenance": true
}'::jsonb WHERE company_name = 'Smart Education';

UPDATE leads SET additional_services = '{
  "logo_design": false,
  "branding": false,
  "seo": true,
  "google_ads": true,
  "social_media": true,
  "content_creation": false,
  "copywriting": false,
  "email_marketing": false,
  "maintenance": false
}'::jsonb WHERE company_name = 'Fresh Foods Market';