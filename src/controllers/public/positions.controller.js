import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const POSITION_SELECT =
  "id, title, department, location, employment_type, description, created_at, " +
  "position_items(id, kind, body, display_order)";

export const getPositions = asyncHandler(async (req, res) => {
  const { department, employment_type } = req.query;

  let query = supabasePublic
    .from("positions")
    .select(POSITION_SELECT)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (department) query = query.eq("department", department);
  if (employment_type) query = query.eq("employment_type", employment_type);

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  const positions = (data || []).map((p) => ({
    ...p,
    position_items: (p.position_items || []).sort(
      (a, b) => a.display_order - b.display_order
    ),
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, positions, "Positions retrieved successfully"));
});

export const getPositionById = asyncHandler(async (req, res) => {
  const { data, error } = await supabasePublic
    .from("positions")
    .select(POSITION_SELECT)
    .eq("id", req.params.id)
    .eq("active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Position not found");
    throw new ApiError(500, error.message);
  }

  const position = {
    ...data,
    position_items: (data.position_items || []).sort(
      (a, b) => a.display_order - b.display_order
    ),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, position, "Position retrieved successfully"));
});