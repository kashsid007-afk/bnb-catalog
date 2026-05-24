'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [waNumber, setWaNumber] = useState('')
  const [banner, setBanner] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setAdminEmail(data.user?.email ?? '')
    })
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

  async function changePassword() {
    if (!adminEmail) {
      toast.error('Admin session not found')
      return
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setChangingPassword(true)
    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: currentPassword,
    })

    if (verifyError) {
      setChangingPassword(false)
      toast.error('Current password is incorrect')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setChangingPassword(false)

    if (error) {
      toast.error(error.message)
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    toast.success('Password changed')
  }

  return (
    <div className="page-enter space-y-5">
      <div className="bg-white border border-bnb-sand rounded-2xl p-4 space-y-4">
        <h2 className="text-[11px] font-bold text-bnb-muted uppercase tracking-widest">WhatsApp Settings</h2>
        <div>
          <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-1.5">WhatsApp Number</label>
          <input
            type="tel" value={waNumber} onChange={e => setWaNumber(e.target.value)}
            className="field-input" placeholder="917666288880 (with country code)"
          />
          <p className="text-[9px] text-bnb-muted mt-1">Include country code, no + or spaces. e.g. 917666288880</p>
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

      <div className="bg-white border border-bnb-sand rounded-2xl p-4 space-y-4">
        <div>
          <h2 className="text-[11px] font-bold text-bnb-muted uppercase tracking-widest">Change Password</h2>
          <p className="mt-1 text-[10px] text-bnb-muted">Signed in as {adminEmail || 'current admin'}</p>
        </div>

        <div>
          <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-1.5">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={event => setCurrentPassword(event.target.value)}
            className="field-input"
            autoComplete="current-password"
            placeholder="Current password"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-1.5">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
            className="field-input"
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest block mb-1.5">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            className="field-input"
            autoComplete="new-password"
            placeholder="Repeat new password"
          />
        </div>

        <button
          onClick={changePassword}
          disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
          className="w-full bg-bnb-dark text-bnb-gold py-3.5 rounded-2xl font-bold text-sm btn-spring disabled:opacity-50"
        >
          {changingPassword ? 'Changing Password...' : 'Change Password'}
        </button>
      </div>
    </div>
  )
}
