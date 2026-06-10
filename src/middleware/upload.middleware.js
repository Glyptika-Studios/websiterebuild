import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max
  },
  fileFilter: (_req, file, callback) => {
    const allowed =
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("audio/");

    if (allowed) {
      callback(null, true);
      return;
    }

    callback(new ApiError(400, "Unsupported file type. Allowed: image, video, audio"), false);
  },
});

export default upload;
