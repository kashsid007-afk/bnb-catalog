'use client'
import { useState } from 'react'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { cn, parseBroadcastText } from '@/lib/utils'

const DEFAULT_BRANDS: Record<string, string[]> = {
  iPhone:   ['11','12','13','14','15','15 Plus','15 Pro','15 Pro Max','16','16 Plus','16 Pro','16 Pro Max','17','17 Pro','17 Pro Max'],
  Samsung:  ['A06','A07','A14','A15','A16','A17','A35','A36','A55','A56','M35','M36','M56','S20 FE','S21 FE','S22','S22 Ultra','S23','S23 FE','S23 Ultra','S24','S24 FE','S24 Ultra','S25','S25 FE','S25 Ultra'],
  Vivo:     ['Y16','Y18','Y19e','Y20i','Y21','Y29','Y31','Y31 Pro','Y39','Y400','Y400 Pro','V40e','V50','V50e','V60','V60e','X200','X200 Pro','X200 FE'],
  Oppo:     ['A5','A5 Pro','F29','F29 Pro','F31','F31 Pro','F31 Pro+','Reno13','Reno14','Reno14 Pro'],
  Mi:       ['13C 5G','14C','15C','15 5G','A3','A4','A5','Note 9 Pro','Note 10S','Note 11S','Note 13 Pro','Note 14 Pro','Note 15','Note 15 Pro'],
  OnePlus:  ['9R','10R','11R','12R','13R','13S','Nord 2','Nord 2T','Nord 3','Nord 4','Nord 5','CE2 Lite','CE3 Lite','CE4 Lite','Nord CE5'],
  Google:   ['Pixel 6A','Pixel 7A','Pixel 8','Pixel 8A','Pixel 9','Pixel 9A','Pixel 9 Pro','Pixel 10','Pixel 10 Pro'],
  Nothing:  ['Phone 1','Phone 2','CMF 1','CMF 2','Phone 3A','Phone 3A Pro','Phone 3'],
  Motorola: ['Edge 50 Fusion','Edge 60 Fusion'],
}

interface Props {
  value: Record<string, string[]>
  onChange: (models: Record<string, string[]>) => void
}

