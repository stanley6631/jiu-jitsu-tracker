import { supabase } from '@/lib/supabase/client'
import type { SessionLog, SessionLogsPage, SessionLogDetail } from '@/types'

const PAGE_SIZE = 10

export type { SessionLog, SessionLogsPage, SessionLogDetail }

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

export async function fetchSessionLog(id: string): Promise<SessionLogDetail> {
  const { data, error } = await supabase
    .from('session_log')
    .select(`
      *,
      session_log_submissions(
        submission_id,
        submissions(id, name)
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)

  return data as SessionLogDetail
}

export { PAGE_SIZE }
