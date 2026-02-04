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
import type { IContentTag } from "@/features/cms/types";
import { tagStore } from "@/features/cms/utils";

export default function TagsPage() {
  const toast = useToast();

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
              toast.success(
                "Tag Updated",
                `"${updated.name}" has been updated successfully`
              );
            }
          } else {
            // Create new
            const created = tagStore.create(
              data as Omit<IContentTag, "id" | "createdAt" | "updatedAt">
            );
            setTags((prev) => [...prev, created]);
            toast.success(
              "Tag Created",
              `"${created.name}" has been created successfully`
            );
          }

          setIsFormModalOpen(false);
          setEditingTag(null);
        } catch {
          toast.error("Error", "An error occurred. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }, 500);
    },
    [editingTag, toast]
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
        toast.success(
          "Tag Deleted",
          `"${deletingTag.name}" has been deleted successfully`
        );
      } else {
        toast.error("Delete Failed", "Failed to delete tag");
      }

      setIsDeleteModalOpen(false);
      setDeletingTag(null);
      setIsSubmitting(false);
    }, 500);
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

  const hasFilters = !!searchValue || isFilterActive !== null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <TagHeader
        onRefresh={loadTags}
        onCreateClick={openCreateModal}
        isLoading={isLoading}
      />

      {/* Search and Filters */}
      <TagSearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeFilter={isFilterActive}
        onActiveFilterChange={setIsFilterActive}
      />

      {/* Tags Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {isLoading ? (
          <TagGridSkeleton />
        ) : filteredTags.length === 0 ? (
          <TagEmptyState
            hasFilters={hasFilters}
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
