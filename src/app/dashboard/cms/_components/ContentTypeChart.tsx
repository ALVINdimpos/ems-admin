"use client";

import { BarChart3 } from "lucide-react";

import { TypeBadge } from "@/features/cms/components";
import type { ContentType } from "@/features/cms/types";

interface IContentTypeChartProps {
  data: Record<ContentType, number>;
  loading?: boolean;
}

export function ContentTypeChart({ data, loading }: IContentTypeChartProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  const types = Object.entries(data) as [ContentType, number][];

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
            <div className="h-6 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <BarChart3 className="h-12 w-12 mb-2 opacity-50" />
        <p>No content yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {types
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => {
          const percentage = Math.round((count / total) * 100);
          return (
            <div key={type}>
              <div className="flex items-center justify-between mb-1">
                <TypeBadge type={type} />
                <span className="text-sm font-medium text-gray-600">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
