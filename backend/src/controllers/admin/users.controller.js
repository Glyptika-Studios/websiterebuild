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

  // Fetch their permissions
  const { data: permissions, error: permError } = await supabaseAdmin
    .from("admin_permissions")
    .select("id, section, can_read, can_write")
    .eq("user_id", id)
    .order("section", { ascending: true });

  if (permError)
    throw new ApiError(500, "Failed to fetch permissions: " + permError.message);

  return res.status(200).json(
    new ApiResponse(
      200,
      { ...user, permissions: permissions || [] },
      "Admin user fetched successfully"
    )
  );
});

// ── POST /api/v1/admin/users/invite ───────────────────────────
// Three steps:
// 1. Send Supabase Auth invite email (uses service_role key)
// 2. Insert into admin_users table
// 3. Insert into admin_permissions if editor or viewer
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

  // Auto-populate all sections for editor and viewer roles if not supplied
  let activeSections = sections;
  if (role !== "superadmin") {
    if (!activeSections || activeSections.length === 0) {
      activeSections = VALID_SECTIONS.map((s) => ({
        section: s,
        can_write: role === "editor",
      }));
    } else {
      const invalidSections = activeSections.filter(
        (s) => !VALID_SECTIONS.includes(s.section)
      );
      if (invalidSections.length > 0) {
        throw new ApiError(
          400,
          `Invalid sections: ${invalidSections.map((s) => s.section).join(", ")}. Must be one of: ${VALID_SECTIONS.join(", ")}`
        );
      }
    }
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

  // Step 3 — Insert permissions for editor / viewer
  let insertedPermissions = [];
  if (role !== "superadmin" && activeSections && activeSections.length > 0) {
    const permissionRows = activeSections.map((s) => ({
      user_id: userId,
      section: s.section,
      can_read: true,
      can_write: s.can_write ?? role === "editor",
    }));

    const { data: perms, error: permError } = await supabaseAdmin
      .from("admin_permissions")
      .insert(permissionRows)
      .select("id, section, can_read, can_write");

    if (permError) {
      console.error("Permissions insert failed:", permError.message);
    } else {
      insertedPermissions = perms;
    }
  }

  await logAudit(req.user, "CREATE", "admin_users", userId, {
    email,
    role,
    employment_type,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      { ...adminUser, permissions: insertedPermissions, action_link: actionLink },
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

  // If role is updated, keep the admin_permissions table perfectly synced
  if (role) {
    if (role === "superadmin") {
      // Superadmins bypass permission tables
      await supabaseAdmin
        .from("admin_permissions")
        .delete()
        .eq("user_id", id);
    } else {
      // Wipe old permissions to avoid keys mismatch and insert clean defaults
      await supabaseAdmin
        .from("admin_permissions")
        .delete()
        .eq("user_id", id);

      const permissionRows = VALID_SECTIONS.map((s) => ({
        user_id: id,
        section: s,
        can_read: true,
        can_write: role === "editor",
      }));

      await supabaseAdmin
        .from("admin_permissions")
        .insert(permissionRows);
    }
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

  // Delete from Supabase Auth first
  const { error: authError } =
    await supabaseAdmin.auth.admin.deleteUser(id);

  if (authError) {
    throw new ApiError(500, "Failed to delete auth user: " + authError.message);
  }

  // Then delete from admin_users
  // ON DELETE CASCADE removes admin_permissions rows automatically
  const { error: deleteError } = await supabaseAdmin
    .from("admin_users")
    .delete()
    .eq("id", id);

  if (deleteError)
    throw new ApiError(500, "Failed to delete admin user: " + deleteError.message);

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
  const { id } = req.params;

  // Check user exists
  const { data: user, error: userError } = await supabaseAdmin
    .from("admin_users")
    .select("id, role")
    .eq("id", id)
    .single();

  if (userError || !user)
    throw new ApiError(404, "Admin user not found");

  // Superadmin has all permissions implicitly — no rows in table
  if (user.role === "superadmin") {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          role: "superadmin",
          note: "Superadmin has full access to all sections. No permission rows needed.",
          permissions: [],
        },
        "Permissions fetched successfully"
      )
    );
  }

  const { data, error } = await supabaseAdmin
    .from("admin_permissions")
    .select("id, section, can_read, can_write")
    .eq("user_id", id)
    .order("section", { ascending: true });

  if (error)
    throw new ApiError(500, "Failed to fetch permissions: " + error.message);

  return res.status(200).json(
    new ApiResponse(200, data, "Permissions fetched successfully")
  );
});

