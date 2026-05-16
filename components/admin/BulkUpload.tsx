'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Play, CheckCircle } from 'lucide-react'
import { parseBroadcastText, countModels } from '@/lib/parseModels'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import toast from 'react-hot-toast'

interface MediaFile { file: File; preview: string; type: 'image' | 'video' }
interface Props { onSuccess?: () => void }

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

export function BulkUpload({ onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [lotCode, setLotCode] = useState('')
  const [name, setName] = useState('')
  const [features, setFeatures] = useState('')
  const [colourMix, setColourMix] = useState('')
  const [packSize, setPackSize] = useState('')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [pasteText, setPasteText] = useState('')
  const [parsedModels, setParsedModels] = useState<any>({})
  const [customModel, setCustomModel] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [newArrival, setNewArrival] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles: MediaFile[] = accepted.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
    }))
    setMediaFiles(prev => [...prev, ...newFiles].slice(0, 8))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': ['.mp4', '.mov'] },
    multiple: true,
  })

  const handleParse = () => {
    const models = parseBroadcastText(pasteText)
    setParsedModels(models)
    const total = countModels(models)
    const brands = Object.keys(models).length
    if (total > 0) {
      toast.success(`Detected ${total} models across ${brands} brands`)
    } else {
      toast.error('No models detected — check the format and try again')
    }
  }

  const addCustomModel = () => {
    if (!customModel.trim() || !customBrand.trim()) return
    setParsedModels((prev: any) => ({
      ...prev,
      [customBrand.trim()]: [...(prev[customBrand.trim()] ?? []), customModel.trim()],
    }))
    setCustomModel('')
    toast.success('Model added')
  }

  const removeModel = (brand: string, model: string) => {
    setParsedModels((prev: any) => {
      const updated = { ...prev, [brand]: prev[brand].filter(m => m !== model) }
      if (updated[brand].length === 0) delete updated[brand]
      return { ...updated }
    })
  }

  const totalModels = countModels(parsedModels)
  const totalLot = packSize && totalModels ? parseInt(packSize) * totalModels : null

  const handlePublish = async () => {
    if (!lotCode.trim()) { toast.error('Lot code is required'); return }
    if (!name.trim()) { toast.error('Product name is required'); return }
    if (mediaFiles.length === 0) { toast.error('At least one photo is required'); return }

    setUploading(true)
    const supabase = createClient()

    try {
      const imageUrls: string[] = []
      let videoUrl: string | null = null

      for (let i = 0; i < mediaFiles.length; i++) {
        const mf = mediaFiles[i]
        setUploadProgress(`Uploading ${mf.type} ${i + 1} of ${mediaFiles.length}...`)
        const url = await uploadToCloudinary(mf.file, CLOUD_NAME, UPLOAD_PRESET)
        if (mf.type === 'video') videoUrl = url
        else imageUrls.push(url)
      }

      setUploadProgress('Saving to database...')

      const slug = slugify(`${lotCode.trim()}-${name.trim()}`)

      const { error } = await supabase.from('products').insert({
        lot_code: lotCode.trim().toUpperCase(),
        name: name.trim(),
        slug,
        features: features.split(',').map(f => f.trim()).filter(Boolean),
        colour_mix: colourMix.trim() || null,
        pack_size: packSize ? parseInt(packSize) : null,
        total_lot_size: totalLot,
        models: parsedModels,
        image_urls: imageUrls,
        video_url: videoUrl,
        new_arrival: newArrival,
        featured,
        sold_out: false,
      })

      if (error) {
        if (error.code === '23505') throw new Error(`Lot code ${lotCode.toUpperCase()} already exists`)
        throw error
      }

      toast.success(`${name} published to catalog!`)
      // Reset form
      setStep(1); setLotCode(''); setName(''); setFeatures(''); setColourMix('')
      setPackSize(''); setMediaFiles([]); setPasteText(''); setParsedModels({})
      setNewArrival(true); setFeatured(false)
      onSuccess?.()
    } catch (err: any) {
      toast.error(err.message ?? 'Upload failed — please try again')
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Step tabs */}
      <div className="flex rounded-xl overflow-hidden border border-bnb-sand">
        {['Basics', 'Models', 'Publish'].map((s, i) => (
          <button key={i} onClick={() => setStep((i + 1) as 1 | 2 | 3)}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              step === i+1 ? 'bg-bnb-dark text-bnb-gold'
              : step > i+1 ? 'bg-bnb-gold/10 text-bnb-gold'
              : 'bg-white text-bnb-muted'}`}>
            {step > i+1 ? '✓ ' : `${i+1}. `}{s}
          </button>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-3 animate-fade-up">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-bnb-muted font-semibold block mb-1">Lot Code *</label>
              <input value={lotCode} onChange={e => setLotCode(e.target.value)} placeholder="B80"
                className="w-full px-3 py-2.5 text-sm bg-white border border-bnb-sand rounded-xl focus:border-bnb-gold outline-none uppercase" />
            </div>
            <div>
              <label className="text-xs text-bnb-muted font-semibold block mb-1">Pack Size</label>
              <input value={packSize} onChange={e => setPackSize(e.target.value)} placeholder="10" type="number" min="1"
                className="w-full px-3 py-2.5 text-sm bg-white border border-bnb-sand rounded-xl focus:border-bnb-gold outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs text-bnb-muted font-semibold block mb-1">Product Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dulero Magsafe PC Case"
              className="w-full px-3 py-2.5 text-sm bg-white border border-bnb-sand rounded-xl focus:border-bnb-gold outline-none" />
          </div>

          <div>
            <label className="text-xs text-bnb-muted font-semibold block mb-1">
              Features <span className="font-normal text-bnb-gold">comma separated</span>
            </label>
            <input value={features} onChange={e => setFeatures(e.target.value)}
              placeholder="Magsafe Working, Hard PC, Anti-Scratch, 4 Colours"
              className="w-full px-3 py-2.5 text-sm bg-white border border-bnb-sand rounded-xl focus:border-bnb-gold outline-none" />
          </div>

          <div>
            <label className="text-xs text-bnb-muted font-semibold block mb-1">Colour Mix</label>
            <input value={colourMix} onChange={e => setColourMix(e.target.value)}
              placeholder="4 Clear, 2 White, 2 Blue, 2 Desert = 10pcs"
              className="w-full px-3 py-2.5 text-sm bg-white border border-bnb-sand rounded-xl focus:border-bnb-gold outline-none" />
          </div>

          <div>
            <label className="text-xs text-bnb-muted font-semibold block mb-2">
              Photos + Video * <span className="font-normal text-bnb-gold">up to 8 files · stored on Cloudinary CDN</span>
            </label>
            <div {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-bnb-gold bg-bnb-gold/5' : 'border-bnb-sand bg-white'}`}>
              <input {...getInputProps()} />
              <Upload size={20} className="text-bnb-gold mx-auto mb-2" />
              <p className="text-xs text-bnb-muted">
                {isDragActive ? 'Drop files here...' : 'Drag & drop photos + video, or tap to select'}
              </p>
              <p className="text-[10px] text-bnb-gold mt-1">JPG · PNG · WebP · MP4 · MOV</p>
            </div>

            {mediaFiles.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {mediaFiles.map((mf, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-bnb-sand">
                    {mf.type === 'video'
                      ? <div className="w-full h-full bg-bnb-dark flex items-center justify-center"><Play size={16} className="text-bnb-gold" /></div>
                      : <img src={mf.preview} alt="" className="w-full h-full object-cover" />
                    }
                    <button onClick={() => setMediaFiles(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <X size={8} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setStep(2)} disabled={!lotCode || !name || mediaFiles.length === 0}
            className="w-full py-3 bg-bnb-dark text-bnb-gold text-sm font-semibold rounded-2xl active:scale-95 transition-transform disabled:opacity-40">
            Next: Add Phone Models →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-up">
          <div className="bg-bnb-gold/10 border border-bnb-gold/30 rounded-xl p-3 text-xs text-bnb-brown leading-relaxed">
            <strong>Smart paste</strong> — copy your WhatsApp broadcast model list and paste below. The system auto-detects all brands and models instantly.
          </div>

          <div>
            <label className="text-xs text-bnb-muted font-semibold block mb-2">Paste from WhatsApp broadcast</label>
            <div className="bg-white border border-bnb-sand rounded-2xl overflow-hidden">
              <textarea value={pasteText} onChange={e => setPasteText(e.target.value)} rows={8}
                placeholder={"👉🏻Samsung :\nA06. 10\nA07. 10\n...\n👉🏻iPhone :\n11-10\n12-10"}
                className="w-full px-3 py-2.5 text-xs font-mono text-bnb-dark bg-white outline-none resize-none" />
              <button onClick={handleParse}
                className="w-full py-2.5 bg-bnb-dark text-bnb-gold text-xs font-semibold border-t border-bnb-sand">
                Auto-detect brands and models →
              </button>
            </div>
          </div>

          {Object.keys(parsedModels).length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">
                  {totalModels} models · {Object.keys(parsedModels).length} brands detected
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(parsedModels).map(([brand, models]) => (
                  <div key={brand}>
                    <p className="text-[10px] font-bold text-bnb-gold uppercase mb-1">{brand}</p>
                    <div className="flex flex-wrap gap-1">
                      {models.map(m => (
                        <span key={m} className="px-2 py-0.5 bg-white border border-bnb-sand rounded-lg text-[10px] text-bnb-dark flex items-center gap-1">
                          {m}
                          <button onClick={() => removeModel(brand, m)} className="text-red-400 ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-bnb-muted font-semibold block mb-2">Add unlisted model</label>
            <div className="flex gap-2">
              <input value={customBrand} onChange={e => setCustomBrand(e.target.value)} placeholder="Brand"
                className="w-24 px-2.5 py-2 text-xs bg-white border border-bnb-sand rounded-xl focus:border-bnb-gold outline-none" />
              <input value={customModel} onChange={e => setCustomModel(e.target.value)} placeholder="Model name"
                className="flex-1 px-2.5 py-2 text-xs bg-white border border-bnb-sand rounded-xl focus:border-bnb-gold outline-none"
                onKeyDown={e => e.key === 'Enter' && addCustomModel()} />
              <button onClick={addCustomModel}
                className="px-3 py-2 bg-bnb-gold text-white text-xs font-semibold rounded-xl active:scale-95 transition-transform">
                Add
              </button>
            </div>
          </div>

          <button onClick={() => setStep(3)}
            className="w-full py-3 bg-bnb-dark text-bnb-gold text-sm font-semibold rounded-2xl active:scale-95 transition-transform">
            Next: Review and Publish →
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-up">
          <div className="bg-white border border-bnb-sand rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-bnb-muted uppercase tracking-wider mb-3">Summary</p>
            {[
              ['Lot Code', lotCode.toUpperCase()],
              ['Name', name],
              ['Media', `${mediaFiles.filter(m => m.type === 'image').length} photos${mediaFiles.find(m => m.type === 'video') ? ' + 1 video' : ''}`],
              ['Features', features || '—'],
              ['Colour Mix', colourMix || '—'],
              ['Models', totalModels > 0 ? `${totalModels} models · ${Object.keys(parsedModels).length} brands` : '—'],
              ['Lot Total', totalLot ? `${totalLot.toLocaleString('en-IN')} pcs` : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-bnb-cream pb-1.5 last:border-0 text-xs">
                <span className="text-bnb-muted">{k}</span>
                <span className="text-bnb-dark font-medium text-right max-w-[200px]">{v}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Arrival', value: newArrival, set: setNewArrival },
              { label: 'Featured', value: featured, set: setFeatured },
            ].map(({ label, value, set }) => (
              <button key={label} onClick={() => set(!value)}
                className={`py-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                  value ? 'bg-bnb-dark border-bnb-dark text-bnb-gold' : 'bg-white border-bnb-sand text-bnb-muted'}`}>
                {value ? '✓ ' : ''}{label}
              </button>
            ))}
          </div>

          {uploadProgress && (
            <div className="bg-bnb-gold/10 border border-bnb-gold/30 rounded-xl p-3 text-xs text-bnb-brown text-center">
              <div className="w-4 h-4 border-2 border-bnb-gold/30 border-t-bnb-gold rounded-full animate-spin mx-auto mb-1" />
              {uploadProgress}
            </div>
          )}

          <button onClick={handlePublish} disabled={uploading}
            className="w-full py-4 bg-bnb-gold text-white text-sm font-bold rounded-2xl active:scale-95 transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
            {uploading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading...</>
              : 'Publish to Catalog'
            }
          </button>
        </div>
      )}
    </div>
  )
}
