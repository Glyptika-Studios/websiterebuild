import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getServices = asyncHandler(async (req, res) => {
  const { published } = req.query;

  let query = supabasePublic
    .from("services")
    .select(
      "id, title, bg_image_id, icon_image_id, url, url_type, active, publish, display_order"
    )
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (published === "true") query = query.eq("publish", true);

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  return res.status(200).json(new ApiResponse(200, data, "Services retrieved successfully"));
});
