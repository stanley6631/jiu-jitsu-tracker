import { useQuery } from '@tanstack/react-query'
import { fetchSessionLog } from '@/api/sessionLogs'

export function useSessionLog(id: string) {
  return useQuery({
    queryKey: ['session-log', id],
    queryFn: () => fetchSessionLog(id),
    enabled: !!id,
  })
}
