import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const CATEGORY_SCOPES = new Set(["post", "product", "service", "project"]);

export const getCategories = asyncHandler(async (req, res) => {
  const { scope } = req.query;

  if (scope && !CATEGORY_SCOPES.has(scope)) {
    throw new ApiError(400, "Invalid category scope");
  }

  let query = supabasePublic
    .from("categories")
    .select("id, label, scope, slug, display_order")
    .order("display_order", { ascending: true })
    .order("label", { ascending: true });

  if (scope) query = query.eq("scope", scope);

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  return res.status(200).json(new ApiResponse(200, data, "Categories retrieved successfully"));
});
