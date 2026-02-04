"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export function ContentEmptyState() {
  return (
    <tr>
      <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
        <p className="text-lg font-medium">No content found</p>
        <p className="text-sm mt-1">
          Try adjusting your filters or create new content
        </p>
        <Link
          href="/dashboard/cms/content/new"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Content
        </Link>
      </td>
    </tr>
  );
}
