import { ProductCard } from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  waNumber: string
  loading?: boolean
}

export default function ProductGrid({ products, waNumber, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 px-3 pb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fadeIn">
        <div className="text-4xl mb-4 opacity-30">📦</div>
        <p className="text-bnb-muted text-sm">No products found</p>
        <p className="text-bnb-muted/60 text-xs mt-1">Check back soon for new arrivals</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-3 pb-6">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          waNumber={waNumber}
          animationDelay={i * 0.055}
        />
      ))}
    </div>
  )
}
