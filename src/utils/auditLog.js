import { supabaseAdmin } from "../config/supabase.js";
import { ApiError } from "./ApiError.js";

function getDisplayName(user) {
  return (
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    null
  );
}

export async function recordAuditLog({
  user = null,
  action,
  entity,
  entityId = null,
  metadata = null,
  failSilently = true,
}) {
  const payload = {
    user_id: user?.id || null,
    user_email: user?.email || metadata?.email || null,
    user_name: getDisplayName(user),
    action,
    entity,
    entity_id: entityId === null || entityId === undefined ? null : String(entityId),
    metadata,
  };

  const { error } = await supabaseAdmin.from("audit_logs").insert(payload);

  if (!error) return;

  if (failSilently) {
    console.error("Audit log failed:", error.message);
    return;
  }

  throw new ApiError(500, "Failed to write audit log: " + error.message);
}
