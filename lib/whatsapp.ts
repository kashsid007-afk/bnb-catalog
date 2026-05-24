import type { Product, SelectedModel, TrayItem } from '@/types'

export const BNB_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '917666288880'

export function normalizeWhatsAppNumber(phone?: string | null): string {
  const cleaned = phone?.replace(/\D/g, '') || ''
  return cleaned.length >= 10 ? cleaned : BNB_WHATSAPP_NUMBER
}

function formatSelections(selections: SelectedModel[]): string {
  if (selections.length === 0) return ''

  return selections
    .map(selection => `* ${selection.model} (Qty ${selection.qty})`)
    .join('\n')
}

export function buildProductInquiryMessage(
  product: Pick<Product, 'lot_code' | 'name'>,
  selections: SelectedModel[] = []
): string {
  const selectedList = formatSelections(selections)

  return [
    'Hi BNB,',
    '',
    "I'd like to inquire about:",
    '',
    `1. ${product.name}`,
    selectedList || `* Lot ${product.lot_code}`,
    '',
    'Please confirm:',
    '* availability',
    '* pricing',
    '* dispatch timeline',
    '',
    'Thank you.',
  ].join('\n')
}

export function buildWhatsAppLink(phone: string | undefined | null, message: string): string {
  return `https://wa.me/${normalizeWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`
}

export function buildSingleInquiry(
  lotCode: string,
  name: string,
  phone: string,
  selections: SelectedModel[] = []
): string {
  return buildWhatsAppLink(phone, buildProductInquiryMessage({ lot_code: lotCode, name }, selections))
}

export const buildInquiryURL = buildSingleInquiry

export function buildTrayInquiryMessage(items: TrayItem[]): string {
  const lines = ['Hi BNB,', '', "I'd like to inquire about:", '']

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`)
    if (item.selections?.length) {
      lines.push(formatSelections(item.selections))
    } else {
      lines.push(`* Lot ${item.lot_code} (Qty ${item.qty ?? 1})`)
    }
    lines.push('')
  })

  lines.push('Please confirm:')
  lines.push('* availability')
  lines.push('* pricing')
  lines.push('* dispatch timeline')
  lines.push('')
  lines.push('Thank you.')

  return lines.join('\n')
}

export function buildTrayInquiry(
  items: TrayItem[],
  phone: string
): string {
  return buildWhatsAppLink(phone, buildTrayInquiryMessage(items))
}
