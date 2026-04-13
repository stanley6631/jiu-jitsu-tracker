import { useQuery } from '@tanstack/react-query'
import { fetchSessionLogs } from '@/api/sessionLogs'

export function useSessionLogs(page: number) {
  return useQuery({
    queryKey: ['session-logs', page],
    queryFn: () => fetchSessionLogs(page),
  })
}
