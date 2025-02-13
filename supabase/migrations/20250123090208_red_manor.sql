/*
  # Lead Workflow Triggers

  1. Triggers
    - Notify marketers when leads are approved and published
    - Update lead status timestamps
    - Track lead status changes
    - Notify admin of new leads

  2. Functions
    - Lead status change handling
    - Notification creation
    - Lead matching
*/

-- Add status tracking timestamps
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS approved_at timestamptz,
ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- Create function to handle lead status changes
CREATE OR REPLACE FUNCTION handle_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Set status timestamps
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.approved_at := CURRENT_TIMESTAMP;
    NEW.published_at := CASE WHEN NEW.published THEN CURRENT_TIMESTAMP ELSE NULL END;
  ELSIF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    NEW.rejected_at := CURRENT_TIMESTAMP;
    NEW.published_at := NULL;
  END IF;

  -- Notify marketers of new approved and published leads
  IF NEW.status = 'approved' AND NEW.published = true AND 
     (OLD.status != 'approved' OR OLD.published = false) THEN
    INSERT INTO notifications (
      user_id,
      type,
      message,
      created_at
    )
    SELECT 
      id,
      'new_lead',
      'Nieuwe lead beschikbaar: ' || NEW.company_name,
      CURRENT_TIMESTAMP
    FROM users
    WHERE role = 'marketer'
    AND subscription_type = 'premium';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for lead status changes
DROP TRIGGER IF EXISTS lead_status_change ON leads;
CREATE TRIGGER lead_status_change
  BEFORE UPDATE OF status, published ON leads
  FOR EACH ROW
  EXECUTE FUNCTION handle_lead_status_change();

-- Create function to notify admin of new leads
CREATE OR REPLACE FUNCTION notify_admin_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify admins of new lead submissions
  INSERT INTO notifications (
    user_id,
    type,
    message,
    created_at
  )
  SELECT 
    id,
    'new_lead_submission',
    'Nieuwe lead aanvraag van ' || NEW.company_name,
    CURRENT_TIMESTAMP
  FROM users
  WHERE role = 'admin';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new lead notifications
DROP TRIGGER IF EXISTS new_lead_notification ON leads;
CREATE TRIGGER new_lead_notification
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_lead();

-- Create function to handle lead matching
CREATE OR REPLACE FUNCTION match_lead_to_marketers()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process approved and published leads
  IF NEW.status = 'approved' AND NEW.published = true AND 
     (OLD.status != 'approved' OR OLD.published = false) THEN
    
    -- Insert into lead_matches table
    INSERT INTO lead_matches (
      lead_id,
      marketer_id,
      match_score,
      status,
      created_at
    )
    SELECT 
      NEW.id,
      u.id,
      -- Calculate match score based on various factors
      (
        CASE WHEN u.min_project_budget <= NEW.budget_range::numeric THEN 0.3 ELSE 0 END +
        CASE WHEN u.max_project_budget >= NEW.budget_range::numeric THEN 0.3 ELSE 0 END +
        CASE WHEN u.expertise && NEW.required_expertise THEN 0.4 ELSE 0 END
      )::decimal AS match_score,
      'pending',
      CURRENT_TIMESTAMP
    FROM users u
    WHERE u.role = 'marketer'
    AND u.subscription_type = 'premium'
    AND u.portfolio_complete = true
    -- Only create matches with a reasonable score
    HAVING (
      CASE WHEN u.min_project_budget <= NEW.budget_range::numeric THEN 0.3 ELSE 0 END +
      CASE WHEN u.max_project_budget >= NEW.budget_range::numeric THEN 0.3 ELSE 0 END +
      CASE WHEN u.expertise && NEW.required_expertise THEN 0.4 ELSE 0 END
    )::decimal >= 0.5;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for lead matching
DROP TRIGGER IF EXISTS lead_matching ON leads;
CREATE TRIGGER lead_matching
  AFTER UPDATE OF status, published ON leads
  FOR EACH ROW
  EXECUTE FUNCTION match_lead_to_marketers();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_published ON leads(published);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_approved_at ON leads(approved_at);
CREATE INDEX IF NOT EXISTS idx_leads_budget_range ON leads(budget_range);

COMMENT ON FUNCTION handle_lead_status_change IS 'Handles lead status changes and notifications';
COMMENT ON FUNCTION notify_admin_new_lead IS 'Notifies admins of new lead submissions';
COMMENT ON FUNCTION match_lead_to_marketers IS 'Matches leads to suitable marketers based on criteria';