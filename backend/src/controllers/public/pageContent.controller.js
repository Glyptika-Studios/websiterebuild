import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const VALID_PAGE_KEYS = ["home", "services", "xplor", "ims", "team"];

export const getPageContent = asyncHandler(async (req, res) => {
  const { key } = req.params;

  if (!VALID_PAGE_KEYS.includes(key)) {
    throw new ApiError(
      400,
      `Invalid page key. Must be one of: ${VALID_PAGE_KEYS.join(", ")}`
    );
  }

  const { data, error } = await supabasePublic
    .from("page_content")
    .select("page, content, updated_at")
    .eq("page", key)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Page content not found");
    throw new ApiError(500, error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Page content retrieved successfully"));
});