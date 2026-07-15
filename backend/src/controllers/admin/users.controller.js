import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { supabaseAdmin } from "../../config/supabase.js";

// Valid ENUMs
const VALID_ROLES = ["superadmin", "editor", "viewer"];
const VALID_EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];
const VALID_SECTIONS = [
  "careers",
  "blog_posts",
  "products",
  "projects",
  "linkedin_posts",
  "media",
  "team",
  "home",
  "services",
  "xplor",
  "ims",
];

// Audit log helper
async function logAudit(user, action, entity, entityId, metadata = null) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      user_id: user.id,
      user_email: user.email,
      user_name: user.user_metadata?.name || user.email,
      action,
      entity,
      entity_id: String(entityId),
      metadata,
    });
  } catch (e) {
    console.error("Audit log failed:", e.message);
  }
}

// ════════════════════════════════════════════════════════════════
// USER ENDPOINTS
// ════════════════════════════════════════════════════════════════

// ── GET /api/v1/admin/users ───────────────────────────────────
export const getAdminUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const from = (page - 1) * limit;
  const role = req.query.role;

  // Validate role filter if provided
  if (role && !VALID_ROLES.includes(role)) {
    throw new ApiError(
      400,
      `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`
    );
  }

  let query = supabaseAdmin
    .from("admin_users")
    .select(
      "id, name, roll_no, role, employment_type, email, created_at, updated_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (role) query = query.eq("role", role);

  const { data, count, error } = await query;

  if (error)
    throw new ApiError(500, "Failed to fetch admin users: " + error.message);

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: data, meta: { page, limit, total: count } },
      "Admin users fetched successfully"
    )
  );
});

// ── GET /api/v1/admin/users/:id ───────────────────────────────
// Returns user with their permissions
export const getAdminUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch user
  const { data: user, error: userError } = await supabaseAdmin
    .from("admin_users")
    .select("id, name, roll_no, role, employment_type, email, created_at, updated_at")
    .eq("id", id)
    .single();

  if (userError || !user)
    throw new ApiError(404, "Admin user not found");

  return res.status(200).json(
    new ApiResponse(
      200,
      { ...user, permissions: [] },
      "Admin user fetched successfully"
    )
  );
});

// ── POST /api/v1/admin/users/invite ───────────────────────────
// Three steps:
// 1. Send Supabase Auth invite email (uses service_role key)
// 2. Insert into admin_users table
// 3. Insert into admin_permissions if editor or viewer (Deprecated: Bypass permissions table)
export const inviteAdminUser = asyncHandler(async (req, res) => {
  const {
    email,
    name,
    roll_no,
    role,
    employment_type,
    sections,
  } = req.body;

  // Validate role
  if (!VALID_ROLES.includes(role)) {
    throw new ApiError(
      400,
      `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`
    );
  }

  // Validate employment_type
  if (!VALID_EMPLOYMENT_TYPES.includes(employment_type)) {
    throw new ApiError(
      400,
      `Invalid employment_type. Must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`
    );
  }

  // Check if email already exists in admin_users
  const { data: existing } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    throw new ApiError(409, "An admin with this email already exists");
  }

  // Step 1 — Generate Supabase Auth invite link
  // Using generateLink avoids the email pre-fetching consumption issue,
  // letting the superadmin display and open the link directly.
  const frontendOrigin = req.headers.origin || process.env.CORS_ORIGIN || "http://localhost:3000";

  const { data: linkData, error: inviteError } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email,
      options: {
        data: { name },
        redirectTo: `${frontendOrigin}/admin/login`,
      },
    });

  if (inviteError) {
    if (inviteError.message?.includes("already been registered")) {
      throw new ApiError(409, "This email is already registered in the system");
    }
    throw new ApiError(500, "Failed to generate invite: " + inviteError.message);
  }

  const userId = linkData.user.id;
  const actionLink = linkData.properties.action_link;

  // Step 2 — Insert into admin_users
  const { data: adminUser, error: insertError } = await supabaseAdmin
    .from("admin_users")
    .insert({
      id: userId,
      name,
      roll_no,
      role,
      employment_type,
      email,
    })
    .select("id, name, roll_no, role, employment_type, email, created_at")
    .single();

  if (insertError) {
    // Clean up the orphaned auth user
    await supabaseAdmin.auth.admin.deleteUser(userId).catch((e) => {
      console.error("Failed to clean up orphaned auth user:", e.message);
    });
    throw new ApiError(
      500,
      "Failed to create admin record: " + insertError.message
    );
  }

  await logAudit(req.user, "CREATE", "admin_users", userId, {
    email,
    role,
    employment_type,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      { ...adminUser, permissions: [], action_link: actionLink },
      "Admin user invited successfully."
    )
  );
});

