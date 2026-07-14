import { createUserClient } from "../config/supabase.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing Authorization header");
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token || token.includes(" ")) {
    throw new ApiError(401, "Invalid Authorization header");
  }

  const supabase = createUserClient(token);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw new ApiError(401, "Invalid or expired token");
  }

  req.user = data.user;
  req.supabase = supabase;

  const { data: adminData, error: adminErr } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", req.user.id)
    .single();

  if (adminErr) {
    if (adminErr.code === "PGRST116") {
      throw new ApiError(403, "Access denied. User is not an administrator.");
    }
    throw new ApiError(500, "Failed to verify admin status");
  }

  req.user.role = adminData.role;

  next();
});
