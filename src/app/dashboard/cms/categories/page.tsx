"use client";

import React, { useState, useCallback, useEffect } from "react";

import {
  CategoryForm,
  CategoryDeleteDialog,
  CategoryTableRow,
  CategoryTableSkeleton,
  CategoryEmptyState,
  CategoryHeader,
  CategorySearchFilter,
} from "./_components";

import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { cmsApi } from "@/features/cms/api";
import type {
  IContentCategory,
  ICreateContentCategory,
} from "@/features/cms/types";

export default function CategoriesPage() {
  const toast = useToast();

  // State
  const [categories, setCategories] = useState<IContentCategory[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<IContentCategory | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<IContentCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState<boolean | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await cmsApi.categories.getAll();
      if (response.success && response.data) {
        const items = Array.isArray(response.data) ? response.data : [];
        setCategories(items);
      } else {
        toast.error("Error", response.error || "Failed to load categories");
      }
    } catch (error) {
      toast.error(
        "Error",
        error instanceof Error ? error.message : "Failed to load categories"
      );
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filter categories
  const filteredCategories = categories.filter((category) => {
    const isMatchingSearch =
      !searchValue ||
      category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchValue.toLowerCase());

    const isMatchingActive =
      isFilterActive === null || category.isActive === isFilterActive;

    return isMatchingSearch && isMatchingActive;
  });

  // Handle create/update
  const handleFormSubmit = useCallback(
    async (data: Partial<IContentCategory>) => {
      setIsSubmitting(true);

      try {
        if (editingCategory) {
          // Update existing
          const response = await cmsApi.categories.update(
            editingCategory.id,
            data
          );
          if (response.success && response.data) {
            setCategories((prev) =>
              prev.map((c) => (c.id === response.data!.id ? response.data! : c))
            );
            toast.success(
              "Category Updated",
              `"${response.data.name}" has been updated successfully`
            );
          } else {
            toast.error("Error", response.error || "Failed to update category");
          }
        } else {
          // Create new
          const response = await cmsApi.categories.create(
            data as ICreateContentCategory
          );
          if (response.success && response.data) {
            setCategories((prev) => [...prev, response.data!]);
            toast.success(
              "Category Created",
              `"${response.data.name}" has been created successfully`
            );
          } else {
            toast.error("Error", response.error || "Failed to create category");
          }
        }

        setIsFormModalOpen(false);
        setEditingCategory(null);
      } catch (error) {
        toast.error(
          "Error",
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingCategory, toast]
  );

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!deletingCategory) return;

    setIsSubmitting(true);

    try {
      const response = await cmsApi.categories.delete(deletingCategory.id);
      if (response.success) {
        setCategories((prev) =>
          prev.filter((c) => c.id !== deletingCategory.id)
        );
        toast.success(
          "Category Deleted",
          `"${deletingCategory.name}" has been deleted successfully`
        );
      } else {
        toast.error(
          "Delete Failed",
          response.error || "Failed to delete category"
        );
      }

      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    } catch (error) {
      toast.error(
        "Error",
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [deletingCategory, toast]);

  // Open create modal
  const openCreateModal = useCallback(() => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  }, []);

  // Open edit modal
  const openEditModal = useCallback((category: IContentCategory) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
    setActionMenuOpen(null);
  }, []);

  // Open delete modal
  const openDeleteModal = useCallback((category: IContentCategory) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
    setActionMenuOpen(null);
  }, []);

  // Toggle action menu
  const handleMenuToggle = useCallback((categoryId: string) => {
    setActionMenuOpen((prev) => (prev === categoryId ? null : categoryId));
  }, []);

  // Close outside click for action menu
  useEffect(() => {
    const handleClickOutside = () => setActionMenuOpen(null);
    if (actionMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [actionMenuOpen]);

  const hasFilters = !!searchValue || isFilterActive !== null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <CategoryHeader
        onRefresh={loadCategories}
        onCreateClick={openCreateModal}
        isLoading={isLoading}
      />

      {/* Search and Filters */}
      <CategorySearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeFilter={isFilterActive}
        onActiveFilterChange={setIsFilterActive}
      />

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contents
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
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
              {isLoading ? (
                <CategoryTableSkeleton />
              ) : filteredCategories.length === 0 ? (
                <CategoryEmptyState
                  hasFilters={hasFilters}
                  onCreateClick={openCreateModal}
                />
              ) : (
                filteredCategories.map((category) => (
                  <CategoryTableRow
                    key={category.id}
                    category={category}
                    isMenuOpen={actionMenuOpen === category.id}
                    onMenuToggle={() => handleMenuToggle(category.id)}
                    onEdit={() => openEditModal(category)}
                    onDelete={() => openDeleteModal(category)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        {!isLoading && filteredCategories.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
            Showing {filteredCategories.length} of {categories.length}{" "}
            categories
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsFormModalOpen(false);
            setEditingCategory(null);
          }
        }}
        title={editingCategory ? "Edit Category" : "Create Category"}
        size="md"
        backdropClassName="bg-black/60 backdrop-blur-sm"
      >
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setEditingCategory(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsDeleteModalOpen(false);
            setDeletingCategory(null);
          }
        }}
        title=""
        size="sm"
        showCloseButton={false}
        backdropClassName="bg-black/60 backdrop-blur-sm"
      >
        {deletingCategory && (
          <CategoryDeleteDialog
            category={deletingCategory}
            onConfirm={handleDelete}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setDeletingCategory(null);
            }}
            isDeleting={isSubmitting}
          />
        )}
      </Modal>
    </div>
  );
}
