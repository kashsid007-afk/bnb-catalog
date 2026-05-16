'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [waNumber, setWaNumber] = useState('')
  const [banner, setBanner] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('*').then(({ data }) => {
      setWaNumber(data?.find(s => s.key === 'whatsapp_number')?.value || '')
      setBanner(data?.find(s => s.key === 'announcement_banner')?.value || '')
    })
  }, [])

  async function save() {
    setSaving(true)
    const supabase = createClient()
    await Promise.all([
      supabase.from('settings').upsert({ key: 'whatsapp_number', value: waNumber.replace(/\D/g, '') }),
      supabase.from('settings').upsert({ key: 'announcement_banner', value: banner }),
    ])
    setSaving(false)
    toast.success('Settings saved')
  }

  return (
    <div className="page-enter space-y-5">
      <div className="bg-white border border-bnb-sand rounded-2xl p-4 space-y-4">
        <h2 className="text-[11px] font-bold text-bnb-muted uppercase tracking-widest">WhatsApp Settings</h2>
        <div>
          <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-1.5">WhatsApp Number</label>
          <input
            type="tel" value={waNumber} onChange={e => setWaNumber(e.target.value)}
            className="field-input" placeholder="919999999999 (with country code)"
          />
          <p className="text-[9px] text-bnb-muted mt-1">Include country code, no + or spaces. e.g. 919876543210</p>
        </div>
      </div>

      <div className="bg-white border border-bnb-sand rounded-2xl p-4 space-y-4">
        <h2 className="text-[11px] font-bold text-bnb-muted uppercase tracking-widest">Announcement Banner</h2>
        <div>
          <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-1.5">Banner Text</label>
          <input
            type="text" value={banner} onChange={e => setBanner(e.target.value)}
            className="field-input" placeholder="e.g. New iPhone 16 cases just arrived! Min order ₹500"
          />
          <p className="text-[9px] text-bnb-muted mt-1">Leave empty to hide the banner</p>
        </div>
      </div>

      <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-bnb-gold text-white py-3.5 rounded-2xl font-bold text-sm btn-spring disabled:opacity-60">
        <Save size={15} />
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
