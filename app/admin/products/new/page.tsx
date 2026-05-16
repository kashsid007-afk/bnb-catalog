import { createClient } from '@/lib/supabase/server'
import { LotForm } from '@/components/admin/LotForm'

export default async function NewProductPage() {
  const supabase = createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')
  return (
    <div className="page-enter">
      <h1 className="text-sm font-bold text-bnb-dark mb-4">Add New Lot</h1>
      <LotForm categories={categories || []} mode="create" />
    </div>
  )
}
