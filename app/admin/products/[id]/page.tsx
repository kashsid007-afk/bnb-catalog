import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
  if (!product) notFound()

  return (
    <main className="max-w-md mx-auto min-h-screen bg-bnb-cream pb-10">
      <div className="bg-bnb-dark px-4 pt-10 pb-5 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-bnb-muted text-sm">← Back</Link>
        <p className="text-sm font-bold text-bnb-gold">Edit · {product.lot_code}</p>
      </div>
      <div className="px-4 py-4">
        <div className="bg-white border border-bnb-sand rounded-2xl p-4">
          <p className="text-xs text-bnb-muted mb-4">Edit functionality — update fields below and save.</p>
          <div className="space-y-3">
            {[
              { label: 'Lot Code', value: product.lot_code },
              { label: 'Name', value: product.name },
              { label: 'Colour Mix', value: product.colour_mix || '' },
            ].map(field => (
              <div key={field.label}>
                <label className="text-xs text-bnb-muted font-semibold block mb-1">{field.label}</label>
                <input defaultValue={field.value}
                  className="w-full px-3 py-2.5 text-sm bg-bnb-cream border border-bnb-sand rounded-xl outline-none focus:border-bnb-gold" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-3 bg-bnb-gold text-white text-sm font-semibold rounded-xl">Save Changes</button>
            <Link href="/admin/dashboard" className="flex-1 py-3 bg-bnb-cream border border-bnb-sand text-bnb-muted text-sm font-semibold rounded-xl text-center">Cancel</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
