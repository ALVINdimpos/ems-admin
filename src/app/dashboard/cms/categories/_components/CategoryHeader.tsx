"use client";

import { Plus, RefreshCw } from "lucide-react";

interface ICategoryHeaderProps {
  onRefresh: () => void;
  onCreateClick: () => void;
  isLoading: boolean;
}

export function CategoryHeader({
  onRefresh,
  onCreateClick,
  isLoading,
}: ICategoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Categories</h1>
        <p className="text-gray-500 mt-1">
          Organize your content with categories
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>
    </div>
  );
}
