import { BottomNav } from '@/components/catalog/BottomNav'
import { createClient } from '@/lib/supabase/server'
import { AnnouncementBanner } from '@/components/catalog/AnnouncementBanner'

export default async function CatalogLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('*')
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
