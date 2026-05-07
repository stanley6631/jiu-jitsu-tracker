import { supabase } from '@/lib/supabase/client'

export interface Statistics {
  thisMonthCount: number
  lastMonthCount: number
  topSubmission: string | null
}

function getMonthRange(year: number, month: number): { start: string; end: string } {
  const start = new Date(Date.UTC(year, month, 1)).toISOString()
  const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)).toISOString()
  return { start, end }
}

export async function fetchStatistics(): Promise<Statistics> {
  const now = new Date()
  const thisMonth = getMonthRange(now.getFullYear(), now.getMonth())
  const lastMonth = getMonthRange(now.getFullYear(), now.getMonth() - 1)

  const [thisMonthResult, lastMonthResult, submissionsResult] = await Promise.all([
    supabase
      .from('session_log')
      .select('*', { count: 'exact', head: true })
      .gte('session_time', thisMonth.start)
      .lte('session_time', thisMonth.end),

    supabase
      .from('session_log')
      .select('*', { count: 'exact', head: true })
      .gte('session_time', lastMonth.start)
      .lte('session_time', lastMonth.end),

    supabase
      .from('session_log_submissions')
      .select('submission_id, submissions(id, name)'),
  ])

  if (thisMonthResult.error) throw new Error(thisMonthResult.error.message)
  if (lastMonthResult.error) throw new Error(lastMonthResult.error.message)
  if (submissionsResult.error) throw new Error(submissionsResult.error.message)

  const counts: Record<string, number> = {}
  for (const row of submissionsResult.data ?? []) {
    const sub = (row.submissions as unknown) as { id: number; name: string } | null
    if (!sub?.name) continue
    counts[sub.name] = (counts[sub.name] ?? 0) + 1
  }

  const topSubmission =
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  return {
    thisMonthCount: thisMonthResult.count ?? 0,
    lastMonthCount: lastMonthResult.count ?? 0,
    topSubmission,
  }
}
