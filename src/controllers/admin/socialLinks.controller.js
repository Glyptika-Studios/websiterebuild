import { supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { recordAuditLog } from "../../utils/auditLog.js";

const VALID_PLATFORMS = ["linkedin", "instagram", "discord"];

export const getSocialLinks = asyncHandler(async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("social_links")
    .select("*")
    .order("platform", { ascending: true });

  if (error) throw new ApiError(500, "Database error: " + error.message);

  return res.status(200).json(new ApiResponse(200, data, "Social links retrieved successfully"));
});

export const upsertSocialLink = asyncHandler(async (req, res) => {
  const { platform } = req.params;
  const { url } = req.validated;

  if (!VALID_PLATFORMS.includes(platform)) {
    throw new ApiError(400, "Invalid platform. Must be one of: linkedin, instagram, discord");
  }

  const { data, error } = await supabaseAdmin
    .from("social_links")
    .upsert({ platform, url }, { onConflict: "platform" })
    .select()
    .single();

  if (error) {
    if (error.code === "23514") throw new ApiError(400, "URL must start with https://");
    if (error.message?.includes("invalid input value for enum")) {
      throw new ApiError(400, "Invalid platform value");
    }

    throw new ApiError(500, "Database error: " + error.message);
  }

  await recordAuditLog({
    user: req.user,
    action: "UPDATE",
    entity: "social_links",
    entityId: platform,
    metadata: { url },
  });

  return res.status(200).json(new ApiResponse(200, data, "Social link saved successfully"));
});
