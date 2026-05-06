export interface SessionLog {
  id: string
  session_focus: string
  session_time: string
  user_id: string
  is_gi_session?: boolean | null
}

export interface SessionLogsPage {
  data: SessionLog[]
  count: number
}

export interface SessionLogSubmission {
  submission_id: number
  submissions: {
    id: number
    name: string
  }
}

export interface SessionLogDetail extends SessionLog {
  session_log_submissions: SessionLogSubmission[]
}
