import type { TrayItem } from '@/types'

export function buildSingleInquiry(
  lotCode: string,
  name: string,
  phone: string
): string {
  const msg = `Hi BNB,\n\nI'd like to inquire about:\n\nLot Code: ${lotCode}\nProduct: ${name}\n\nPlease share availability and details. Thank you.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

export const buildInquiryURL = buildSingleInquiry

export function buildTrayInquiry(
  items: TrayItem[],
  phone: string
): string {
  let msg = `Hi BNB,\n\nWholesale inquiry:\n\n`
  items.forEach((item, i) => {
    msg += `${i + 1}. LOT ${item.lot_code} – ${item.name}\n   Qty: ${item.qty} lot${item.qty > 1 ? 's' : ''}\n\n`
  })
  const totalLots = items.reduce((s, i) => s + i.qty, 0)
  msg += `Total: ${totalLots} lot${totalLots > 1 ? 's' : ''}\nPlease confirm availability and pricing. Thank you.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}
