import { supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { parsePagination } from "../../utils/pagination.js";

const PROJECT_SELECT =
  "id, title, category_id, active, publish, display_order, category:categories(id, label, slug)";

async function getProjectByIdOrThrow(id) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Project not found");
    throw new ApiError(500, error.message);
  }

  return data;
}

async function ensureProjectCategory(categoryId) {
  if (!categoryId) return;

  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("id, scope")
    .eq("id", categoryId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Project category not found");
    throw new ApiError(500, error.message);
  }

  if (data.scope !== "project") {
    throw new ApiError(400, "Project category must have scope 'project'");
  }
}

async function logAudit(action, entityId, metadata) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      action,
      entity: "projects",
      entity_id: String(entityId),
      metadata,
    });
  } catch (error) {
    console.error("Project audit log failed:", error.message);
  }
}

function handleProjectWriteError(error) {
  if (error.code === "23505") {
    throw new ApiError(409, "A project with this unique value already exists");
  }

  if (error.code === "23503") {
    throw new ApiError(400, "Invalid project reference");
  }

  if (error.message?.toLowerCase().includes("category scope")) {
    throw new ApiError(400, "Project category must have scope 'project'");
  }

  throw new ApiError(500, error.message);
}

export const getProjects = asyncHandler(async (req, res) => {
  const { category_id, active, search } = req.query;
  const published = req.query.published ?? req.query.publish;
  const { page, limit, from, to } = parsePagination(req.query);

  let query = supabaseAdmin
    .from("projects")
    .select(PROJECT_SELECT, { count: "exact" });

  if (category_id) query = query.eq("category_id", category_id);
  if (active === "true" || active === "false") query = query.eq("active", active === "true");
  if (published === "true" || published === "false") {
    query = query.eq("publish", published === "true");
  }
  if (search) query = query.ilike("title", `%${search}%`);

  query = query
    .order("display_order", { ascending: true })
    .order("title", { ascending: true })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message);

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: data, meta: { page, limit, total: count } },
      "Projects retrieved successfully"
    )
  );
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await getProjectByIdOrThrow(req.params.id);
  return res.status(200).json(new ApiResponse(200, project, "Project retrieved successfully"));
});

export const createProject = asyncHandler(async (req, res) => {
  await ensureProjectCategory(req.validated.category_id);

  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert(req.validated)
    .select(PROJECT_SELECT)
    .single();

  if (error) handleProjectWriteError(error);

  await logAudit("CREATE", data.id, { title: data.title, category_id: data.category_id });

  return res.status(201).json(new ApiResponse(201, data, "Project created successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
  await getProjectByIdOrThrow(req.params.id);

  if (Object.prototype.hasOwnProperty.call(req.validated, "category_id")) {
    await ensureProjectCategory(req.validated.category_id);
  }

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update(req.validated)
    .eq("id", req.params.id)
    .select(PROJECT_SELECT)
    .single();

  if (error) handleProjectWriteError(error);

  await logAudit("UPDATE", data.id, req.validated);

  return res.status(200).json(new ApiResponse(200, data, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await getProjectByIdOrThrow(req.params.id);

  const { error } = await supabaseAdmin
    .from("projects")
    .delete()
    .eq("id", project.id);

  if (error) {
    if (error.code === "23503") {
      throw new ApiError(
        409,
        "Cannot delete this project because it is referenced by existing proposals or content."
      );
    }

    throw new ApiError(500, error.message);
  }

  await logAudit("DELETE", project.id, { title: project.title });

  return res.status(200).json(new ApiResponse(200, { id: project.id }, "Project deleted successfully"));
});
