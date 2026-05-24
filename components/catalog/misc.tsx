'use client'

import { useMemo, useState } from 'react'
import { Bookmark, Check, Copy, MessageCircle, Minus, Plus, Search } from 'lucide-react'
import { buildProductInquiryMessage, buildWhatsAppLink } from '@/lib/whatsapp'
import { useTray } from '@/hooks/useTray'
import { cn } from '@/lib/utils'
import type { ModelMap, Product, SelectedModel } from '@/types'

export function FeaturePills({ features }: { features: string[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5 pill-stagger">
      {features.map((feature, index) => (
        <span
          key={feature}
          className="animate-scale-in rounded-full border border-bnb-sand bg-bnb-cream px-3 py-1.5 text-xs font-medium text-bnb-brown"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {feature}
        </span>
      ))}
    </div>
  )
}

function modelListText(models: ModelMap): string {
  return Object.entries(models)
    .map(([brand, brandModels]) => [brand.toUpperCase(), ...brandModels].join('\n'))
    .join('\n\n')
}

function getSelectionKey(brand: string, model: string): string {
  return `${brand}::${model}`
}

function selectionsFromMap(selected: Record<string, SelectedModel>): SelectedModel[] {
  return Object.values(selected).filter(selection => selection.qty > 0)
}

export function ProductModelSelector({ product, waNumber }: { product: Product; waNumber: string }) {
  const brands = Object.keys(product.models ?? {})
  const [activeBrand, setActiveBrand] = useState(brands[0] ?? '')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Record<string, SelectedModel>>({})
  const [copied, setCopied] = useState(false)
  const { addItem, isInTray } = useTray()

  const activeModels = product.models?.[activeBrand] ?? []
  const filteredModels = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return activeModels
    return activeModels.filter(model => model.toLowerCase().includes(normalized))
  }, [activeModels, query])

  const selections = selectionsFromMap(selected)
  const selectedQty = selections.reduce((sum, selection) => sum + selection.qty, 0)
  const modelCount = Object.values(product.models ?? {}).reduce((sum, models) => sum + models.length, 0)
  const waUrl = buildWhatsAppLink(waNumber, buildProductInquiryMessage(product, selections))

  function toggleModel(brand: string, model: string) {
    const key = getSelectionKey(brand, model)
    setSelected(prev => {
      if (prev[key]) {
        const { [key]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: { brand, model, qty: 1 } }
    })
  }

  function adjustQty(brand: string, model: string, delta: number) {
    const key = getSelectionKey(brand, model)
    setSelected(prev => {
      const current = prev[key] ?? { brand, model, qty: 0 }
      const nextQty = current.qty + delta
      if (nextQty < 1) {
        const { [key]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: { ...current, qty: nextQty } }
    })
  }

  async function copyModels() {
    await navigator.clipboard.writeText(modelListText(product.models ?? {}))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function saveSelection() {
    addItem(product, selections.length ? selections : undefined)
  }

  if (brands.length === 0) {
    return (
      <div className="mb-4 rounded-2xl border border-bnb-sand bg-white p-4 text-sm text-bnb-muted">
        Model list is being updated. Send an inquiry and BNB will confirm supported models.
      </div>
    )
  }

  return (
    <div className="mb-4 animate-fade-up space-y-3" style={{ animationDelay: '0.15s' }}>
      <div className="rounded-3xl border border-bnb-sand bg-white shadow-sm">
        <div className="border-b border-bnb-cream px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-bnb-muted">Select Models</p>
              <p className="mt-0.5 text-[11px] text-bnb-muted">{modelCount} models across {brands.length} brands</p>
            </div>
            <button
              onClick={copyModels}
              className="flex items-center gap-1.5 rounded-xl border border-bnb-sand bg-bnb-cream px-3 py-2 text-[10px] font-bold text-bnb-brown active:scale-95"
            >
              <Copy size={12} />
              {copied ? 'Copied' : 'Copy List'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-bnb-cream px-3 py-2 no-scrollbar">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => { setActiveBrand(brand); setQuery('') }}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all',
                activeBrand === brand
                  ? 'border-bnb-dark bg-bnb-dark text-bnb-gold'
                  : 'border-bnb-sand bg-bnb-cream text-bnb-brown'
              )}
            >
              {brand}
            </button>
          ))}
        </div>

        <div className="p-3">
          <div className="mb-3 flex items-center gap-2 rounded-2xl border border-bnb-sand bg-bnb-cream px-3 py-2">
            <Search size={14} className="text-bnb-muted" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={`Search ${activeBrand} models`}
              className="min-w-0 flex-1 bg-transparent text-xs text-bnb-dark outline-none placeholder:text-bnb-muted"
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            {filteredModels.map(model => {
              const key = getSelectionKey(activeBrand, model)
              const selection = selected[key]
              const isSelected = Boolean(selection)

              return (
                <div
                  key={model}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 transition-all',
                    isSelected
                      ? 'border-bnb-gold bg-bnb-gold/10'
                      : 'border-bnb-sand bg-white'
                  )}
                >
                  <button
                    onClick={() => toggleModel(activeBrand, model)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                      isSelected ? 'border-bnb-gold bg-bnb-gold text-white' : 'border-bnb-sand bg-bnb-cream text-bnb-muted'
                    )}>
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className="truncate text-sm font-semibold text-bnb-dark">{model}</span>
                  </button>

                  {isSelected && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => adjustQty(activeBrand, model, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-xl border border-bnb-sand bg-white text-bnb-brown active:scale-90"
                        aria-label={`Decrease ${model} quantity`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-bnb-dark">{selection.qty}</span>
                      <button
                        onClick={() => adjustQty(activeBrand, model, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-xl border border-bnb-sand bg-white text-bnb-brown active:scale-90"
                        aria-label={`Increase ${model} quantity`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selections.length > 0 && (
        <div className="rounded-2xl border border-bnb-gold/30 bg-bnb-gold/10 px-4 py-3 text-xs text-bnb-brown">
          {selections.length} model{selections.length === 1 ? '' : 's'} selected · {selectedQty} pcs total
        </div>
      )}

      <div className="space-y-2.5">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-wa py-3.5 text-sm font-bold text-white transition-transform active:scale-95 wa-pulse"
        >
          <MessageCircle size={18} />
          Inquire on WhatsApp
        </a>
        <button
          onClick={saveSelection}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-semibold transition-all duration-300 active:scale-95',
            isInTray(product.id)
              ? 'border-bnb-dark bg-bnb-dark text-bnb-gold'
              : 'border-bnb-sand bg-bnb-cream text-bnb-brown hover:border-bnb-gold'
          )}
        >
          {isInTray(product.id) ? <Check size={15} /> : <Bookmark size={15} />}
          {isInTray(product.id) ? 'Add More / Saved in Tray' : 'Add Selection to Tray'}
        </button>
      </div>
    </div>
  )
}

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-bnb-sand bg-bnb-cream/90 text-bnb-dark transition-transform active:scale-90"
      aria-label="Go back"
    >
      ‹
    </button>
  )
}

export function ShareButton({ product }: { product: Product }) {
  const share = () => {
    const url = `${window.location.origin}/products/${product.slug}`
    if (navigator.share) {
      navigator.share({ title: product.name, url })
    } else {
      navigator.clipboard.writeText(url)
    }
  }

  return (
    <button
      onClick={share}
      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-bnb-sand bg-bnb-cream/90 text-bnb-brown transition-transform active:scale-90"
      aria-label="Share product"
    >
      ↗
    </button>
  )
}

export function AnnouncementBanner({ message }: { message: string }) {
  return (
    <div className="bg-bnb-dark px-4 py-2 text-center text-xs font-medium tracking-wide text-bnb-gold-light">
      {message}
    </div>
  )
}
