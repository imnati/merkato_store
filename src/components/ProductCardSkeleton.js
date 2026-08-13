export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between animate-pulse">
      <div className="bg-slate-50 rounded-xl aspect-square flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-2 mt-3 flex-1">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="mt-4 pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
        <div className="h-5 bg-gray-100 rounded w-16" />
        <div className="h-8 bg-gray-100 rounded w-16" />
      </div>
    </div>
  );
}
