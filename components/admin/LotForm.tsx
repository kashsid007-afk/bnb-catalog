'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { Upload, X, Plus, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { parseBroadcastModels, slugify } from '@/lib/utils'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { Product, Category } from '@/types'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

const BRANDS = ['Samsung','Apple','Vivo','Oppo','OnePlus','Mi/Xiaomi','Google','Nothing','Realme','Motorola','Tecno','Infinix']

const BRAND_MODELS: Record<string, string[]> = {
  Samsung: ['A06','A07','A14','A15','A16','A17','A35','A36','A55','A56','M35','M36','M56','S20fe','S21fe','S22','S22 Ultra','S23','S23fe','S23 Ultra','S24','S24 Ultra','S24fe','S25','S25fe','S25 Ultra'],
  Apple: ['iPhone 11','iPhone 12','iPhone 13','iPhone 14','iPhone 15','iPhone 15 Plus','iPhone 15 Pro','iPhone 15 Pro Max','iPhone 16','iPhone 16 Plus','iPhone 16 Pro','iPhone 16 Pro Max'],
  Vivo: ['Y16','Y18','Y19e','Y20i','Y21','Y29','Y31','Y31 Pro','Y39','Y400','Y400 Pro','V40e','V50','V50e','V60','V60e','X200','X200 Pro','X200fe'],
  Oppo: ['A5','A5 Pro','F31','F31 Pro','F29','F29 Pro','Reno13','Reno14','Reno14 Pro'],
  OnePlus: ['Nord 2','Nord 2T','Nord 3','Nord 4','Nord 5','Ce2 Lite','Ce3 Lite','Ce4 Lite','Nord CE5','9R','10R','11R','12R','13R','13S'],
  'Mi/Xiaomi': ['13C 5G','14C','15C','15 5G','A3','A4','A5','Note 9 Pro','Note 10s','Note 11s','Note 13 Pro','Note 14 Pro','Note 15','Note 15 Pro'],
  Google: ['Pixel 6A','Pixel 7A','Pixel 8','Pixel 8A','Pixel 9','Pixel 9A','Pixel 9 Pro','Pixel 10','Pixel 10 Pro'],
  Nothing: ['Nothing 1','Nothing 2','Nothing 3','Nothing 3A','Nothing 3A Pro','CMF1','CMF2'],
  Realme: ['Realme 15','Realme 15x','Realme 15T','Realme 15 Pro'],
  Motorola: ['Edge 50 Fusion','Edge 60 Fusion'],
  Tecno: ['Spark 20','Spark 30','Camon 30','Camon 40 Pro'],
  Infinix: ['Hot 40','Hot 50','Note 40','Note 50 Pro'],
}

interface Props {
  categories: Category[]
  initialData?: Partial<Product>
  mode: 'create' | 'edit'
}

