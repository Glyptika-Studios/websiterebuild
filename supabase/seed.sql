BEGIN;

-- ============================================================
-- CATEGORIES (one per scope, multiple per scope for variety)
-- ============================================================
INSERT INTO categories (label, scope, slug, display_order) VALUES
  ('Technology',      'post',    'technology',       1),
  ('Design',          'post',    'design',           2),
  ('Business',        'post',    'business',         3),
  ('SaaS',            'product', 'saas',             1),
  ('Mobile App',      'product', 'mobile-app',       2),
  ('Web App',         'project', 'web-app',          1),
  ('Mobile',          'project', 'mobile',           2),
  ('Consulting',      'service', 'consulting',       1),
  ('Development',     'service', 'development',      2);

-- ============================================================
-- TAGS
-- ============================================================
INSERT INTO tags (slug, label) VALUES
  ('react',           'React'),
  ('nodejs',          'Node.js'),
  ('ui-ux',           'UI/UX'),
  ('fullstack',       'Full Stack'),
  ('postgresql',      'PostgreSQL'),
  ('typescript',      'TypeScript'),
  ('nextjs',          'Next.js'),
  ('supabase',        'Supabase'),
  ('mobile',          'Mobile'),
  ('branding',        'Branding');

-- ============================================================
-- SOCIAL LINKS
-- ============================================================
INSERT INTO social_links (platform, url) VALUES
  ('linkedin',   'https://linkedin.com/company/glyptika'),
  ('instagram',  'https://instagram.com/glyptika'),
  ('discord',    'https://discord.gg/glyptika');

-- ============================================================
-- PAGE CONTENT (all 5 pages)
-- ============================================================
INSERT INTO page_content (page, content) VALUES
  ('home', '{
    "hero": {
      "title": "We build digital products",
      "subtitle": "Glyptika is a product studio crafting SaaS, mobile, and web experiences.",
      "cta_label": "See our work",
      "cta_url": "/projects"
    },
    "stats": [
      { "label": "Projects delivered", "value": "40+" },
      { "label": "Happy clients", "value": "30+" },
      { "label": "Years of experience", "value": "5+" }
    ]
  }'),
  ('services', '{
    "headline": "What we do",
    "subheadline": "End-to-end digital product design and development."
  }'),
  ('xplor', '{
    "headline": "Xplor",
    "subheadline": "Explore our research and experiments."
  }'),
  ('ims', '{
    "headline": "IMS",
    "subheadline": "Integrated management solutions."
  }'),
  ('team', '{
    "headline": "Meet the team",
    "subheadline": "The people behind Glyptika."
  }');

-- ============================================================
-- SERVICES
-- ============================================================
INSERT INTO services (title, url, url_type, active, publish, display_order) VALUES
  ('Product Design',      NULL, 'internal', true,  true,  1),
  ('Web Development',     NULL, 'internal', true,  true,  2),
  ('Mobile Development',  NULL, 'internal', true,  true,  3),
  ('Brand Identity',      NULL, 'internal', true,  true,  4),
  ('Tech Consulting',     NULL, 'internal', true,  false, 5);
-- ============================================================
-- POSITIONS
-- ============================================================
INSERT INTO positions (id, title, department, location, employment_type, description, active)
VALUES
  ('11111111-0000-0000-0000-000000000001',
   'Senior Full Stack Developer', 'Engineering', 'Remote / Delhi',
   'Full-time',
   'We are looking for a Senior Full Stack Developer to join our growing engineering team.',
   true),
  ('11111111-0000-0000-0000-000000000002',
   'UI/UX Designer', 'Design', 'Remote / Delhi',
   'Full-time',
   'We are looking for a talented UI/UX Designer to craft beautiful and intuitive interfaces.',
   true),
  ('11111111-0000-0000-0000-000000000003',
   'Product Manager', 'Product', 'Delhi',
   'Full-time',
   'We need a Product Manager to own the roadmap and work closely with design and engineering.',
   false);

