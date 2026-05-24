import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/catalog/ProductGallery'
import { FeaturePills, ProductModelSelector, BackButton, ShareButton } from '@/components/catalog/misc'
import { DEFAULT_WHATSAPP_NUMBER, demoProducts } from '@/lib/demo-data'
import { hasSupabaseConfig } from '@/lib/supabase/config'
import type { Product } from '@/types'

export const revalidate = 60

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = hasSupabaseConfig() ? await createClient() : null

  const [{ data: product }, { data: settingsRows }] = await Promise.all([
    supabase ? supabase.from('products').select('*, category:categories(*)').eq('slug', slug).single() : { data: null },
    supabase ? supabase.from('settings').select('key, value') : { data: null },
  ])

  const fallbackProduct = demoProducts.find(item => item.slug === slug)
  if (!product && !fallbackProduct) notFound()

  const settings = {
    whatsapp_number: DEFAULT_WHATSAPP_NUMBER,
    store_name: 'BNB Wholesale',
    announcement: null,
  }
  settingsRows?.forEach(row => {
    if (row.key === 'whatsapp_number') settings.whatsapp_number = row.value
    if (row.key === 'store_name') settings.store_name = row.value
  })

  const p = (product || fallbackProduct) as Product
  const totalModels = Object.values(p.models ?? {}).reduce((s, a) => s + a.length, 0)
  const brandCount = Object.keys(p.models ?? {}).length

  return (
    <main className="max-w-md mx-auto min-h-screen bg-bnb-cream pb-24">
      <div className="relative">
        <BackButton />
        <ShareButton product={p} />
        <ProductGallery images={p.image_urls} videoUrl={p.video_url} productName={p.name} />
      </div>

      <div className="px-4 pt-4 page-enter">
        <p className="text-xs font-bold text-bnb-gold tracking-widest mb-1">LOT · {p.lot_code}</p>
        <h1 className="text-xl font-bold text-bnb-dark leading-tight mb-3">{p.name}</h1>

        <div className="flex gap-2 mb-4">
          {p.featured && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-bnb-dark text-bnb-gold">Hot Pick</span>}
          {p.new_arrival && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-bnb-gold-light text-bnb-brown">New Arrival</span>}
          {!p.sold_out && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-bnb-sand text-bnb-brown">Ready Stock</span>}
          {p.sold_out && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-400">Sold Out</span>}
        </div>

        {p.features?.length > 0 && <FeaturePills features={p.features} />}

        <div className="bg-white border border-bnb-sand rounded-2xl p-4 mb-4">
          <p className="text-xs font-bold text-bnb-muted uppercase tracking-widest mb-3">Lot Details</p>
          <div className="space-y-2">
            {p.pack_size && (
              <div className="flex justify-between text-sm">
                <span className="text-bnb-muted">Pack size</span>
                <span className="font-semibold text-bnb-dark">{p.pack_size} pcs / model</span>
              </div>
            )}
            {p.colour_mix && (
              <div className="flex justify-between text-sm">
                <span className="text-bnb-muted">Colour mix</span>
                <span className="font-semibold text-bnb-dark text-right max-w-[180px]">{p.colour_mix}</span>
              </div>
            )}
            {totalModels > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-bnb-muted">Models covered</span>
                <span className="font-semibold text-bnb-dark">{totalModels} models · {brandCount} brands</span>
              </div>
            )}
            {p.total_lot_size && (
              <div className="flex justify-between text-sm pt-2 border-t border-bnb-cream">
                <span className="text-bnb-muted">Lot total</span>
                <span className="font-bold text-bnb-dark">{p.total_lot_size.toLocaleString('en-IN')} pcs</span>
              </div>
            )}
          </div>
        </div>

        {p.description && <p className="text-sm text-bnb-muted leading-relaxed mb-4">{p.description}</p>}
        {!p.sold_out
          ? <ProductModelSelector product={p} waNumber={settings.whatsapp_number} />
          : <div className="w-full py-4 bg-gray-100 rounded-2xl text-center text-sm text-gray-400 font-medium mb-4">This lot is sold out</div>
        }
      </div>
    </main>
  )
}
