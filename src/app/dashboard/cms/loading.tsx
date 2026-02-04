import { FileText, FolderTree, Tags, BarChart3 } from "lucide-react";

export default function CmsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-lg" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[FileText, BarChart3, FolderTree, Tags].map((Icon, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon className="h-6 w-6 text-gray-300" />
              </div>
              <div className="flex-1">
                <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-6 w-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j}>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-2 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
