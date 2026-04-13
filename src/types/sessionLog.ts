export interface SessionLog {
  id: string
  session_focus: string
  session_time: string
  user_id: string
}

export interface SessionLogsPage {
  data: SessionLog[]
  count: number
}
