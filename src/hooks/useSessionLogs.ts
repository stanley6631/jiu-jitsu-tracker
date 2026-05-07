import { useQuery } from "@tanstack/react-query";
import { fetchSessionLogs } from "@/api/sessionLogs";
import { PAGE_SIZE } from "@/api/sessionLogs";

export function useSessionLogs(page: number, pageSize: number = PAGE_SIZE) {
  return useQuery({
    queryKey: ["session-logs", page, pageSize],
    queryFn: () => fetchSessionLogs(page, pageSize),
  });
}
