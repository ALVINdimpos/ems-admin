"use client";

import { Trash2, RefreshCw, AlertTriangle } from "lucide-react";

import type { IMarketingContent } from "@/features/cms/types";

interface IContentDeleteDialogProps {
  content: IMarketingContent;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function ContentDeleteDialog({
  content,
  onConfirm,
  onCancel,
  isDeleting = false,
}: IContentDeleteDialogProps) {
  return (
    <div className="space-y-4">
      {/* Icon & Title */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600 flex-shrink-0">
          <Trash2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Content
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete &quot;{content.title}&quot;? This
            action cannot be undone.
          </p>
        </div>
      </div>

      {/* Content summary */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {content.title}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
            {content.type}
          </span>
          <span>{content.isActive ? "Active" : "Inactive"}</span>
          {content.category && <span>Category: {content.category.name}</span>}
        </div>
      </div>

      {/* Warning */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-yellow-800">
          This will permanently remove this content and all its associated
          media, tags, and metadata.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
        >
          {isDeleting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Content
            </>
          )}
        </button>
      </div>
    </div>
  );
}
