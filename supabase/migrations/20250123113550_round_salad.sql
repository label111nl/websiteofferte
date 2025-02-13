-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can manage settings" ON admin_settings;
DROP POLICY IF EXISTS "Anyone can view settings" ON admin_settings;

-- Create new policies with proper admin role check
CREATE POLICY "Admins can manage settings"
ON admin_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Public can view settings"
ON admin_settings
FOR SELECT
USING (true);

-- Ensure RLS is enabled
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Add default settings if they don't exist
INSERT INTO admin_settings (key, value, description)
VALUES 
  ('payment_settings', jsonb_build_object(
    'stripe_mode', 'test',
    'stripe_publishable_key', '',
    'stripe_secret_key', '',
    'lead_price', 3500,
    'subscription_price', 15000,
    'subscription_trial_days', 0,
    'payment_currency', 'eur',
    'auto_payout', true,
    'payout_schedule', 'weekly',
    'minimum_payout_amount', 10000
  ), 'Stripe and payment configuration'),
  ('lead_matching', jsonb_build_object(
    'min_score', 0.6,
    'max_matches_per_lead', 5,
    'consider_portfolio', true,
    'consider_expertise', true,
    'consider_budget', true,
    'expertise_weight', 0.4,
    'portfolio_weight', 0.3,
    'budget_weight', 0.2,
    'location_weight', 0.1
  ), 'Lead matching algorithm configuration'),
  ('ai_verification', jsonb_build_object(
    'enabled', true,
    'min_confidence', 0.8,
    'check_spam', true,
    'check_quality', true,
    'quality_threshold', 0.7,
    'spam_threshold', 0.9,
    'max_processing_time', 30,
    'auto_approve_threshold', 0.95,
    'auto_reject_threshold', 0.2,
    'language_check', true,
    'sentiment_analysis', true
  ), 'AI verification configuration')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    description = EXCLUDED.description;