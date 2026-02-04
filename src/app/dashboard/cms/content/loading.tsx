export default function ContentLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          <div className="h-10 w-36 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Search and Filters Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-28 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[40, 200, 80, 80, 100, 80, 100, 60].map((width, i) => (
                  <th key={i} className="px-4 py-3">
                    <div
                      className="h-4 bg-gray-200 rounded"
                      style={{ width: `${width}px` }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4">
                    <div className="h-4 w-4 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded" />
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                        <div className="h-3 w-48 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 w-12 bg-gray-200 rounded-full" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
