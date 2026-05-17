import { createClient } from '@/lib/supabase/server'
import { LotForm } from '@/components/admin/LotForm'
import { demoCategories } from '@/lib/demo-data'
import { hasSupabaseConfig } from '@/lib/supabase/config'

export default async function NewProductPage() {
  const supabase = hasSupabaseConfig() ? await createClient() : null
  const { data: categories } = supabase ? await supabase.from('categories').select('*').order('sort_order') : { data: null }
  const categoryRows = categories?.length ? categories : demoCategories
  return (
    <div className="page-enter">
      <h1 className="text-sm font-bold text-bnb-dark mb-4">Add New Lot</h1>
      <LotForm categories={categoryRows} mode="create" />
    </div>
  )
}
