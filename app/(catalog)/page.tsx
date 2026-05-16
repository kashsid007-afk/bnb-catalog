import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CategoryChips } from '@/components/catalog/CategoryChips'
import { SearchBar } from '@/components/catalog/SearchBar'
import type { Product, Category } from '@/types'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat: selectedCat = 'all' } = await searchParams
  const supabase = createClient()

  const [{ data: categories }, { data: settings }, { data: featured }, { data: newArrivals }] =
    await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('settings').select('*'),
      supabase.from('products').select('*,categories(*)').eq('featured', true).eq('sold_out', false).limit(4),
      supabase.from('products').select('*,categories(*)').eq('new_arrival', true).eq('sold_out', false).order('created_at', { ascending: false }).limit(8),
    ])

  let filteredProducts: Product[] = []
  if (selectedCat !== 'all' && categories) {
    const catId = (categories as Category[]).find(c => c.slug === selectedCat)?.id
    if (catId) {
      const { data } = await supabase
        .from('products')
        .select('*,categories(*)')
        .eq('sold_out', false)
        .eq('category_id', catId)
        .order('created_at', { ascending: false })
      filteredProducts = (data as Product[]) || []
    }
  }

  const waNumber = settings?.find(s => s.key === 'whatsapp_number')?.value || '919999999999'
  const cats = (categories as Category[]) || []

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
        </div>
      </div>

      <SearchBar />

      <CategoryChips categories={cats} selected={selectedCat} />

      {/* Featured */}
      {featured && featured.length > 0 && selectedCat === 'all' && (
        <section className="px-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-bnb-dark">Featured Lots</h2>
            <Link href="/products" className="text-[11px] text-bnb-gold">See all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(featured as Product[]).map((p, i) => (
              <ProductCard key={p.id} product={p} waNumber={waNumber} animationDelay={i * 0.04} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals && newArrivals.length > 0 && selectedCat === 'all' && (
        <section className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-bnb-dark">New Arrivals</h2>
            <Link href="/products?filter=new" className="text-[11px] text-bnb-gold">See all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(newArrivals as Product[]).map((p, i) => (
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
        </section>
      )}

      <div className="h-6" />
    </div>
  )
}
