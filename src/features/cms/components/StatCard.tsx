"use client";

import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

interface IStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  change?: {
    value: number;
    label?: string;
  };
  loading?: boolean;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100",
  change,
  loading = false,
  className,
}: IStatCardProps) {
  const isPositiveChange = change && change.value >= 0;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className={cn(
            "flex items-center justify-center h-12 w-12 rounded-lg",
            iconBgColor
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>

        {/* Change Indicator */}
        {change && !loading && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              isPositiveChange
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {isPositiveChange ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            <span>{Math.abs(change.value)}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
            {change?.label && (
              <p className="text-xs text-gray-400 mt-1">{change.label}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
