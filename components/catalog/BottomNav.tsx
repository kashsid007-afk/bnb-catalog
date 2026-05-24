'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTray } from '@/hooks/useTray'

const navItems = [
  { href: '/',        icon: Home,     label: 'Catalog'  },
  { href: '/search',  icon: Search,   label: 'Search'   },
  { href: '/tray',    icon: Bookmark, label: 'Tray',    badge: true },
]

export function BottomNav() {
  const pathname = usePathname()
  const { count } = useTray()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-bnb-sand z-50 safe-area-bottom">
      <div className="flex max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2.5 relative transition-all duration-200',
                active ? 'text-bnb-gold' : 'text-bnb-muted'
              )}
            >
              <div className={cn('relative transition-transform duration-200', active && 'scale-110')}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {badge && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-bnb-gold rounded-full text-[8px] font-bold text-white flex items-center justify-center animate-scale-in">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium">{label}</span>
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-bnb-gold rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
