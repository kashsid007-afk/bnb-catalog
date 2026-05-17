import type { Category, Product } from '@/types'

const now = new Date('2026-01-01T00:00:00.000Z').toISOString()

export const DEFAULT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999'

export const demoCategories: Category[] = [
  { id: 'demo-cat-iphone', name: 'iPhone Covers', slug: 'iphone-covers', image_url: null, sort_order: 1 },
  { id: 'demo-cat-samsung', name: 'Samsung Covers', slug: 'samsung-covers', image_url: null, sort_order: 2 },
  { id: 'demo-cat-transparent', name: 'Transparent Cases', slug: 'transparent-cases', image_url: null, sort_order: 3 },
  { id: 'demo-cat-silicone', name: 'Silicone Covers', slug: 'silicone-covers', image_url: null, sort_order: 4 },
  { id: 'demo-cat-magsafe', name: 'MagSafe Covers', slug: 'magsafe-covers', image_url: null, sort_order: 5 },
  { id: 'demo-cat-rugged', name: 'Rugged Covers', slug: 'rugged-covers', image_url: null, sort_order: 6 },
]

export const demoProducts: Product[] = [
  {
    id: 'demo-iphone-15-pro-max-covers',
    lot_code: 'DEMO-101',
    name: 'iPhone 15 Pro Max MagSafe Covers',
    slug: 'demo-iphone-15-pro-max-magsafe-covers',
    description: 'Premium MagSafe-compatible back covers with soft-touch finish and camera protection.',
    category_id: 'demo-cat-magsafe',
    categories: demoCategories[4],
    features: ['MagSafe ring', 'Camera guard', 'Premium matte finish'],
    pack_size: 10,
    colour_mix: '3 Black, 3 Clear, 2 Titanium, 2 Blue',
    total_lot_size: 60,
    models: { iPhone: ['15 Pro Max', '15 Pro', '16 Pro Max', '16 Pro'] },
    image_urls: [],
    video_url: null,
    featured: true,
    new_arrival: true,
    sold_out: false,
    created_at: now,
  },
  {
    id: 'demo-samsung-s24-ultra-covers',
    lot_code: 'DEMO-102',
    name: 'Samsung S24 Ultra Transparent Cases',
    slug: 'demo-samsung-s24-ultra-transparent-cases',
    description: 'Crystal clear TPU cases made for daily wholesale movement.',
    category_id: 'demo-cat-transparent',
    categories: demoCategories[2],
    features: ['Anti-yellow TPU', 'Slim profile', 'Raised edges'],
    pack_size: 10,
    colour_mix: '10 Clear per model',
    total_lot_size: 70,
    models: { Samsung: ['S24 Ultra', 'S24', 'S23 Ultra', 'A55', 'A35', 'A15', 'A06'] },
    image_urls: [],
    video_url: null,
    featured: true,
    new_arrival: true,
    sold_out: false,
    created_at: now,
  },
  {
    id: 'demo-silicone-soft-covers',
    lot_code: 'DEMO-103',
    name: 'Soft Silicone Mobile Covers',
    slug: 'demo-soft-silicone-mobile-covers',
    description: 'Smooth silicone back covers in fast-moving colours for mixed lots.',
    category_id: 'demo-cat-silicone',
    categories: demoCategories[3],
    features: ['Soft hand feel', 'Microfiber lining', 'Assorted colours'],
    pack_size: 10,
    colour_mix: 'Black, Lavender, Blue, Wine, Forest',
    total_lot_size: 80,
    models: { iPhone: ['13', '14', '15', '15 Plus'], Samsung: ['A15', 'A35', 'S23 FE'], Vivo: ['V50', 'Y29'] },
    image_urls: [],
    video_url: null,
    featured: false,
    new_arrival: true,
    sold_out: false,
    created_at: now,
  },
  {
    id: 'demo-premium-leather-cases',
    lot_code: 'DEMO-104',
    name: 'Premium Leather Finish Cases',
    slug: 'demo-premium-leather-finish-cases',
    description: 'Executive leather-finish covers for premium counters and gifting demand.',
    category_id: 'demo-cat-iphone',
    categories: demoCategories[0],
    features: ['Leather texture', 'Metal buttons', 'Camera ring'],
    pack_size: 6,
    colour_mix: '2 Brown, 2 Black, 2 Tan',
    total_lot_size: 36,
    models: { iPhone: ['14 Pro Max', '15 Pro Max', '16 Pro Max'], Samsung: ['S24 Ultra', 'S23 Ultra', 'S25 Ultra'] },
    image_urls: [],
    video_url: null,
    featured: true,
    new_arrival: false,
    sold_out: false,
    created_at: now,
  },
  {
    id: 'demo-printed-anime-covers',
    lot_code: 'DEMO-105',
    name: 'Printed Anime Back Covers',
    slug: 'demo-printed-anime-back-covers',
    description: 'Trendy printed phone covers for youth-focused retail counters.',
    category_id: 'demo-cat-rugged',
    categories: demoCategories[5],
    features: ['Glossy print', 'Scratch resistant', 'Mixed designs'],
    pack_size: 12,
    colour_mix: '12 assorted prints per model',
    total_lot_size: 72,
    models: { iPhone: ['13', '14', '15'], OnePlus: ['Nord 4', '12R'], Oppo: ['Reno14', 'F29 Pro'] },
    image_urls: [],
    video_url: null,
    featured: false,
    new_arrival: true,
    sold_out: false,
    created_at: now,
  },
  {
    id: 'demo-rugged-armor-covers',
    lot_code: 'DEMO-106',
    name: 'Rugged Armor Mobile Cases',
    slug: 'demo-rugged-armor-mobile-cases',
    description: 'Heavy-duty back covers with corner bumpers for protection-focused buyers.',
    category_id: 'demo-cat-rugged',
    categories: demoCategories[5],
    features: ['Shockproof corners', 'Grip texture', 'Raised camera lip'],
    pack_size: 8,
    colour_mix: '4 Black, 2 Green, 2 Navy',
    total_lot_size: 48,
    models: { Samsung: ['S24 Ultra', 'S23 Ultra', 'A55'], Motorola: ['Edge 50 Fusion', 'Edge 60 Fusion'], Google: ['Pixel 9 Pro', 'Pixel 8A'] },
    image_urls: [],
    video_url: null,
    featured: true,
    new_arrival: true,
    sold_out: false,
    created_at: now,
  },
]

export function productEmoji(product: Pick<Product, 'name' | 'features'>): string {
  const text = `${product.name} ${product.features.join(' ')}`.toLowerCase()
  if (text.includes('magsafe')) return '🧲'
  if (text.includes('transparent') || text.includes('clear')) return '💎'
  if (text.includes('silicone')) return '🎨'
  if (text.includes('leather')) return '🟤'
  if (text.includes('anime') || text.includes('printed')) return '🖼️'
  if (text.includes('rugged') || text.includes('armor')) return '🛡️'
  return '📱'
}

export function filterDemoProducts(query: string): Product[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return demoProducts

  return demoProducts.filter(product => {
    const searchable = [
      product.name,
      product.lot_code,
      product.description ?? '',
      product.features.join(' '),
      Object.entries(product.models)
        .map(([brand, models]) => `${brand} ${models.join(' ')}`)
        .join(' '),
    ].join(' ').toLowerCase()

    return searchable.includes(normalized)
  })
}
