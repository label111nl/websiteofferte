-- Drop existing policies for leads table
DROP POLICY IF EXISTS "Admins can manage all leads" ON leads;
DROP POLICY IF EXISTS "Marketers can view approved leads" ON leads;
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;

-- Recreate policies with proper permissions
CREATE POLICY "Admins can manage all leads"
ON leads FOR ALL
USING (is_admin());

CREATE POLICY "Marketers can view approved leads"
ON leads FOR SELECT
USING (
  status = 'approved' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'marketer'
  )
);

-- Allow anyone to create new leads
CREATE POLICY "Anyone can create leads"
ON leads
FOR INSERT
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;