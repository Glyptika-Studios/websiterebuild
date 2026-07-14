import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { recordAuditLog } from "../../utils/auditLog.js";
import {
  uploadToMediaBucket,
  deleteFromMediaBucket,
  listMediaFiles,
} from "../../utils/media.service.js";

export const uploadMedia = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "No file uploaded. Use the 'file' field in multipart/form-data.");
  }

  // Allow caller to supply a custom display name
  if (req.body.file_name && String(req.body.file_name).trim()) {
    file.originalname = String(req.body.file_name).trim();
  }

  const uploaded = await uploadToMediaBucket(file, req.body.folder, req.user.id);

  await recordAuditLog({
    user: req.user,
    action: "CREATE",
    entity: "media_files",
    entityId: uploaded.id,
    metadata: {
      file_name: uploaded.file_name,
      media_type: uploaded.media_type,
      storage_path: uploaded.storage_path,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, uploaded, "Media uploaded successfully")
  );
});

export const getMediaList = asyncHandler(async (req, res) => {
  const parsedLimit = parseInt(req.query.limit);
  const page       = Math.max(1, parseInt(req.query.page) || 1);
  const limit      = Math.min(100, Math.max(1, parsedLimit > 0 ? parsedLimit : 20));
  const media_type = req.query.media_type           || null;

  // media_type must be one of the valid ENUM values if provided
  const validTypes = ["image", "video", "audio"];
  if (media_type && !validTypes.includes(media_type)) {
    throw new ApiError(400, `Invalid media_type. Must be one of: ${validTypes.join(", ")}`);
  }

  const result = await listMediaFiles({ page, limit, media_type });

  return res.status(200).json(
    new ApiResponse(200, result, "Media files fetched successfully")
  );
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Media ID is required");
  }

  const deleted = await deleteFromMediaBucket(id);

  await recordAuditLog({
    user: req.user,
    action: "DELETE",
    entity: "media_files",
    entityId: deleted.id,
    metadata: deleted,
  });

  return res.status(200).json(
    new ApiResponse(200, deleted, "Media file deleted successfully")
  );
});
