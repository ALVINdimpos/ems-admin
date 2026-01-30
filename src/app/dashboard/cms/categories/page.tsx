"use client";

import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  RefreshCw,
  FolderTree,
  Search,
  X,
  Check,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { ActiveBadge } from "@/features/cms/components";
import type { IContentCategory } from "@/features/cms/types";
import { categoryStore, generateSlug } from "@/features/cms/utils";

// Category Form Component
interface ICategoryFormProps {
  category?: IContentCategory | null;
  categories: IContentCategory[];
  onSubmit: (data: Partial<IContentCategory>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function CategoryForm({
  category,
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ICategoryFormProps) {
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [description, setDescription] = useState(category?.description || "");
  const [parentId, setParentId] = useState(category?.parentId || "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle name change and auto-generate slug
  const handleNameChange = (value: string) => {
    setName(value);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (name.length > 100) {
      newErrors.name = "Name must not exceed 100 characters";
    }

    if (!slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      newErrors.slug = "Slug must be lowercase with hyphens only";
    }

    // Check for duplicate slug
    const existingCategory = categories.find(
      (c) => c.slug === slug && c.id !== category?.id
    );
    if (existingCategory) {
      newErrors.slug = "This slug is already in use";
    }

    if (description && description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    // Prevent setting self as parent
    if (parentId && category && parentId === category.id) {
      newErrors.parentId = "Category cannot be its own parent";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      parentId: parentId || undefined,
      isActive,
    });
  };

  // Filter out current category and its children from parent options
  const availableParents = categories.filter(
    (c) => c.id !== category?.id && c.parentId !== category?.id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <Input
        label="Name *"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Enter category name"
        error={errors.name}
        disabled={isSubmitting}
      />

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
              setIsSlugManuallyEdited(true);
            }}
            placeholder="category-slug"
            disabled={isSubmitting}
            className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.slug ? "border-red-500" : "border-gray-300"
            } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
          <button
            type="button"
            onClick={() => {
              setSlug(generateSlug(name));
              setIsSlugManuallyEdited(false);
            }}
            disabled={isSubmitting || !name}
            className="px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Regenerate from name"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          URL-friendly identifier (lowercase, hyphens only)
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this category"
          rows={3}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {description.length}/500 characters
        </p>
      </div>

      {/* Parent Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parent Category
        </label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        >
          <option value="">None (Top-level category)</option>
          {availableParents.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.parentId && (
          <p className="mt-1 text-sm text-red-600">{errors.parentId}</p>
        )}
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Active (visible in content selection)
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              {category ? "Update" : "Create"} Category
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Delete Confirmation Dialog
interface IDeleteDialogProps {
  category: IContentCategory;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

function DeleteDialog({
  category,
  onConfirm,
  onCancel,
  isDeleting = false,
}: IDeleteDialogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600">
          <Trash2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Category
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete &quot;{category.name}&quot;? This
            action cannot be undone.
          </p>
        </div>
      </div>

      {category._count && category._count.contents > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Warning:</strong> This category has {category._count.contents}{" "}
          content item(s) associated with it. Deleting will remove the category
          assignment from these items.
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Category
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Main Categories Page Component
export default function CategoriesPage() {
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

  // Toast/notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

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
              showNotification(
                "success",
                `Category "${updated.name}" updated successfully`
              );
            }
          } else {
            // Create new
            const created = categoryStore.create(
              data as Omit<IContentCategory, "id" | "createdAt" | "updatedAt">
            );
            setCategories((prev) => [...prev, created]);
            showNotification(
              "success",
              `Category "${created.name}" created successfully`
            );
          }

          setIsFormModalOpen(false);
          setEditingCategory(null);
        } catch {
          showNotification("error", "An error occurred. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }, 500);
    },
    [editingCategory]
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
        showNotification(
          "success",
          `Category "${deletingCategory.name}" deleted successfully`
        );
      } else {
        showNotification("error", "Failed to delete category");
      }

      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
      setIsSubmitting(false);
    }, 500);
  }, [deletingCategory]);

  // Open edit modal
  const openEditModal = (category: IContentCategory) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
    setActionMenuOpen(null);
  };

  // Open delete modal
  const openDeleteModal = (category: IContentCategory) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
    setActionMenuOpen(null);
  };

  // Close outside click for action menu
  useEffect(() => {
    const handleClickOutside = () => setActionMenuOpen(null);
    if (actionMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [actionMenuOpen]);

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            className="ml-2 hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Content Categories
          </h1>
          <p className="text-gray-500 mt-1">
            Organize your content with categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadCategories}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search categories..."
            className="w-full h-10 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Active Filter */}
        <select
          value={isFilterActive === null ? "" : isFilterActive.toString()}
          onChange={(e) =>
            setIsFilterActive(
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
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-200 rounded" />
                        <div>
                          <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                          <div className="h-3 w-48 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-8 bg-gray-200 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <FolderTree className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-medium">No categories found</p>
                    <p className="text-sm mt-1">
                      {searchValue || isFilterActive !== null
                        ? "Try adjusting your search or filters"
                        : "Create your first category to get started"}
                    </p>
                    {!searchValue && isFilterActive === null && (
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setIsFormModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add Category
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 bg-purple-100 text-purple-600 rounded-lg">
                          <FolderTree className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {category.name}
                          </p>
                          {category.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {category._count?.contents ?? 0}
                    </td>
                    <td className="px-4 py-4">
                      <ActiveBadge isActive={category.isActive} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenuOpen(
                              actionMenuOpen === category.id
                                ? null
                                : category.id
                            );
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>

                        {actionMenuOpen === category.id && (
                          <div
                            className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => openEditModal(category)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </button>
                            <hr className="my-1 border-gray-200" />
                            <button
                              onClick={() => openDeleteModal(category)}
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
      >
        {deletingCategory && (
          <DeleteDialog
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
