const API_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = "jj_access_token";
const EMAIL_KEY = "jj_email";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

export function setStoredEmail(email: string): void {
  localStorage.setItem(EMAIL_KEY, email);
}

export function clearStoredEmail(): void {
  localStorage.removeItem(EMAIL_KEY);
}

/**
 * Decode a JWT and return its `exp` claim (seconds since epoch), or null if the
 * token is malformed or has no expiry. No external dependency — just base64url.
 */
export function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const claims = JSON.parse(json) as { exp?: number };
    return typeof claims.exp === "number" ? claims.exp : null;
  } catch {
    return null;
  }
}

/**
 * Thin fetch wrapper around the FastAPI backend. Prepends the API URL, sets JSON
 * headers, attaches the bearer token when present, and throws on non-2xx with
 * the FastAPI `detail` message. Returns parsed JSON, or undefined for empty
 * (204) responses.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body?.detail) {
        message =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {
      // non-JSON error body — fall back to statusText
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
