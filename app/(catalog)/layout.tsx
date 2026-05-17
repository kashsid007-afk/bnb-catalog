import { BottomNav } from '@/components/catalog/BottomNav'
import { createClient } from '@/lib/supabase/server'
import { AnnouncementBanner } from '@/components/catalog/AnnouncementBanner'
import { hasSupabaseConfig } from '@/lib/supabase/config'

export default async function CatalogLayout({ children }: { children: React.ReactNode }) {
  const supabase = hasSupabaseConfig() ? await createClient() : null
  const { data } = supabase ? await supabase.from('settings').select('*') : { data: null }
  const banner = data?.find(s => s.key === 'announcement_banner')?.value || ''

  return (
    <div className="min-h-screen bg-bnb-cream">
      {banner && <AnnouncementBanner message={banner} />}
      <main className="max-w-md mx-auto pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
