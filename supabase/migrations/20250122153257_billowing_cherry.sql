-- First check if published column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'leads' 
    AND column_name = 'published'
  ) THEN
    ALTER TABLE leads ADD COLUMN published boolean DEFAULT false;
  END IF;
END $$;

-- Drop existing policies safely
DO $$ 
BEGIN
  -- Drop policies if they exist
  EXECUTE (
    SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON leads;', E'\n')
    FROM pg_policies 
    WHERE tablename = 'leads'
  );
END $$;

-- Update existing leads to have proper status and published values
UPDATE leads 
SET status = COALESCE(status, 'pending'),
    published = COALESCE(published, false);

-- Add NOT NULL constraints if not already present
DO $$ 
BEGIN
  ALTER TABLE leads ALTER COLUMN status SET NOT NULL;
  EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE leads ALTER COLUMN published SET NOT NULL;
  EXCEPTION WHEN others THEN NULL;
END $$;

-- Create new policies
CREATE POLICY "admins_all_access"
ON leads FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "marketers_view_approved"
ON leads FOR SELECT
USING (
  status = 'approved' AND
  published = true AND
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'marketer'
  )
);

CREATE POLICY "public_create"
ON leads FOR INSERT
WITH CHECK (true);

-- Create function to handle lead status changes
CREATE OR REPLACE FUNCTION handle_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically publish leads when they are approved
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.published := true;
  END IF;

  -- Automatically unpublish leads when they are rejected or pending
  IF NEW.status IN ('rejected', 'pending') THEN
    NEW.published := false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for lead status changes
DROP TRIGGER IF EXISTS lead_status_change ON leads;
CREATE TRIGGER lead_status_change
  BEFORE UPDATE OF status ON leads
  FOR EACH ROW
  EXECUTE FUNCTION handle_lead_status_change();