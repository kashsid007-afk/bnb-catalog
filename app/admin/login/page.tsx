'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Invalid credentials')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-bnb-dark flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="text-center mb-8">
          <div className="text-4xl font-extrabold tracking-[8px] text-bnb-gold mb-1">BNB</div>
          <div className="text-[10px] text-bnb-muted tracking-[3px] uppercase">Admin Panel</div>
        </div>
        <form onSubmit={handleLogin} className="bg-white/5 border border-bnb-gold/20 rounded-3xl p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-2">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email"
              className="w-full bg-white/10 border border-bnb-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-bnb-muted outline-none focus:border-bnb-gold transition-colors"
              placeholder="admin@bnb.com"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-2">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required autoComplete="current-password"
              className="w-full bg-white/10 border border-bnb-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-bnb-muted outline-none focus:border-bnb-gold transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-bnb-gold text-white py-3.5 rounded-xl font-bold text-sm btn-spring disabled:opacity-60 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
