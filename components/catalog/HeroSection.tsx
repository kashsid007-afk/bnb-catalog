'use client'

export function HeroSection({ storeName }: { storeName: string }) {
  return (
    <section className="bg-bnb-dark px-5 pt-10 pb-6 relative overflow-hidden">
      {/* Decorative rings */}
      <div className="absolute w-48 h-48 rounded-full border border-bnb-gold/10 -right-12 -top-12 pointer-events-none" />
      <div className="absolute w-24 h-24 rounded-full border border-bnb-gold/10 right-8 top-16 pointer-events-none" />

      <p className="text-3xl font-extrabold tracking-[6px] text-bnb-gold animate-fade-in">
        BNB
      </p>
      <p className="text-[9px] tracking-[3px] text-bnb-muted uppercase mt-0.5 mb-4 animate-fade-in"
         style={{ animationDelay: '0.1s' }}>
        Wholesale Collection
      </p>
      <h1 className="text-base font-semibold text-white max-w-[200px] leading-snug mb-4 animate-fade-up"
          style={{ animationDelay: '0.15s' }}>
        Premium Mobile Accessories
      </h1>

      <div className="inline-flex items-center gap-2 border border-bnb-gold/30 rounded-full px-3 py-1.5 animate-fade-up"
           style={{ animationDelay: '0.25s' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-bnb-gold animate-pulse-gold" />
        <span className="text-[10px] text-bnb-gold-light tracking-wide">New arrivals daily</span>
      </div>
    </section>
  )
}
