import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from './config'

export async function createClient() {
  const cookieStore = await cookies()
  const config = getSupabaseConfig()
  if (!config) throw new Error('Missing Supabase URL or anon key')

  return createServerClient(
    config.url,
    config.anonKey,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    }
  )
}
