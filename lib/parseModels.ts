import type { ModelMap } from '@/types'

// Detects brand headers in the WhatsApp broadcast format:
// 👉🏻Samsung : or 👉🏻iPhone : etc.
const BRAND_PATTERNS: { pattern: RegExp; brand: string }[] = [
  { pattern: /samsung/i,         brand: 'Samsung'    },
  { pattern: /iphone|apple/i,    brand: 'iPhone'     },
  { pattern: /vivo/i,            brand: 'Vivo'       },
  { pattern: /oppo|realme/i,     brand: 'Oppo'       },
  { pattern: /mi|xiaomi|redmi/i, brand: 'Xiaomi/Mi'  },
  { pattern: /oneplus|1\+/i,     brand: 'OnePlus'    },
  { pattern: /google|pixel/i,    brand: 'Google'     },
  { pattern: /nothing|cmf/i,     brand: 'Nothing'    },
  { pattern: /moto|motorola/i,   brand: 'Motorola'   },
]

// Cleans a model string: removes qty, dots, special chars
function cleanModel(raw: string): string {
  return raw
    .replace(/👉🏻|👉|➡️|:|-|\.|,|\d+\s*pcs?\.?/gi, '')
    .replace(/\(.*?\)/g, '')
    .trim()
}

export function parseBroadcastText(text: string): ModelMap {
  const result: ModelMap = {}
  let currentBrand: string | null = null

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  for (const line of lines) {
    // Check if this line is a brand header
    const brandMatch = BRAND_PATTERNS.find(b => b.pattern.test(line))
    if (brandMatch && (line.includes(':') || line.includes('👉') || line.length < 30)) {
      currentBrand = brandMatch.brand
      if (!result[currentBrand]) result[currentBrand] = []
      continue
    }

    if (!currentBrand) continue

    // Skip lines that are clearly totals or summaries
    if (/total|lot|@|price|packet/i.test(line)) continue

    // Extract model name — handles both "A06. 10" and "11-10" formats
    const modelRaw = line
      .replace(/\.\s*\d+\s*$/, '')   // remove trailing ". 10"
      .replace(/-\s*\d+\s*$/, '')    // remove trailing "-10"
      .replace(/\s+\d+$/, '')        // remove trailing " 10"
      .trim()

    const model = cleanModel(modelRaw)
    if (model.length >= 1 && model.length <= 30) {
      if (!result[currentBrand].includes(model)) {
        result[currentBrand].push(model)
      }
    }
  }

  // Remove empty brands
  Object.keys(result).forEach(b => {
    if (result[b].length === 0) delete result[b]
  })

  return result
}

export function countModels(models: ModelMap): number {
  return Object.values(models).reduce((sum, arr) => sum + arr.length, 0)
}

export function getBrandNames(models: ModelMap): string[] {
  return Object.keys(models)
}
