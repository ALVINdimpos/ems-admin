"use client";

import { RefreshCw, Check } from "lucide-react";
import React, { useState } from "react";

import Input from "@/components/ui/Input";
import type { IContentCategory } from "@/features/cms/types";

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
  const [description, setDescription] = useState(category?.description || "");
  const [parentId, setParentId] = useState(category?.parentId || "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle name change
  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (name.length > 100) {
      newErrors.name = "Name must not exceed 100 characters";
    }

    if (description && description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    // Prevent setting self as parent
    if (parentId && category && parentId === category.id) {
      newErrors.parentId = "Category cannot be its own parent";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      name: name.trim(),
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
