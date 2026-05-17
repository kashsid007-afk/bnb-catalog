import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'
import { getSupabaseConfig } from './lib/supabase/config'

type CookieToSet = {
  name: string
  value: string
  options?: CookieOptions
}

export async function middleware(request: NextRequest) {
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'
  if (isLoginRoute) return NextResponse.next({ request })

  const config = getSupabaseConfig()
  if (!config) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    config.url,
    config.anonKey,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
