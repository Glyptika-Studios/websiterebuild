# Glyptika API

## Architecture

*   **Controllers (`src/controllers/`)**: Contains the core business logic and database interactions.
*   **Routes (`src/routes/`)**: Maps incoming HTTP requests to their specific controller functions. Separated into `public` and `admin` directories.
*   **Middleware (`src/middleware/`)**: Functions that intercept requests for authentication, validation, and global error handling.
*   **Validators (`src/validators/`)**: Zod schema definitions that strictly enforce data structures before hitting the database.
*   **Utils (`src/utils/`)**: Shared helpers for responses, errors, async handling, media uploads, and post tags.

## Features Developed

*   **Public API**: Open endpoints for retrieving posts, categories, tags, services, products, projects, and submitting proposals.
*   **Admin API**: Secure, authenticated endpoints for managing posts, proposals, media, tags, social links, categories, products, projects, page content, and audit logs.
*   **Admin Auth**: Login, logout, and current-admin endpoints backed by Supabase Auth, admin role checks, generic auth failures, and login throttling.
*   **Post Tags**: Posts now use normalized tags through `tags` and `post_tags`, while API responses still return a simple `tags` array.
*   **Media Uploads**: Admin users can upload image, video, and audio files to the Supabase `media` storage bucket using multipart form uploads. Uploads are tracked in the `media_files` table.
*   **Categories**: Categories support scoped management for `post`, `product`, `service`, and `project` content. Public category responses only return active categories.
*   **Tags**: Tags can be managed directly by admins and are also created/synced automatically from post tag payloads.
*   **Page Content**: Admin users can list and update editable page content for the supported page keys, with database-backed version history.
*   **Social Links**: Admin users can read and update supported social URLs for `linkedin`, `instagram`, and `discord`.
*   **Products and Projects**: Public lookup endpoints expose active products and projects for browsing and proposal forms.
*   **Supabase Integration**: Implements a three client strategy to respect Row Level Security (RLS).
*   **Error Handling**: A centralized error handling system that catches all unhandled promise rejections and returns standardized, predictable JSON error responses.
*   **Data Validation**: Incoming POST, PUT, and PATCH requests are validated with Zod, including post tags, proposal budget/source rules, category scopes, page content JSON, and HTTPS social links.
*   **Role-Based Access Control (RBAC)**: Enforces three distinct user roles (`superadmin`, `editor`, `viewer`). 
    *   `auth.middleware.js` identifies the user and fetches their role from the database.
    *   `authorize.middleware.js` protects specific routes based on the role (e.g., viewers can only read, editors/superadmins can read and write).
*   **Audit Logs**: Admin login/logout and protected write actions are recorded in `audit_logs`. Superadmins can view logs with pagination and filters.
*   **Security Hardening**: Supabase clients do not persist server-side sessions, login attempts are rate-limited, bearer headers are validated, JSON request bodies are capped, and search filters are sanitized before Supabase query construction.

## Getting Started

1.  Clone the repository.
2.  Run `npm install` to install dependencies.
3.  Copy `.env.example` to `.env` and fill in your Supabase credentials.
4.  Set `CORS_ORIGIN` to your dashboard origin in production. Use a comma-separated list for multiple allowed origins.
5.  Run `npm run start` to start the Express server.

## Current Endpoints

### Public
*   `GET /api/v1/health`
*   `GET /api/v1/posts`
*   `GET /api/v1/posts/slug/:slug`
*   `GET /api/v1/posts/:id`
*   `GET /api/v1/categories`
*   `GET /api/v1/tags`
*   `GET /api/v1/services`
*   `GET /api/v1/products`
*   `GET /api/v1/projects`
*   `POST /api/v1/proposals`

### Admin Auth
*   `POST /api/v1/admin/auth/login`
*   `POST /api/v1/admin/auth/logout`
*   `GET /api/v1/admin/auth/me`

### Admin (Requires JWT)
*   `GET /api/v1/admin/audit_logs`
*   `GET /api/v1/admin/audit_logs/:id`
*   `GET /api/v1/admin/posts`
*   `GET /api/v1/admin/posts/:id`
*   `POST /api/v1/admin/posts`
*   `PATCH /api/v1/admin/posts/:id`
*   `DELETE /api/v1/admin/posts/:id`
*   `GET /api/v1/admin/proposals`
*   `GET /api/v1/admin/proposals/:id`
*   `PATCH /api/v1/admin/proposals/:id`
*   `DELETE /api/v1/admin/proposals/:id`
*   `GET /api/v1/admin/media`
*   `POST /api/v1/admin/media/upload`
*   `DELETE /api/v1/admin/media/:id`
*   `GET /api/v1/admin/tags`
*   `GET /api/v1/admin/tags/:id`
*   `POST /api/v1/admin/tags`
*   `PUT /api/v1/admin/tags/:id`
*   `DELETE /api/v1/admin/tags/:id`
*   `GET /api/v1/admin/categories`
*   `GET /api/v1/admin/categories/:id`
*   `POST /api/v1/admin/categories`
*   `PUT /api/v1/admin/categories/:id`
*   `DELETE /api/v1/admin/categories/:id`
*   `GET /api/v1/admin/products`
*   `GET /api/v1/admin/products/:id`
*   `POST /api/v1/admin/products`
*   `PUT /api/v1/admin/products/:id`
*   `DELETE /api/v1/admin/products/:id`
*   `PATCH /api/v1/admin/products/:id/status`
*   `GET /api/v1/admin/products/:id/modules`
*   `POST /api/v1/admin/products/:id/modules`
*   `PUT /api/v1/admin/products/:id/modules/:mid`
*   `DELETE /api/v1/admin/products/:id/modules/:mid`
*   `PATCH /api/v1/admin/products/:id/modules/reorder`
*   `PUT /api/v1/admin/modules/:mid/pricing/:tier`
*   `GET /api/v1/admin/projects`
*   `GET /api/v1/admin/projects/:id`
*   `POST /api/v1/admin/projects`
*   `PUT /api/v1/admin/projects/:id`
*   `DELETE /api/v1/admin/projects/:id`
*   `PATCH /api/v1/admin/projects/:id/status`
*   `POST /api/v1/admin/projects/:id/media`
*   `DELETE /api/v1/admin/projects/:id/media/:emid`
*   `PATCH /api/v1/admin/projects/:id/media/reorder`
*   `GET /api/v1/admin/social_links`
*   `PUT /api/v1/admin/social_links/:platform`
*   `GET /api/v1/admin/pages`
*   `GET /api/v1/admin/pages/:key`
*   `PUT /api/v1/admin/pages/:key`
*   `GET /api/v1/admin/pages/:key/history`