export default function ModelSelector({ value, onChange }: Props) {
  const [pasteText, setPasteText] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ iPhone: true, Samsung: true })
  const [customInput, setCustomInput] = useState<Record<string, string>>({})
  const [parsedBrands, setParsedBrands] = useState<string[]>([])

  const isSelected = (brand: string, model: string) =>
    (value[brand] || []).includes(model)

  const toggle = (brand: string, model: string) => {
    const current = value[brand] || []
    const next = current.includes(model)
      ? current.filter(m => m !== model)
      : [...current, model]
    onChange({ ...value, [brand]: next })
  }

  const selectAll = (brand: string) => {
    const all = DEFAULT_BRANDS[brand] || []
    onChange({ ...value, [brand]: [...all] })
  }

  const clearBrand = (brand: string) => {
    const next = { ...value }
    delete next[brand]
    onChange(next)
  }

  const handleParse = () => {
    const parsed = parseBroadcastText(pasteText)
    const merged = { ...value }
    for (const [brand, models] of Object.entries(parsed)) {
      const allModels = DEFAULT_BRANDS[brand] || []
      const matched = models.map(m => {
        const norm = m.toLowerCase().replace(/\s+/g, '')
        return allModels.find(am => am.toLowerCase().replace(/\s+/g, '') === norm) || m
      })
      merged[brand] = Array.from(new Set([...(merged[brand] || []), ...matched]))
    }
    onChange(merged)
    setParsedBrands(Object.keys(parsed))
  }

  const addCustom = (brand: string) => {
    const val = (customInput[brand] || '').trim()
    if (!val) return
    const current = value[brand] || []
    if (!current.includes(val)) onChange({ ...value, [brand]: [...current, val] })
    setCustomInput(p => ({ ...p, [brand]: '' }))
  }

  const totalSelected = Object.values(value).reduce((s, a) => s + a.length, 0)

  return (
    <div>
      {/* Smart paste */}
      <div className="bg-bnb-cream border border-bnb-sand rounded-2xl overflow-hidden mb-3">
        <div className="px-3 py-2 border-b border-bnb-sand">
          <p className="text-[10px] font-bold text-bnb-dark">Smart paste from WhatsApp broadcast</p>
          <p className="text-[9px] text-bnb-muted mt-0.5">Copy your broadcast list and paste — brands auto-detected</p>
        </div>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          rows={5}
          placeholder={'👉🏻Samsung :\nA06. 10\nA15. 10\n...\n👉🏻iPhone :\n15-20\n16-20\n...'}
          className="w-full px-3 py-2 bg-white text-[11px] text-bnb-dark font-mono outline-none resize-none border-b border-bnb-sand placeholder:text-bnb-muted/50"
        />
        <button
          type="button"
          onClick={handleParse}
          className="w-full py-2 text-[11px] font-bold text-bnb-dark bg-bnb-gold/10 hover:bg-bnb-gold/20 transition-colors"
        >
          Auto-detect brands & models →
        </button>
      </div>

      {parsedBrands.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-3 flex flex-wrap gap-1.5 animate-scaleIn">
          <span className="text-[10px] text-green-700 font-semibold w-full mb-1">✓ Detected: {parsedBrands.length} brands</span>
          {parsedBrands.map(b => (
            <span key={b} className="text-[10px] bg-green-100 text-green-800 px-2 py-[2px] rounded-full font-medium">{b}</span>
          ))}
        </div>
      )}

      {/* Summary */}
      {totalSelected > 0 && (
        <div className="text-[11px] font-semibold text-bnb-dark mb-2 px-1">
          {totalSelected} model{totalSelected !== 1 ? 's' : ''} selected across {Object.keys(value).filter(b => value[b]?.length).length} brand{Object.keys(value).filter(b => value[b]?.length).length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Brand accordions */}
      <div className="border border-bnb-sand rounded-2xl overflow-hidden">
        {Object.entries(DEFAULT_BRANDS).map(([brand, models], idx) => {
          const selected = value[brand] || []
          const isOpen = !!expanded[brand]
          return (
            <div key={brand} className={cn('border-b border-bnb-sand', idx === Object.keys(DEFAULT_BRANDS).length - 1 && 'border-b-0')}>
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-3 bg-white"
                onClick={() => setExpanded(p => ({ ...p, [brand]: !p[brand] }))}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-bnb-dark">{brand}</span>
                  {selected.length > 0 && (
                    <span className="text-[9px] font-bold bg-bnb-gold text-white px-2 py-[1px] rounded-full">
                      {selected.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selected.length > 0 && (
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); clearBrand(brand); }}
                      className="text-[9px] text-red-400 font-medium"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); selectAll(brand); }}
                    className="text-[9px] text-bnb-gold font-semibold"
                  >
                    All
                  </button>
                  {isOpen ? <ChevronUp size={14} className="text-bnb-muted" /> : <ChevronDown size={14} className="text-bnb-muted" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3 bg-bnb-cream/50 animate-fadeIn">
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {models.map(model => (
                      <button
                        key={model}
                        type="button"
                        onClick={() => toggle(brand, model)}
                        className={cn(
                          'text-[10px] font-semibold px-2.5 py-1 rounded-lg border btn-spring transition-all',
                          isSelected(brand, model)
                            ? 'bg-bnb-gold text-white border-bnb-gold'
                            : 'bg-white text-bnb-dark border-bnb-sand'
                        )}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                  {/* Custom model */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={customInput[brand] || ''}
                      onChange={e => setCustomInput(p => ({ ...p, [brand]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom(brand))}
                      placeholder="Add custom model..."
                      className="flex-1 text-[11px] px-3 py-1.5 bg-white border border-bnb-sand rounded-lg outline-none focus:border-bnb-gold text-bnb-dark placeholder:text-bnb-muted"
                    />
                    <button
                      type="button"
                      onClick={() => addCustom(brand)}
                      className="px-3 py-1.5 bg-bnb-gold text-white text-[11px] font-bold rounded-lg btn-spring"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  {/* Show custom-added models not in default list */}
                  {selected.filter(m => !models.includes(m)).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggle(brand, m)}
                      className="mt-1 mr-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg border bg-bnb-gold text-white border-bnb-gold btn-spring"
                    >
                      {m} ✕
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Fully custom brand */}
        <div className="px-3 py-3 bg-bnb-cream border-t border-bnb-sand">
          <p className="text-[10px] font-semibold text-bnb-muted mb-2">Brand not listed? Add custom</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Brand · Model  e.g. CMF Phone 2"
              id="custom-brand-model"
              className="flex-1 text-[11px] px-3 py-2 bg-white border border-bnb-sand rounded-xl outline-none focus:border-bnb-gold text-bnb-dark placeholder:text-bnb-muted"
            />
            <button
              type="button"
              onClick={() => {
                const inp = document.getElementById('custom-brand-model') as HTMLInputElement
                const parts = inp.value.split('·').map(s => s.trim())
                if (parts.length === 2) {
                  const [brand, model] = parts
                  onChange({ ...value, [brand]: [...(value[brand] || []), model] })
                  inp.value = ''
                }
              }}
              className="px-3 py-2 bg-bnb-gold text-white text-[11px] font-bold rounded-xl btn-spring whitespace-nowrap"
            >
              Add
            </button>
          </div>
          <p className="text-[9px] text-bnb-muted mt-1">Format: Brand · Model</p>
        </div>
      </div>
    </div>
  )
}
