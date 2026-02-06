"use client";

import React, { useState, useCallback } from "react";

import {
  ContentHeader,
  ContentTableSkeleton,
  ContentEmptyState,
  ContentTableRow,
  ContentPagination,
  ContentDeleteDialog,
  ErrorAlert,
} from "./_components";

import Modal from "@/components/ui/Modal";
import {
  SearchFilter,
  BulkActions,
  type IFilterField,
} from "@/features/cms/components";
import { useContent, useSelection, useCategories } from "@/features/cms/hooks";
import type {
  BulkAction,
  IContentFilters,
  IMarketingContent,
} from "@/features/cms/types";

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

// Status options for filter (maps to backend `isActive` boolean)
const STATUS_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
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
    activate,
    archive,
  } = useContent();

  const { categories } = useCategories();

  const selection = useSelection(contents);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingContent, setDeletingContent] =
    useState<IMarketingContent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      key: "isActive",
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
      key: "dateRange",
      label: "Date Range",
      type: "daterange",
    },
  ];

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
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
      const validValue = value as unknown;
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

  // Open delete confirmation modal
  const handleDeleteClick = useCallback(
    (id: string) => {
      const content = contents.find((c) => c.id === id);
      if (content) {
        setDeletingContent(content);
        setIsDeleteModalOpen(true);
        setActionMenuOpen(null);
      }
    },
    [contents]
  );

  // Confirm delete
  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingContent) return;
    setIsDeleting(true);
    try {
      await remove(deletingContent.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeletingContent(null);
    }
  }, [deletingContent, remove]);

  // Handle activate
  const handleActivate = useCallback(
    async (id: string) => {
      await activate(id);
      setActionMenuOpen(null);
    },
    [activate]
  );

  // Handle archive
  const handleArchive = useCallback(
    async (id: string) => {
      await archive(id);
      setActionMenuOpen(null);
    },
    [archive]
  );

  // Toggle action menu
  const handleMenuToggle = useCallback((contentId: string) => {
    setActionMenuOpen((prev) => (prev === contentId ? null : contentId));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ContentHeader onRefresh={refresh} isLoading={isLoading} />

      {/* Error Alert */}
      {error && <ErrorAlert error={error} />}

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
                <ContentTableSkeleton />
              ) : contents.length === 0 ? (
                <ContentEmptyState />
              ) : (
                contents.map((content) => (
                  <ContentTableRow
                    key={content.id}
                    content={content}
                    isSelected={selection.isSelected(content.id)}
                    isMenuOpen={actionMenuOpen === content.id}
                    onSelect={() => selection.toggle(content.id)}
                    onMenuToggle={() => handleMenuToggle(content.id)}
                    onActivate={handleActivate}
                    onArchive={handleArchive}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <ContentPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          total={pagination.total}
          onPageChange={setPage}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setDeletingContent(null);
          }
        }}
        title=""
        size="sm"
        showCloseButton={false}
        backdropClassName="bg-black/60 backdrop-blur-sm"
      >
        {deletingContent && (
          <ContentDeleteDialog
            content={deletingContent}
            onConfirm={handleDeleteConfirm}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setDeletingContent(null);
            }}
            isDeleting={isDeleting}
          />
        )}
      </Modal>
    </div>
  );
}
