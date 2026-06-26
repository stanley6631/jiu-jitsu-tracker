import { apiFetch } from "@/lib/api/client";
import type { Competition } from "@/types";

export const fetchCompetitionData = async (): Promise<Competition[]> => {
  const data = await apiFetch<Competition[]>("/competitions/");
  return data;
};
