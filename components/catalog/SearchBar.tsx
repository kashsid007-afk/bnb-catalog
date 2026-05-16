'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface Props { placeholder?: string; autoFocus?: boolean }

export function SearchBar({ placeholder = 'Search lot code, model, brand...', autoFocus }: Props) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pt-3 pb-1">
      <div className="flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 border border-bnb-sand focus-within:border-bnb-gold transition-colors duration-200">
        <Search size={15} className="text-bnb-gold flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 text-[12px] text-bnb-dark placeholder:text-bnb-muted bg-transparent outline-none"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus() }}>
            <X size={14} className="text-bnb-muted" />
          </button>
        )}
      </div>
    </form>
  )
}
