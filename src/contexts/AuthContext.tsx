import { createContext, useEffect, useState } from "react";
import {
  clearStoredEmail,
  clearToken,
  decodeJwtExp,
  getStoredEmail,
  getToken,
  setStoredEmail,
  setToken,
} from "@/lib/api/client";
import { login } from "@/api/auth";
import type { AuthContextValue, AuthUser } from "@/types";

export const AuthContext = createContext<AuthContextValue | null>(null);

function isTokenValid(token: string): boolean {
  const exp = decodeJwtExp(token);
  // No exp claim -> treat as non-expiring; otherwise compare against now.
  return exp === null || exp * 1000 > Date.now();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const email = getStoredEmail();

    if (token && isTokenValid(token) && email) {
      setUser({ email });
    } else {
      clearToken();
      clearStoredEmail();
    }

    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    const token = await login(email, password);
    setToken(token);
    setStoredEmail(email);
    setUser({ email });
  }

  function signOut() {
    clearToken();
    clearStoredEmail();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
