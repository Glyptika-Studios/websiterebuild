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

  // Enrich showcase items media IDs with actual public URLs and media types
  if (data && data.content && Array.isArray(data.content.showcase_items)) {
    const mediaIds = data.content.showcase_items.map((item) => item.media_id).filter(Boolean);
    if (mediaIds.length > 0) {
      const { data: mediaFiles } = await supabasePublic
        .from("media_files")
        .select("id, public_url, media_type")
        .in("id", mediaIds);
      
      if (mediaFiles) {
        const mediaMap = {};
        mediaFiles.forEach((f) => {
          mediaMap[f.id] = f;
        });
        
        data.content.showcase_items = data.content.showcase_items.map((item) => ({
          ...item,
          public_url: mediaMap[item.media_id]?.public_url || null,
          media_type: mediaMap[item.media_id]?.media_type || "video",
        }));
      }
    }
  }

  // Enrich homepage carousel items media IDs with actual public URLs and media types
  if (data && data.content && Array.isArray(data.content.carousel_items)) {
    const mediaIds = data.content.carousel_items.map((item) => item.media_id).filter(Boolean);
    if (mediaIds.length > 0) {
      const { data: mediaFiles } = await supabasePublic
        .from("media_files")
        .select("id, public_url, media_type")
        .in("id", mediaIds);
      
      if (mediaFiles) {
        const mediaMap = {};
        mediaFiles.forEach((f) => {
          mediaMap[f.id] = f;
        });
        
        data.content.carousel_items = data.content.carousel_items.map((item) => ({
          ...item,
          public_url: mediaMap[item.media_id]?.public_url || null,
          media_type: mediaMap[item.media_id]?.media_type || "image",
        }));
      }
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Page content retrieved successfully"));
});