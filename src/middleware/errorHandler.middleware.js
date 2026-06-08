import { ApiError } from "../utils/ApiError.js";

export function errorHandler(err, _req, res, _next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? 400 : 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], error.stack);
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
