import { ApiError } from "../utils/ApiError.js";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      next(new ApiError(400, "Validation failed", fieldErrors));
      return;
    }

    req.body = result.data;
    req.validated = result.data;
    next();
  };
}
