"use client";

import { RefreshCw, Check } from "lucide-react";
import React, { useState } from "react";

import Input from "@/components/ui/Input";
import type { IContentCategory } from "@/features/cms/types";
import { generateSlug } from "@/features/cms/utils";

interface ICategoryFormProps {
  category?: IContentCategory | null;
  categories: IContentCategory[];
  onSubmit: (data: Partial<IContentCategory>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CategoryForm({
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
