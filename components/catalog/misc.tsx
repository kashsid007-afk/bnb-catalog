'use client'
import { MessageCircle, Bookmark, Check } from 'lucide-react'
import { buildInquiryURL } from '@/lib/whatsapp'
import { useTray } from '@/hooks/useTray'
import { cn } from '@/lib/utils'
import type { Product, ModelMap } from '@/types'

export function FeaturePills({ features }: { features: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-4 pill-stagger">
      {features.map((f, i) => (
        <span
          key={i}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-bnb-cream border border-bnb-sand text-bnb-brown animate-scale-in"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {f}
        </span>
      ))}
    </div>
  )
}

export function ModelsList({ models }: { models: ModelMap }) {
  const brands = Object.keys(models)
  if (brands.length === 0) return null

  return (
    <div className="mb-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
      <p className="text-xs font-bold text-bnb-muted uppercase tracking-widest mb-3">
        Available Models
      </p>
      <div className="bg-white border border-bnb-sand rounded-2xl overflow-hidden divide-y divide-bnb-cream">
        {brands.map(brand => (
          <div key={brand} className="p-3">
            <p className="text-[10px] font-bold text-bnb-gold uppercase tracking-wider mb-2">
              {brand}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {models[brand].map(model => (
                <span
                  key={model}
                  className="px-2.5 py-1 rounded-lg text-[10px] bg-bnb-cream border border-bnb-sand text-bnb-dark"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WhatsAppButtons({ product, waNumber }: { product: Product; waNumber: string }) {
  const { addItem, isInTray } = useTray()
  const inTray = isInTray(product.id)
  const waUrl = buildInquiryURL(product.lot_code, product.name, waNumber)

  return (
    <div className="space-y-2.5 mb-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2.5 bg-wa text-white py-3.5 rounded-2xl text-sm font-bold active:scale-95 transition-transform wa-pulse"
      >
        <MessageCircle size={18} />
        Inquire on WhatsApp
      </a>
      <button
        onClick={() => addItem(product)}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold border transition-all duration-300 active:scale-95',
          inTray
            ? 'bg-bnb-dark border-bnb-dark text-bnb-gold'
            : 'bg-bnb-cream border-bnb-sand text-bnb-brown hover:border-bnb-gold'
        )}
      >
        {inTray ? <Check size={15} /> : <Bookmark size={15} />}
        {inTray ? 'Saved to Inquiry Tray' : 'Save to Inquiry Tray'}
      </button>
    </div>
  )
}

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-bnb-cream/90 border border-bnb-sand flex items-center justify-center text-bnb-dark active:scale-90 transition-transform"
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
      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-bnb-cream/90 border border-bnb-sand flex items-center justify-center text-bnb-brown active:scale-90 transition-transform"
      aria-label="Share product"
    >
      ↗
    </button>
  )
}

export function AnnouncementBanner({ message }: { message: string }) {
  return (
    <div className="bg-bnb-dark text-bnb-gold-light text-xs text-center py-2 px-4 font-medium tracking-wide">
      {message}
    </div>
  )
}
