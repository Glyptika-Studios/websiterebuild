import { z } from "zod";

const VALID_ROLES = ["superadmin", "editor", "viewer"];
const VALID_EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];
const VALID_SECTIONS = [
  "careers",
  "blog_posts",
  "products",
  "projects",
  "linkedin_posts",
  "media",
  "team",
  "home",
  "services",
  "xplor",
  "ims",
];

const sectionPermissionSchema = z.object({
  section: z.enum(VALID_SECTIONS, {
    errorMap: () => ({
      message: `section must be one of: ${VALID_SECTIONS.join(", ")}`,
    }),
  }),
  can_write: z.boolean().optional().default(false),
});

export const inviteAdminUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Must be a valid email address"),

    name: z
      .string()
      .min(1, "Name is required")
      .max(200, "Name must be 200 characters or less"),

    roll_no: z
      .string()
      .min(1, "Roll number is required")
      .max(50, "Roll number must be 50 characters or less"),

    role: z.enum(VALID_ROLES, {
      errorMap: () => ({
        message: `role must be one of: ${VALID_ROLES.join(", ")}`,
      }),
    }),

    employment_type: z.enum(VALID_EMPLOYMENT_TYPES, {
      errorMap: () => ({
        message: `employment_type must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`,
      }),
    }),

    // sections required for editor/viewer, ignored for superadmin
    sections: z
      .array(sectionPermissionSchema)
      .optional(),
  }),
});

export const updateAdminUserSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(1)
        .max(200)
        .optional(),

      role: z
        .enum(VALID_ROLES, {
          errorMap: () => ({
            message: `role must be one of: ${VALID_ROLES.join(", ")}`,
          }),
        })
        .optional(),

      employment_type: z
        .enum(VALID_EMPLOYMENT_TYPES, {
          errorMap: () => ({
            message: `employment_type must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`,
          }),
        })
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      { message: "At least one field must be provided" }
    ),
});

export const upsertPermissionsSchema = z.object({
  body: z.object({
    permissions: z
      .array(sectionPermissionSchema)
      .min(1, "At least one permission must be provided"),
  }),
});