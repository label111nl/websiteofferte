-- Initialize payment settings
INSERT INTO admin_settings (
  key,
  value,
  description
) VALUES (
  'payment_settings',
  jsonb_build_object(
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
  ),
  'Stripe and payment configuration'
) ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    description = EXCLUDED.description;

-- Add comment
COMMENT ON TABLE admin_settings IS 'Stores application configuration settings';