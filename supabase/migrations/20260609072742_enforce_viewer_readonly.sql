-- Step 1: Replace the function
CREATE OR REPLACE FUNCTION is_admin(check_write BOOLEAN DEFAULT FALSE)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND (
      check_write = FALSE
      OR role IN ('superadmin', 'editor')
    )
  );
$$;

-- Step 2: Update only the write policies
-- (existing read policies already use is_admin() with no arg — no change needed)

DROP POLICY IF EXISTS "admin_write_categories"        ON categories;
DROP POLICY IF EXISTS "admin_write_tags"              ON tags;
DROP POLICY IF EXISTS "admin_write_posts"             ON posts;
DROP POLICY IF EXISTS "admin_write_post_tags"         ON post_tags;
DROP POLICY IF EXISTS "admin_write_products"          ON products;
DROP POLICY IF EXISTS "admin_write_product_tags"      ON product_tags;
DROP POLICY IF EXISTS "admin_write_entity_media"      ON entity_media;
DROP POLICY IF EXISTS "admin_write_projects"          ON projects;
DROP POLICY IF EXISTS "admin_write_project_tags"      ON project_tags;
DROP POLICY IF EXISTS "admin_write_product_modules"   ON product_modules;
DROP POLICY IF EXISTS "admin_write_module_pricing"    ON module_pricing;
DROP POLICY IF EXISTS "admin_write_media_files"       ON media_files;
DROP POLICY IF EXISTS "admin_write_positions"         ON positions;
DROP POLICY IF EXISTS "admin_write_position_items"    ON position_items;
DROP POLICY IF EXISTS "admin_write_team_members"      ON team_members;
DROP POLICY IF EXISTS "admin_write_page_content"      ON page_content;
DROP POLICY IF EXISTS "admin_write_social_links"      ON social_links;
DROP POLICY IF EXISTS "admin_write_services"          ON services;
DROP POLICY IF EXISTS "admin_write_proposals"         ON proposals;
DROP POLICY IF EXISTS "admin_write_proposal_services" ON proposal_services;
DROP POLICY IF EXISTS "admin_write_proposal_products" ON proposal_products;
DROP POLICY IF EXISTS "admin_write_proposal_projects" ON proposal_projects;

CREATE POLICY "admin_write_categories"        ON categories        FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_tags"              ON tags              FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_posts"             ON posts             FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_post_tags"         ON post_tags         FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_products"          ON products          FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_product_tags"      ON product_tags      FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_entity_media"      ON entity_media      FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_projects"          ON projects          FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_project_tags"      ON project_tags      FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_product_modules"   ON product_modules   FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_module_pricing"    ON module_pricing    FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_media_files"       ON media_files       FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_positions"         ON positions         FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_position_items"    ON position_items    FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_team_members"      ON team_members      FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_page_content"      ON page_content      FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_social_links"      ON social_links      FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_services"          ON services          FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_proposals"         ON proposals         FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_proposal_services" ON proposal_services FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_proposal_products" ON proposal_products FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
CREATE POLICY "admin_write_proposal_projects" ON proposal_projects FOR ALL TO authenticated USING (is_admin(TRUE)) WITH CHECK (is_admin(TRUE));
