import { ApiError } from "../utils/ApiError.js";

export function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      next(new ApiError(400, "Validation failed", fieldErrors));
      return;
    }

    req[source] = result.data;
    req.validated = result.data;
    next();
  };
}
