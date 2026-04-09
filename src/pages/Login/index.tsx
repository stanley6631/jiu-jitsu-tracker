import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'

export default function Login() {
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }

    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">🥋 BJJ Tracker</h1>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

        {sent ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center space-y-2">
            <p className="font-medium">Check your email</p>
            <p className="text-muted-foreground text-sm">
              We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send magic link'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
