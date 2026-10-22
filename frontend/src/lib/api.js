const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5100").replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("interviewly_token");
  const headers = { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const isAdminApi = (path.startsWith("/api/platform/admin/") || path.startsWith("/api/payments/admin/")) && !path.endsWith("/admin/unlock");
  const adminToken = isAdminApi ? sessionStorage.getItem("interviewly_admin_token") : null;
  if (adminToken) headers["X-Admin-Token"] = adminToken;
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the Interviewly server. Check your connection and make sure the backend is running.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("interviewly_token");
      localStorage.removeItem("interviewly_user");
      window.dispatchEvent(new Event("interviewly-auth-changed"));
    }
    throw new Error(data.message || "The request could not be completed.");
  }
  return data;
}

export function getApiBase() { return API_BASE; }