-- Position items for Senior Full Stack Developer
INSERT INTO position_items (position_id, kind, body, display_order) VALUES
  ('11111111-0000-0000-0000-000000000001', 'responsibility', 'Build and maintain scalable backend APIs using Node.js and PostgreSQL', 1),
  ('11111111-0000-0000-0000-000000000001', 'responsibility', 'Collaborate with designers to implement pixel-perfect frontend interfaces', 2),
  ('11111111-0000-0000-0000-000000000001', 'responsibility', 'Write clean, well-tested, and well-documented code', 3),
  ('11111111-0000-0000-0000-000000000001', 'requirement',    'At least 3 years of experience with React and Node.js', 1),
  ('11111111-0000-0000-0000-000000000001', 'requirement',    'Strong understanding of PostgreSQL and database design', 2),
  ('11111111-0000-0000-0000-000000000001', 'requirement',    'Experience with TypeScript', 3),
  ('11111111-0000-0000-0000-000000000001', 'benefit',        'Fully remote with flexible hours', 1),
  ('11111111-0000-0000-0000-000000000001', 'benefit',        'Competitive salary and equity', 2),
  ('11111111-0000-0000-0000-000000000001', 'benefit',        'Annual learning and development budget', 3);

-- Position items for UI/UX Designer
INSERT INTO position_items (position_id, kind, body, display_order) VALUES
  ('11111111-0000-0000-0000-000000000002', 'responsibility', 'Create wireframes, prototypes, and high-fidelity designs in Figma', 1),
  ('11111111-0000-0000-0000-000000000002', 'responsibility', 'Conduct user research and usability testing', 2),
  ('11111111-0000-0000-0000-000000000002', 'requirement',    'Proficiency in Figma and design systems', 1),
  ('11111111-0000-0000-0000-000000000002', 'requirement',    'Portfolio demonstrating strong visual and interaction design', 2),
  ('11111111-0000-0000-0000-000000000002', 'benefit',        'Work on exciting products across multiple industries', 1),
  ('11111111-0000-0000-0000-000000000002', 'benefit',        'Collaborative and creative team environment', 2);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
INSERT INTO team_members (name, position_id, bio, linkedin_url, display_order, active)
VALUES
  ('Arjun Mehta',
   '11111111-0000-0000-0000-000000000001',
   'Arjun leads our engineering team with 6 years of experience building SaaS products. He is passionate about clean architecture and developer experience.',
   'https://linkedin.com/in/arjunmehta',
   1, true),
  ('Priya Sharma',
   '11111111-0000-0000-0000-000000000002',
   'Priya is our lead designer with a background in product design and brand identity. She has worked with startups across India and Southeast Asia.',
   'https://linkedin.com/in/priyasharma',
   2, true),
  ('Rohan Gupta',
   null,
   'Rohan is a co-founder and handles business development and client relationships.',
   'https://linkedin.com/in/rohangupta',
   3, true);

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT INTO products (id, title, overview, description, status, featured, published_at)
VALUES
  ('22222222-0000-0000-0000-000000000001',
   'Glyptika CMS',
   'A headless CMS built for modern product studios.',
   'Glyptika CMS is a flexible, developer-friendly content management system designed for agencies and product studios. It supports multi-user access, rich media management, and a fully customizable content schema.',
   'published', true, CURRENT_DATE),
  ('22222222-0000-0000-0000-000000000002',
   'Xplor Analytics',
   'Real-time analytics for growing SaaS products.',
   'Xplor Analytics gives product teams instant visibility into user behaviour, retention, and growth metrics. Built on a PostgreSQL core with a clean dashboard UI.',
   'published', false, CURRENT_DATE),
  ('22222222-0000-0000-0000-000000000003',
   'IMS Platform',
   'Integrated management system for operations teams.',
   'IMS Platform streamlines internal operations — HR, inventory, approvals, and reporting — in a single unified dashboard.',
   'draft', false, CURRENT_DATE);

-- Product tags
INSERT INTO product_tags (product_id, tag_id)
SELECT '22222222-0000-0000-0000-000000000001', id FROM tags WHERE slug IN ('react','nextjs','supabase','typescript');

INSERT INTO product_tags (product_id, tag_id)
SELECT '22222222-0000-0000-0000-000000000002', id FROM tags WHERE slug IN ('react','postgresql','typescript');

