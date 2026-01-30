"use client";

import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  RefreshCw,
  Tags,
  Search,
  X,
  Check,
} from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { ActiveBadge, TagBadge, ColorPicker } from "@/features/cms/components";
import type { IContentTag } from "@/features/cms/types";
import { tagStore, generateSlug } from "@/features/cms/utils";

// Tag Form Component
interface ITagFormProps {
  tag?: IContentTag | null;
  tags: IContentTag[];
  onSubmit: (data: Partial<IContentTag>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function TagForm({
  tag,
  tags,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ITagFormProps) {
  const [name, setName] = useState(tag?.name || "");
  const [slug, setSlug] = useState(tag?.slug || "");
  const [color, setColor] = useState(tag?.color || "#3B82F6");
  const [isActive, setIsActive] = useState(tag?.isActive ?? true);
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
    } else if (name.length > 50) {
      newErrors.name = "Name must not exceed 50 characters";
    }

    if (!slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      newErrors.slug = "Slug must be lowercase with hyphens only";
    }

    // Check for duplicate slug
    const existingTag = tags.find((t) => t.slug === slug && t.id !== tag?.id);
    if (existingTag) {
      newErrors.slug = "This slug is already in use";
    }

    if (!color) {
      newErrors.color = "Color is required";
    } else if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      newErrors.color = "Must be a valid hex color";
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
      color,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
        <TagBadge name={name || "Tag Name"} color={color} />
      </div>

      {/* Name */}
      <Input
        label="Name *"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Enter tag name"
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
            placeholder="tag-slug"
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
      </div>

      {/* Color */}
      <ColorPicker
        label="Color *"
        value={color}
        onChange={setColor}
        error={errors.color}
        disabled={isSubmitting}
      />

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
          Active (visible in content tagging)
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
              {tag ? "Update" : "Create"} Tag
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Delete Confirmation Dialog
interface IDeleteDialogProps {
  tag: IContentTag;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

function DeleteDialog({
  tag,
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
          <h3 className="text-lg font-semibold text-gray-900">Delete Tag</h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete the tag{" "}
            <TagBadge name={tag.name} color={tag.color} />? This action cannot
            be undone.
          </p>
        </div>
      </div>

      {tag._count && tag._count.contents > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Warning:</strong> This tag is used by {tag._count.contents}{" "}
          content item(s). Deleting will remove the tag from these items.
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
              Delete Tag
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Main Tags Page Component
export default function TagsPage() {
  // State
  const [tags, setTags] = useState<IContentTag[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<IContentTag | null>(null);
  const [deletingTag, setDeletingTag] = useState<IContentTag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState<boolean | null>(null);

  // Toast/notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Load tags (using mock data)
  const loadTags = useCallback(() => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setTags(tagStore.getAll());
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // Filter tags
  const filteredTags = tags.filter((tag) => {
    const isMatchingSearch =
      !searchValue ||
      tag.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchValue.toLowerCase());

    const isMatchingActive =
      isFilterActive === null || tag.isActive === isFilterActive;

    return isMatchingSearch && isMatchingActive;
  });

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle create/update
  const handleFormSubmit = useCallback(
    (data: Partial<IContentTag>) => {
      setIsSubmitting(true);

      // Simulate API delay
      setTimeout(() => {
        try {
          if (editingTag) {
            // Update existing
            const updated = tagStore.update(editingTag.id, data);
            if (updated) {
              setTags((prev) =>
                prev.map((t) => (t.id === updated.id ? updated : t))
              );
              showNotification(
                "success",
                `Tag "${updated.name}" updated successfully`
              );
            }
          } else {
            // Create new
            const created = tagStore.create(
              data as Omit<IContentTag, "id" | "createdAt" | "updatedAt">
            );
            setTags((prev) => [...prev, created]);
            showNotification(
              "success",
              `Tag "${created.name}" created successfully`
            );
          }

          setIsFormModalOpen(false);
          setEditingTag(null);
        } catch {
          showNotification("error", "An error occurred. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }, 500);
    },
    [editingTag]
  );

  // Handle delete
  const handleDelete = useCallback(() => {
    if (!deletingTag) return;

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      const isSuccess = tagStore.delete(deletingTag.id);
      if (isSuccess) {
        setTags((prev) => prev.filter((t) => t.id !== deletingTag.id));
        showNotification(
          "success",
          `Tag "${deletingTag.name}" deleted successfully`
        );
      } else {
        showNotification("error", "Failed to delete tag");
      }

      setIsDeleteModalOpen(false);
      setDeletingTag(null);
      setIsSubmitting(false);
    }, 500);
  }, [deletingTag]);

  // Open edit modal
  const openEditModal = (tag: IContentTag) => {
    setEditingTag(tag);
    setIsFormModalOpen(true);
    setActionMenuOpen(null);
  };

  // Open delete modal
  const openDeleteModal = (tag: IContentTag) => {
    setDeletingTag(tag);
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
          <h1 className="text-2xl font-bold text-gray-900">Content Tags</h1>
          <p className="text-gray-500 mt-1">
            Create and manage tags for content organization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTags}
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
              setEditingTag(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Tag
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
            placeholder="Search tags..."
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

      {/* Tags Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  <div className="h-6 w-6 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Tags className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No tags found</p>
            <p className="text-sm mt-1">
              {searchValue || isFilterActive !== null
                ? "Try adjusting your search or filters"
                : "Create your first tag to get started"}
            </p>
            {!searchValue && isFilterActive === null && (
              <button
                onClick={() => {
                  setEditingTag(null);
                  setIsFormModalOpen(true);
                }}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Tag
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="group relative p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                {/* Tag Color Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                  style={{ backgroundColor: tag.color }}
                />

                {/* Action Menu */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionMenuOpen(
                        actionMenuOpen === tag.id ? null : tag.id
                      );
                    }}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>

                  {actionMenuOpen === tag.id && (
                    <div
                      className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openEditModal(tag)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(tag)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Tag Content */}
                <div className="mt-2">
                  <TagBadge name={tag.name} color={tag.color} />
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500">
                      <code className="px-1 py-0.5 bg-gray-100 rounded">
                        {tag.slug}
                      </code>
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {tag._count?.contents ?? 0} content(s)
                      </span>
                      <ActiveBadge isActive={tag.isActive} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {!isLoading && filteredTags.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
            Showing {filteredTags.length} of {tags.length} tags
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsFormModalOpen(false);
            setEditingTag(null);
          }
        }}
        title={editingTag ? "Edit Tag" : "Create Tag"}
        size="md"
      >
        <TagForm
          tag={editingTag}
          tags={tags}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setEditingTag(null);
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
            setDeletingTag(null);
          }
        }}
        title=""
        size="sm"
        showCloseButton={false}
      >
        {deletingTag && (
          <DeleteDialog
            tag={deletingTag}
            onConfirm={handleDelete}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setDeletingTag(null);
            }}
            isDeleting={isSubmitting}
          />
        )}
      </Modal>
    </div>
  );
}
