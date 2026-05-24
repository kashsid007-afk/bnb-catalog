'use client'

import { MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useTray } from '@/hooks/useTray'
import { useSettings } from '@/hooks/useSettings'
import { buildTrayInquiry, buildTrayInquiryMessage } from '@/lib/whatsapp'

export default function TrayPage() {
  const { items, removeItem, updateModelQty, updateQty, clearTray } = useTray()
  const { whatsappNumber } = useSettings()

  const selectedModels = items.reduce((sum, item) => sum + (item.selections.length || 1), 0)
  const totalQty = items.reduce((sum, item) => (
    sum + (item.selections.length
      ? item.selections.reduce((selectionSum, selection) => selectionSum + selection.qty, 0)
      : (item.qty ?? 1))
  ), 0)
  const waUrl = buildTrayInquiry(items, whatsappNumber)
  const previewMessage = items.length > 0 ? buildTrayInquiryMessage(items) : ''

  return (
    <div className="page-enter min-h-screen">
      <div className="bg-bnb-dark px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-bnb-gold">Inquiry Tray</h1>
            <p className="mt-0.5 text-[10px] text-bnb-muted">
              {items.length} lot{items.length !== 1 ? 's' : ''} · {selectedModels} model selections
            </p>
          </div>
          {items.length > 0 && (
            <button onClick={clearTray} className="flex items-center gap-1 text-[10px] text-bnb-muted transition-colors hover:text-red-400">
              <Trash2 size={12} /> Clear all
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-8 py-24 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-bnb-sand" />
          <p className="text-sm font-semibold text-bnb-dark">Your tray is empty</p>
          <p className="mb-6 mt-1 text-[11px] text-bnb-muted">Select phone models inside any lot and build one clean WhatsApp inquiry.</p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-bnb-gold px-5 py-2.5 text-sm font-bold text-white btn-spring">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-4 space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="animate-slide-left rounded-3xl border border-bnb-sand bg-white p-4 shadow-sm"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold tracking-widest text-bnb-gold">LOT {item.lot_code}</div>
                    <div className="truncate text-sm font-bold text-bnb-dark">{item.name}</div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 btn-spring"
                    aria-label="Remove lot"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {item.selections.length > 0 ? (
                  <div className="space-y-2">
                    {item.selections.map(selection => (
                      <div key={`${selection.brand}-${selection.model}`} className="flex items-center justify-between gap-3 rounded-2xl border border-bnb-sand bg-bnb-cream px-3 py-2">
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold text-bnb-dark">{selection.model}</div>
                          <div className="text-[9px] font-bold uppercase tracking-wide text-bnb-gold">{selection.brand}</div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            onClick={() => updateModelQty(item.id, selection.brand, selection.model, selection.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl border border-bnb-sand bg-white text-bnb-brown btn-spring"
                            aria-label={`Decrease ${selection.model}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-sm font-bold text-bnb-dark">{selection.qty}</span>
                          <button
                            onClick={() => updateModelQty(item.id, selection.brand, selection.model, selection.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl border border-bnb-sand bg-white text-bnb-brown btn-spring"
                            aria-label={`Increase ${selection.model}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, (item.qty ?? 1) - 1)} className="flex h-7 w-7 items-center justify-center rounded-xl border border-bnb-sand bg-bnb-cream text-bnb-dark btn-spring">−</button>
                    <span className="w-7 text-center text-sm font-bold text-bnb-dark">{item.qty ?? 1}</span>
                    <button onClick={() => updateQty(item.id, (item.qty ?? 1) + 1)} className="flex h-7 w-7 items-center justify-center rounded-xl border border-bnb-sand bg-bnb-cream text-bnb-dark btn-spring">+</button>
                    <span className="text-[10px] text-bnb-muted">lots</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-4 animate-fade-up rounded-2xl border border-bnb-sand bg-white p-3.5">
            <div className="flex justify-between border-b border-bnb-cream py-1.5 text-[11px]">
              <span className="text-bnb-muted">Lots selected</span>
              <span className="font-bold text-bnb-dark">{items.length}</span>
            </div>
            <div className="flex justify-between py-1.5 text-[11px]">
              <span className="text-bnb-muted">Total pieces requested</span>
              <span className="font-bold text-bnb-dark">{totalQty}</span>
            </div>
          </div>

          <div className="mb-4 animate-scale-in rounded-2xl border border-[#b2e0c2] bg-[#E8F8EE] p-3.5">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]">
                <MessageCircle size={11} className="text-white" />
              </div>
              <span className="text-[11px] font-semibold text-[#1a7a3a]">Auto-generated message</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-[#2d5a3d]">
              {previewMessage}
            </pre>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] py-4 text-sm font-bold text-white btn-spring wa-pulse"
          >
            <MessageCircle size={18} />
            Send Inquiry on WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
