import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const TEAM_SELECT =
  "id, name, bio, linkedin_url, display_order, " +
  "position:positions(id, title, department), " +
  "photo:media_files(id, public_url, file_name)";

export const getTeam = asyncHandler(async (req, res) => {
  const { data, error } = await supabasePublic
    .from("team_members")
    .select(TEAM_SELECT)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) throw new ApiError(500, error.message);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Team members retrieved successfully"));
});