// ── PUT /api/v1/admin/users/:id ───────────────────────────────
export const updateAdminUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, role, employment_type } = req.body;

  // Check exists
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("admin_users")
    .select("id, email")
    .eq("id", id)
    .single();

  if (fetchError || !existing)
    throw new ApiError(404, "Admin user not found");

  // Prevent superadmin from demoting themselves
  if (id === req.user.id && role && role !== "superadmin") {
    throw new ApiError(
      400,
      "You cannot change your own role"
    );
  }

  // Prevent demoting the last superadmin
  if (role && role !== "superadmin" && existing.role === "superadmin") {
    const { count } = await supabaseAdmin
      .from("admin_users")
      .select("id", { count: "exact", head: true })
      .eq("role", "superadmin");

    if (count <= 1) {
      throw new ApiError(
        400,
        "Cannot demote the last superadmin. Promote another user first."
      );
    }
  }

  // Validate role if provided
  if (role && !VALID_ROLES.includes(role)) {
    throw new ApiError(
      400,
      `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`
    );
  }

  // Validate employment_type if provided
  if (employment_type && !VALID_EMPLOYMENT_TYPES.includes(employment_type)) {
    throw new ApiError(
      400,
      `Invalid employment_type. Must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`
    );
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (role !== undefined) updates.role = role;
  if (employment_type !== undefined) updates.employment_type = employment_type;

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .update(updates)
    .eq("id", id)
    .select("id, name, roll_no, role, employment_type, email, updated_at")
    .single();

  if (error) {
    if (error.message?.includes("invalid input value for enum"))
      throw new ApiError(400, "Invalid role or employment_type value");
    throw new ApiError(500, "Failed to update user: " + error.message);
  }

  await logAudit(req.user, "UPDATE", "admin_users", id, updates);

  return res.status(200).json(
    new ApiResponse(200, data, "Admin user updated successfully")
  );
});

// ── DELETE /api/v1/admin/users/:id ────────────────────────────
export const deleteAdminUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent superadmin from deleting themselves
  if (id === req.user.id) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  // Check exists
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, role")
    .eq("id", id)
    .single();

  if (fetchError || !existing)
    throw new ApiError(404, "Admin user not found");

  // Delete from admin_users first
  // ON DELETE CASCADE removes admin_permissions rows automatically
  const { error: deleteError } = await supabaseAdmin
    .from("admin_users")
    .delete()
    .eq("id", id);

  if (deleteError)
    throw new ApiError(500, "Failed to delete admin user: " + deleteError.message);

  // Then delete from Supabase Auth
  const { error: authError } =
    await supabaseAdmin.auth.admin.deleteUser(id);

  if (authError) {
    throw new ApiError(500, "Failed to delete auth user: " + authError.message);
  }

  await logAudit(req.user, "DELETE", "admin_users", id, {
    email: existing.email,
    role: existing.role,
  });

  return res.status(200).json(
    new ApiResponse(200, { id }, "Admin user deleted successfully")
  );
});

// ════════════════════════════════════════════════════════════════
// PERMISSION ENDPOINTS
// ════════════════════════════════════════════════════════════════

// ── GET /api/v1/admin/users/:id/permissions ──────────────────
export const getUserPermissions = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, [], "Permissions fetched successfully")
  );
});

export const upsertUserPermissions = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, [], "Permissions updated successfully")
  );
});

export const deleteUserPermission = asyncHandler(async (req, res) => {
  const { id, section } = req.params;
  return res.status(200).json(
    new ApiResponse(200, { user_id: id, section }, "Permission removed successfully")
  );
});

// ── POST /api/v1/admin/users/:id/reset-password ──────────────
// Generates a password reset link for the user.
export const resetAdminUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch user email from admin_users
  const { data: adminUser, error: fetchError } = await supabaseAdmin
    .from("admin_users")
    .select("id, email")
    .eq("id", id)
    .single();

  if (fetchError || !adminUser)
    throw new ApiError(404, "Admin user not found");

  const frontendOrigin = req.headers.origin || process.env.CORS_ORIGIN || "http://localhost:3000";

  // Generate a password reset link via Supabase Auth Admin
  const { data: linkData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email: adminUser.email,
    options: {
      redirectTo: `${frontendOrigin}/admin/login`,
    },
  });

  if (resetError) {
    throw new ApiError(500, "Failed to generate password reset link: " + resetError.message);
  }

  const actionLink = linkData.properties.action_link;

  await logAudit(req.user, "UPDATE", "admin_auth", id, {
    action: "password_reset_triggered",
    target_email: adminUser.email,
    triggered_by: req.user.email,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { email: adminUser.email, action_link: actionLink },
      "Password reset link generated successfully."
    )
  );
});
