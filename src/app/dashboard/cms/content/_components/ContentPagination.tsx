"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface IContentPaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function ContentPagination({
  page,
  totalPages,
  limit,
  total,
  onPageChange,
}: IContentPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="text-sm text-gray-500">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
        {total} results
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
