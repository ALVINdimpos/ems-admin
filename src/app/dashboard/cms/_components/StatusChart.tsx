"use client";

import { StatusBadge } from "@/features/cms/components";
import type { ContentStatus } from "@/features/cms/types";

interface IStatusChartProps {
  data: Record<ContentStatus, number>;
  loading?: boolean;
}

export function StatusChart({ data, loading }: IStatusChartProps) {
  const statuses = Object.entries(data) as [ContentStatus, number][];
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <div className="flex justify-center gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2" />
            <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {statuses.map(([status, count]) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div
            key={status}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
            <StatusBadge status={status} />
            <div className="text-xs text-gray-500 mt-1">{percentage}%</div>
          </div>
        );
      })}
    </div>
  );
}
