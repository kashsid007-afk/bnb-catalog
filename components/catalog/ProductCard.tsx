'use client'
import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Bookmark, BookmarkCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface Props {
  product: Product
  waNumber: string
  onAddToTray?: () => void
  inTray?: boolean
  animationDelay?: number
}

export function ProductCard({ product, waNumber, onAddToTray, inTray, animationDelay = 0 }: Props) {
  const imgSrc = product.image_urls?.[0]
  const totalModels = Object.values(product.models || {}).reduce((s, a) => s + a.length, 0)

  return (
    <div
      className="bg-white rounded-3xl border border-bnb-sand overflow-hidden card-hover animate-fade-up cursor-pointer group"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-bnb-cream overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc} alt={product.name} fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">📦</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {product.new_arrival && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-bnb-gold-light text-bnb-brown tracking-wide">
                NEW
              </span>
            )}
            {product.featured && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-bnb-dark text-bnb-gold tracking-wide">
                HOT
              </span>
            )}
            {product.sold_out && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 tracking-wide">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Tray bookmark */}
          {onAddToTray && (
            <button
              onClick={(e) => { e.preventDefault(); onAddToTray() }}
              className={cn(
                'absolute top-2 right-2 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200',
                inTray
                  ? 'bg-bnb-gold text-white'
                  : 'bg-white/80 text-bnb-muted hover:bg-bnb-gold hover:text-white'
              )}
              aria-label={inTray ? 'Remove from tray' : 'Add to tray'}
            >
              {inTray
                ? <BookmarkCheck size={13} />
                : <Bookmark size={13} />
              }
            </button>
          )}
        </div>

        <div className="p-3">
          <div className="text-[9px] font-bold text-bnb-gold tracking-widest mb-0.5">
            LOT {product.lot_code}
          </div>
          <div className="text-[11px] font-semibold text-bnb-dark leading-snug mb-1.5 line-clamp-2">
            {product.name}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-bnb-muted">
              {totalModels > 0 ? `${totalModels} models` : 'Universal'}
            </span>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi BNB,\n\nInquiry about Lot ${product.lot_code} – ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-[#25D366] text-white px-2.5 py-1.5 rounded-xl text-[10px] font-bold btn-spring"
              aria-label="Inquire on WhatsApp"
            >
              <MessageCircle size={11} />
            </a>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
