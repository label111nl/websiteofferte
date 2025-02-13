-- Drop existing problematic policies
DROP POLICY IF EXISTS "Marketers can only see published leads" ON leads;
DROP POLICY IF EXISTS "Admins can manage lead publishing" ON leads;
DROP POLICY IF EXISTS "Marketers can view approved leads" ON leads;
DROP POLICY IF EXISTS "Admins can manage all leads" ON leads;

-- Create new policies for leads
CREATE POLICY "Admins can manage all leads"
ON leads FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Marketers can view approved and published leads"
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

-- Create quotes policies
CREATE POLICY "Marketers can submit quotes"
ON quotes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'marketer'
  )
);

CREATE POLICY "Marketers can view own quotes"
ON quotes FOR SELECT
USING (marketer_id = auth.uid());

-- Add trigger to notify marketers of new leads
CREATE OR REPLACE FUNCTION notify_marketers_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND NEW.published = true THEN
    INSERT INTO notifications (
      user_id,
      type,
      message
    )
    SELECT 
      id,
      'new_lead',
      'A new lead is available: ' || NEW.company_name
    FROM users
    WHERE role = 'marketer'
    AND subscription_type = 'premium';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_approved_published
  AFTER UPDATE OF status, published ON leads
  FOR EACH ROW
  WHEN (NEW.status = 'approved' AND NEW.published = true)
  EXECUTE FUNCTION notify_marketers_new_lead();