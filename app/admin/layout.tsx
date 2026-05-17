'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Plus, Settings, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen bg-bnb-cream">
      {/* Admin top bar */}
      <div className="bg-bnb-dark px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold tracking-widest text-bnb-gold">BNB</span>
          <span className="text-[10px] text-bnb-muted border-l border-bnb-muted/30 pl-3">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-[10px] text-bnb-muted hover:text-bnb-gold transition-colors px-2 py-1">
            View Site
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-bnb-muted hover:text-red-400 transition-colors p-1.5" aria-label="Sign out">
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Admin nav tabs */}
      <div className="bg-white border-b border-bnb-sand flex max-w-2xl mx-auto">
        {[
          { href: '/admin/dashboard', icon: LayoutGrid, label: 'Dashboard' },
          { href: '/admin/products/new', icon: Plus, label: 'Add Lot' },
          { href: '/admin/settings', icon: Settings, label: 'Settings' },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold text-bnb-muted hover:text-bnb-gold transition-colors border-b-2 border-transparent hover:border-bnb-gold"
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>

      <main className="max-w-2xl mx-auto p-4">{children}</main>
    </div>
  )
}
