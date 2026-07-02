import { apiFetch } from "@/lib/api/client";

type TokenResponse = {
  access_token: string;
  token_type: string;
};

export async function login(
  email: string,
  password: string,
): Promise<string> {
  const data = await apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data.access_token;
}

export async function register(
  email: string,
  password: string,
): Promise<string> {
  const data = await apiFetch<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data.access_token;
}
