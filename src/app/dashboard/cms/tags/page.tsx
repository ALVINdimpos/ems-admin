"use client";

import React, { useState, useCallback, useEffect } from "react";

import {
  TagForm,
  TagDeleteDialog,
  TagCard,
  TagGridSkeleton,
  TagEmptyState,
  TagHeader,
  TagSearchFilter,
} from "./_components";

import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { cmsApi } from "@/features/cms/api";
import type { IContentTag, ICreateContentTag } from "@/features/cms/types";

export default function TagsPage() {
  const toast = useToast();

  // State
  const [tags, setTags] = useState<IContentTag[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<IContentTag | null>(null);
  const [deletingTag, setDeletingTag] = useState<IContentTag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load tags from API
  const loadTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await cmsApi.tags.getAll();
      if (response.success && response.data) {
        const items = Array.isArray(response.data) ? response.data : [];
        setTags(items);
      } else {
        toast.error("Error", response.error || "Failed to load tags");
      }
    } catch (error) {
      toast.error(
        "Error",
        error instanceof Error ? error.message : "Failed to load tags"
      );
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
      isActiveFilter === null || tag.isActive === isActiveFilter;

    return isMatchingSearch && isMatchingActive;
  });

  // Handle create/update
  const handleFormSubmit = useCallback(
    async (data: Partial<IContentTag>) => {
      setIsSubmitting(true);

      try {
        if (editingTag) {
          // Update existing
          const response = await cmsApi.tags.update(
            editingTag.id,
            data as Partial<ICreateContentTag>
          );
          if (response.success && response.data) {
            setTags((prev) =>
              prev.map((t) => (t.id === response.data!.id ? response.data! : t))
            );
            toast.success(
              "Tag Updated",
              `"${response.data.name}" has been updated successfully`
            );
          } else {
            toast.error("Error", response.error || "Failed to update tag");
          }
        } else {
          // Create new
          const response = await cmsApi.tags.create(data as ICreateContentTag);
          if (response.success && response.data) {
            setTags((prev) => [...prev, response.data!]);
            toast.success(
              "Tag Created",
              `"${response.data.name}" has been created successfully`
            );
          } else {
            toast.error("Error", response.error || "Failed to create tag");
          }
        }

        setIsFormModalOpen(false);
        setEditingTag(null);
      } catch (error) {
        toast.error(
          "Error",
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingTag, toast]
  );

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!deletingTag) return;

    setIsSubmitting(true);

    try {
      const response = await cmsApi.tags.delete(deletingTag.id);
      if (response.success) {
        setTags((prev) => prev.filter((t) => t.id !== deletingTag.id));
        toast.success(
          "Tag Deleted",
          `"${deletingTag.name}" has been deleted successfully`
        );
      } else {
        toast.error("Delete Failed", response.error || "Failed to delete tag");
      }

      setIsDeleteModalOpen(false);
      setDeletingTag(null);
    } catch (error) {
      toast.error(
        "Error",
        error instanceof Error ? error.message : "Failed to delete tag"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [deletingTag, toast]);

  // Open create modal
  const openCreateModal = useCallback(() => {
    setEditingTag(null);
    setIsFormModalOpen(true);
  }, []);

  // Open edit modal
  const openEditModal = useCallback((tag: IContentTag) => {
    setEditingTag(tag);
    setIsFormModalOpen(true);
    setActionMenuOpen(null);
  }, []);

  // Open delete modal
  const openDeleteModal = useCallback((tag: IContentTag) => {
    setDeletingTag(tag);
    setIsDeleteModalOpen(true);
    setActionMenuOpen(null);
  }, []);

  // Toggle action menu
  const handleMenuToggle = useCallback((tagId: string) => {
    setActionMenuOpen((prev) => (prev === tagId ? null : tagId));
  }, []);

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
      {/* Page Header */}
      <TagHeader
        onRefresh={loadTags}
        onCreateClick={openCreateModal}
        isLoading={isLoading}
      />

      {/* Search Filter */}
      <TagSearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeFilter={isActiveFilter}
        onActiveFilterChange={setIsActiveFilter}
      />

      {/* Tags Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {isLoading ? (
          <TagGridSkeleton />
        ) : filteredTags.length === 0 ? (
          <TagEmptyState
            hasFilters={!!searchValue}
            onCreateClick={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTags.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                isMenuOpen={actionMenuOpen === tag.id}
                onMenuToggle={() => handleMenuToggle(tag.id)}
                onEdit={() => openEditModal(tag)}
                onDelete={() => openDeleteModal(tag)}
              />
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
        backdropClassName="bg-black/60 backdrop-blur-sm"
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
        backdropClassName="bg-black/60 backdrop-blur-sm"
      >
        {deletingTag && (
          <TagDeleteDialog
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
