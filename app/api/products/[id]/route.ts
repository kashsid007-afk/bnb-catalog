import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const formData = await request.formData()
  if (formData.get('_method') !== 'DELETE') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const response = await DELETE(request, context)
  if (!response.ok) return response

  return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303)
}
