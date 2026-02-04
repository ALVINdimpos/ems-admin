"use client";

import { FolderTree, MoreVertical, Edit, Trash2, Plus } from "lucide-react";

import { ActiveBadge } from "@/features/cms/components";
import type { IContentCategory } from "@/features/cms/types";

interface ICategoryTableRowProps {
  category: IContentCategory;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryTableRow({
  category,
  isMenuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
}: ICategoryTableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 bg-purple-100 text-purple-600 rounded-lg">
            <FolderTree className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{category.name}</p>
            {category.description && (
              <p className="text-sm text-gray-500 truncate max-w-xs">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <code className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded">
          {category.slug}
        </code>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">
        {category._count?.contents ?? 0}
      </td>
      <td className="px-4 py-4">
        <ActiveBadge isActive={category.isActive} />
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {new Date(category.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-4">
        <div className="relative flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onEdit}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <hr className="my-1 border-gray-200" />
              <button
                onClick={onDelete}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export function CategoryTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
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
            <div className="h-4 w-24 bg-gray-200 rounded" />
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
    </>
  );
}

interface ICategoryEmptyStateProps {
  hasFilters: boolean;
  onCreateClick: () => void;
}

export function CategoryEmptyState({
  hasFilters,
  onCreateClick,
}: ICategoryEmptyStateProps) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
        <FolderTree className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="text-lg font-medium">No categories found</p>
        <p className="text-sm mt-1">
          {hasFilters
            ? "Try adjusting your search or filters"
            : "Create your first category to get started"}
        </p>
        {!hasFilters && (
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        )}
      </td>
    </tr>
  );
}
