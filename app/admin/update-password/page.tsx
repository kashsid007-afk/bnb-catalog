'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<ResetShell>Preparing reset form...</ResetShell>}>
      <UpdatePasswordForm />
    </Suspense>
  )
}

function UpdatePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function prepareResetSession() {
      const supabase = createClient()
      const code = searchParams.get('code')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          toast.error('Reset link is invalid or expired')
          return
        }
      }

      const { data: { session } } = await supabase.auth.getSession()
      setSessionReady(Boolean(session))
      if (!session) toast.error('Open this page from the reset email link')
    }

    prepareResetSession()
  }, [searchParams])

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Password updated')
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bnb-dark flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="text-center mb-8">
          <div className="text-4xl font-extrabold tracking-[8px] text-bnb-gold mb-1">BNB</div>
          <div className="text-[10px] text-bnb-muted tracking-[3px] uppercase">Admin Password Reset</div>
        </div>

        <form onSubmit={updatePassword} className="bg-white/5 border border-bnb-gold/20 rounded-3xl p-6 space-y-4">
          <div>
            <h1 className="text-base font-bold text-white">Set a new password</h1>
            <p className="mt-1 text-[11px] leading-relaxed text-bnb-muted">
              Use the reset link from your email, then create a fresh admin password.
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full bg-white/10 border border-bnb-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-bnb-muted outline-none focus:border-bnb-gold transition-colors"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full bg-white/10 border border-bnb-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-bnb-muted outline-none focus:border-bnb-gold transition-colors"
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !sessionReady}
            className="w-full bg-bnb-gold text-white py-3.5 rounded-xl font-bold text-sm btn-spring disabled:opacity-50"
          >
            {loading ? 'Updating...' : sessionReady ? 'Update Password' : 'Waiting for reset link...'}
          </button>

          <Link href="/admin/login" className="block w-full py-1 text-center text-[11px] font-semibold text-bnb-gold-light">
            Back to login
          </Link>
        </form>
      </div>
    </div>
  )
}

function ResetShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bnb-dark flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-3xl border border-bnb-gold/20 bg-white/5 p-6 text-center text-sm font-semibold text-bnb-gold-light">
        {children}
      </div>
    </div>
  )
}
