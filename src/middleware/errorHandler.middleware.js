import { ApiError } from "../utils/ApiError.js";

export function errorHandler(err, _req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  if (!(error instanceof ApiError)) {
    const isMulterError = error.name === "MulterError";
    const multerStatusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const statusCode = error.statusCode || error.status || (isMulterError ? multerStatusCode : 500);
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], error.stack);
  }

  // Log server errors so they are not silently swallowed
  if (error.statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] Server Error:`, err.message, err.stack);
  }

  const response = {
    success: error.success,
    message: error.message,
    errors: error.errors,
    data: error.data,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
  };

  return res.status(error.statusCode).json(response);
}
