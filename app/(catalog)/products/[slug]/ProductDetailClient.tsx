'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Share2, MessageCircle, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Play } from 'lucide-react'
import { buildSingleInquiry } from '@/lib/whatsapp'
import { useTray } from '@/hooks/useTray'
import { totalModels, cn } from '@/lib/utils'
import type { Product } from '@/types'

export function ProductDetailClient({ product, waNumber }: { product: Product; waNumber: string }) {
  const [mediaIdx, setMediaIdx] = useState(0)
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({})
  const { addItem, isInTray } = useTray()
  const inTray = isInTray(product.id)

  const allMedia = [...product.image_urls.map(url => ({ type: 'image', url })),
    ...(product.video_url ? [{ type: 'video', url: product.video_url }] : [])]
  const current = allMedia[mediaIdx]
  const modelCount = totalModels(product.models)

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="page-enter min-h-screen bg-bnb-cream">
      {/* Media */}
      <div className="relative bg-white">
        <div className="relative h-72 overflow-hidden">
          {current?.type === 'image' ? (
            <Image src={current.url} alt={product.name} fill className="object-cover" sizes="100vw" />
          ) : current?.type === 'video' ? (
            <video src={current.url} controls autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bnb-cream">
              <span className="text-6xl opacity-20">📦</span>
            </div>
          )}
          {product.sold_out && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-widest">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Top controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Link href="/" className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center border border-bnb-sand shadow-sm active:scale-90 transition-all">
            <ArrowLeft size={16} className="text-bnb-dark" />
          </Link>
          <button onClick={share} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center border border-bnb-sand shadow-sm active:scale-90 transition-all">
            <Share2 size={14} className="text-bnb-brown" />
          </button>
        </div>

        {/* Thumbnails */}
        {allMedia.length > 1 && (
          <div className="flex gap-2 p-3 border-t border-bnb-sand overflow-x-auto no-scrollbar">
            {allMedia.map((m, i) => (
              <button key={i} onClick={() => setMediaIdx(i)}
                className={cn('w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all active:scale-90',
                  i === mediaIdx ? 'border-bnb-gold' : 'border-transparent')}>
                {m.type === 'image' ? (
                  <Image src={m.url} alt="" width={56} height={56} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-bnb-dark flex items-center justify-center">
                    <Play size={14} className="text-bnb-gold" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pt-4 pb-6 space-y-4 animate-fade-up">
        {/* Title */}
        <div>
          <div className="text-[10px] font-bold tracking-widest text-bnb-gold mb-1">LOT · {product.lot_code}</div>
          <h1 className="font-display text-2xl font-light text-bnb-dark leading-tight">{product.name}</h1>
          {product.category && (
            <div className="text-xs text-bnb-muted mt-1">{product.category.name}</div>
          )}
        </div>

        {/* Features */}
        {product.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.features.map((f, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-[11px] font-medium bg-white border border-bnb-sand text-bnb-brown animate-scale-in"
                style={{ animationDelay: `${i * 40}ms` }}>
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-sm text-bnb-muted leading-relaxed">{product.description}</p>
        )}

        {/* Lot details */}
        <div className="bg-white border border-bnb-sand rounded-2xl p-4">
          <div className="text-[10px] font-bold tracking-widest text-bnb-muted uppercase mb-3">Lot Details</div>
          <div className="space-y-2">
            {[
              ['Pack size', product.pack_size ? `${product.pack_size} pcs per model` : '—'],
              ['Colour mix', product.colour_mix || '—'],
              ['Total models', modelCount > 0 ? `${modelCount} models` : '—'],
              ['Lot total', product.total_lot_size ? `${product.total_lot_size.toLocaleString('en-IN')} pcs` : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-bnb-cream pb-2 last:border-0 last:pb-0">
                <span className="text-bnb-muted">{k}</span>
                <span className="font-semibold text-bnb-dark text-right max-w-[180px]">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Models */}
        {modelCount > 0 && (
          <div className="bg-white border border-bnb-sand rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-bnb-cream flex items-center justify-between">
              <h3 className="text-sm font-bold text-bnb-dark">Available Models</h3>
              <span className="text-xs text-bnb-muted">{modelCount} total</span>
            </div>
            <div className="p-3 space-y-2">
              {Object.entries(product.models).map(([brand, models]) => (
                <div key={brand} className="animate-fade-in">
                  <button className="w-full flex items-center justify-between py-1.5 px-1"
                    onClick={() => setExpandedBrands(p => ({ ...p, [brand]: !p[brand] }))}>
                    <span className="text-[11px] font-bold text-bnb-gold uppercase tracking-wide">{brand}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-bnb-muted">{models.length} models</span>
                      {expandedBrands[brand] ? <ChevronUp size={12} className="text-bnb-muted" /> : <ChevronDown size={12} className="text-bnb-muted" />}
                    </div>
                  </button>
                  {expandedBrands[brand] && (
                    <div className="flex flex-wrap gap-1.5 mt-1 pl-1 animate-fade-in">
                      {models.map(m => (
                        <span key={m} className="px-2 py-1 bg-bnb-cream border border-bnb-sand rounded-lg text-[10px] text-bnb-dark">{m}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-2.5 pt-2">
          <a href={buildSingleInquiry(product.lot_code, product.name, waNumber)}
            target="_blank" rel="noopener noreferrer"
            className={cn(
              'w-full flex items-center justify-center gap-2.5 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-[15px] active:scale-95 transition-all duration-200',
              product.sold_out && 'opacity-50 pointer-events-none'
            )}>
            <MessageCircle size={18} />
            Inquire on WhatsApp
          </a>
          <button onClick={() => addItem(product)}
            className={cn(
              'w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-[13px] border transition-all duration-200 active:scale-95',
              inTray ? 'bg-bnb-dark border-bnb-dark text-bnb-gold' : 'bg-white border-bnb-sand text-bnb-brown hover:border-bnb-gold-light'
            )}>
            {inTray ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {inTray ? 'Saved to Inquiry Tray' : 'Save to Inquiry Tray'}
          </button>
        </div>
      </div>
    </div>
  )
}
