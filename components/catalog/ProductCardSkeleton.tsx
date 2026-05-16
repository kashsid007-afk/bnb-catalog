export default function ProductCardSkeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="bg-white rounded-3xl border border-bnb-sand overflow-hidden animate-fadeUp" style={style}>
      <div className="aspect-square skeleton" />
      <div className="p-3">
        <div className="skeleton h-2 w-12 rounded mb-2" />
        <div className="skeleton h-3 w-full rounded mb-1" />
        <div className="skeleton h-3 w-3/4 rounded mb-3" />
        <div className="skeleton h-2 w-20 rounded" />
      </div>
      <div className="px-3 pb-3">
        <div className="skeleton h-8 rounded-xl" />
      </div>
    </div>
  )
}
