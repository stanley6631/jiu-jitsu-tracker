const API_URL = import.meta.env.VITE_API_URL;

// The access token lives in memory only (never persisted). AuthContext mirrors
// it in React state; this module-level copy exists so apiFetch can read it
// outside the React tree.
let accessToken: string | null = null;

type AuthCallbacks = {
  onTokenRefreshed: (token: string) => void;
  onSessionExpired: () => void;
};

let authCallbacks: AuthCallbacks | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function setAuthCallbacks(callbacks: AuthCallbacks | null): void {
  authCallbacks = callbacks;
}

let refreshInFlight: Promise<string | null> | null = null;

/**
 * Exchange the httpOnly refresh cookie for a new access token. The server
 * rotates the refresh token on every call and revokes the whole token family
 * if it sees the same token twice, so concurrent callers MUST share a single
 * in-flight request. Returns the new access token, or null if the session is
 * gone.
 */
export function refreshAccessToken(): Promise<string | null> {
  refreshInFlight ??= (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        accessToken = null;
        return null;
      }
      const data = (await res.json()) as { access_token: string };
      accessToken = data.access_token;
      authCallbacks?.onTokenRefreshed(data.access_token);
      return data.access_token;
    } catch {
      accessToken = null;
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

async function throwApiError(res: Response): Promise<never> {
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

/**
 * Thin fetch wrapper around the FastAPI backend. Prepends the API URL, sets
 * JSON headers, attaches the in-memory bearer token, and sends cookies so the
 * /auth endpoints can set/read the httpOnly refresh token. On a 401 from a
 * non-auth endpoint it silently refreshes the access token and retries once.
 * Throws on non-2xx with the FastAPI `detail` message. Returns parsed JSON,
 * or undefined for empty (204) responses.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const doFetch = () => {
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  let res = await doFetch();

  if (res.status === 401 && !path.startsWith("/auth/")) {
    const token = await refreshAccessToken();
    if (!token) {
      authCallbacks?.onSessionExpired();
      await throwApiError(res);
    }
    res = await doFetch();
  }

  if (!res.ok) {
    await throwApiError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