INSERT INTO product_tags (product_id, tag_id)
SELECT '22222222-0000-0000-0000-000000000003', id FROM tags WHERE slug IN ('fullstack','nodejs','postgresql');

-- Product categories
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'saas' AND scope = 'product')
WHERE id IN ('22222222-0000-0000-0000-000000000001','22222222-0000-0000-0000-000000000002');

UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'saas' AND scope = 'product')
WHERE id = '22222222-0000-0000-0000-000000000003';

-- ============================================================
-- PRODUCT MODULES
-- ============================================================
INSERT INTO product_modules (id, product_id, title, description, display_order, active)
VALUES
  ('33333333-0000-0000-0000-000000000001',
   '22222222-0000-0000-0000-000000000001',
   'Content Editor',
   'Rich text editor with media embedding, versioning, and collaborative editing.',
   1, true),
  ('33333333-0000-0000-0000-000000000002',
   '22222222-0000-0000-0000-000000000001',
   'Media Manager',
   'Upload, organise, and serve images and videos via CDN.',
   2, true),
  ('33333333-0000-0000-0000-000000000003',
   '22222222-0000-0000-0000-000000000002',
   'Dashboard',
   'Real-time metrics overview with customisable widgets.',
   1, true);

-- ============================================================
-- MODULE PRICING
-- ============================================================
INSERT INTO module_pricing (module_id, tier, price_amount, currency, billing_cycle, details)
VALUES
  ('33333333-0000-0000-0000-000000000001', 'basic',    29.00, 'USD', 'monthly',
   '{"features": ["Up to 5 users", "10GB storage", "Basic support"], "cta": "Get started"}'),
  ('33333333-0000-0000-0000-000000000001', 'standard', 79.00, 'USD', 'monthly',
   '{"features": ["Up to 20 users", "50GB storage", "Priority support", "API access"], "cta": "Most popular"}'),
  ('33333333-0000-0000-0000-000000000001', 'premium',  199.00, 'USD', 'monthly',
   '{"features": ["Unlimited users", "500GB storage", "Dedicated support", "Custom integrations"], "cta": "Contact us"}'),
  ('33333333-0000-0000-0000-000000000002', 'basic',    0.00,  'USD', 'monthly',
   '{"features": ["5GB media storage", "CDN delivery"], "cta": "Included"}'),
  ('33333333-0000-0000-0000-000000000002', 'standard', 19.00, 'USD', 'monthly',
   '{"features": ["50GB media storage", "CDN delivery", "Image transformations"], "cta": "Upgrade"}'),
  ('33333333-0000-0000-0000-000000000003', 'basic',    49.00, 'USD', 'monthly',
   '{"features": ["Up to 10k events/month", "7 day retention"], "cta": "Start free trial"}'),
  ('33333333-0000-0000-0000-000000000003', 'standard', 99.00, 'USD', 'monthly',
   '{"features": ["Up to 100k events/month", "30 day retention", "Funnel analysis"], "cta": "Most popular"}'),
  ('33333333-0000-0000-0000-000000000003', 'premium',  249.00, 'USD', 'monthly',
   '{"features": ["Unlimited events", "90 day retention", "Custom dashboards", "Data export"], "cta": "Scale up"}');

-- ============================================================
-- PROJECTS
-- ============================================================
INSERT INTO projects (id, title, description, status, featured, published_at)
VALUES
  ('44444444-0000-0000-0000-000000000001',
   'Zeno Finance Dashboard',
   'A comprehensive financial analytics dashboard built for a fintech startup. Includes real-time portfolio tracking, transaction history, and AI-powered insights.',
   'completed', true, CURRENT_DATE - INTERVAL '30 days'),
  ('44444444-0000-0000-0000-000000000002',
   'Petal Health App',
   'A mobile-first wellness tracking app for Android and iOS. Features habit tracking, mood journaling, and personalised health recommendations.',
   'completed', false, CURRENT_DATE - INTERVAL '60 days'),
  ('44444444-0000-0000-0000-000000000003',
   'Orbis E-Commerce Platform',
   'An ongoing e-commerce platform rebuild for a mid-sized retail brand. Full replatforming from legacy PHP to a modern Next.js and Supabase stack.',
   'ongoing', false, CURRENT_DATE);

