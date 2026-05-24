import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { LotForm } from '@/components/admin/LotForm'
import { demoCategories } from '@/lib/demo-data'
import type { Category, Product } from '@/types'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('sort_order'),
  ])

  if (!product) notFound()

  const categoryRows = ((categories || []) as Category[]).length > 0
    ? (categories || []) as Category[]
    : demoCategories

  return (
    <main className="min-h-screen bg-bnb-cream pb-10">
      <div className="mb-4 flex items-center gap-3 bg-bnb-dark px-4 pb-5 pt-10">
        <Link href="/admin/dashboard" className="text-sm text-bnb-muted">← Back</Link>
        <p className="text-sm font-bold text-bnb-gold">Edit · {(product as Product).lot_code}</p>
      </div>
      <div className="px-4">
        <LotForm categories={categoryRows} initialData={product as Product} mode="edit" />
      </div>
    </main>
  )
}
