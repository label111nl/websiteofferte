/*
  # Add Missing Tables

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (text)
      - `amount` (decimal)
      - `status` (text)
      - `description` (text)
      - `stripe_invoice_id` (text)
      - `created_at` (timestamptz)
    
    - `notification_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `email_notifications` (boolean)
      - `push_notifications` (boolean)
      - `new_lead_notification` (boolean)
      - `quote_accepted_notification` (boolean)
      - `payment_notification` (boolean)
      - `marketing_emails` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('subscription', 'lead_payment', 'refund')),
  amount decimal NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed')),
  description text,
  stripe_invoice_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  new_lead_notification boolean DEFAULT true,
  quote_accepted_notification boolean DEFAULT true,
  payment_notification boolean DEFAULT true,
  marketing_emails boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON transactions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  ));

-- Policies for notification_settings
CREATE POLICY "Users can view own notification settings"
  ON notification_settings
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notification settings"
  ON notification_settings
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own notification settings"
  ON notification_settings
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create default notification settings for existing users
INSERT INTO notification_settings (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Create function to automatically create notification settings for new users
CREATE OR REPLACE FUNCTION create_default_notification_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create notification settings for new users
DROP TRIGGER IF EXISTS create_notification_settings_trigger ON users;
CREATE TRIGGER create_notification_settings_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_settings();