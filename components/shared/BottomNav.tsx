'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Bookmark, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTray } from '@/hooks/useTray'

const navItems = [
  { href: '/',           icon: Home,      label: 'Catalog' },
  { href: '/search',     icon: Search,    label: 'Search'  },
  { href: '/tray',       icon: Bookmark,  label: 'Tray',   badge: true },
  { href: '/categories', icon: Grid3X3,   label: 'Browse'  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { items } = useTray()

  return (
    <nav className="sticky bottom-0 z-50 bg-white border-t border-bnb-sand">
      <div className="flex">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-[3px] py-2 pb-3',
                'text-[9px] font-medium transition-colors duration-200',
                active ? 'text-bnb-gold' : 'text-bnb-muted',
              )}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={cn(
                    'transition-transform duration-200',
                    active && 'scale-110'
                  )}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {badge && items.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-bnb-gold rounded-full text-[8px] font-bold text-white flex items-center justify-center px-[3px] animate-bounceIn">
                    {items.length}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
