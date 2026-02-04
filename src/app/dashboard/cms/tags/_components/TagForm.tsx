"use client";

import { RefreshCw, Check } from "lucide-react";
import React, { useState } from "react";

import Input from "@/components/ui/Input";
import { TagBadge, ColorPicker } from "@/features/cms/components";
import type { IContentTag } from "@/features/cms/types";
import { generateSlug } from "@/features/cms/utils";

interface ITagFormProps {
  tag?: IContentTag | null;
  tags: IContentTag[];
  onSubmit: (data: Partial<IContentTag>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TagForm({
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
