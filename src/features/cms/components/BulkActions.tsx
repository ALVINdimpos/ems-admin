"use client";

import {
  MoreHorizontal,
  Trash2,
  Archive,
  CheckCircle,
  XCircle,
  Send,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";

import type { BulkAction } from "../types";

import { cn } from "@/lib/utils";

interface IBulkActionsProps {
  selectedCount: number;
  onAction: (action: BulkAction) => Promise<void>;
  availableActions?: BulkAction[];
  disabled?: boolean;
  className?: string;
}

const ACTION_CONFIG: Record<
  BulkAction,
  {
    label: string;
    icon: React.ReactNode;
    variant: "default" | "danger" | "success" | "warning";
    confirmMessage: string;
  }
> = {
  publish: {
    label: "Publish",
    icon: <Send className="h-4 w-4" />,
    variant: "success",
    confirmMessage: "Are you sure you want to publish the selected items?",
  },
  archive: {
    label: "Archive",
    icon: <Archive className="h-4 w-4" />,
    variant: "warning",
    confirmMessage: "Are you sure you want to archive the selected items?",
  },
  delete: {
    label: "Delete",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "danger",
    confirmMessage:
      "Are you sure you want to delete the selected items? This action cannot be undone.",
  },
  activate: {
    label: "Activate",
    icon: <CheckCircle className="h-4 w-4" />,
    variant: "success",
    confirmMessage: "Are you sure you want to activate the selected items?",
  },
  deactivate: {
    label: "Deactivate",
    icon: <XCircle className="h-4 w-4" />,
    variant: "warning",
    confirmMessage: "Are you sure you want to deactivate the selected items?",
  },
};

const VARIANT_STYLES = {
  default: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  danger: "bg-red-100 text-red-700 hover:bg-red-200",
  success: "bg-green-100 text-green-700 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
};

export default function BulkActions({
  selectedCount,
  onAction,
  availableActions = ["publish", "archive", "delete", "activate", "deactivate"],
  disabled = false,
  className,
}: IBulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<BulkAction | null>(null);

  const handleAction = async (action: BulkAction) => {
    const config = ACTION_CONFIG[action];

    if (!confirm(config.confirmMessage)) {
      return;
    }

    setLoadingAction(action);
    try {
      await onAction(action);
    } finally {
      setLoadingAction(null);
      setIsOpen(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg",
        className
      )}
    >
      {/* Selected Count */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-6 w-6 bg-blue-600 text-white text-xs font-bold rounded-full">
          {selectedCount}
        </div>
        <span className="text-sm font-medium text-blue-800">
          item{selectedCount !== 1 ? "s" : ""} selected
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-blue-300" />

      {/* Quick Action Buttons (for common actions) */}
      <div className="flex items-center gap-2">
        {availableActions.slice(0, 3).map((action) => {
          const config = ACTION_CONFIG[action];
          const isLoading = loadingAction === action;

          return (
            <button
              key={action}
              type="button"
              onClick={() => handleAction(action)}
              disabled={disabled || loadingAction !== null}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                VARIANT_STYLES[config.variant],
                (disabled || loadingAction !== null) &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                config.icon
              )}
              {config.label}
            </button>
          );
        })}

        {/* More Actions Dropdown */}
        {availableActions.length > 3 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              disabled={disabled || loadingAction !== null}
              className={cn(
                "flex items-center gap-1 px-2 py-1.5 text-sm font-medium rounded-md transition-colors",
                "bg-gray-100 text-gray-700 hover:bg-gray-200",
                (disabled || loadingAction !== null) &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {availableActions.slice(3).map((action) => {
                  const config = ACTION_CONFIG[action];
                  const isLoading = loadingAction === action;

                  return (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleAction(action)}
                      disabled={loadingAction !== null}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors",
                        loadingAction !== null &&
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        config.icon
                      )}
                      {config.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
