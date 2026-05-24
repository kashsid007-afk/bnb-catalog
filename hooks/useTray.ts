'use client'

import { useEffect, useState } from 'react'
import type { Product, SelectedModel, TrayItem } from '@/types'

const STORAGE_KEY = 'bnb_inquiry_tray'

function totalSelectionQty(selections: SelectedModel[]): number {
  return selections.reduce((sum, selection) => sum + selection.qty, 0)
}

function firstModelSelection(product: Pick<Product, 'models'>): SelectedModel[] {
  const first = Object.entries(product.models ?? {}).find(([, models]) => models.length > 0)
  if (!first) return []
  return [{ brand: first[0], model: first[1][0], qty: 1 }]
}

function normalizeSelections(selections: SelectedModel[]): SelectedModel[] {
  const merged = new Map<string, SelectedModel>()

  selections.forEach(selection => {
    if (!selection.brand.trim() || !selection.model.trim()) return
    const key = `${selection.brand.trim()}::${selection.model.trim()}`
    const existing = merged.get(key)
    const qty = Math.max(1, Number(selection.qty) || 1)

    merged.set(key, existing
      ? { ...existing, qty: existing.qty + qty }
      : { brand: selection.brand.trim(), model: selection.model.trim(), qty }
    )
  })

  return Array.from(merged.values())
}

function normalizeStoredItem(item: Partial<TrayItem>): TrayItem | null {
  if (!item.id || !item.lot_code || !item.name) return null
  const selections = normalizeSelections(item.selections ?? [])

  return {
    id: item.id,
    lot_code: item.lot_code,
    name: item.name,
    emoji: item.emoji,
    models: item.models ?? {},
    selections,
    qty: selections.length > 0 ? totalSelectionQty(selections) : Math.max(1, Number(item.qty) || 1),
  }
}

export function useTray() {
  const [items, setItems] = useState<TrayItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return
      const parsed: unknown = JSON.parse(stored)
      if (!Array.isArray(parsed)) return
      setItems(parsed.map(normalizeStoredItem).filter((item): item is TrayItem => item !== null))
    } catch {}
  }, [])

  function save(newItems: TrayItem[]) {
    setItems(newItems)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
    } catch {}
  }

  function addItem(product: Product, selections?: SelectedModel[]) {
    const cleanSelections = normalizeSelections(selections?.length ? selections : firstModelSelection(product))
    const fallbackQty = cleanSelections.length > 0 ? totalSelectionQty(cleanSelections) : 1

    setItems(prev => {
      const exists = prev.find(item => item.id === product.id)
      const next = exists
        ? prev.map(item => item.id === product.id
          ? {
              ...item,
              selections: normalizeSelections([...item.selections, ...cleanSelections]),
              qty: cleanSelections.length > 0
                ? totalSelectionQty(normalizeSelections([...item.selections, ...cleanSelections]))
                : (item.qty ?? 1) + 1,
            }
          : item
        )
        : [
            ...prev,
            {
              id: product.id,
              lot_code: product.lot_code,
              name: product.name,
              models: product.models,
              selections: cleanSelections,
              qty: fallbackQty,
            },
          ]

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}

      return next
    })
  }

  function removeItem(id: string) {
    save(items.filter(item => item.id !== id))
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) {
      removeItem(id)
      return
    }
    save(items.map(item => item.id === id ? { ...item, qty } : item))
  }

  function updateModelQty(id: string, brand: string, model: string, qty: number) {
    save(items.flatMap(item => {
      if (item.id !== id) return [item]
      const selections = item.selections
        .map(selection => (
          selection.brand === brand && selection.model === model
            ? { ...selection, qty }
            : selection
        ))
        .filter(selection => selection.qty > 0)

      if (selections.length === 0) return []
      return [{ ...item, selections, qty: totalSelectionQty(selections) }]
    }))
  }

  function removeSelection(id: string, brand: string, model: string) {
    updateModelQty(id, brand, model, 0)
  }

  function clearTray() {
    save([])
  }

  function isInTray(id: string) {
    return items.some(item => item.id === id)
  }

  const count = items.reduce((sum, item) => sum + Math.max(1, item.selections.length || 1), 0)
  const modelQty = items.reduce((sum, item) => sum + (item.selections.length ? totalSelectionQty(item.selections) : (item.qty ?? 1)), 0)

  return {
    items,
    addItem,
    removeItem,
    updateQty,
    updateModelQty,
    removeSelection,
    clearTray,
    isInTray,
    count,
    modelQty,
  }
}
