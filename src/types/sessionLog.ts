export type SessionLog = {
  id: number
  session_focus: string | null
  session_time: string
  is_gi_session?: boolean | null
  created_at?: string
}

export type SessionLogsPage = {
  data: SessionLog[]
  count: number
}

export type SessionLogDetail = SessionLog & {
  submissions: {
    id: number
    name: string
  }[]
}
