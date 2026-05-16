'use client'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props { images: string[]; videoUrl: string | null; productName: string }

export function ProductGallery({ images, videoUrl, productName }: Props) {
  const media = [...images, ...(videoUrl ? ['__video__'] : [])]
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const switchTo = (idx: number) => {
    if (idx === active) return
    setFading(true)
    setTimeout(() => { setActive(idx); setFading(false) }, 180)
  }

  const isVideo = media[active] === '__video__'

  return (
    <div className="bg-white">
      {/* Main media */}
      <div className="relative aspect-square bg-bnb-cream overflow-hidden">
        <div className={cn('w-full h-full transition-all duration-200', fading ? 'opacity-0 scale-[0.97]' : 'opacity-100 scale-100')}>
          {isVideo && videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              autoPlay muted loop playsInline controls
            />
          ) : media[active] && media[active] !== '__video__' ? (
            <Image
              src={media[active]}
              alt={`${productName} photo ${active + 1}`}
              fill className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
              priority={active === 0}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
          )}
        </div>

        {/* Dot indicators */}
        {media.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => switchTo(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === active ? 'w-5 bg-bnb-gold' : 'w-1.5 bg-bnb-gold/30'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 px-3 py-2.5 border-b border-bnb-sand overflow-x-auto no-scrollbar">
          {media.map((src, i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              className={cn(
                'shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200',
                i === active ? 'border-bnb-gold' : 'border-transparent'
              )}
            >
              {src === '__video__' ? (
                <div className="w-full h-full bg-bnb-dark flex items-center justify-center">
                  <Play size={16} className="text-bnb-gold" />
                </div>
              ) : (
                <div className="relative w-full h-full bg-bnb-cream">
                  <Image src={src} alt="" fill className="object-cover" sizes="56px" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
