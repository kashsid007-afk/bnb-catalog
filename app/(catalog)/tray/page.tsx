'use client'
import { Trash2, MessageCircle, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useTray } from '@/hooks/useTray'
import { useSettings } from '@/hooks/useSettings'
import { buildWhatsAppURL } from '@/lib/utils'

export default function TrayPage() {
  const { items, removeItem, updateQty, clearTray } = useTray()
  const { whatsappNumber } = useSettings()

  const totalQty = items.reduce((s, i) => s + i.qty, 0)
  const waUrl = buildWhatsAppURL(
    items.map(i => ({ lot_code: i.lot_code, name: i.name, qty: i.qty })),
    whatsappNumber
  )

  const previewMessage = items.length > 0
    ? `Hi BNB,\n\nWholesale inquiry:\n\n${items.map((it, i) => `${i+1}. LOT ${it.lot_code} – ${it.name}\n   Qty: ${it.qty} lot${it.qty > 1 ? 's' : ''}`).join('\n\n')}\n\nPlease confirm availability.`
    : ''

  return (
    <div className="page-enter min-h-screen">
      <div className="bg-bnb-dark px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-bnb-gold">Inquiry Tray</h1>
          <p className="text-[10px] text-bnb-muted mt-0.5">{items.length} lot{items.length !== 1 ? 's' : ''} selected</p>
        </div>
        {items.length > 0 && (
          <button onClick={clearTray} className="text-[10px] text-bnb-muted hover:text-red-400 transition-colors flex items-center gap-1">
            <Trash2 size={12} /> Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 px-8">
          <ShoppingBag size={48} className="mx-auto text-bnb-sand mb-4" />
          <p className="text-sm font-semibold text-bnb-dark">Your tray is empty</p>
          <p className="text-[11px] text-bnb-muted mt-1 mb-6">Browse the catalog and save lots to inquire about multiple products at once</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-bnb-gold text-white px-5 py-2.5 rounded-2xl text-sm font-bold btn-spring">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="p-4">
          <div className="space-y-3 mb-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white border border-bnb-sand rounded-2xl p-3 flex items-center gap-3 animate-slide-left"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-bnb-cream flex items-center justify-center text-xl flex-shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-bold text-bnb-gold tracking-widest">LOT {item.lot_code}</div>
                  <div className="text-[11px] font-semibold text-bnb-dark truncate">{item.name}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-lg border border-bnb-sand bg-bnb-cream flex items-center justify-center text-xs font-bold text-bnb-dark btn-spring"
                    >−</button>
                    <span className="text-xs font-bold text-bnb-dark w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-lg border border-bnb-sand bg-bnb-cream flex items-center justify-center text-xs font-bold text-bnb-dark btn-spring"
                    >+</button>
                    <span className="text-[9px] text-bnb-muted ml-0.5">lots</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-7 h-7 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400 btn-spring"
                  aria-label="Remove"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white border border-bnb-sand rounded-2xl p-3.5 mb-4 animate-fade-up">
            <div className="flex justify-between text-[11px] py-1.5 border-b border-bnb-cream">
              <span className="text-bnb-muted">Total lots selected</span>
              <span className="font-bold text-bnb-dark">{items.length}</span>
            </div>
            <div className="flex justify-between text-[11px] py-1.5">
              <span className="text-bnb-muted">Total quantity</span>
              <span className="font-bold text-bnb-dark">{totalQty} lots</span>
            </div>
          </div>

          {/* Message preview */}
          <div className="bg-[#E8F8EE] border border-[#b2e0c2] rounded-2xl p-3.5 mb-4 animate-scale-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle size={11} className="text-white" />
              </div>
              <span className="text-[11px] font-semibold text-[#1a7a3a]">Auto-generated message</span>
            </div>
            <pre className="text-[10px] text-[#2d5a3d] font-mono whitespace-pre-wrap leading-relaxed">
              {previewMessage}
            </pre>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] text-white py-4 rounded-2xl text-sm font-bold btn-spring wa-pulse mb-6"
          >
            <MessageCircle size={18} />
            Send Inquiry on WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
