'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface Props {
  imageUrls: string[]
  videoUrl?: string | null
  productName: string
}

export function MediaGallery({ imageUrls, videoUrl, productName }: Props) {
  const [active, setActive] = useState(0)
  const [isVideo, setIsVideo] = useState(false)

  const allMedia = [...imageUrls, ...(videoUrl ? ['__video__'] : [])]

  function selectMedia(idx: number) {
    if (allMedia[idx] === '__video__') {
      setIsVideo(true)
    } else {
      setIsVideo(false)
    }
    setActive(idx)
  }

  return (
    <div>
      {/* Main media */}
      <div className="relative aspect-square bg-bnb-cream overflow-hidden">
        {isVideo && videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            autoPlay muted loop playsInline controls
          />
        ) : imageUrls[active] ? (
          <Image
            src={imageUrls[active]}
            alt={`${productName} photo ${active + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="100vw"
            priority={active === 0}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bnb-cream via-white to-bnb-gold-light/50">
            <div className="text-center">
              <div className="text-7xl">📱</div>
              <div className="mt-3 text-[10px] font-bold tracking-[0.24em] text-bnb-gold">MOBILE COVER LOT</div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 p-3 bg-white border-b border-bnb-sand overflow-x-auto no-scrollbar">
          {allMedia.map((src, i) => {
            const isVid = src === '__video__'
            return (
              <button
                key={i}
                onClick={() => selectMedia(i)}
                className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 btn-spring ${
                  active === i ? 'border-bnb-gold' : 'border-transparent'
                }`}
                aria-label={isVid ? 'Video' : `Photo ${i + 1}`}
              >
                {isVid ? (
                  <div className="w-full h-full bg-bnb-dark flex items-center justify-center">
                    <Play size={18} className="text-bnb-gold" />
                  </div>
                ) : (
                  <div className="relative w-full h-full bg-bnb-cream">
                    <Image src={src} alt="" fill className="object-cover" sizes="56px" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
