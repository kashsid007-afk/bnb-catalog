import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-bnb-cream">
      <h1 className="text-[48px] font-extrabold text-bnb-gold mb-2">404</h1>
      <p className="text-[16px] font-semibold text-bnb-dark mb-1">Page not found</p>
      <p className="text-[12px] text-bnb-muted mb-6">This lot or page doesn't exist</p>
      <Link href="/" className="bg-bnb-dark text-bnb-gold font-bold text-[13px] px-6 py-3 rounded-2xl btn-spring">
        Back to Catalog →
      </Link>
    </div>
  )
}
