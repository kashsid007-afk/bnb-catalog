export type ModelMap = Record<string, string[]>

export interface Product {
  id: string
  lot_code: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  features: string[]
  pack_size: number | null
  colour_mix: string | null
  total_lot_size: number | null
  models: ModelMap
  image_urls: string[]
  video_url: string | null
  featured: boolean
  new_arrival: boolean
  sold_out: boolean
  created_at: string
  categories?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  sort_order: number
}

export interface Settings {
  key: string
  value: string
}

export interface SettingsMap {
  whatsapp_number: string
  store_name: string
  announcement: string | null
}

export interface TrayItem {
  id: string
  lot_code: string
  name: string
  emoji?: string
  models: ModelMap
  qty: number
}
