'use client'
import { X, Minus, Plus, Trash2, MessageCircle } from 'lucide-react'
import { buildTrayInquiry } from '@/lib/whatsapp'
import type { TrayItem } from '@/types'

interface Props {
  items: TrayItem[]
  waNumber: string
  onUpdateQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onClear: () => void
  onClose: () => void
}

export function TrayDrawer({ items, waNumber, onUpdateQty, onRemove, onClear, onClose }: Props) {
  const totalQty = items.reduce((s, i) => s + i.qty, 0)
  const waUrl = buildTrayInquiry(items, waNumber)

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(58,46,37,0.6)' }}>
      <div className="flex-1" onClick={onClose} />
      <div className="bg-bnb-cream rounded-t-3xl overflow-hidden animate-fade-up" style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        <div className="bg-bnb-dark px-4 py-3.5 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-bnb-gold font-bold text-[15px] tracking-wide">Inquiry Tray</div>
            <div className="text-bnb-muted text-[10px] mt-0.5">{items.length} lot{items.length !== 1 ? 's' : ''} · {totalQty} total</div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={onClear} className="text-bnb-muted text-[11px] px-2 py-1 rounded-lg">Clear all</button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-bnb-gold-light">
              <X size={15} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-bnb-muted">
              <div className="text-4xl mb-3 opacity-30">📋</div>
              <div className="text-sm">Your tray is empty</div>
            </div>
          ) : (
            items.map((item, i) => (
              <div key={item.product.id}
                className="bg-white rounded-2xl border border-bnb-sand p-3 flex items-center gap-3 animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-bnb-cream flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-bnb-gold border border-bnb-sand">
                  {item.product.lot_code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-bnb-dark truncate">{item.product.name}</div>
                  <div className="text-[10px] text-bnb-muted mt-0.5">LOT {item.product.lot_code}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => onUpdateQty(item.product.id, item.qty - 1)} className="w-6 h-6 rounded-lg border border-bnb-sand bg-bnb-cream flex items-center justify-center active:scale-90 transition-all">
                      <Minus size={10} />
                    </button>
                    <span className="text-[13px] font-bold text-bnb-dark min-w-[20px] text-center">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.product.id, item.qty + 1)} className="w-6 h-6 rounded-lg border border-bnb-sand bg-bnb-cream flex items-center justify-center active:scale-90 transition-all">
                      <Plus size={10} />
                    </button>
                    <span className="text-[10px] text-bnb-muted">lots</span>
                  </div>
                </div>
                <button onClick={() => onRemove(item.product.id)} className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400 flex-shrink-0 active:scale-90 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-4 border-t border-bnb-sand flex-shrink-0 space-y-2">
            <div className="bg-[#E8F8EE] border border-[#b2e0c2] rounded-xl px-3 py-2.5 text-[10px] text-[#2d5a3d] font-mono leading-relaxed whitespace-pre-wrap">
              {'Hi BNB,\n\nWholesale inquiry:\n\n' + items.map((item, i) =>
                `${i + 1}. LOT ${item.product.lot_code} - ${item.product.name}\n   Qty: ${item.qty} lot${item.qty > 1 ? 's' : ''}`
              ).join('\n\n') + `\n\nTotal: ${totalQty} lots\nPlease confirm availability.`}
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white rounded-2xl font-bold text-[14px] active:scale-95 transition-all">
              <MessageCircle size={17} />
              Send Inquiry on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
