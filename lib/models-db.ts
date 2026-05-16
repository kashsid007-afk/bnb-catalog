// Master phone model database — pre-loaded, always up to date
// Admin can also add custom models that get saved to Supabase

export const PHONE_BRANDS: Record<string, string[]> = {
  Samsung: [
    'A06','A07','A14','A15','A16','A17','A25','A35','A36','A55','A56',
    'M35','M36','M56','S20 FE','S21 FE','S22','S22 Ultra','S23','S23 FE',
    'S23 Ultra','S24','S24 FE','S24 Ultra','S25','S25 FE','S25 Ultra',
    'F15','F55','F35'
  ],
  iPhone: [
    '11','11 Pro','11 Pro Max',
    '12','12 Mini','12 Pro','12 Pro Max',
    '13','13 Mini','13 Pro','13 Pro Max',
    '14','14 Plus','14 Pro','14 Pro Max',
    '15','15 Plus','15 Pro','15 Pro Max',
    '16','16 Plus','16 Pro','16 Pro Max',
    '17','17 Plus','17 Pro','17 Pro Max'
  ],
  Vivo: [
    'Y16','Y17s','Y18','Y18e','Y19e','Y20i','Y21','Y28','Y29','Y31',
    'Y31 Pro','Y36','Y39','Y58','Y200','Y400','Y400 Pro',
    'V29','V29e','V40','V40e','V50','V50e','V60','V60e',
    'X100','X200','X200 Pro','X200 FE'
  ],
  Oppo: [
    'A3','A3 Pro','A5','A5 Pro','A18','A38','A58','A78',
    'F25 Pro','F27','F27 Pro','F29','F29 Pro','F31','F31 Pro','F31 Pro+',
    'Reno 11','Reno 12','Reno 12 Pro','Reno 13','Reno 14','Reno 14 Pro',
    'Realme 13 Pro','Realme 14 Pro','Realme 15','Realme 15 Pro','Realme 15T','Realme 15X'
  ],
  'Xiaomi / Mi': [
    '13C 5G','14C','15C','15 5G','Redmi 13C','Redmi 14C',
    'A3','A4','A5',
    'Note 9 Pro','Note 10s','Note 11s','Note 12 Pro','Note 13 Pro',
    'Note 14 Pro','Note 15','Note 15 Pro',
    'Poco X6 Pro','Poco M6 Pro','Poco F6','Poco X7 Pro'
  ],
  OnePlus: [
    'Nord 2','Nord 2T','Nord 3','Nord 4','Nord 5',
    'Nord CE 2 Lite','Nord CE 3 Lite','Nord CE 4 Lite','Nord CE 5',
    '9R','10R','11R','12R','13R','13S',
    '12','13'
  ],
  Google: [
    'Pixel 6A','Pixel 7','Pixel 7A','Pixel 7 Pro',
    'Pixel 8','Pixel 8A','Pixel 8 Pro',
    'Pixel 9','Pixel 9A','Pixel 9 Pro','Pixel 9 Pro XL',
    'Pixel 10','Pixel 10 Pro'
  ],
  Nothing: [
    'Phone 1','Phone 2','Phone 2A','Phone 3','Phone 3A','Phone 3A Pro',
    'CMF Phone 1','CMF Phone 2'
  ],
  Motorola: [
    'Edge 50 Fusion','Edge 50 Pro','Edge 50 Ultra',
    'Edge 60 Fusion','Edge 60 Pro',
    'G85','G35','Razr 50'
  ],
}

// Parse the WhatsApp broadcast format into brand→models map
export function parseBroadcastText(text: string): Record<string, string[]> {
  const result: Record<string, string[]> = {}

  const brandPatterns: Record<string, RegExp> = {
    Samsung:         /👉[🏻🏼🏽🏾🏿]?\s*Samsung\s*:/i,
    iPhone:          /👉[🏻🏼🏽🏾🏿]?\s*i[Pp]hone\s*:/i,
    Vivo:            /👉[🏻🏼🏽🏾🏿]?\s*Vivo\s*:/i,
    Oppo:            /👉[🏻🏼🏽🏾🏿]?\s*Oppo\s*:/i,
    'Xiaomi / Mi':   /👉[🏻🏼🏽🏾🏿]?\s*(Mi|Xiaomi)\s*:/i,
    OnePlus:         /👉[🏻🏼🏽🏾🏿]?\s*(OnePlus|1\+)\s*:/i,
    Google:          /👉[🏻🏼🏽🏾🏿]?\s*Google\s*:/i,
    Nothing:         /👉[🏻🏼🏽🏾🏿]?\s*Nothing\s*:/i,
    Motorola:        /👉[🏻🏼🏽🏾🏿]?\s*(Motorola|Moto)\s*:/i,
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  let currentBrand: string | null = null

  for (const line of lines) {
    // Check if this line is a brand header
    let foundBrand = false
    for (const [brand, pattern] of Object.entries(brandPatterns)) {
      if (pattern.test(line)) {
        currentBrand = brand
        if (!result[currentBrand]) result[currentBrand] = []
        foundBrand = true
        break
      }
    }
    if (foundBrand) continue
    if (!currentBrand) continue

    // Extract model name — handles formats like "A06. 10", "S24ultra. 10", "15-20", "15pro-10"
    const modelMatch = line.match(/^([A-Za-z0-9+\s]+?)[\s\.\-]+\d+/)
    if (modelMatch) {
      let model = modelMatch[1].trim()
      // Normalise common shorthands
      model = model
        .replace(/(\d+)(ultra)/i, '$1 Ultra')
        .replace(/(\d+)(pro)(max)/i, '$1 Pro Max')
        .replace(/(\d+)(pro)/i, '$1 Pro')
        .replace(/(\d+)(plus)/i, '$1 Plus')
        .replace(/(\d+)(fe)/i, '$1 FE')
        .replace(/^1\+/, '')
        .trim()
      if (model && !result[currentBrand].includes(model)) {
        result[currentBrand].push(model)
      }
    }
  }

  return result
}
