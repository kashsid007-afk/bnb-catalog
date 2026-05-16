import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/catalog/SearchBar'
import { ProductCard } from '@/components/catalog/ProductCard'
import type { Product, Settings } from '@/types'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() || ''
  const supabase = await createClient()

  const { data: settings } = await supabase.from('settings').select('*')
  const settingsRows = (settings || []) as Settings[]
  const waNumber = settingsRows.find((s: Settings) => s.key === 'whatsapp_number')?.value || '919999999999'

  let products: Product[] = []
  if (query) {
    const { data } = await supabase
      .from('products')
      .select('*,categories(*)')
      .or(`name.ilike.%${query}%,lot_code.ilike.%${query}%,models::text.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    products = (data || []) as Product[]
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
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-[13px] text-bnb-muted">Search by lot code, phone model, or brand</p>
            <p className="text-[11px] text-bnb-muted/70 mt-1">e.g. &quot;B80&quot;, &quot;iPhone 15&quot;, &quot;Samsung S24&quot;</p>
          </div>
        )}

        {query && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">😕</div>
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