// ── PUT /api/v1/admin/users/:id/permissions ──────────────────
// Bulk upsert — replaces ALL permissions for this user
// Send the complete desired set of permissions
// Any section not in the array will be removed
// Example body:
// { permissions: [
//     { section: "products", can_read: true, can_write: true },
//     { section: "media",    can_read: true, can_write: false }
// ]}
export const upsertUserPermissions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body;

  // Check user exists
  const { data: user, error: userError } = await supabaseAdmin
    .from("admin_users")
    .select("id, role")
    .eq("id", id)
    .single();

  if (userError || !user)
    throw new ApiError(404, "Admin user not found");

  // Superadmin does not need permissions
  if (user.role === "superadmin") {
    throw new ApiError(
      400,
      "Superadmin has full access to all sections. Permission rows are not needed."
    );
  }

  // Validate all sections
  const invalidSections = permissions.filter(
    (p) => !VALID_SECTIONS.includes(p.section)
  );
  if (invalidSections.length > 0) {
    throw new ApiError(
      400,
      `Invalid sections: ${invalidSections.map((p) => p.section).join(", ")}. Must be one of: ${VALID_SECTIONS.join(", ")}`
    );
  }

  // Delete all existing permissions for this user
  const { error: deleteError } = await supabaseAdmin
    .from("admin_permissions")
    .delete()
    .eq("user_id", id);

  if (deleteError)
    throw new ApiError(500, "Failed to update permissions: " + deleteError.message);

  // Insert the new set
  const permissionRows = permissions.map((p) => ({
    user_id: id,
    section: p.section,
    can_read: p.can_read ?? true,
    can_write: p.can_write ?? false,
  }));

  const { data, error: insertError } = await supabaseAdmin
    .from("admin_permissions")
    .insert(permissionRows)
    .select("id, section, can_read, can_write");

  if (insertError)
    throw new ApiError(500, "Failed to save permissions: " + insertError.message);

  await logAudit(req.user, "UPDATE", "admin_permissions", id, {
    user_id: id,
    sections_count: permissions.length,
  });

  return res.status(200).json(
    new ApiResponse(200, data, "Permissions updated successfully")
  );
});

// ── DELETE /api/v1/admin/users/:id/permissions/:section ──────
export const deleteUserPermission = asyncHandler(async (req, res) => {
  const { id, section } = req.params;

  // Validate section
  if (!VALID_SECTIONS.includes(section)) {
    throw new ApiError(
      400,
      `Invalid section. Must be one of: ${VALID_SECTIONS.join(", ")}`
    );
  }

  // Check user exists
  const { data: user, error: userError } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("id", id)
    .single();

  if (userError || !user)
    throw new ApiError(404, "Admin user not found");

  // Check permission row exists
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("admin_permissions")
    .select("id")
    .eq("user_id", id)
    .eq("section", section)
    .single();

  if (fetchError || !existing)
    throw new ApiError(
      404,
      `No permission found for section '${section}' on this user`
    );

  const { error } = await supabaseAdmin
    .from("admin_permissions")
    .delete()
    .eq("user_id", id)
    .eq("section", section);

  if (error)
    throw new ApiError(500, "Failed to delete permission: " + error.message);

  await logAudit(req.user, "DELETE", "admin_permissions", id, {
    user_id: id,
    section,
  });

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
