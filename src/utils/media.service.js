import { supabaseAdmin } from "../config/supabase.js";
import { ApiError } from "./ApiError.js";

const BUCKET = "media";

function sanitizePathSegment(value, fallback) {
  const sanitized = String(value || fallback)
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, "-"))
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");

  return sanitized || fallback;
}

export const uploadToMediaBucket = async (file, folder) => {
  if (!file) {
    throw new ApiError(400, "No file provided for upload");
  }

  const sanitizedFolder = sanitizePathSegment(folder, "");
  const sanitizedName = sanitizePathSegment(file.originalname, "upload");
  const destinationPath = `${sanitizedFolder ? `${sanitizedFolder}/` : ""}${Date.now()}-${sanitizedName}`;

  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(destinationPath, file.buffer, {
      cacheControl: "3600",
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    throw new ApiError(500, uploadError.message || "Failed to upload media file");
  }

  const { data: publicUrlData, error: urlError } = await supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(destinationPath);

  if (urlError) {
    throw new ApiError(500, urlError.message || "Failed to generate media URL");
  }

  return {
    id: uploadData?.id || null,
    bucket: BUCKET,
    path: destinationPath,
    fullPath: uploadData?.fullPath || `${BUCKET}/${destinationPath}`,
    url: publicUrlData.publicUrl,
    originalName: file.originalname,
    contentType: file.mimetype,
    size: file.size,
    metadata: uploadData,
  };
};
