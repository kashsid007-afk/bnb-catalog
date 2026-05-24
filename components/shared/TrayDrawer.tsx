'use client'

import { MessageCircle, Minus, Plus, Trash2, X } from 'lucide-react'
import { buildTrayInquiry, buildTrayInquiryMessage } from '@/lib/whatsapp'
import type { TrayItem } from '@/types'

interface Props {
  items: TrayItem[]
  waNumber: string
  onUpdateQty: (id: string, qty: number) => void
  onUpdateModelQty?: (id: string, brand: string, model: string, qty: number) => void
  onRemove: (id: string) => void
  onClear: () => void
  onClose: () => void
}

export function TrayDrawer({ items, waNumber, onUpdateQty, onUpdateModelQty, onRemove, onClear, onClose }: Props) {
  const totalQty = items.reduce((sum, item) => (
    sum + (item.selections.length
      ? item.selections.reduce((selectionSum, selection) => selectionSum + selection.qty, 0)
      : (item.qty ?? 1))
  ), 0)
  const waUrl = buildTrayInquiry(items, waNumber)

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(58,46,37,0.6)' }}>
      <div className="flex-1" onClick={onClose} />
      <div className="flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl bg-bnb-cream animate-fade-up">
        <div className="flex shrink-0 items-center justify-between bg-bnb-dark px-4 py-3.5">
          <div>
            <div className="text-[15px] font-bold tracking-wide text-bnb-gold">Inquiry Tray</div>
            <div className="mt-0.5 text-[10px] text-bnb-muted">{items.length} lot{items.length !== 1 ? 's' : ''} · {totalQty} pcs</div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={onClear} className="rounded-lg px-2 py-1 text-[11px] text-bnb-muted">Clear all</button>
            )}
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-bnb-gold-light">
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="py-12 text-center text-bnb-muted">
              <div className="mb-3 text-4xl opacity-30">📋</div>
              <div className="text-sm">Your tray is empty</div>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={item.id} className="animate-fade-up rounded-2xl border border-bnb-sand bg-white p-3" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-semibold text-bnb-dark">{item.name}</div>
                    <div className="mt-0.5 text-[10px] text-bnb-muted">LOT {item.lot_code}</div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 transition-all active:scale-90">
                    <Trash2 size={13} />
                  </button>
                </div>

                {item.selections.length > 0 ? (
                  <div className="space-y-1.5">
                    {item.selections.map(selection => (
                      <div key={`${selection.brand}-${selection.model}`} className="flex items-center justify-between gap-2 rounded-xl border border-bnb-sand bg-bnb-cream px-2.5 py-2">
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-semibold text-bnb-dark">{selection.model}</div>
                          <div className="text-[8px] font-bold uppercase tracking-wide text-bnb-gold">{selection.brand}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateModelQty?.(item.id, selection.brand, selection.model, selection.qty - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-lg border border-bnb-sand bg-white transition-all active:scale-90"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="min-w-5 text-center text-[12px] font-bold text-bnb-dark">{selection.qty}</span>
                          <button
                            onClick={() => onUpdateModelQty?.(item.id, selection.brand, selection.model, selection.qty + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-lg border border-bnb-sand bg-white transition-all active:scale-90"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateQty(item.id, (item.qty ?? 1) - 1)} className="flex h-6 w-6 items-center justify-center rounded-lg border border-bnb-sand bg-bnb-cream transition-all active:scale-90">
                      <Minus size={10} />
                    </button>
                    <span className="min-w-5 text-center text-[13px] font-bold text-bnb-dark">{item.qty ?? 1}</span>
                    <button onClick={() => onUpdateQty(item.id, (item.qty ?? 1) + 1)} className="flex h-6 w-6 items-center justify-center rounded-lg border border-bnb-sand bg-bnb-cream transition-all active:scale-90">
                      <Plus size={10} />
                    </button>
                    <span className="text-[10px] text-bnb-muted">lots</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 space-y-2 border-t border-bnb-sand p-4">
            <div className="max-h-36 overflow-y-auto rounded-xl border border-[#b2e0c2] bg-[#E8F8EE] px-3 py-2.5 font-mono text-[10px] leading-relaxed text-[#2d5a3d] whitespace-pre-wrap">
              {buildTrayInquiryMessage(items)}
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-[14px] font-bold text-white transition-all active:scale-95">
              <MessageCircle size={17} />
              Send Inquiry on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
