"use client";

import { Filter, Search } from "lucide-react";

interface IAnnouncementsFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: "newest" | "oldest";
  onSortChange: (value: "newest" | "oldest") => void;
  totalCount: number;
}

export function AnnouncementsFilter({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  totalCount,
}: IAnnouncementsFilterProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={sortOrder}
            onChange={(e) =>
              onSortChange(e.target.value as "newest" | "oldest")
            }
            className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Count */}
          <span className="text-sm text-slate-500">
            {totalCount} announcement{totalCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
