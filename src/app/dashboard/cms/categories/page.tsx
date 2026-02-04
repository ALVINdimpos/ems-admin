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
import type { IContentCategory } from "@/features/cms/types";
import { categoryStore } from "@/features/cms/utils";

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

  const loadCategories = useCallback(() => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setCategories(categoryStore.getAll());
      setIsLoading(false);
    }, 300);
  }, []);

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
    (data: Partial<IContentCategory>) => {
      setIsSubmitting(true);

      // Simulate API delay
      setTimeout(() => {
        try {
          if (editingCategory) {
            // Update existing
            const updated = categoryStore.update(editingCategory.id, data);
            if (updated) {
              setCategories((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c))
              );
              toast.success(
                "Category Updated",
                `"${updated.name}" has been updated successfully`
              );
            }
          } else {
            // Create new
            const created = categoryStore.create(
              data as Omit<IContentCategory, "id" | "createdAt" | "updatedAt">
            );
            setCategories((prev) => [...prev, created]);
            toast.success(
              "Category Created",
              `"${created.name}" has been created successfully`
            );
          }

          setIsFormModalOpen(false);
          setEditingCategory(null);
        } catch {
          toast.error("Error", "An error occurred. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }, 500);
    },
    [editingCategory, toast]
  );

  // Handle delete
  const handleDelete = useCallback(() => {
    if (!deletingCategory) return;

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      const isSuccess = categoryStore.delete(deletingCategory.id);
      if (isSuccess) {
        setCategories((prev) =>
          prev.filter((c) => c.id !== deletingCategory.id)
        );
        toast.success(
          "Category Deleted",
          `"${deletingCategory.name}" has been deleted successfully`
        );
      } else {
        toast.error("Delete Failed", "Failed to delete category");
      }

      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
      setIsSubmitting(false);
    }, 500);
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
