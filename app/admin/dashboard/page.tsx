import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit, Trash2, Zap } from 'lucide-react'
import type { Product } from '@/types'

type ProductStatusRow = Pick<Product, 'id' | 'new_arrival' | 'featured' | 'sold_out'>

export default async function DashboardPage() {
  const supabase = await createClient()
  const [{ data: products }, { data: counts }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(20),
    supabase.from('products').select('id, new_arrival, featured, sold_out'),
  ])

  const all = (counts || []) as ProductStatusRow[]
  const stats = {
    total: all.length,
    newArrivals: all.filter((p: ProductStatusRow) => p.new_arrival).length,
    featured: all.filter((p: ProductStatusRow) => p.featured).length,
    soldOut: all.filter((p: ProductStatusRow) => p.sold_out).length,
  }

  const productRows = (products || []) as Product[]

  return (
    <div className="page-enter space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Lots',    value: stats.total,       color: 'text-bnb-dark'  },
          { label: 'New Arrivals',  value: stats.newArrivals, color: 'text-bnb-gold'  },
          { label: 'Featured',      value: stats.featured,    color: 'text-bnb-brown' },
          { label: 'Sold Out',      value: stats.soldOut,     color: 'text-bnb-muted' },
        ].map(({ label, value, color }, i) => (
          <div key={label} className="bg-white border border-bnb-sand rounded-2xl p-4 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="text-[10px] text-bnb-muted uppercase tracking-widest mb-1">{label}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/admin/products/new"
          className="bg-bnb-dark text-bnb-gold border border-bnb-dark rounded-2xl p-4 flex items-center gap-3 btn-spring animate-fade-up"
          style={{ animationDelay: '0.2s' }}>
          <div className="w-9 h-9 rounded-xl bg-bnb-gold/20 flex items-center justify-center flex-shrink-0">
            <Plus size={18} className="text-bnb-gold" />
          </div>
          <div>
            <div className="text-[12px] font-bold">Add New Lot</div>
            <div className="text-[10px] text-bnb-muted mt-0.5">Upload product</div>
          </div>
        </Link>
        <Link href="/admin/settings"
          className="bg-white border border-bnb-sand rounded-2xl p-4 flex items-center gap-3 btn-spring animate-fade-up"
          style={{ animationDelay: '0.25s' }}>
          <div className="w-9 h-9 rounded-xl bg-bnb-cream flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-bnb-brown" />
          </div>
          <div>
            <div className="text-[12px] font-bold text-bnb-dark">Settings</div>
            <div className="text-[10px] text-bnb-muted mt-0.5">WhatsApp & banner</div>
          </div>
        </Link>
      </div>

      {/* Products list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-bold text-bnb-dark">All Lots</h2>
          <span className="text-[10px] text-bnb-muted">{stats.total} total</span>
        </div>
        <div className="space-y-2.5">
          {productRows.map((p, i) => (
            <div
              key={p.id}
              className="bg-white border border-bnb-sand rounded-2xl p-3 flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-bnb-cream flex-shrink-0 overflow-hidden">
                {p.image_urls?.[0]
                  ? <img src={p.image_urls[0]} alt={p.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold text-bnb-gold tracking-widest">{p.lot_code}</div>
                <div className="text-[11px] font-semibold text-bnb-dark truncate">{p.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {p.new_arrival && <span className="text-[8px] font-bold text-bnb-brown bg-bnb-gold-light px-1.5 py-0.5 rounded-full">NEW</span>}
                  {p.featured && <span className="text-[8px] font-bold text-bnb-gold bg-bnb-dark px-1.5 py-0.5 rounded-full">HOT</span>}
                  {p.sold_out && <span className="text-[8px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">SOLD</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Link href={`/admin/products/${p.id}`}
                  className="w-8 h-8 rounded-xl bg-bnb-cream border border-bnb-sand flex items-center justify-center btn-spring">
                  <Edit size={13} className="text-bnb-brown" />
                </Link>
                <DeleteButton id={p.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={`/api/products/${id}`} method="POST">
      <input type="hidden" name="_method" value="DELETE" />
      <button
        type="submit"
        onClick={e => { if (!confirm('Delete this lot?')) e.preventDefault() }}
        className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center btn-spring"
        aria-label="Delete"
      >
        <Trash2 size={13} className="text-red-400" />
      </button>
    </form>
  )
}
