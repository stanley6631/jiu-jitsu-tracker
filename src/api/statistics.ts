import { apiFetch } from '@/lib/api/client'
import type { SessionLogDetail } from '@/types'

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

/**
 * The backend has no statistics endpoint, so we derive everything from the full
 * session list (each session embeds its submissions).
 */
export async function fetchStatistics(): Promise<Statistics> {
  const sessions = await apiFetch<SessionLogDetail[]>('/sessions/')

  const now = new Date()
  const thisMonth = getMonthRange(now.getFullYear(), now.getMonth())
  const lastMonth = getMonthRange(now.getFullYear(), now.getMonth() - 1)

  const thisStart = Date.parse(thisMonth.start)
  const thisEnd = Date.parse(thisMonth.end)
  const lastStart = Date.parse(lastMonth.start)
  const lastEnd = Date.parse(lastMonth.end)

  let thisMonthCount = 0
  let lastMonthCount = 0
  const counts: Record<string, number> = {}

  for (const session of sessions) {
    const time = Date.parse(session.session_time)
    if (time >= thisStart && time <= thisEnd) thisMonthCount++
    if (time >= lastStart && time <= lastEnd) lastMonthCount++

    for (const sub of session.submissions ?? []) {
      if (!sub?.name) continue
      counts[sub.name] = (counts[sub.name] ?? 0) + 1
    }
  }

  const topSubmission =
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  return { thisMonthCount, lastMonthCount, topSubmission }
}
