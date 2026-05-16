'use client'
import { useState, useEffect } from 'react'
import type { TrayItem } from '@/types'

const STORAGE_KEY = 'bnb_inquiry_tray'

export function useTray() {
  const [items, setItems] = useState<TrayItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  function save(newItems: TrayItem[]) {
    setItems(newItems)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems)) } catch {}
  }

  function addItem(item: Omit<TrayItem, 'qty'>) {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      const next = exists
        ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  function removeItem(id: string) {
    save(items.filter(i => i.id !== id))
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) { removeItem(id); return }
    save(items.map(i => i.id === id ? { ...i, qty } : i))
  }

  function clearTray() { save([]) }

  function isInTray(id: string) { return items.some(i => i.id === id) }

  return { items, addItem, removeItem, updateQty, clearTray, isInTray, count: items.length }
}
