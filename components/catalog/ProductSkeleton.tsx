export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-bnb-sand overflow-hidden">
      <div className="aspect-square shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-2 w-12 rounded shimmer" />
        <div className="h-3 w-full rounded shimmer" />
        <div className="h-3 w-3/4 rounded shimmer" />
        <div className="flex justify-between mt-2">
          <div className="h-3 w-16 rounded shimmer" />
          <div className="h-7 w-9 rounded-xl shimmer" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-24">
      {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  )
}
