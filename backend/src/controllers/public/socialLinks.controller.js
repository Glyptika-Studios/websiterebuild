import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getSocialLinks = asyncHandler(async (req, res) => {
  const { data, error } = await supabasePublic
    .from("social_links")
    .select("id, platform, url")
    .order("platform", { ascending: true });

  if (error) throw new ApiError(500, error.message);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Social links retrieved successfully"));
});