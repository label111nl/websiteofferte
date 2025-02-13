-- Drop existing problematic policies
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Only admins and authors can manage blog posts" ON blog_posts;

-- Fix blog posts policies
CREATE POLICY "Anyone can read published blog posts"
ON blog_posts FOR SELECT
USING (
  status = 'published' OR (
    auth.uid() IS NOT NULL AND (
      author_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'admin'
      )
    )
  )
);

CREATE POLICY "Admins can manage all blog posts"
ON blog_posts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Add missing fields to blog_posts
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS meta_keywords text[],
ADD COLUMN IF NOT EXISTS reading_time integer,
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- Create function to estimate reading time
CREATE OR REPLACE FUNCTION calculate_reading_time(content text)
RETURNS integer AS $$
DECLARE
  words integer;
  reading_time integer;
BEGIN
  -- Count words (rough estimate)
  words := array_length(regexp_split_to_array(content, '\s+'), 1);
  -- Assume average reading speed of 200 words per minute
  reading_time := GREATEST(1, CEIL(words::float / 200));
  RETURN reading_time;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate reading time
CREATE OR REPLACE FUNCTION update_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reading_time := calculate_reading_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_reading_time
  BEFORE INSERT OR UPDATE OF content ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_reading_time();

-- Create view for blog post statistics
CREATE OR REPLACE VIEW blog_post_stats AS
SELECT 
  bp.id,
  bp.title,
  bp.views,
  bp.reading_time,
  COUNT(DISTINCT bpc.category_id) as category_count,
  COUNT(DISTINCT bpt.tag_id) as tag_count,
  bp.created_at,
  bp.updated_at
FROM blog_posts bp
LEFT JOIN blog_posts_categories bpc ON bp.id = bpc.post_id
LEFT JOIN blog_posts_tags bpt ON bp.id = bpt.post_id
GROUP BY bp.id;

-- Add function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_blog_post_views TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_reading_time TO authenticated;