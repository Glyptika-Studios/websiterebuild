# Glyptika API

## Architecture

*   **Controllers (`src/controllers/`)**: Contains the core business logic and database interactions.
*   **Routes (`src/routes/`)**: Maps incoming HTTP requests to their specific controller functions. Separated into `public` and `admin` directories.
*   **Middleware (`src/middleware/`)**: Functions that intercept requests for authentication, validation, and global error handling.
*   **Validators (`src/validators/`)**: Zod schema definitions that strictly enforce data structures before hitting the database.
*   **Utils (`src/utils/`)**: Shared helpers for responses, errors, async handling, media uploads, and post tags.

## Features Developed

*   **Public API**: Open endpoints for retrieving posts, categories, tags, services, and submitting proposals.
*   **Admin API**: Secure, authenticated endpoints for managing posts, proposals, and media uploads.
*   **Post Tags**: Posts now use normalized tags through `tags` and `post_tags`, while API responses still return a simple `tags` array.
*   **Media Uploads**: Admin users can upload images/PDFs to the Supabase `media` storage bucket using multipart form uploads.
*   **Supabase Integration**: Implements a three client strategy to respect Row Level Security (RLS).
*   **Error Handling**: A centralized error handling system that catches all unhandled promise rejections and returns standardized, predictable JSON error responses.
*   **Data Validation**: Incoming POST and PATCH requests are validated with Zod, including post tags and proposal budget/source rules.
*   **Role-Based Access Control (RBAC)**: Enforces three distinct user roles (`superadmin`, `editor`, `viewer`). 
    *   `auth.middleware.js` identifies the user and fetches their role from the database.
    *   `authorize.middleware.js` protects specific routes based on the role (e.g., viewers can only read, editors/superadmins can read and write).

## Getting Started

1.  Clone the repository.
2.  Run `npm install` to install dependencies.
3.  Copy `.env.example` to `.env` and fill in your Supabase credentials.
4.  Run `npm run start` to start the Express server.

## Current Endpoints

### Public
*   `GET /api/v1/health`
*   `GET /api/v1/posts`
*   `GET /api/v1/posts/slug/:slug`
*   `GET /api/v1/posts/:id`
*   `GET /api/v1/categories`
*   `GET /api/v1/tags`
*   `GET /api/v1/services`
*   `POST /api/v1/proposals`

### Admin (Requires JWT)
*   `GET /api/v1/admin/posts`
*   `GET /api/v1/admin/posts/:id`
*   `POST /api/v1/admin/posts`
*   `PATCH /api/v1/admin/posts/:id`
*   `DELETE /api/v1/admin/posts/:id`
*   `GET /api/v1/admin/proposals`
*   `GET /api/v1/admin/proposals/:id`
*   `PATCH /api/v1/admin/proposals/:id`
*   `DELETE /api/v1/admin/proposals/:id`
*   `POST /api/v1/admin/media/upload`
