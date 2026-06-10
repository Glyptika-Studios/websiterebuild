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

function getMediaType(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  throw new ApiError(400, `Unsupported file type: ${mimetype}`);
}

export const uploadToMediaBucket = async (file, folder, uploadedBy = null) => {
  if (!file) throw new ApiError(400, "No file provided for upload");

  const sanitizedFolder = sanitizePathSegment(folder, "");
  const sanitizedName   = sanitizePathSegment(file.originalname, "upload");
  const destinationPath = `${sanitizedFolder ? `${sanitizedFolder}/` : ""}${Date.now()}-${sanitizedName}`;

  // Step 1 — Upload file to Supabase Storage
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

  // Step 2 — Get public CDN URL
  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(destinationPath);

  // Step 3 — Insert row into media_files table
  const { data: record, error: dbError } = await supabaseAdmin
    .from("media_files")
    .insert({
      storage_path: destinationPath,
      public_url:   publicUrlData.publicUrl,
      file_name:    file.originalname,
      mime_type:    file.mimetype,
      media_type:   getMediaType(file.mimetype),
      size_bytes:   file.size,
      uploaded_by:  uploadedBy,
    })
    .select("id, storage_path, public_url, file_name, mime_type, media_type, size_bytes, created_at")
    .single();

  if (dbError) {
    // DB insert failed — remove the orphaned Storage file
    await supabaseAdmin.storage.from(BUCKET).remove([destinationPath]);
    throw new ApiError(500, "Failed to save media record: " + dbError.message);
  }

  return record;
};

export const deleteFromMediaBucket = async (id) => {
  if (!id) throw new ApiError(400, "Media ID is required");

  // Step 1 — Get the storage_path from media_files
  const { data: record, error: fetchError } = await supabaseAdmin
    .from("media_files")
    .select("id, storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !record) {
    throw new ApiError(404, "Media file not found");
  }

  // Step 2 — Delete from Supabase Storage
  const { error: storageError } = await supabaseAdmin.storage
    .from(BUCKET)
    .remove([record.storage_path]);

  if (storageError) {
    throw new ApiError(500, "Failed to delete file from storage: " + storageError.message);
  }

  // Step 3 — Delete row from media_files table
  const { error: dbError } = await supabaseAdmin
    .from("media_files")
    .delete()
    .eq("id", id);

  if (dbError) {
    throw new ApiError(500, "Failed to delete media record: " + dbError.message);
  }

  return { id };
};

export const listMediaFiles = async ({ page = 1, limit = 20, media_type = null }) => {
  const from = (page - 1) * limit;

  let query = supabaseAdmin
    .from("media_files")
    .select(
      "id, storage_path, public_url, file_name, mime_type, media_type, size_bytes, uploaded_by, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (media_type) {
    query = query.eq("media_type", media_type);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new ApiError(500, "Failed to fetch media files: " + error.message);
  }

  return {
    items: data,
    meta: { page, limit, total: count },
  };
};
