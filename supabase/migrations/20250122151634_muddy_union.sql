-- Add published field to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;

-- Update existing leads to be published
UPDATE leads SET published = true WHERE published IS NULL;

-- Add policies for published field
CREATE POLICY "Marketers can only see published leads"
ON leads FOR SELECT
USING (
  published = true AND
  status = 'approved' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'marketer'
  )
);

CREATE POLICY "Admins can manage lead publishing"
ON leads FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);