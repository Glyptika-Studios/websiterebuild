import { supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  // Query 1: Posts count
  const { count: postsCount, error: postsError } = await supabaseAdmin
    .from("posts")
    .select("*", { head: true, count: "exact" });

  if (postsError) {
    throw new ApiError(500, "Failed to count posts: " + postsError.message);
  }

  // Query 2: Products count
  const { count: productsCount, error: productsError } = await supabaseAdmin
    .from("products")
    .select("*", { head: true, count: "exact" });

  if (productsError) {
    throw new ApiError(500, "Failed to count products: " + productsError.message);
  }

  // Query 3: Positions (Careers) count
  const { count: positionsCount, error: positionsError } = await supabaseAdmin
    .from("positions")
    .select("*", { head: true, count: "exact" });

  if (positionsError) {
    throw new ApiError(500, "Failed to count positions: " + positionsError.message);
  }

  const { count: activePositionsCount, error: activePositionsError } = await supabaseAdmin
    .from("positions")
    .select("*", { head: true, count: "exact" })
    .eq("active", true);

  if (activePositionsError) {
    throw new ApiError(550, "Failed to count active positions: " + activePositionsError.message);
  }

  // Query 4: Team members count
  const { count: teamCount, error: teamError } = await supabaseAdmin
    .from("team_members")
    .select("*", { head: true, count: "exact" });

  if (teamError) {
    throw new ApiError(500, "Failed to count team members: " + teamError.message);
  }

  // Query 5: Recent audit logs (last 5)
  const { data: recentLogs, error: logsError } = await supabaseAdmin
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (logsError) {
    throw new ApiError(500, "Failed to fetch recent logs: " + logsError.message);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats: {
          posts: postsCount || 0,
          products: productsCount || 0,
          careers: {
            total: positionsCount || 0,
            active: activePositionsCount || 0,
          },
          team: teamCount || 0,
        },
        recentLogs: recentLogs || [],
      },
      "Dashboard statistics retrieved successfully"
    )
  );
});
