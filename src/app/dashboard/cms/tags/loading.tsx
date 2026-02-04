export default function TagsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          <div className="h-10 w-28 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Search and Filters Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Tags Grid Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg">
              <div className="h-1 w-full bg-gray-200 rounded-t-lg mb-4" />
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                <div className="h-6 w-6 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-14 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
