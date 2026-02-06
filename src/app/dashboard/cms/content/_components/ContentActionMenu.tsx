"use client";

import { Eye, Edit, Send, Archive, Copy, Trash2 } from "lucide-react";
import Link from "next/link";

interface IContentActionMenuProps {
  contentId: string;
  isActive: boolean;
  onActivate: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContentActionMenu({
  contentId,
  isActive,
  onActivate,
  onArchive,
  onDelete,
}: IContentActionMenuProps) {
  return (
    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
      <Link
        href={`/dashboard/cms/content/${contentId}`}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Eye className="h-4 w-4" />
        View
      </Link>
      <Link
        href={`/dashboard/cms/content/${contentId}/edit`}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Link>
      {!isActive && (
        <button
          onClick={() => onActivate(contentId)}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Send className="h-4 w-4" />
          Activate
        </button>
      )}
      {isActive && (
        <button
          onClick={() => onArchive(contentId)}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Archive className="h-4 w-4" />
          Deactivate
        </button>
      )}
      <button
        onClick={() => {}}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Copy className="h-4 w-4" />
        Duplicate
      </button>
      <hr className="my-1 border-gray-200" />
      <button
        onClick={() => onDelete(contentId)}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}
