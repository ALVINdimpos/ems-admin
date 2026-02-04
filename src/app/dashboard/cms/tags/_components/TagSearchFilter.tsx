"use client";

import { Search, X } from "lucide-react";

interface ITagSearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeFilter: boolean | null;
  onActiveFilterChange: (value: boolean | null) => void;
}

export function TagSearchFilter({
  searchValue,
  onSearchChange,
  activeFilter,
  onActiveFilterChange,
}: ITagSearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tags..."
          className="w-full h-10 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Active Filter */}
      <select
        value={activeFilter === null ? "" : activeFilter.toString()}
        onChange={(e) =>
          onActiveFilterChange(
            e.target.value === "" ? null : e.target.value === "true"
          )
        }
        className="h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  );
}
