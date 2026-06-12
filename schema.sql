-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE post_type            AS ENUM ('blog', 'linkedin');
CREATE TYPE employment_type      AS ENUM ('Full-time', 'Part-time', 'Contract', 'Internship');
CREATE TYPE admin_role           AS ENUM ('superadmin', 'editor', 'viewer');
CREATE TYPE audit_action         AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');
CREATE TYPE media_type           AS ENUM ('image', 'video', 'audio');
CREATE TYPE permission_section   AS ENUM (
  'careers', 'blog_posts', 'products', 'projects', 'linkedin_posts',
  'media', 'team', 'home', 'services', 'xplor', 'ims'
);
CREATE TYPE page_key             AS ENUM ('home', 'services', 'xplor', 'ims', 'team');
CREATE TYPE social_platform      AS ENUM ('linkedin', 'instagram', 'discord');
CREATE TYPE proposal_status      AS ENUM ('new', 'in_review', 'accepted', 'rejected', 'archived');
CREATE TYPE category_scope       AS ENUM ('post', 'product', 'service', 'project');
CREATE TYPE position_item_kind   AS ENUM ('responsibility', 'requirement', 'benefit');
CREATE TYPE pricing_tier         AS ENUM ('basic', 'standard', 'premium');
CREATE TYPE budget_type          AS ENUM ('fixed', 'range', 'flexible');

-- CHANGE 2: New ENUM for service URL route classification
CREATE TYPE service_url_type     AS ENUM ('internal', 'external');

-- CHANGE 3: New ENUMs replacing publish/active BOOLEANs
CREATE TYPE product_status       AS ENUM ('draft', 'published', 'archived');
CREATE TYPE project_status       AS ENUM ('ongoing', 'completed', 'archived');

-- CHANGE 4: New ENUMs for proposal enrichment
CREATE TYPE proposal_priority    AS ENUM ('low', 'normal', 'high');
CREATE TYPE proposal_channel     AS ENUM ('website', 'referral', 'email', 'linkedin', 'other');

-- ============================================================
-- REMOVED ENUMS (no longer needed after changes)
-- ============================================================
-- entity_media_type  — REMOVED: entity_media now uses explicit FKs (Change 1)
-- proposal_source_type — REMOVED: proposals now uses explicit FKs (Change 1)

-- ============================================================
-- TABLE: media_files
-- ============================================================
CREATE TABLE media_files (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path    TEXT        NOT NULL UNIQUE,
  public_url      TEXT        NOT NULL,
  file_name       TEXT        NOT NULL,
  mime_type       TEXT        NOT NULL,
  media_type      media_type  NOT NULL,
  size_bytes      BIGINT      NOT NULL CHECK (size_bytes > 0),
  uploaded_by     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE media_files IS
  'Central registry for all uploaded assets. All other tables reference this via FK, never raw URLs.';

CREATE INDEX idx_media_files_created ON media_files (created_at DESC);
CREATE INDEX idx_media_files_type    ON media_files (media_type);

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE categories (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  label           TEXT            NOT NULL CHECK (char_length(label) BETWEEN 1 AND 100),
  scope           category_scope  NOT NULL,
  slug            TEXT            NOT NULL CHECK (char_length(slug) BETWEEN 1 AND 120),
  display_order   INT             NOT NULL DEFAULT 0,
  active          BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),

  UNIQUE (slug, scope)
);

COMMENT ON TABLE categories IS
  'Controlled category vocabulary for posts, products, services, and projects.';

CREATE INDEX idx_categories_scope ON categories (scope, display_order) WHERE active = TRUE;

