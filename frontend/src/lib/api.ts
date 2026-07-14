interface RequestOptions extends Omit<RequestInit, "body"> {
  token?: string;
  body?: unknown;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

async function apiRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers = {}, body, ...rest } = options;

  const mergedHeaders = new Headers(headers as HeadersInit);

  const activeToken = token || getCookie("glyptika_admin_token");
  if (activeToken) {
    mergedHeaders.set("Authorization", `Bearer ${activeToken}`);
  }

  let finalBody: BodyInit | undefined;
  if (body) {
    if (body instanceof FormData) {
      // Allow browser to set boundary header automatically for multipart uploads
      finalBody = body;
    } else {
      if (!mergedHeaders.has("Content-Type")) {
        mergedHeaders.set("Content-Type", "application/json");
      }
      finalBody = JSON.stringify(body);
    }
  }

  const response = await fetch(url, {
    headers: mergedHeaders,
    body: finalBody,
    ...rest,
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseData?.message || `API Error: ${response.status} ${response.statusText}`
    );
  }

  return responseData as T;
}

export const api = {
  get: <T>(url: string, options?: Omit<RequestOptions, "body">) =>
    apiRequest<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, body?: unknown, options?: Omit<RequestOptions, "body">) =>
    apiRequest<T>(url, { method: "POST", body, ...options }),

  patch: <T>(url: string, body?: unknown, options?: Omit<RequestOptions, "body">) =>
    apiRequest<T>(url, { method: "PATCH", body, ...options }),

  put: <T>(url: string, body?: unknown, options?: Omit<RequestOptions, "body">) =>
    apiRequest<T>(url, { method: "PUT", body, ...options }),

  delete: <T>(url: string, options?: Omit<RequestOptions, "body">) =>
    apiRequest<T>(url, { method: "DELETE", ...options }),
};
