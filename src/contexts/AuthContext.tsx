import { createContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  refreshAccessToken,
  setAccessToken,
  setAuthCallbacks,
} from "@/lib/api/client";
import { login, logout } from "@/api/auth";
import type { AuthContextValue } from "@/types";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Memory-only copy of the access token; the refresh token lives in an
  // httpOnly cookie the JS never sees.
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    setAuthCallbacks({
      onTokenRefreshed: (newToken) => setToken(newToken),
      onSessionExpired: () => setToken(null),
    });

    // Bootstrap the session from the refresh cookie. Safe under StrictMode's
    // double effect run — refreshAccessToken is single-flight.
    void refreshAccessToken().then((newToken) => {
      setToken(newToken);
      setLoading(false);
    });

    return () => setAuthCallbacks(null);
  }, []);

  async function signIn(email: string, password: string) {
    const newToken = await login(email, password);
    setAccessToken(newToken);
    setToken(newToken);
  }

  async function signOut() {
    try {
      await logout();
    } catch {
      // Server-side revocation failed (e.g. offline) — still end the local session.
    }
    setAccessToken(null);
    setToken(null);
    //clear the query so that users cache after logut clears and there are no data lingering
    queryClient.clear();
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: token !== null, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