-- ============================================================
-- CHANGE 5: TABLE: tags (normalized tag registry)
-- ============================================================
CREATE TABLE tags (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT    NOT NULL UNIQUE CHECK (char_length(slug) BETWEEN 1 AND 100),
  label       TEXT    NOT NULL CHECK (char_length(label) BETWEEN 1 AND 100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE tags IS
  'Normalized tag registry. slug is the unique canonical key (lowercase, hyphenated).
   label is the human-readable display name.
   Custom tags are created via upsert (INSERT ... ON CONFLICT DO NOTHING).';

CREATE INDEX idx_tags_label_trgm ON tags USING gin (label gin_trgm_ops);

-- ============================================================
-- TABLE: posts
-- ============================================================
CREATE TABLE posts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type          post_type   NOT NULL,
  title         TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 300),
  slug          TEXT        UNIQUE,
  excerpt       TEXT        CHECK (char_length(excerpt) <= 500),
  content       TEXT,
  category_id   UUID        REFERENCES categories(id) ON DELETE SET NULL,
  -- CHANGE 5: tags TEXT[] column REMOVED — replaced by post_tags junction table
  featured      BOOLEAN     NOT NULL DEFAULT FALSE,
  image_id      UUID        REFERENCES media_files(id) ON DELETE SET NULL,

  linkedin_url  TEXT        CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https://'),

  author_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

  published_at  DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_blog_requires_content
    CHECK (type <> 'blog'     OR content IS NOT NULL),
  CONSTRAINT chk_linkedin_requires_url
    CHECK (type <> 'linkedin' OR linkedin_url IS NOT NULL)
);

COMMENT ON TABLE posts IS
  'Blog posts and LinkedIn embeds for the Insights feed.
   Tags are stored in the post_tags junction table (Change 5).';

CREATE INDEX idx_posts_type      ON posts (type);
CREATE INDEX idx_posts_featured  ON posts (featured) WHERE featured = TRUE;
CREATE INDEX idx_posts_published ON posts (published_at DESC);
CREATE INDEX idx_posts_category  ON posts (category_id);
CREATE INDEX idx_posts_fts       ON posts USING gin (
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,''))
);

