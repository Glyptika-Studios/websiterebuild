import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getTags = asyncHandler(async (req, res) => {
  const { search } = req.query;

  let query = supabasePublic
    .from("tags")
    .select("id, slug, label")
    .order("label", { ascending: true });

  if (search) {
    query = query.or(`label.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  return res.status(200).json(new ApiResponse(200, data, "Tags retrieved successfully"));
});
