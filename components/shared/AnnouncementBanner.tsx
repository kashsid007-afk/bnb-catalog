'use client'
import { useState } from 'react'
import { X, Megaphone } from 'lucide-react'

interface Props { text: string }

export function AnnouncementBanner({ text }: Props) {
  const [visible, setVisible] = useState(true)
  if (!visible || !text) return null

  return (
    <div className="bg-bnb-dark text-bnb-gold-light text-[11px] px-4 py-2 flex items-center gap-2 animate-fade-in">
      <Megaphone size={12} className="flex-shrink-0 animate-pulse-gold" />
      <span className="flex-1 truncate font-medium">{text}</span>
      <button onClick={() => setVisible(false)} className="flex-shrink-0 opacity-60 hover:opacity-100">
        <X size={12} />
      </button>
    </div>
  )
}
