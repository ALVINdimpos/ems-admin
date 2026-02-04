"use client";

import { Trash2, RefreshCw } from "lucide-react";

import type { IContentCategory } from "@/features/cms/types";

interface ICategoryDeleteDialogProps {
  category: IContentCategory;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function CategoryDeleteDialog({
  category,
  onConfirm,
  onCancel,
  isDeleting = false,
}: ICategoryDeleteDialogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600">
          <Trash2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Category
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete &quot;{category.name}&quot;? This
            action cannot be undone.
          </p>
        </div>
      </div>

      {category._count && category._count.contents > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Warning:</strong> This category has {category._count.contents}{" "}
          content item(s) associated with it. Deleting will remove the category
          assignment from these items.
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Category
            </>
          )}
        </button>
      </div>
    </div>
  );
}
