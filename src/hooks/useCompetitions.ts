import { useQuery } from "@tanstack/react-query";
import { fetchCompetitionData } from "@/api/competition";

export function useCompetitions() {
  return useQuery({
    queryKey: ["competitions"],
    queryFn: () => fetchCompetitionData(),
  });
}