export function LotForm({ categories, initialData, mode }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step 1 fields
  const [lotCode, setLotCode] = useState(initialData?.lot_code || '')
  const [name, setName] = useState(initialData?.name || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [features, setFeatures] = useState(initialData?.features?.join(', ') || '')
  const [colourMix, setColourMix] = useState(initialData?.colour_mix || '')
  const [packSize, setPackSize] = useState(String(initialData?.pack_size || ''))
  const [description, setDescription] = useState(initialData?.description || '')
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.image_urls || [])
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '')
  const [uploading, setUploading] = useState(false)

  // Step 2 fields
  const [models, setModels] = useState<Record<string, string[]>>(initialData?.models || {})
  const [pasteText, setPasteText] = useState('')
  const [customInput, setCustomInput] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [expandedBrand, setExpandedBrand] = useState<string | null>('Samsung')

  // Step 3 flags
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [newArrival, setNewArrival] = useState(initialData?.new_arrival ?? true)
  const [soldOut, setSoldOut] = useState(initialData?.sold_out || false)

  // --- Media upload ---
  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true)
    const urls: string[] = []
    for (const file of files) {
      if (file.size > 15 * 1024 * 1024) { toast.error(`${file.name} too large (max 15MB)`); continue }

      try {
        let publicUrl: string

        if (CLOUD_NAME && UPLOAD_PRESET) {
          publicUrl = await uploadToCloudinary(file, CLOUD_NAME, UPLOAD_PRESET)
        } else {
          const supabase = createClient()
          const ext = file.name.split('.').pop()
          const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const { error } = await supabase.storage.from('product-images').upload(path, file, { cacheControl: '3600' })
          if (error) throw error
          const { data: { publicUrl: supabaseUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
          publicUrl = supabaseUrl
        }

        if (file.type.startsWith('video/')) {
          setVideoUrl(publicUrl)
        } else {
          urls.push(publicUrl)
        }
      } catch {
        toast.error(`Upload failed: ${file.name}`)
      }
    }
    setUploadedImages(prev => [...prev, ...urls])
    setUploading(false)
    if (urls.length > 0) toast.success(`${urls.length} photo${urls.length > 1 ? 's' : ''} uploaded`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [], 'video/*': [] }, multiple: true,
  })

  // --- Model selection ---
  function toggleModel(brand: string, model: string) {
    setModels(prev => {
      const brandModels = prev[brand] || []
      const next = brandModels.includes(model)
        ? brandModels.filter(m => m !== model)
        : [...brandModels, model]
      if (next.length === 0) {
        const { [brand]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [brand]: next }
    })
  }

  function selectAllBrand(brand: string) {
    const all = BRAND_MODELS[brand] || []
    setModels(prev => ({ ...prev, [brand]: [...all] }))
  }

  function clearBrand(brand: string) {
    setModels(prev => { const { [brand]: _, ...rest } = prev; return rest })
  }

  function parsePaste() {
    const parsed = parseBroadcastModels(pasteText)
    if (Object.keys(parsed).length === 0) { toast.error('No models detected. Check format.'); return }
    setModels(prev => {
      const merged = { ...prev }
      for (const [brand, mods] of Object.entries(parsed)) {
        merged[brand] = Array.from(new Set([...(merged[brand] || []), ...mods]))
      }
      return merged
    })
    toast.success(`Detected ${Object.keys(parsed).length} brands`)
  }

  function addCustomModel() {
    if (!customInput.trim() || !customBrand.trim()) { toast.error('Enter both brand and model'); return }
    const b = customBrand.trim()
    const m = customInput.trim()
    setModels(prev => ({ ...prev, [b]: Array.from(new Set([...(prev[b] || []), m])) }))
    setCustomInput('')
    toast.success(`Added ${m} under ${b}`)
  }

  const totalModels = Object.values(models).reduce((s, a) => s + a.length, 0)

  // --- Save ---
  async function handleSave() {
    if (!lotCode.trim() || !name.trim()) { toast.error('Lot code and name required'); setStep(1); return }
    setSaving(true)
    const supabase = createClient()
    const slug = slugify(`${lotCode}-${name}`)
    const payload = {
      lot_code: lotCode.trim().toUpperCase(),
      name: name.trim(),
      slug,
      category_id: categoryId && !categoryId.startsWith('demo-cat-') ? categoryId : null,
      features: features.split(',').map(f => f.trim()).filter(Boolean),
      colour_mix: colourMix.trim() || null,
      pack_size: packSize ? parseInt(packSize) : null,
      total_lot_size: packSize ? parseInt(packSize) * totalModels : null,
      description: description.trim() || null,
      models,
      image_urls: uploadedImages,
      video_url: videoUrl || null,
      featured,
      new_arrival: newArrival,
      sold_out: soldOut,
    }
    const { error } = mode === 'create'
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', initialData!.id!)

    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(mode === 'create' ? 'Lot published!' : 'Lot updated!')
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="space-y-4 page-enter">
      {/* Step indicator */}
      <div className="flex items-center gap-2 bg-white border border-bnb-sand rounded-2xl p-3.5">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setStep(s)} className="flex-1 flex items-center justify-center gap-1.5">
            <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
              s < step ? 'bg-green-500 text-white' : s === step ? 'bg-bnb-dark text-bnb-gold' : 'bg-bnb-cream text-bnb-muted'
            }`}>
              {s < step ? <CheckCircle2 size={14} /> : s}
            </div>
            <span className={`text-[10px] font-semibold ${s === step ? 'text-bnb-dark' : 'text-bnb-muted'}`}>
              {['Basics', 'Models', 'Publish'][s - 1]}
            </span>
          </button>
        ))}
      </div>

      {/* STEP 1: Basics */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Lot Code *" hint="e.g. B80">
              <input value={lotCode} onChange={e => setLotCode(e.target.value.toUpperCase())}
                className="field-input" placeholder="B80" />
            </Field>
            <Field label="Category">
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="field-input">
                <option value="">Select...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Product Name *">
            <input value={name} onChange={e => setName(e.target.value)}
              className="field-input" placeholder="e.g. Dulero Magsafe PC Case" />
          </Field>

          <Field label="Features" hint="Comma separated">
            <input value={features} onChange={e => setFeatures(e.target.value)}
              className="field-input" placeholder="Magsafe Working, Hard PC, Anti-Scratch, 4 Colours" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Colour Mix">
              <input value={colourMix} onChange={e => setColourMix(e.target.value)}
                className="field-input" placeholder="4 Clear, 2 Black..." />
            </Field>
            <Field label="Pack Size">
              <input type="number" value={packSize} onChange={e => setPackSize(e.target.value)}
                className="field-input" placeholder="10" />
            </Field>
          </div>

          <Field label="Description (optional)">
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              className="field-input min-h-[70px] resize-none" placeholder="Product description..." />
          </Field>

          {/* Media upload */}
          <div>
            <div className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest mb-2">
              Photos + Video
            </div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-bnb-gold bg-bnb-gold/5' : 'border-bnb-sand hover:border-bnb-gold-light'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={22} className="mx-auto text-bnb-muted mb-2" />
              <p className="text-[11px] text-bnb-muted">
                {uploading ? 'Uploading...' : isDragActive ? 'Drop here' : 'Upload photos/video, then paste model list'}
              </p>
              <p className="text-[10px] text-bnb-muted/60 mt-1">
                {CLOUD_NAME && UPLOAD_PRESET ? 'Cloudinary CDN enabled' : 'Supabase storage fallback'} · JPG, PNG, WebP, MP4 · Max 15MB each
              </p>
            </div>

            {(uploadedImages.length > 0 || videoUrl) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {uploadedImages.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-bnb-sand">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setUploadedImages(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                      aria-label="Remove"
                    >
                      <X size={9} className="text-white" />
                    </button>
                  </div>
                ))}
                {videoUrl && (
                  <div className="relative w-16 h-16 rounded-xl bg-bnb-dark border border-bnb-gold/30 flex items-center justify-center">
                    <span className="text-bnb-gold text-xs font-bold">VID</span>
                    <button
                      onClick={() => setVideoUrl('')}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                      aria-label="Remove video"
                    >
                      <X size={9} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setStep(2)} className="w-full bg-bnb-dark text-bnb-gold py-3.5 rounded-2xl font-bold text-sm btn-spring">
            Next: Add Phone Models →
          </button>
        </div>
      )}

      {/* STEP 2: Models */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          {/* Smart paste */}
          <div className="bg-white border border-bnb-sand rounded-2xl overflow-hidden">
            <div className="bg-bnb-cream px-4 py-2.5 flex items-center justify-between border-b border-bnb-sand">
              <span className="text-[11px] font-bold text-bnb-dark">Smart paste from WhatsApp</span>
              <span className="text-[9px] text-bnb-muted">Paste your broadcast text</span>
            </div>
            <textarea
              value={pasteText} onChange={e => setPasteText(e.target.value)}
              className="w-full px-4 py-3 text-[11px] font-mono text-bnb-dark min-h-[100px] outline-none resize-none"
              placeholder={"APPLE\niPhone 15\niPhone 15 Pro\niPhone 15 Pro Max\n\nSAMSUNG\nS24\nS24 Ultra\n\nVIVO\nV40\nV40 Pro"}
            />
            <button
              onClick={parsePaste}
              className="w-full py-2.5 bg-bnb-dark text-bnb-gold text-[11px] font-bold border-t border-bnb-sand btn-spring"
            >
              Auto-detect brands & models →
            </button>
          </div>

          {/* Manual selection */}
          <div className="bg-white border border-bnb-sand rounded-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-bnb-cream border-b border-bnb-sand flex items-center justify-between">
              <span className="text-[11px] font-bold text-bnb-dark">Manual selection</span>
              <span className="text-[10px] text-bnb-gold font-semibold">{totalModels} selected</span>
            </div>
            {BRANDS.map(brand => {
              const selected = models[brand] || []
              const all = BRAND_MODELS[brand] || []
              const isOpen = expandedBrand === brand
              return (
                <div key={brand} className="border-b border-bnb-sand last:border-0">
                  <button
                    onClick={() => setExpandedBrand(isOpen ? null : brand)}
                    className="w-full px-4 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-bnb-dark">
                      {brand}
                      {selected.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-bnb-gold text-white rounded-full text-[8px] font-bold">
                          {selected.length}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isOpen && (
                        <>
                          <button onClick={e => { e.stopPropagation(); selectAllBrand(brand) }}
                            className="text-[9px] text-bnb-gold font-bold">All</button>
                          <button onClick={e => { e.stopPropagation(); clearBrand(brand) }}
                            className="text-[9px] text-bnb-muted">Clear</button>
                        </>
                      )}
                      <span className="text-bnb-muted text-[10px]">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 flex flex-wrap gap-1.5 animate-fade-in">
                      {all.map(model => (
                        <button
                          key={model}
                          onClick={() => toggleModel(brand, model)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all duration-150 btn-spring ${
                            selected.includes(model)
                              ? 'bg-bnb-gold text-white border-bnb-gold'
                              : 'bg-bnb-cream text-bnb-dark border-bnb-sand'
                          }`}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add custom */}
            <div className="px-4 py-3 border-t border-bnb-sand bg-bnb-cream/50">
              <div className="text-[10px] font-bold text-bnb-muted uppercase tracking-wider mb-2">Not listed? Add custom</div>
              <div className="flex gap-2">
                <input
                  value={customBrand} onChange={e => setCustomBrand(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-bnb-sand bg-white text-[11px] text-bnb-dark outline-none focus:border-bnb-gold"
                  placeholder="Brand (e.g. CMF)"
                />
                <input
                  value={customInput} onChange={e => setCustomInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-bnb-sand bg-white text-[11px] text-bnb-dark outline-none focus:border-bnb-gold"
                  placeholder="Model (e.g. Phone 2)"
                  onKeyDown={e => e.key === 'Enter' && addCustomModel()}
                />
                <button onClick={addCustomModel} className="px-3 py-2 bg-bnb-gold text-white rounded-xl text-[11px] font-bold btn-spring">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 bg-white border border-bnb-sand text-bnb-brown py-3 rounded-2xl font-semibold text-sm btn-spring">
              ← Back
            </button>
            <button onClick={() => setStep(3)} className="flex-1 bg-bnb-dark text-bnb-gold py-3 rounded-2xl font-bold text-sm btn-spring">
              Review & Publish →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Publish */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white border border-bnb-sand rounded-2xl p-4">
            <div className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest mb-3">Summary</div>
            {[
              { k: 'Lot Code',   v: lotCode },
              { k: 'Name',       v: name },
              { k: 'Photos',     v: `${uploadedImages.length} photos${videoUrl ? ' + 1 video' : ''}` },
              { k: 'Brands',     v: Object.keys(models).join(', ') || 'None' },
              { k: 'Models',     v: `${totalModels} models` },
              { k: 'Pack size',  v: packSize ? `${packSize} pcs/model` : '—' },
              { k: 'Lot total',  v: packSize && totalModels ? `${(parseInt(packSize) * totalModels).toLocaleString()} pcs` : '—' },
            ].map(({ k, v }) => (
              <div key={k} className="flex justify-between py-2 border-b border-bnb-cream last:border-0 text-[11px]">
                <span className="text-bnb-muted">{k}</span>
                <span className="font-semibold text-bnb-dark text-right max-w-[60%] truncate">{v}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'New Arrival', value: newArrival, set: setNewArrival },
              { label: 'Featured',   value: featured,   set: setFeatured   },
              { label: 'Sold Out',   value: soldOut,    set: setSoldOut    },
            ].map(({ label, value, set }) => (
              <button
                key={label}
                onClick={() => set(!value)}
                className={`py-3 rounded-2xl text-[10px] font-bold border transition-all btn-spring ${
                  value ? 'bg-bnb-dark text-bnb-gold border-bnb-dark' : 'bg-white text-bnb-muted border-bnb-sand'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 bg-white border border-bnb-sand text-bnb-brown py-3 rounded-2xl font-semibold text-sm btn-spring">
              ← Back
            </button>
            <button
              onClick={handleSave} disabled={saving}
              className="flex-1 bg-bnb-gold text-white py-3.5 rounded-2xl font-bold text-sm btn-spring disabled:opacity-60"
            >
              {saving ? 'Publishing...' : mode === 'create' ? 'Publish Lot ✓' : 'Save Changes ✓'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[10px] font-bold text-bnb-muted uppercase tracking-widest">{label}</label>
        {hint && <span className="text-[9px] text-bnb-gold">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
