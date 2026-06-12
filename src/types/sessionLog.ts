export interface SessionLog {
  id: number
  session_focus: string | null
  session_time: string
  is_gi_session?: boolean | null
  created_at?: string
}

export interface SessionLogsPage {
  data: SessionLog[]
  count: number
}

export interface SessionLogDetail extends SessionLog {
  submissions: {
    id: number
    name: string
  }[]
}
