"use client";

import { Search, X, Filter, ChevronDown } from "lucide-react";
import React, { useState, useCallback } from "react";

import { cn } from "@/lib/utils";

export interface IFilterOption {
  label: string;
  value: string;
}

export interface IFilterField {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date" | "daterange" | "boolean";
  options?: IFilterOption[];
  placeholder?: string;
}

interface ISearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: IFilterField[];
  filterValues?: Record<string, unknown>;
  onFilterChange?: (key: string, value: unknown) => void;
  onClearFilters?: () => void;
  className?: string;
}

export default function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  filterValues = {},
  onFilterChange,
  onClearFilters,
  className,
}: ISearchFilterProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const activeFilterCount = Object.values(filterValues).filter(
    (v) =>
      v !== undefined &&
      v !== "" &&
      v !== null &&
      (!Array.isArray(v) || v.length > 0)
  ).length;

  const handleFilterChange = useCallback(
    (key: string, value: unknown) => {
      onFilterChange?.(key, value);
    },
    [onFilterChange]
  );

  const renderFilterInput = (filter: IFilterField) => {
    const value = filterValues[filter.key];

    switch (filter.type) {
      case "select":
        return (
          <select
            value={(value as string) || ""}
            onChange={(e) =>
              handleFilterChange(filter.key, e.target.value || undefined)
            }
            className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {filter.placeholder || `Select ${filter.label}`}
            </option>
            {filter.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className="relative">
            <select
              multiple
              value={(value as string[]) || []}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (opt) => opt.value
                );
                handleFilterChange(
                  filter.key,
                  selected.length > 0 ? selected : undefined
                );
              }}
              className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filter.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple
            </p>
          </div>
        );

      case "date":
        return (
          <input
            type="date"
            value={(value as string) || ""}
            onChange={(e) =>
              handleFilterChange(filter.key, e.target.value || undefined)
            }
            className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "daterange":
        const dateRange = (value as { from?: string; to?: string }) || {};
        return (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.from || ""}
              onChange={(e) =>
                handleFilterChange(filter.key, {
                  ...dateRange,
                  from: e.target.value || undefined,
                })
              }
              placeholder="From"
              className="flex-1 h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.to || ""}
              onChange={(e) =>
                handleFilterChange(filter.key, {
                  ...dateRange,
                  to: e.target.value || undefined,
                })
              }
              placeholder="To"
              className="flex-1 h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "boolean":
        return (
          <select
            value={value === true ? "true" : value === false ? "false" : ""}
            onChange={(e) => {
              const val = e.target.value;
              handleFilterChange(
                filter.key,
                val === "true" ? true : val === "false" ? false : undefined
              );
            }}
            className="w-full h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Search and Filter Toggle Row */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-10 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        {filters.length > 0 && (
          <button
            type="button"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={cn(
              "flex items-center gap-2 h-10 px-4 text-sm font-medium rounded-lg border transition-colors",
              isFiltersOpen || activeFilterCount > 0
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center h-5 w-5 text-xs bg-blue-600 text-white rounded-full">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isFiltersOpen && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* Expandable Filters Panel */}
      {isFiltersOpen && filters.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && onClearFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
