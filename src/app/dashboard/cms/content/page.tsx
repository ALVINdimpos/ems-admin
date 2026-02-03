"use client";

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Send,
  Archive,
  Copy,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback } from "react";

import {
  SearchFilter,
  BulkActions,
  StatusBadge,
  TypeBadge,
  TagBadge,
  type IFilterField,
} from "@/features/cms/components";
import { useContent, useSelection, useCategories } from "@/features/cms/hooks";
import type { BulkAction, IContentFilters } from "@/features/cms/types";

// Content type options for filter
const CONTENT_TYPE_OPTIONS = [
  { label: "Banner", value: "BANNER" },
  { label: "Hero", value: "HERO" },
  { label: "Promotion", value: "PROMOTION" },
  { label: "Announcement", value: "ANNOUNCEMENT" },
  { label: "Blog", value: "BLOG" },
  { label: "Testimonial", value: "TESTIMONIAL" },
  { label: "FAQ", value: "FAQ" },
  { label: "Feature", value: "FEATURE" },
];

// Status options for filter
const STATUS_OPTIONS = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
  { label: "Scheduled", value: "SCHEDULED" },
];

export default function ContentListPage() {
  const {
    contents,
    isLoading,
    error,
    pagination,
    filters,
    setFilters,
    setPage,
    refresh,
    remove,
    bulkAction,
    publish,
    archive,
  } = useContent();

  const { categories } = useCategories();

  const selection = useSelection(contents);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Build filter fields
  const filterFields: IFilterField[] = [
    {
      key: "type",
      label: "Type",
      type: "select",
      options: CONTENT_TYPE_OPTIONS,
      placeholder: "All types",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: STATUS_OPTIONS,
      placeholder: "All statuses",
    },
    {
      key: "categoryId",
      label: "Category",
      type: "select",
      options: categories.map((c) => ({ label: c.name, value: c.id })),
      placeholder: "All categories",
    },
    {
      key: "isActive",
      label: "Active",
      type: "boolean",
    },
    {
      key: "dateRange",
      label: "Date Range",
      type: "daterange",
    },
  ];

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      // Debounce would be ideal here, using a simple approach
      const timeoutId = setTimeout(() => {
        setFilters({ ...filters, search: value || undefined });
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    [filters, setFilters]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key: string, value: unknown) => {
      const validValue = value as any;
      setFilters({ ...filters, [key]: validValue } as IContentFilters);
    },
    [filters, setFilters]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchValue("");
    setFilters({});
  }, [setFilters]);

  // Handle bulk action
  const handleBulkAction = useCallback(
    async (action: BulkAction) => {
      const ids = Array.from(selection.selectedIds);
      const isSuccess = await bulkAction(action, ids);
      if (isSuccess) {
        selection.clear();
      }
    },
    [selection, bulkAction]
  );

  // Handle single item delete
  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm("Are you sure you want to delete this content?")) {
        await remove(id);
      }
    },
    [remove]
  );

  // Handle publish
  const handlePublish = useCallback(
    async (id: string) => {
      await publish(id);
      setActionMenuOpen(null);
    },
    [publish]
  );

  // Handle archive
  const handleArchive = useCallback(
    async (id: string) => {
      await archive(id);
      setActionMenuOpen(null);
    },
    [archive]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Marketing Content
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all your marketing content in one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <Link
            href="/dashboard/cms/content/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Create Content
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by title, content..."
        filters={filterFields}
        filterValues={filters as Record<string, unknown>}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Bulk Actions Bar */}
      {selection.selectedIds.size > 0 && (
        <BulkActions
          selectedCount={selection.selectedIds.size}
          onAction={handleBulkAction}
          availableActions={["publish", "archive", "delete"]}
        />
      )}

      {/* Content Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selection.isAllSelected}
                    onChange={selection.toggleAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && contents.length === 0 ? (
                // isLoading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 bg-gray-200 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-200 rounded" />
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-12 bg-gray-200 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : contents.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <p className="text-lg font-medium">No content found</p>
                    <p className="text-sm mt-1">
                      Try adjusting your filters or create new content
                    </p>
                    <Link
                      href="/dashboard/cms/content/new"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Create Content
                    </Link>
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr
                    key={content.id}
                    className={`hover:bg-gray-50 ${
                      selection.isSelected(content.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selection.isSelected(content.id)}
                        onChange={() => selection.toggle(content.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {content.featuredImage ? (
                          <Image
                            src={content.featuredImage}
                            alt={content.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            No img
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/dashboard/cms/content/${content.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {content.title}
                          </Link>
                          {content.summary && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {content.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <TypeBadge type={content.type} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={content.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {content.category?.name || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {content.tags?.slice(0, 2).map((tag) => (
                          <TagBadge
                            key={tag.id}
                            name={tag.name}
                            color={tag.color}
                          />
                        ))}
                        {content.tags && content.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{content.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(content.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setActionMenuOpen(
                              actionMenuOpen === content.id ? null : content.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>

                        {actionMenuOpen === content.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                            <Link
                              href={`/dashboard/cms/content/${content.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                            <Link
                              href={`/dashboard/cms/content/${content.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                            {content.status === "DRAFT" && (
                              <button
                                onClick={() => handlePublish(content.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Send className="h-4 w-4" />
                                Publish
                              </button>
                            )}
                            {content.status === "PUBLISHED" && (
                              <button
                                onClick={() => handleArchive(content.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Archive className="h-4 w-4" />
                                Archive
                              </button>
                            )}
                            <button
                              onClick={() => {}}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Copy className="h-4 w-4" />
                              Duplicate
                            </button>
                            <hr className="my-1 border-gray-200" />
                            <button
                              onClick={() => handleDelete(content.id)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