-- ============================================================
-- CHANGE 5: Junction table for post tags
-- ============================================================
CREATE TABLE post_tags (
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id      UUID NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

COMMENT ON TABLE post_tags IS
  'Many-to-many junction between posts and the normalized tags table.';

CREATE INDEX idx_post_tags_tag ON post_tags (tag_id);

-- ============================================================
-- TABLE: products
-- CHANGE 3: publish BOOLEAN → status product_status ENUM
-- CHANGE 5: tags TEXT[] REMOVED → product_tags junction table
-- ============================================================
CREATE TABLE products (
  id            UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT            NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  overview      TEXT            CHECK (char_length(overview) <= 500),
  description   TEXT,
  category_id   UUID            REFERENCES categories(id) ON DELETE SET NULL,
  -- CHANGE 5: tags TEXT[] column REMOVED — replaced by product_tags junction table
  cover_id      UUID            REFERENCES media_files(id) ON DELETE SET NULL,
  featured      BOOLEAN         NOT NULL DEFAULT FALSE,
  -- CHANGE 3: replaced "publish BOOLEAN" with status ENUM
  status        product_status  NOT NULL DEFAULT 'draft',
  published_at  DATE            NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT now()
);

COMMENT ON TABLE products IS
  'Portfolio product entries.
   overview     = short tagline shown on cards.
   description  = full rich-text body.
   cover_id     = FK to media_files.
   status       = product_status ENUM (draft, published, archived) — replaces publish BOOLEAN.
   Tags stored in product_tags junction table (Change 5).
   Media gallery stored in entity_media (using explicit product_id FK — Change 1).
   Modules and pricing in product_modules / module_pricing.';

CREATE INDEX idx_products_featured  ON products (featured) WHERE featured = TRUE;
CREATE INDEX idx_products_status    ON products (status)   WHERE status = 'published';
CREATE INDEX idx_products_category  ON products (category_id);

-- ============================================================
-- CHANGE 5: Junction table for product tags
-- ============================================================
CREATE TABLE product_tags (
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id      UUID NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

COMMENT ON TABLE product_tags IS
  'Many-to-many junction between products and the normalized tags table.';

CREATE INDEX idx_product_tags_tag ON product_tags (tag_id);

-- ============================================================
-- TABLE: projects
-- CHANGE 3: publish BOOLEAN → status project_status ENUM
-- CHANGE 5: tags TEXT[] REMOVED → project_tags junction table
-- ============================================================
CREATE TABLE projects (
  id            UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT            NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description   TEXT,
  category_id   UUID            REFERENCES categories(id) ON DELETE SET NULL,
  -- CHANGE 5: tags TEXT[] column REMOVED — replaced by project_tags junction table
  featured      BOOLEAN         NOT NULL DEFAULT FALSE,
  -- CHANGE 3: replaced "publish BOOLEAN" with status ENUM
  status        project_status  NOT NULL DEFAULT 'ongoing',
  cover_id      UUID            REFERENCES media_files(id) ON DELETE SET NULL,
  published_at  DATE            NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT now()
);

COMMENT ON TABLE projects IS
  'Portfolio project entries.
   status       = project_status ENUM (ongoing, completed, archived) — replaces publish BOOLEAN.
   Tags stored in project_tags junction table (Change 5).
   Media gallery in entity_media (using explicit project_id FK — Change 1).
   category_id is a FK to categories(scope=project).';

CREATE INDEX idx_projects_featured  ON projects (featured)    WHERE featured = TRUE;
CREATE INDEX idx_projects_status    ON projects (status)      WHERE status IN ('ongoing', 'completed');
CREATE INDEX idx_projects_category  ON projects (category_id);
CREATE INDEX idx_projects_published ON projects (published_at DESC);

-- ============================================================
-- CHANGE 5: Junction table for project tags
-- ============================================================
CREATE TABLE project_tags (
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag_id      UUID NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

COMMENT ON TABLE project_tags IS
  'Many-to-many junction between projects and the normalized tags table.';

CREATE INDEX idx_project_tags_tag ON project_tags (tag_id);

-- ============================================================
-- TABLE: entity_media
-- CHANGE 1: Polymorphic → Exclusive Arcs with explicit FKs
-- ============================================================
CREATE TABLE entity_media (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id        UUID        NOT NULL REFERENCES media_files(id) ON DELETE RESTRICT,

  -- CHANGE 1: explicit nullable FKs replace entity_type + entity_id
  product_id      UUID        REFERENCES products(id) ON DELETE CASCADE,
  project_id      UUID        REFERENCES projects(id) ON DELETE CASCADE,

  display_order   INT         NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- CHANGE 1: exactly one parent must be set
  CONSTRAINT chk_exclusive_entity CHECK (
    num_nonnulls(product_id, project_id) = 1
  ),

  -- Prevent duplicate media per parent
  CONSTRAINT uq_product_media UNIQUE (product_id, media_id),
  CONSTRAINT uq_project_media UNIQUE (project_id, media_id)
);

COMMENT ON TABLE entity_media IS
  'Unified ordered media gallery for products and projects.
   CHANGE 1: Replaced polymorphic entity_type/entity_id with explicit nullable FKs
   (product_id, project_id). A CHECK constraint enforces that exactly one is non-null.
   Native ON DELETE CASCADE handles cleanup — no triggers needed.
   RESTRICT on media_id prevents orphaned gallery items.';

CREATE INDEX idx_entity_media_product ON entity_media (product_id, display_order) WHERE product_id IS NOT NULL;
CREATE INDEX idx_entity_media_project ON entity_media (project_id, display_order) WHERE project_id IS NOT NULL;
CREATE INDEX idx_entity_media_media   ON entity_media (media_id);

-- ============================================================
-- TABLE: product_modules
-- ============================================================
CREATE TABLE product_modules (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description     TEXT,
  display_order   INT         NOT NULL DEFAULT 0,
  active          BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE product_modules IS
  'Each product can have a variable number of modules.
   description is unrestricted TEXT — rich formatting lives at the app layer.
   Ordered by display_order per product.';

CREATE INDEX idx_product_modules_product ON product_modules (product_id, display_order);

-- ============================================================
-- TABLE: module_pricing
-- ============================================================
CREATE TABLE module_pricing (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id       UUID          NOT NULL REFERENCES product_modules(id) ON DELETE CASCADE,
  tier            pricing_tier  NOT NULL,
  price_amount    NUMERIC(12,2) NOT NULL CHECK (price_amount >= 0),
  currency        CHAR(3)       NOT NULL DEFAULT 'USD'
                                CHECK (currency = upper(currency)),
  billing_cycle   TEXT          NOT NULL DEFAULT 'monthly'
                                CHECK (billing_cycle IN ('monthly','annual','one-time','custom')),
  details         JSONB         NOT NULL DEFAULT '{}',

  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),

  UNIQUE (module_id, tier)
);

COMMENT ON TABLE module_pricing IS
  'Three pricing tiers (basic / standard / premium) per product module.
   details JSONB stores feature list, CTA label, etc.
   Application layer validates JSONB shape via Zod / JSON Schema.';

CREATE INDEX idx_module_pricing_module ON module_pricing (module_id);

-- ============================================================
-- TABLE: positions
-- ============================================================
CREATE TABLE positions (
  id                UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT              NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  department        TEXT              NOT NULL CHECK (char_length(department) <= 100),
  location          TEXT              NOT NULL CHECK (char_length(location) <= 200),
  employment_type   employment_type   NOT NULL,
  description       TEXT,
  active            BOOLEAN           NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ       NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ       NOT NULL DEFAULT now()
);

COMMENT ON TABLE positions IS
  'Job postings. employment_type is an enum.
   Responsibilities, requirements, and benefits are unified in position_items (kind column).
   team_members can optionally reference a position via position_id FK (Change 6).';

CREATE INDEX idx_positions_active ON positions (active) WHERE active = TRUE;
CREATE INDEX idx_positions_dept   ON positions (department);

-- ============================================================
-- TABLE: position_items
-- ============================================================
CREATE TABLE position_items (
  id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id     UUID                NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
  kind            position_item_kind  NOT NULL,
  body            TEXT                NOT NULL CHECK (char_length(body) BETWEEN 1 AND 500),
  display_order   INT                 NOT NULL DEFAULT 0,

  CONSTRAINT uq_position_item_order UNIQUE (position_id, kind, display_order) DEFERRABLE INITIALLY DEFERRED
);

COMMENT ON TABLE position_items IS
  'Merged replacement for position_responsibilities, position_requirements, and position_benefits.
   kind enum distinguishes the three categories.
   CASCADE delete removes items when the parent position is deleted.
   display_order is unique per (position, kind) — deferrable to allow bulk reorder in one txn.';

CREATE INDEX idx_position_items_position ON position_items (position_id, kind, display_order);

-- ============================================================
-- TABLE: team_members
-- CHANGE 6: role TEXT → position_id FK to positions table
-- ============================================================
CREATE TABLE team_members (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  -- CHANGE 6: replaced free-text "role TEXT" with FK to positions table
  position_id     UUID        REFERENCES positions(id) ON DELETE SET NULL,
  bio             TEXT        CHECK (char_length(bio) <= 2000),
  photo_id        UUID        REFERENCES media_files(id) ON DELETE SET NULL,
  linkedin_url    TEXT        CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https://linkedin\.com'),
  display_order   INT         NOT NULL DEFAULT 0,
  active          BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE team_members IS
  'Team member profiles. photo_id is a FK to media_files.
   CHANGE 6: role is now derived from positions table via position_id FK,
   eliminating free-text duplication and ensuring consistency with HR data.';

CREATE INDEX idx_team_members_order    ON team_members (display_order) WHERE active = TRUE;
CREATE INDEX idx_team_members_position ON team_members (position_id);

-- ============================================================
-- TABLE: admin_users
-- ============================================================
CREATE TABLE admin_users (
  id              UUID            PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT            NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  roll_no         TEXT            NOT NULL UNIQUE CHECK (char_length(roll_no) BETWEEN 1 AND 50),
  role            admin_role      NOT NULL DEFAULT 'editor',
  employment_type employment_type NOT NULL DEFAULT 'Full-time',
  email           TEXT            NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

COMMENT ON TABLE admin_users IS
  'Application-level admin profile extending auth.users.
   role = superadmin → can edit all sections, create/update/delete other admins, and assign permissions.
   role = editor / viewer → access controlled via admin_permissions rows.
   RLS policies enforce the superadmin bypass.';

-- ============================================================
-- TABLE: admin_permissions
-- ============================================================
CREATE TABLE admin_permissions (
  id          UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID               NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  section     permission_section NOT NULL,
  can_read    BOOLEAN            NOT NULL DEFAULT TRUE,
  can_write   BOOLEAN            NOT NULL DEFAULT FALSE,

  UNIQUE (user_id, section)
);

COMMENT ON TABLE admin_permissions IS
  'Per-section permissions for editor/viewer admins.
   Superadmin rows do NOT need entries here — full access by RLS policy.';

CREATE INDEX idx_admin_permissions_user ON admin_permissions (user_id);

-- ============================================================
-- TABLE: page_content
-- ============================================================
CREATE TABLE page_content (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  page        page_key    NOT NULL UNIQUE,
  content     JSONB       NOT NULL DEFAULT '{}',
  updated_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE page_content IS
  'Unified CMS for all admin-editable pages. page is enum-typed.
   Content shape is validated by Zod schemas at the application layer.';

-- ============================================================
-- TABLE: page_content_history
-- ============================================================
CREATE TABLE page_content_history (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  page        page_key    NOT NULL,
  content     JSONB       NOT NULL,
  changed_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE page_content_history IS
  'Version history for page_content. 20 most recent versions per page are retained.';

CREATE INDEX idx_page_history_page ON page_content_history (page, changed_at DESC);

-- ============================================================
-- TABLE: social_links
-- ============================================================
CREATE TABLE social_links (
  id          UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  platform    social_platform   NOT NULL UNIQUE,
  url         TEXT              NOT NULL CHECK (url ~* '^https://')
);

COMMENT ON TABLE social_links IS
  'Social links keyed by enum platform. UNIQUE prevents duplicate platform entries.';

-- ============================================================
-- TABLE: services
-- CHANGE 2: Added url_type ENUM for internal/external route classification
-- ============================================================
CREATE TABLE services (
  id              UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT             NOT NULL UNIQUE CHECK (char_length(title) BETWEEN 1 AND 200),
  bg_image_id     UUID             REFERENCES media_files(id) ON DELETE SET NULL,
  icon_image_id   UUID             REFERENCES media_files(id) ON DELETE SET NULL,
  url             TEXT             CHECK (url IS NULL OR url ~* '^https?://'),
  -- CHANGE 2: classifies the url as internal or external route
  url_type        service_url_type NOT NULL DEFAULT 'external',
  active          BOOLEAN          NOT NULL DEFAULT TRUE,
  publish         BOOLEAN          NOT NULL DEFAULT FALSE,
  display_order   INT              NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ      NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ      NOT NULL DEFAULT now()
);

COMMENT ON TABLE services IS
  'Service cards for the public site and proposal form.
   bg_image_id / icon_image_id reference media_files.
   publish controls public visibility; active controls proposal form visibility.
   CHANGE 2: url_type (internal/external) classifies whether the URL points to
   an internal route or an external website. This enables the app layer to render
   internal links with client-side navigation and external links with target="_blank".';

CREATE INDEX idx_services_active  ON services (display_order) WHERE active  = TRUE;
CREATE INDEX idx_services_publish ON services (display_order) WHERE publish = TRUE;

-- ============================================================
-- TABLE: proposals
-- CHANGE 1: Polymorphic source_type/source_id → explicit FKs
-- CHANGE 4: Added priority and source_channel ENUMs
-- ============================================================
CREATE TABLE proposals (
  id              UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),

  name            TEXT                 NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email           TEXT                 NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone           TEXT                 CHECK (char_length(phone) <= 30),
  company         TEXT                 CHECK (char_length(company) <= 200),

  subject         TEXT                 CHECK (char_length(subject) <= 300),
  message         TEXT                 CHECK (char_length(message) <= 5000),

  budget_type     budget_type,
  budget_min      NUMERIC(12,2)        CHECK (budget_min >= 0),
  budget_max      NUMERIC(12,2)        CHECK (budget_max >= 0),
  budget_label    TEXT                 CHECK (char_length(budget_label) <= 100),

  -- CHANGE 1: replaced polymorphic source_type/source_id with explicit nullable FKs
  source_product_id  UUID  REFERENCES products(id) ON DELETE SET NULL,
  source_service_id  UUID  REFERENCES services(id) ON DELETE SET NULL,
  source_project_id  UUID  REFERENCES projects(id) ON DELETE SET NULL,

  -- CHANGE 4: new enrichment columns
  priority        proposal_priority    NOT NULL DEFAULT 'normal',
  source_channel  proposal_channel,

  status          proposal_status      NOT NULL DEFAULT 'new',
  reviewed_by     UUID                 REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  admin_notes     TEXT                 CHECK (char_length(admin_notes) <= 2000),

  created_at      TIMESTAMPTZ          NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ          NOT NULL DEFAULT now(),

  -- CHANGE 1: at most one source can be set (0 or 1)
  CONSTRAINT chk_single_source CHECK (
    num_nonnulls(source_product_id, source_service_id, source_project_id) <= 1
  ),
  CONSTRAINT chk_budget_range
    CHECK (budget_max IS NULL OR budget_min IS NULL OR budget_max >= budget_min)
);

COMMENT ON TABLE proposals IS
  'Contact form / proposal submissions from the public site.
   CHANGE 1: source_type/source_id replaced with explicit nullable FKs
   (source_product_id, source_service_id, source_project_id). A CHECK constraint
   ensures at most one source is set. Native ON DELETE SET NULL handles cleanup.
   CHANGE 4: priority ENUM (low/normal/high) and source_channel ENUM
   (website/referral/email/linkedin/other) added for triage and analytics.
   Services selected are in proposal_services; products in proposal_products.';

CREATE INDEX idx_proposals_status   ON proposals (status, created_at DESC);
CREATE INDEX idx_proposals_created  ON proposals (created_at DESC);
CREATE INDEX idx_proposals_email    ON proposals (email);
CREATE INDEX idx_proposals_priority ON proposals (priority);
CREATE INDEX idx_proposals_channel  ON proposals (source_channel) WHERE source_channel IS NOT NULL;
CREATE INDEX idx_proposals_source_product ON proposals (source_product_id) WHERE source_product_id IS NOT NULL;
CREATE INDEX idx_proposals_source_service ON proposals (source_service_id) WHERE source_service_id IS NOT NULL;
CREATE INDEX idx_proposals_source_project ON proposals (source_project_id) WHERE source_project_id IS NOT NULL;

-- ============================================================
-- TABLE: proposal_services
-- ============================================================
CREATE TABLE proposal_services (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id     UUID        NOT NULL REFERENCES proposals(id)  ON DELETE CASCADE,
  service_id      UUID        NOT NULL REFERENCES services(id)   ON DELETE RESTRICT,

  UNIQUE (proposal_id, service_id)
);

COMMENT ON TABLE proposal_services IS
  'Many-to-many between proposals and services.
   RESTRICT on service delete prevents silent data loss on active proposals.';

CREATE INDEX idx_proposal_services_proposal ON proposal_services (proposal_id);
CREATE INDEX idx_proposal_services_service  ON proposal_services (service_id);

-- ============================================================
-- TABLE: proposal_products
-- ============================================================
CREATE TABLE proposal_products (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id     UUID        NOT NULL REFERENCES proposals(id)  ON DELETE CASCADE,
  product_id      UUID        NOT NULL REFERENCES products(id)   ON DELETE RESTRICT,

  UNIQUE (proposal_id, product_id)
);

COMMENT ON TABLE proposal_products IS
  'Many-to-many between proposals and products.
   RESTRICT on product delete prevents silent data loss on active proposals.';

CREATE INDEX idx_proposal_products_proposal ON proposal_products (proposal_id);
CREATE INDEX idx_proposal_products_product  ON proposal_products (product_id);

-- ============================================================
-- TABLE: proposal_projects
-- ============================================================
CREATE TABLE proposal_projects (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id     UUID        NOT NULL REFERENCES proposals(id)  ON DELETE CASCADE,
  project_id      UUID        NOT NULL REFERENCES projects(id)   ON DELETE RESTRICT,

  UNIQUE (proposal_id, project_id)
);

COMMENT ON TABLE proposal_projects IS
  'Many-to-many between proposals and portfolio projects.
   RESTRICT on project delete prevents silent data loss on active proposals.';

CREATE INDEX idx_proposal_projects_proposal ON proposal_projects (proposal_id);
CREATE INDEX idx_proposal_projects_project  ON proposal_projects (project_id);

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE audit_logs (
  id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID            REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email  TEXT            NOT NULL,
  user_name   TEXT            NOT NULL,
  action      audit_action    NOT NULL,
  entity      TEXT,
  entity_id   TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT now()
);

COMMENT ON TABLE audit_logs IS
  'Append-only admin action log. action is an enum. user identity is denormalised for permanence.';

CREATE INDEX idx_audit_created ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_user    ON audit_logs (user_id);
CREATE INDEX idx_audit_entity  ON audit_logs (entity, entity_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Audit log immutability
CREATE OR REPLACE FUNCTION fn_protect_audit_logs()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only — UPDATE and DELETE are not permitted.';
END;
$$;

CREATE TRIGGER trg_audit_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION fn_protect_audit_logs();

-- Auto-set updated_at on UPDATE
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_product_modules_updated_at
  BEFORE UPDATE ON product_modules
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_module_pricing_updated_at
  BEFORE UPDATE ON module_pricing
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_positions_updated_at
  BEFORE UPDATE ON positions
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- CHANGE 1: REMOVED — fn_cascade_entity_media trigger (no longer needed, native FK CASCADE handles it)
-- CHANGE 1: REMOVED — fn_nullify_proposal_source trigger (no longer needed, native FK SET NULL handles it)

-- Category scope enforcement via trigger (unchanged)
CREATE OR REPLACE FUNCTION fn_check_category_scope()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  expected_scope  category_scope := TG_ARGV[0]::category_scope;
  actual_scope    category_scope;
BEGIN
  IF NEW.category_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT scope INTO actual_scope FROM categories WHERE id = NEW.category_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'category_id % does not exist', NEW.category_id;
  END IF;
  IF actual_scope <> expected_scope THEN
    RAISE EXCEPTION 'category scope mismatch: expected %, got % for category_id %',
      expected_scope, actual_scope, NEW.category_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_posts_check_category_scope
  BEFORE INSERT OR UPDATE OF category_id ON posts
  FOR EACH ROW EXECUTE FUNCTION fn_check_category_scope('post');

CREATE TRIGGER trg_products_check_category_scope
  BEFORE INSERT OR UPDATE OF category_id ON products
  FOR EACH ROW EXECUTE FUNCTION fn_check_category_scope('product');

CREATE TRIGGER trg_projects_check_category_scope
  BEFORE INSERT OR UPDATE OF category_id ON projects
  FOR EACH ROW EXECUTE FUNCTION fn_check_category_scope('project');

-- Page content version capture (unchanged)
CREATE OR REPLACE FUNCTION fn_capture_page_version()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO page_content_history (page, content, changed_by, changed_at)
  VALUES (OLD.page, OLD.content, NEW.updated_by, now());

  DELETE FROM page_content_history
  WHERE page = OLD.page
    AND id NOT IN (
      SELECT id FROM page_content_history
      WHERE page = OLD.page
      ORDER BY changed_at DESC
      LIMIT 20
    );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_page_content_version
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  WHEN (OLD.content IS DISTINCT FROM NEW.content)
  EXECUTE FUNCTION fn_capture_page_version();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE media_files          ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags            ENABLE ROW LEVEL SECURITY;
ALTER TABLE products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags         ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_media         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_modules      ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_pricing       ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags         ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content         ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links         ENABLE ROW LEVEL SECURITY;
ALTER TABLE services             ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_services    ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_projects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs           ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid() AND role = 'superadmin'
  );
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$;

-- ============================================================
-- RLS POLICIES: Public Read
-- ============================================================
CREATE POLICY "public_read_categories"
  ON categories FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "public_read_tags"
  ON tags FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_posts"
  ON posts FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_post_tags"
  ON post_tags FOR SELECT TO anon, authenticated
  USING (true);

-- CHANGE 3: products visibility uses status ENUM instead of publish BOOLEAN
CREATE POLICY "public_read_products"
  ON products FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "public_read_product_tags"
  ON product_tags FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_entity_media"
  ON entity_media FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_product_modules"
  ON product_modules FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "public_read_module_pricing"
  ON module_pricing FOR SELECT TO anon, authenticated
  USING (true);

-- CHANGE 3: projects visibility uses status ENUM instead of publish BOOLEAN
CREATE POLICY "public_read_projects"
  ON projects FOR SELECT TO anon, authenticated
  USING (status IN ('ongoing', 'completed'));

CREATE POLICY "public_read_project_tags"
  ON project_tags FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_media_files"
  ON media_files FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_positions"
  ON positions FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "public_read_position_items"
  ON position_items FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_team_members"
  ON team_members FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_page_content"
  ON page_content FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_social_links"
  ON social_links FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_services"
  ON services FOR SELECT TO anon, authenticated
  USING (active = true);

-- ============================================================
-- RLS POLICIES: Public Insert (proposals)
-- ============================================================
CREATE POLICY "public_insert_proposals"
  ON proposals FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_insert_proposal_services"
  ON proposal_services FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_insert_proposal_products"
  ON proposal_products FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_insert_proposal_projects"
  ON proposal_projects FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ============================================================
-- RLS POLICIES: Admin Write
-- ============================================================
CREATE POLICY "admin_write_categories"
  ON categories FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_tags"
  ON tags FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_posts"
  ON posts FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_post_tags"
  ON post_tags FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_products"
  ON products FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_product_tags"
  ON product_tags FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_entity_media"
  ON entity_media FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_projects"
  ON projects FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_project_tags"
  ON project_tags FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_product_modules"
  ON product_modules FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_module_pricing"
  ON module_pricing FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_media_files"
  ON media_files FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_positions"
  ON positions FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_position_items"
  ON position_items FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_team_members"
  ON team_members FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_page_content"
  ON page_content FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_social_links"
  ON social_links FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_services"
  ON services FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_proposals"
  ON proposals FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_proposal_services"
  ON proposal_services FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_proposal_products"
  ON proposal_products FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin_write_proposal_projects"
  ON proposal_projects FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- RLS POLICIES: Admin Users (superadmin-managed)
-- ============================================================
CREATE POLICY "admin_users_read_own"
  ON admin_users FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_superadmin());

CREATE POLICY "superadmin_insert_admin_users"
  ON admin_users FOR INSERT TO authenticated
  WITH CHECK (is_superadmin());

CREATE POLICY "superadmin_update_admin_users"
  ON admin_users FOR UPDATE TO authenticated
  USING (is_superadmin()) WITH CHECK (is_superadmin());

CREATE POLICY "superadmin_delete_admin_users"
  ON admin_users FOR DELETE TO authenticated
  USING (is_superadmin());

-- ============================================================
-- RLS POLICIES: Admin Permissions (superadmin-managed)
-- ============================================================
CREATE POLICY "admin_permissions_read_own"
  ON admin_permissions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_superadmin());

CREATE POLICY "superadmin_insert_permissions"
  ON admin_permissions FOR INSERT TO authenticated
  WITH CHECK (is_superadmin());

CREATE POLICY "superadmin_update_permissions"
  ON admin_permissions FOR UPDATE TO authenticated
  USING (is_superadmin()) WITH CHECK (is_superadmin());

CREATE POLICY "superadmin_delete_permissions"
  ON admin_permissions FOR DELETE TO authenticated
  USING (is_superadmin());

-- ============================================================
-- RLS POLICIES: Audit Logs & Page History
-- ============================================================
CREATE POLICY "superadmin_read_audit_logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (is_superadmin());

CREATE POLICY "admin_read_page_history"
  ON page_content_history FOR SELECT TO authenticated
  USING (is_admin());
