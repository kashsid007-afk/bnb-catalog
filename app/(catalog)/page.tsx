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

  const [{ data: categories }, { data: settings }, { data: featured }, { data: newArrivals }, { data: allProducts }] =
    supabase
      ? await Promise.all([
          supabase.from('categories').select('*').order('sort_order'),
          supabase.from('settings').select('*'),
          supabase.from('products').select('*,categories(*)').eq('featured', true).eq('sold_out', false).limit(4),
          supabase.from('products').select('*,categories(*)').eq('new_arrival', true).eq('sold_out', false).order('created_at', { ascending: false }).limit(8),
          supabase.from('products').select('*,categories(*)').eq('sold_out', false).order('created_at', { ascending: false }).limit(24),
        ])
      : [{ data: null }, { data: null }, { data: null }, { data: null }, { data: null }]

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
  const catalogProducts = ((allProducts || []) as Product[]).length > 0
    ? (allProducts || []) as Product[]
    : demoProducts
  const brandNames = Array.from(new Set(catalogProducts.flatMap(product => Object.keys(product.models ?? {}))))
    .slice(0, 10)

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
      <div className="relative overflow-hidden bg-bnb-dark px-5 pb-8 pt-9">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-bnb-gold/10" />
        <div className="absolute right-8 top-16 h-24 w-24 rounded-full border border-bnb-gold/10" />
        <div className="animate-fade-up">
          <div className="mb-1 text-3xl font-extrabold tracking-[6px] text-bnb-gold">BNB Covers</div>
          <div className="mb-4 text-[10px] uppercase tracking-[3px] text-bnb-muted">Wholesale Mobile Cover Collection</div>
          <h1 className="max-w-[280px] text-2xl font-semibold leading-tight text-white">
            Premium case designs, ready for reseller inquiries.
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-bnb-gold/30 px-3 py-1.5 text-[10px] text-bnb-gold-light">
            <span className="h-1.5 w-1.5 rounded-full bg-bnb-gold animate-pulse-gold" />
            Fresh stock updated daily
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {[
              ['🔥 Hot Picks', '#hot-picks'],
              ['🆕 New Arrivals', '#new-arrivals'],
              ['⭐ Best Sellers', '#hot-picks'],
              ['📦 Ready Stock', '#all-covers'],
            ].map(([label, href]) => (
              <a key={label} href={href} className="rounded-2xl border border-bnb-gold/20 bg-white/5 px-3 py-2 text-center text-[10px] font-bold text-bnb-gold-light transition-colors active:bg-white/10">
                {label}
              </a>
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

      {/* Hot picks */}
      {featuredProducts.length > 0 && selectedCat === 'all' && (
        <section id="hot-picks" className="mt-3 px-4 scroll-mt-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-bold text-bnb-dark">Trending / Hot Picks</h2>
              <p className="mt-0.5 text-[10px] text-bnb-muted">Fast-moving wholesale designs</p>
            </div>
            <a href="#all-covers" className="text-[11px] text-bnb-gold">Explore all</a>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
            {featuredProducts.map((p, i) => (
              <div key={p.id} className="w-[46%] min-w-[160px] max-w-[190px] shrink-0">
                <ProductCard product={p} waNumber={waNumber} animationDelay={i * 0.04} />
              </div>
            ))}
          </div>
        </section>
      )}

      {newArrivalProducts.length > 0 && selectedCat === 'all' && (
        <section id="new-arrivals" className="mt-6 px-4 scroll-mt-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-bold text-bnb-dark">New Arrivals</h2>
              <p className="mt-0.5 text-[10px] text-bnb-muted">Newest uploaded products first</p>
            </div>
            <a href="#all-covers" className="text-[11px] text-bnb-gold">See stock</a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {newArrivalProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} waNumber={waNumber} animationDelay={i * 0.04} />
            ))}
          </div>
        </section>
      )}

      {selectedCat === 'all' && brandNames.length > 0 && (
        <section id="brands" className="mt-6 px-4 scroll-mt-4">
          <div className="mb-3">
            <h2 className="text-[13px] font-bold text-bnb-dark">Browse By Brand</h2>
            <p className="mt-0.5 text-[10px] text-bnb-muted">Jump into collections by phone brand</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {brandNames.map(brand => (
              <Link
                key={brand}
                href={`/search?q=${encodeURIComponent(brand)}`}
                className="rounded-2xl border border-bnb-sand bg-white px-4 py-3 text-sm font-bold text-bnb-dark shadow-sm transition-transform active:scale-95"
              >
                {brand}
                <span className="mt-0.5 block text-[10px] font-medium text-bnb-muted">View supported lots</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {selectedCat === 'all' && (
        <section id="all-covers" className="mt-6 px-4 scroll-mt-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-bold text-bnb-dark">Explore All Covers</h2>
              <p className="mt-0.5 text-[10px] text-bnb-muted">Full wholesale catalog</p>
            </div>
            <span className="text-[11px] text-bnb-muted">{catalogProducts.length} lots</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {catalogProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} waNumber={waNumber} animationDelay={i * 0.03} />
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
