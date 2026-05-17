import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/catalog/SearchBar'
import { ProductCard } from '@/components/catalog/ProductCard'
import { DEFAULT_WHATSAPP_NUMBER, demoProducts, filterDemoProducts } from '@/lib/demo-data'
import { hasSupabaseConfig } from '@/lib/supabase/config'
import type { Product, Settings } from '@/types'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() || ''
  const supabase = hasSupabaseConfig() ? await createClient() : null

  const { data: settings } = supabase ? await supabase.from('settings').select('*') : { data: null }
  const settingsRows = (settings || []) as Settings[]
  const waNumber = settingsRows.find((s: Settings) => s.key === 'whatsapp_number')?.value || DEFAULT_WHATSAPP_NUMBER

  let products: Product[] = []
  if (query && supabase) {
    const { data } = await supabase
      .from('products')
      .select('*,categories(*)')
      .or(`name.ilike.%${query}%,lot_code.ilike.%${query}%,models::text.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    products = (data || []) as Product[]
    if (products.length === 0) products = filterDemoProducts(query)
  } else if (query) {
    products = filterDemoProducts(query)
  } else {
    if (supabase) {
      const { data } = await supabase
        .from('products')
        .select('*,categories(*)')
        .eq('sold_out', false)
        .order('created_at', { ascending: false })
        .limit(4)
      products = ((data || []) as Product[]).length > 0 ? (data || []) as Product[] : demoProducts.slice(0, 4)
    } else {
      products = demoProducts.slice(0, 4)
    }
  }

  return (
    <div className="page-enter">
      <div className="bg-white border-b border-bnb-sand pt-4 pb-2">
        <SearchBar />
        {query && (
          <p className="text-[11px] text-bnb-muted px-4 pb-2 mt-1.5">
            {products.length} result{products.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
        )}
      </div>

      <div className="p-4">
        {!query && (
          <div className="rounded-3xl border border-bnb-sand bg-white p-5 mb-4">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-semibold text-bnb-dark">Search mobile cover lots</p>
            <p className="text-[11px] text-bnb-muted mt-1">Try model, lot code, material, or brand. e.g. &quot;iPhone 15&quot;, &quot;MagSafe&quot;, &quot;Samsung S24&quot;.</p>
          </div>
        )}

        {query && products.length === 0 && (
          <div className="text-center py-16 rounded-3xl border border-bnb-sand bg-white">
            <div className="text-4xl mb-3">📱</div>
            <p className="text-[13px] font-semibold text-bnb-dark">No results for &quot;{query}&quot;</p>
            <p className="text-[11px] text-bnb-muted mt-1">Try a different model name or lot code</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} waNumber={waNumber} animationDelay={i * 0.04} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
