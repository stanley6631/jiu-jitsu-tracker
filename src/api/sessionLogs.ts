import { supabase } from '@/lib/supabase/client'
import type { SessionLog, SessionLogsPage } from '@/types'

const PAGE_SIZE = 10

export type { SessionLog, SessionLogsPage }

export async function fetchSessionLogs(page: number): Promise<SessionLogsPage> {
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error, count } = await supabase
    .from('session_log')
    .select('*', { count: 'exact' })
    .order('session_time', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  return { data: data ?? [], count: count ?? 0 }
}

export { PAGE_SIZE }
