/*
  # Add Additional Services to Leads Schema

  1. New Fields
    - Add additional service fields to leads table
    - Add service requirements tracking
    - Add service budget fields

  2. Updates
    - Add constraints for service fields
    - Add default values
*/

-- Add additional service fields to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS additional_services jsonb DEFAULT '{
  "logo_design": false,
  "branding": false,
  "seo": false,
  "google_ads": false,
  "social_media": false,
  "content_creation": false,
  "copywriting": false,
  "email_marketing": false,
  "maintenance": false
}';

-- Add service requirements fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_requirements jsonb DEFAULT '{}';

-- Add service budgets
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_budgets jsonb DEFAULT '{}';

-- Add service details
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_details jsonb DEFAULT '{}';

-- Create type for service status
DO $$ BEGIN
  CREATE TYPE service_status AS ENUM ('requested', 'approved', 'in_progress', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add service status tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_status jsonb DEFAULT '{}';

-- Add function to validate service fields
CREATE OR REPLACE FUNCTION validate_service_fields()
RETURNS trigger AS $$
BEGIN
  -- Ensure additional_services is a valid JSON object with boolean values
  IF NOT (NEW.additional_services ? 'logo_design' AND 
          NEW.additional_services ? 'branding' AND
          NEW.additional_services ? 'seo' AND
          NEW.additional_services ? 'google_ads' AND
          NEW.additional_services ? 'social_media' AND
          NEW.additional_services ? 'content_creation' AND
          NEW.additional_services ? 'copywriting' AND
          NEW.additional_services ? 'email_marketing' AND
          NEW.additional_services ? 'maintenance') THEN
    RAISE EXCEPTION 'Invalid additional_services structure';
  END IF;

  -- Initialize service_requirements if null
  IF NEW.service_requirements IS NULL THEN
    NEW.service_requirements := '{}';
  END IF;

  -- Initialize service_budgets if null
  IF NEW.service_budgets IS NULL THEN
    NEW.service_budgets := '{}';
  END IF;

  -- Initialize service_details if null
  IF NEW.service_details IS NULL THEN
    NEW.service_details := '{}';
  END IF;

  -- Initialize service_status if null
  IF NEW.service_status IS NULL THEN
    NEW.service_status := '{}';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for service field validation
DROP TRIGGER IF EXISTS validate_services ON leads;
CREATE TRIGGER validate_services
  BEFORE INSERT OR UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION validate_service_fields();

-- Add index for faster service queries
CREATE INDEX IF NOT EXISTS idx_leads_additional_services ON leads USING gin (additional_services);

-- Update existing leads with default values
UPDATE leads
SET 
  additional_services = '{
    "logo_design": false,
    "branding": false,
    "seo": false,
    "google_ads": false,
    "social_media": false,
    "content_creation": false,
    "copywriting": false,
    "email_marketing": false,
    "maintenance": false
  }',
  service_requirements = '{}',
  service_budgets = '{}',
  service_details = '{}',
  service_status = '{}'
WHERE additional_services IS NULL;

COMMENT ON COLUMN leads.additional_services IS 'Tracks which additional services are requested';
COMMENT ON COLUMN leads.service_requirements IS 'Specific requirements for each requested service';
COMMENT ON COLUMN leads.service_budgets IS 'Budget allocation for each requested service';
COMMENT ON COLUMN leads.service_details IS 'Additional details for each service';
COMMENT ON COLUMN leads.service_status IS 'Status tracking for each service';