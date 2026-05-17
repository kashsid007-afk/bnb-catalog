import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CategoryChips } from '@/components/catalog/CategoryChips'
import { SearchBar } from '@/components/catalog/SearchBar'
import { DEFAULT_WHATSAPP_NUMBER, demoCategories, demoProducts } from '@/lib/demo-data'
import { hasSupabaseConfig } from '@/lib/supabase/config'
import type { Product, Category } from '@/types'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat: selectedCat = 'all' } = await searchParams
  const supabase = hasSupabaseConfig() ? await createClient() : null

  const [{ data: categories }, { data: settings }, { data: featured }, { data: newArrivals }] =
    supabase
      ? await Promise.all([
          supabase.from('categories').select('*').order('sort_order'),
          supabase.from('settings').select('*'),
          supabase.from('products').select('*,categories(*)').eq('featured', true).eq('sold_out', false).limit(4),
          supabase.from('products').select('*,categories(*)').eq('new_arrival', true).eq('sold_out', false).order('created_at', { ascending: false }).limit(8),
        ])
      : [{ data: null }, { data: null }, { data: null }, { data: null }]

  let filteredProducts: Product[] = []
  const dbCategories = (categories || []) as Category[]
  const settingsRows = (settings || []) as { key: string; value: string }[]
  const usingDemoData = dbCategories.length === 0 && !featured?.length && !newArrivals?.length
  const cats = dbCategories.length > 0 ? dbCategories : demoCategories
  const featuredProducts = ((featured || []) as Product[]).length > 0
    ? (featured || []) as Product[]
    : demoProducts.filter(product => product.featured)
  const newArrivalProducts = ((newArrivals || []) as Product[]).length > 0
    ? (newArrivals || []) as Product[]
    : demoProducts.filter(product => product.new_arrival)

  if (selectedCat !== 'all') {
    const catId = cats.find((c: Category) => c.slug === selectedCat)?.id
    if (catId) {
      if (usingDemoData || catId.startsWith('demo-cat-')) {
        filteredProducts = demoProducts.filter(product => product.category_id === catId && !product.sold_out)
      } else if (supabase) {
        const { data } = await supabase
          .from('products')
          .select('*,categories(*)')
          .eq('sold_out', false)
          .eq('category_id', catId)
          .order('created_at', { ascending: false })
        filteredProducts = (data || []) as Product[]
      }
    }
  }

  const waNumber = settingsRows.find(s => s.key === 'whatsapp_number')?.value || DEFAULT_WHATSAPP_NUMBER

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="bg-bnb-dark px-5 pt-8 pb-7 relative overflow-hidden">
        <div className="absolute w-48 h-48 rounded-full border border-bnb-gold/10 -right-12 -top-12" />
        <div className="absolute w-24 h-24 rounded-full border border-bnb-gold/10 right-8 top-16" />
        <div className="animate-fade-up">
          <div className="text-3xl font-extrabold tracking-[6px] text-bnb-gold mb-1">BNB</div>
          <div className="text-[10px] text-bnb-muted tracking-[3px] uppercase mb-5">Wholesale Collection</div>
          <div className="inline-flex items-center gap-2 border border-bnb-gold/30 rounded-full px-3 py-1.5 text-[10px] text-bnb-gold-light">
            <span className="w-1.5 h-1.5 rounded-full bg-bnb-gold animate-pulse-gold" />
            New arrivals added daily
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 max-w-xs">
            {['Phone covers', 'Wholesale lots', 'WhatsApp inquiry'].map(label => (
              <div key={label} className="rounded-2xl border border-bnb-gold/20 bg-white/5 px-2 py-2 text-center text-[9px] font-semibold text-bnb-gold-light">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {usingDemoData && (
        <div className="mx-4 mt-3 rounded-2xl border border-bnb-gold/30 bg-white px-4 py-3 shadow-sm animate-fade-up">
          <div className="text-[10px] font-bold uppercase tracking-widest text-bnb-gold">Demo catalog preview</div>
          <p className="mt-1 text-[11px] leading-relaxed text-bnb-muted">
            Your Supabase catalog is empty, so BNB is showing mobile-cover sample lots. Add real lots from Admin and these previews will step aside.
          </p>
        </div>
      )}

      <SearchBar />

      <CategoryChips categories={cats} selected={selectedCat} />

      {/* Featured */}
      {featuredProducts.length > 0 && selectedCat === 'all' && (
        <section className="px-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-bnb-dark">Featured Lots</h2>
            <Link href="/products" className="text-[11px] text-bnb-gold">See all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} waNumber={waNumber} animationDelay={i * 0.04} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivalProducts.length > 0 && selectedCat === 'all' && (
        <section className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-bnb-dark">New Arrivals</h2>
            <Link href="/products?filter=new" className="text-[11px] text-bnb-gold">See all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {newArrivalProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} waNumber={waNumber} animationDelay={i * 0.04} />
            ))}
          </div>
        </section>
      )}

      {/* Category filtered */}
      {selectedCat !== 'all' && (
        <section className="px-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-bnb-dark">
              {cats.find(c => c.slug === selectedCat)?.name || 'Products'}
            </h2>
            <span className="text-[11px] text-bnb-muted">{filteredProducts.length} lots</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} waNumber={waNumber} animationDelay={i * 0.04} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-bnb-sand bg-white p-6 text-center">
              <div className="text-4xl mb-3">📱</div>
              <p className="text-sm font-semibold text-bnb-dark">No covers in this category yet</p>
              <p className="mt-1 text-[11px] leading-relaxed text-bnb-muted">Add lots from Admin or browse the demo collection while your stock is being uploaded.</p>
            </div>
          )}
        </section>
      )}

      <div className="h-6" />
    </div>
  )
}
