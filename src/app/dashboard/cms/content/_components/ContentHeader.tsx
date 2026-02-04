"use client";

import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

interface IContentHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function ContentHeader({ onRefresh, isLoading }: IContentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketing Content</h1>
        <p className="text-gray-500 mt-1">
          Manage all your marketing content in one place
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
        <Link
          href="/dashboard/cms/content/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          Create Content
        </Link>
      </div>
    </div>
  );
}
