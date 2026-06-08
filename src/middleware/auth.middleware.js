import { createUserClient } from "../config/supabase.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing Authorization header");
  }

  const token = header.replace("Bearer ", "");
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
    throw new ApiError(403, "Access denied. User is not an administrator.");
  }

  req.user.role = adminData.role;

  next();
});
