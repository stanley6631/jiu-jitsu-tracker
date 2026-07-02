import { apiFetch } from "@/lib/api/client";

export type Submission = {
  id: number;
  name: string;
};

export async function fetchSubmissions(): Promise<Submission[]> {
  const data = await apiFetch<Submission[]>("/submissions/");
  return [...data].sort((a, b) => a.name.localeCompare(b.name));
}
