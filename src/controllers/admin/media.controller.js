import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadToMediaBucket } from "../../utils/media.service.js";

export const uploadMedia = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "No file uploaded. Use the 'file' field in multipart/form-data.");
  }

  const uploaded = await uploadToMediaBucket(file, req.body.folder);

  return res.status(201).json(new ApiResponse(201, uploaded, "Media uploaded successfully"));
});
