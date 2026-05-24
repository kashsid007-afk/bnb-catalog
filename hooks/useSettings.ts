'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BNB_WHATSAPP_NUMBER, normalizeWhatsAppNumber } from '@/lib/whatsapp'

export function useSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState(BNB_WHATSAPP_NUMBER)
  const [announcementBanner, setAnnouncementBanner] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('*').then(({ data }) => {
      if (!data) return
      const wa = data.find(s => s.key === 'whatsapp_number')
      const banner = data.find(s => s.key === 'announcement_banner')
      if (wa) setWhatsappNumber(normalizeWhatsAppNumber(wa.value))
      if (banner) setAnnouncementBanner(banner.value)
    })
  }, [])

  return { whatsappNumber, announcementBanner }
}
