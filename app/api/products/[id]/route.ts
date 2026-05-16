import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const form = await req.formData()
  if (form.get('_method') === 'DELETE') {
    return DELETE(req, { params })
  }
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
