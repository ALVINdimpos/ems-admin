import { FolderTree } from "lucide-react";

export default function CategoriesLoading() {
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
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Category",
                  "Slug",
                  "Contents",
                  "Status",
                  "Updated",
                  "Actions",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FolderTree className="h-5 w-5 text-gray-300" />
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                        <div className="h-3 w-48 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-8 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
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
