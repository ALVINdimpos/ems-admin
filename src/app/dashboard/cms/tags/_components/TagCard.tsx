"use client";

import { Tags, MoreVertical, Edit, Trash2, Plus } from "lucide-react";

import { TagBadge, ActiveBadge } from "@/features/cms/components";
import type { IContentTag } from "@/features/cms/types";

interface ITagCardProps {
  tag: IContentTag;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TagCard({
  tag,
  isMenuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
}: ITagCardProps) {
  return (
    <div className="group relative p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all">
      {/* Tag Color Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{ backgroundColor: tag.color }}
      />

      {/* Action Menu */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle();
          }}
          className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-lg transition-all"
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>

        {isMenuOpen && (
          <div
            className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onEdit}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Tag Content */}
      <div className="mt-2">
        <TagBadge name={tag.name} color={tag.color} />
        <div className="mt-3 space-y-1">
          <p className="text-xs text-gray-500">
            <code className="px-1 py-0.5 bg-gray-100 rounded">{tag.slug}</code>
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {tag._count?.contents ?? 0} content(s)
            </span>
            <ActiveBadge isActive={tag.isActive} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TagGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse p-4 border border-gray-200 rounded-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-6 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

interface ITagEmptyStateProps {
  hasFilters: boolean;
  onCreateClick: () => void;
}

export function TagEmptyState({
  hasFilters,
  onCreateClick,
}: ITagEmptyStateProps) {
  return (
    <div className="text-center py-12 text-gray-500">
      <Tags className="h-12 w-12 mx-auto mb-2 opacity-50" />
      <p className="text-lg font-medium">No tags found</p>
      <p className="text-sm mt-1">
        {hasFilters
          ? "Try adjusting your search or filters"
          : "Create your first tag to get started"}
      </p>
      {!hasFilters && (
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Tag
        </button>
      )}
    </div>
  );
}
