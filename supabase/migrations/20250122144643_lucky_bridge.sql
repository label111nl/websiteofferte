/*
  # Enhanced Admin Features

  1. New Tables
    - `portfolios`
      - Portfolio entries for marketers
      - Stores project details, images, and technologies used
    - `admin_settings`
      - Global platform settings
      - Configuration for lead matching
    - `lead_matches`
      - Automated matches between leads and marketers
      - Stores match score and status
    - `admin_audit_logs`
      - Tracks admin actions
      - Important for security and compliance

  2. Changes
    - Add portfolio fields to users table
    - Add matching preferences to leads table

  3. Security
    - Enable RLS on all new tables
    - Add admin-only policies
    - Add marketer-specific policies
*/

-- Create portfolios table
CREATE TABLE portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  url text,
  technologies text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  budget_range text NOT NULL,
  completion_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_settings table
CREATE TABLE admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_matches table
CREATE TABLE lead_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  marketer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  match_score decimal NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  ai_insights jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(lead_id, marketer_id)
);

-- Create admin_audit_logs table
CREATE TABLE admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES users(id),
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  changes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Add portfolio fields to users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS portfolio_complete boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS expertise text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_budget_ranges text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS min_project_budget integer,
ADD COLUMN IF NOT EXISTS max_project_budget integer;

-- Add matching fields to leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS required_expertise text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS complexity_score decimal,
ADD COLUMN IF NOT EXISTS ai_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_verification_date timestamptz,
ADD COLUMN IF NOT EXISTS call_status text DEFAULT 'not_called' CHECK (call_status IN ('not_called', 'called', 'unreachable'));

-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for portfolios
CREATE POLICY "Users can manage own portfolios"
  ON portfolios
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view portfolios"
  ON portfolios
  FOR SELECT
  USING (true);

-- Policies for admin_settings
CREATE POLICY "Only admins can manage settings"
  ON admin_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can view settings"
  ON admin_settings
  FOR SELECT
  USING (true);

-- Policies for lead_matches
CREATE POLICY "Admins can manage all matches"
  ON lead_matches
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Marketers can view own matches"
  ON lead_matches
  FOR SELECT
  USING (marketer_id = auth.uid());

-- Policies for admin_audit_logs
CREATE POLICY "Only admins can view audit logs"
  ON admin_audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    INSERT INTO admin_audit_logs (
      admin_id,
      action,
      table_name,
      record_id,
      changes
    ) VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      CASE
        WHEN TG_OP = 'DELETE' THEN OLD.id
        ELSE NEW.id
      END,
      CASE
        WHEN TG_OP = 'INSERT' THEN jsonb_build_object('new', row_to_json(NEW))
        WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        WHEN TG_OP = 'DELETE' THEN jsonb_build_object('old', row_to_json(OLD))
      END
    );
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit log triggers
CREATE TRIGGER log_leads_audit
  AFTER INSERT OR UPDATE OR DELETE ON leads
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

CREATE TRIGGER log_users_audit
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

CREATE TRIGGER log_portfolios_audit
  AFTER INSERT OR UPDATE OR DELETE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION log_admin_action();

-- Insert default admin settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('lead_matching', 
   jsonb_build_object(
     'min_score', 0.6,
     'max_matches_per_lead', 5,
     'consider_portfolio', true,
     'consider_expertise', true,
     'consider_budget', true
   ),
   'Configuration for lead-marketer matching algorithm'
  ),
  ('ai_verification',
   jsonb_build_object(
     'enabled', true,
     'min_confidence', 0.8,
     'check_spam', true,
     'check_quality', true
   ),
   'Settings for AI-based lead verification'
  ),
  ('platform',
   jsonb_build_object(
     'maintenance_mode', false,
     'max_portfolio_items', 10,
     'max_images_per_portfolio', 5
   ),
   'General platform settings'
  )
ON CONFLICT (key) DO NOTHING;