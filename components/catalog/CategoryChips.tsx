import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  selected?: string
}

export function CategoryChips({ categories, selected = 'all' }: Props) {
  const all = [{ id: 'all', slug: 'all', name: 'All', sort_order: 0, image_url: null, created_at: '' } as Category, ...categories]

  return (
    <div className="flex gap-2 px-3 py-2.5 overflow-x-auto no-scrollbar animate-fade-up">
      {all.map(cat => (
        <Link
          key={cat.id}
          href={cat.slug === 'all' ? '/' : `/?cat=${cat.slug}`}
          className={cn(
            'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 active:scale-95',
            selected === cat.slug
              ? 'bg-bnb-gold text-white border-bnb-gold'
              : 'bg-white text-bnb-brown border-bnb-sand'
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
