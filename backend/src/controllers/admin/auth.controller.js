import { createAuthClient, supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { recordAuditLog } from "../../utils/auditLog.js";

function formatAdminUser(user, role) {
  return {
    id: user.id,
    email: user.email,
    role,
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email,
    metadata: user.user_metadata || {},
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
    email_confirmed_at: user.email_confirmed_at,
  };
}

async function getAdminRoleOrThrow(userId) {
  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data?.role) {
    throw new ApiError(403, "Access denied. User is not an administrator.");
  }

  return data.role;
}

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.validated;
  const authClient = createAuthClient();

  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.session || !data?.user) {
    await recordAuditLog({
      action: "LOGIN_FAILED",
      entity: "admin_auth",
      entityId: email,
      metadata: { email, reason: error?.message || "Missing Supabase session" },
    });
    throw new ApiError(401, "Invalid email or password");
  }

  let role;
  try {
    role = await getAdminRoleOrThrow(data.user.id);
  } catch {
    await authClient.auth.signOut();
    await recordAuditLog({
      user: data.user,
      action: "LOGIN_DENIED",
      entity: "admin_auth",
      entityId: data.user.id,
      metadata: { email: data.user.email, reason: "User is not an administrator" },
    });
    throw new ApiError(401, "Invalid email or password");
  }

  await recordAuditLog({
    user: data.user,
    action: "LOGIN",
    entity: "admin_auth",
    entityId: data.user.id,
    metadata: { email: data.user.email },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: formatAdminUser(data.user, role),
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          token_type: data.session.token_type,
          expires_in: data.session.expires_in,
          expires_at: data.session.expires_at,
        },
      },
      "Admin login successful"
    )
  );
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  const { error } = await req.supabase.auth.signOut();

  if (error) {
    throw new ApiError(500, "Logout failed: " + error.message);
  }

  await recordAuditLog({
    user: req.user,
    action: "LOGOUT",
    entity: "admin_auth",
    entityId: req.user.id,
    metadata: { email: req.user.email },
  });

  return res.status(200).json(
    new ApiResponse(200, { logged_out: true }, "Admin logout successful")
  );
});

export const getAdminMe = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      { user: formatAdminUser(req.user, req.user.role) },
      "Authenticated admin retrieved successfully"
    )
  );
});

// ── POST /api/v1/admin/auth/update-password ──────────────────
// Updates the user's password using their recovery/invite access token
export const updateAdminPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ApiError(400, "Token and password are required");
  }

  const authClient = createAuthClient();

  const { error: setSessionError } = await authClient.auth.setSession({
    access_token: token,
    refresh_token: "",
  });

  if (setSessionError) {
    throw new ApiError(400, "Invalid or expired confirmation link: " + setSessionError.message);
  }

  const { data: updateData, error: updateError } = await authClient.auth.updateUser({
    password,
  });

  if (updateError) {
    throw new ApiError(400, "Failed to update password: " + updateError.message);
  }

  return res.status(200).json(
    new ApiResponse(200, { email: updateData.user?.email }, "Password updated successfully. You can now sign in.")
  );
});
