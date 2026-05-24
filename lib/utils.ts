import type { ModelMap } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { buildSingleInquiry, buildTrayInquiry, normalizeWhatsAppNumber } from '@/lib/whatsapp'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildWhatsAppURL(
  items: Parameters<typeof buildTrayInquiry>[0],
  phone: string
): string {
  return buildTrayInquiry(items, phone)
}

export function buildSingleWhatsAppURL(
  lotCode: string,
  name: string,
  phone: string
): string {
  return buildSingleInquiry(lotCode, name, normalizeWhatsAppNumber(phone))
}

export const buildInquiryURL = buildSingleWhatsAppURL

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Parse WhatsApp broadcast format into models object
// Input: "👉🏻Samsung :\nA06. 10\nA07. 10\n👉🏻iPhone :\n11-10\n12-10"
export function parseBroadcastModels(text: string): ModelMap {
  const result: ModelMap = {}
  const brandMap: Record<string, string> = {
    samsung: 'Samsung', iphone: 'Apple', apple: 'Apple', vivo: 'Vivo',
    oppo: 'Oppo', oneplus: 'OnePlus', 'one+': 'OnePlus',
    mi: 'Mi/Xiaomi', xiaomi: 'Mi/Xiaomi', google: 'Google',
    pixel: 'Google', nothing: 'Nothing', cmf: 'Nothing',
    realme: 'Realme', moto: 'Motorola', motorola: 'Motorola',
    tecno: 'Tecno', infinix: 'Infinix',
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  let currentBrand = ''

  for (const line of lines) {
    const lower = line.toLowerCase()
    // Detect brand header lines (contain brand name + optional colon)
    const foundBrand = Object.keys(brandMap).find(b => lower.includes(b))
    const isHeader = foundBrand && (
      lower.includes(':') ||
      line.startsWith('👉') ||
      line.startsWith('>') ||
      /^[a-z0-9 /+]+$/i.test(line)
    )
    if (isHeader && foundBrand) {
      currentBrand = brandMap[foundBrand]
      if (!result[currentBrand]) result[currentBrand] = []
      continue
    }
    if (!currentBrand) continue

    // Extract model name — strip quantities, bullets, emojis
    const cleaned = line
      .replace(/[👉🏻►•\-–—]/g, '')
      .replace(/\.\s*\d+\s*$/, '')   // "A06. 10" → "A06"
      .replace(/-\d+\s*$/, '')        // "11-10" → "11"
      .replace(/\s*\d+pcs?\s*$/i, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (cleaned && cleaned.length > 0 && cleaned.length < 30) {
      if (!result[currentBrand]) result[currentBrand] = []
      if (!result[currentBrand].some(model => model.toLowerCase() === cleaned.toLowerCase())) {
        result[currentBrand].push(cleaned)
      }
    }
  }
  return result
}

export const parseBroadcastText = parseBroadcastModels

export function getTotalModels(models: ModelMap = {}): number {
  return Object.values(models).reduce((sum, arr) => sum + arr.length, 0)
}

export function formatModelsPreview(models: ModelMap): string {
  const brands = Object.keys(models)
  if (brands.length === 0) return 'No models'
  if (brands.length <= 2) return brands.join(', ')
  return `${brands.slice(0, 2).join(', ')} +${brands.length - 2} more`
}
