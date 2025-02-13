-- Create blog categories table
CREATE TABLE blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  seo_keywords text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog post categories junction table
CREATE TABLE blog_posts_categories (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Create blog tags table
CREATE TABLE blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create blog post tags junction table
CREATE TABLE blog_posts_tags (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_tags ENABLE ROW LEVEL SECURITY;

-- Policies for blog categories
CREATE POLICY "Anyone can read blog categories"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage blog categories"
  ON blog_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policies for blog posts
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR (
    auth.uid() IS NOT NULL AND author_id = auth.uid()
  ));

CREATE POLICY "Only admins and authors can manage blog posts"
  ON blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (role = 'admin' OR id = blog_posts.author_id)
    )
  );

-- Policies for blog tags
CREATE POLICY "Anyone can read blog tags"
  ON blog_tags FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage blog tags"
  ON blog_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policies for junction tables
CREATE POLICY "Anyone can read post categories"
  ON blog_posts_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage post categories"
  ON blog_posts_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can read post tags"
  ON blog_posts_tags FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage post tags"
  ON blog_posts_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(title text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate slugs for blog posts
CREATE OR REPLACE FUNCTION blog_posts_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_before_insert_update
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION blog_posts_generate_slug();

-- Trigger to automatically generate slugs for categories
CREATE OR REPLACE FUNCTION blog_categories_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_categories_before_insert_update
  BEFORE INSERT OR UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION blog_categories_generate_slug();

-- Trigger to automatically generate slugs for tags
CREATE OR REPLACE FUNCTION blog_tags_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_tags_before_insert_update
  BEFORE INSERT OR UPDATE ON blog_tags
  FOR EACH ROW
  EXECUTE FUNCTION blog_tags_generate_slug();

-- Insert some default categories
INSERT INTO blog_categories (name, description) VALUES
  ('Web Development', 'Articles about web development and best practices'),
  ('Design', 'Articles about web design and UI/UX'),
  ('Marketing', 'Digital marketing tips and strategies'),
  ('Business', 'Business advice and entrepreneurship'),
  ('Technology', 'Latest tech news and trends')
ON CONFLICT (name) DO NOTHING;

-- Insert some default tags
INSERT INTO blog_tags (name) VALUES
  ('JavaScript'),
  ('React'),
  ('CSS'),
  ('HTML'),
  ('SEO'),
  ('UI/UX'),
  ('Performance'),
  ('Security'),
  ('WordPress'),
  ('E-commerce')
ON CONFLICT (name) DO NOTHING;