import { useQuery } from "@tanstack/react-query";
import { fetchSubmissions } from "@/api/submissions";

export function useSubmissions() {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
    staleTime: 1000 * 60 * 5, // 5 minutes — submissions rarely change
  });
}
