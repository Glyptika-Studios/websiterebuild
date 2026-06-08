import { ApiError } from "../utils/ApiError.js";

/**
 * @param {string[]} allowedRoles Array of roles, e.g., ['superadmin', 'editor']
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, `Forbidden. Requires one of: ${allowedRoles.join(", ")}`);
    }

    next();
  };
};
