import { apiFetch } from "@/lib/api/client";
import type { SessionLog, SessionLogsPage, SessionLogDetail } from "@/types";

const PAGE_SIZE = 10;

export type { SessionLog, SessionLogsPage, SessionLogDetail };

/**
 * The backend returns all sessions in one call (no server-side paging), so we
 * sort newest-first and paginate client-side to preserve the existing UI.
 */
export async function fetchSessionLogs(
  page: number,
  pageSize: number = PAGE_SIZE,
): Promise<SessionLogsPage> {
  const all = await apiFetch<SessionLog[]>("/sessions/");

  const sorted = [...all].sort(
    (a, b) =>
      new Date(b.session_time).getTime() - new Date(a.session_time).getTime(),
  );

  const from = (page - 1) * pageSize;
  const data = sorted.slice(from, from + pageSize);

  return { data, count: sorted.length };
}

export async function fetchSessionLog(
  id: string | number,
): Promise<SessionLogDetail> {
  return apiFetch<SessionLogDetail>(`/sessions/${id}`);
}

export { PAGE_SIZE };
