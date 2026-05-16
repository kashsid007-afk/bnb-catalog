'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

interface Props { message: string }

export function AnnouncementBanner({ message }: Props) {
  const [visible, setVisible] = useState(true)
  if (!message || !visible) return null

  return (
    <div className="bg-bnb-dark text-bnb-gold-light text-xs font-medium px-4 py-2.5 flex items-center justify-between animate-fade-in">
      <span className="flex-1 text-center">{message}</span>
      <button onClick={() => setVisible(false)} className="ml-3 text-bnb-muted hover:text-white transition-colors">
        <X size={14} />
      </button>
    </div>
  )
}