-- Project tags
INSERT INTO project_tags (project_id, tag_id)
SELECT '44444444-0000-0000-0000-000000000001', id FROM tags WHERE slug IN ('react','typescript','postgresql');

INSERT INTO project_tags (project_id, tag_id)
SELECT '44444444-0000-0000-0000-000000000002', id FROM tags WHERE slug IN ('mobile','react','ui-ux');

INSERT INTO project_tags (project_id, tag_id)
SELECT '44444444-0000-0000-0000-000000000003', id FROM tags WHERE slug IN ('nextjs','supabase','fullstack');

-- Project categories
UPDATE projects SET category_id = (SELECT id FROM categories WHERE slug = 'web-app' AND scope = 'project')
WHERE id IN ('44444444-0000-0000-0000-000000000001','44444444-0000-0000-0000-000000000003');

UPDATE projects SET category_id = (SELECT id FROM categories WHERE slug = 'mobile' AND scope = 'project')
WHERE id = '44444444-0000-0000-0000-000000000002';

-- ============================================================
-- POSTS
-- ============================================================
INSERT INTO posts (id, type, title, slug, excerpt, content, featured, published_at, linkedin_url)
VALUES
  ('55555555-0000-0000-0000-000000000001',
   'blog',
   'Why we chose Supabase for our entire backend',
   'why-we-chose-supabase',
   'After evaluating Firebase, PlanetScale, and Neon, we settled on Supabase. Here is why.',
   'Full article content goes here. This is a placeholder for the rich text body of the blog post.',
   true,
   CURRENT_DATE - INTERVAL '7 days',
   NULL),
  ('55555555-0000-0000-0000-000000000002',
   'blog',
   'Design systems at scale: lessons from 3 years of building',
   'design-systems-at-scale',
   'We have rebuilt our design system twice. Here is what we learned and what we would do differently.',
   'Full article content goes here. This is a placeholder for the rich text body of the blog post.',
   false,
   CURRENT_DATE - INTERVAL '14 days',
   NULL),
  ('55555555-0000-0000-0000-000000000003',
   'linkedin',
   'Excited to announce our latest project launch',
   null,
   'We just shipped something we are really proud of.',
   null,
   false,
   CURRENT_DATE - INTERVAL '3 days',
   'https://linkedin.com/posts/glyptika-test-post');

-- Fix linkedin post - needs linkedin_url
UPDATE posts SET linkedin_url = 'https://linkedin.com/posts/glyptika-test-post'
WHERE id = '55555555-0000-0000-0000-000000000003';

-- Post categories
UPDATE posts SET category_id = (SELECT id FROM categories WHERE slug = 'technology' AND scope = 'post')
WHERE id IN ('55555555-0000-0000-0000-000000000001','55555555-0000-0000-0000-000000000002');

-- Post tags
INSERT INTO post_tags (post_id, tag_id)
SELECT '55555555-0000-0000-0000-000000000001', id FROM tags WHERE slug IN ('supabase','nodejs','postgresql');

INSERT INTO post_tags (post_id, tag_id)
SELECT '55555555-0000-0000-0000-000000000002', id FROM tags WHERE slug IN ('ui-ux','branding');

-- ============================================================
-- SAMPLE PROPOSAL (for admin endpoint testing)
-- ============================================================
INSERT INTO proposals (
  id, name, email, phone, company,
  subject, message,
  budget_type, budget_min, budget_max, budget_label,
  source_channel, priority, status
) VALUES (
  '66666666-0000-0000-0000-000000000001',
  'Rahul Verma',
  'rahul@example.com',
  '+91 98765 43210',
  'Verma Ventures',
  'Looking for a web app for our logistics team',
  'We need a custom dashboard to track our fleet in real time. Open to a SaaS solution or bespoke build.',
  'range', 500000, 1500000, '₹5L – ₹15L',
  'website', 'high', 'new'
);

INSERT INTO proposal_services (proposal_id, service_id)
SELECT '66666666-0000-0000-0000-000000000001', id FROM services WHERE title = 'Web Development';

INSERT INTO proposal_products (proposal_id, product_id)
VALUES ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001');

COMMIT;
