"use client";

import { Check, RefreshCw } from "lucide-react";
import React, { useState } from "react";

import Input from "@/components/ui/Input";
import { TagBadge, ColorPicker } from "@/features/cms/components";
import type { IContentTag } from "@/features/cms/types";

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
  const [color, setColor] = useState(tag?.color || "#3B82F6");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle name change
  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name and color
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (name.length > 50) {
      newErrors.name = "Name must not exceed 50 characters";
    }

    if (!color) {
      newErrors.color = "Color is required";
    } else if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      newErrors.color = "Must be a valid hex color";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      name: name.trim(),
      color,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
        <TagBadge name={name || "Tag Name"} color={color} />
      </div>

      {/* Slug - Hidden, API generates it */}
      {/* Name */}
      <Input
        label="Name *"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Enter tag name"
        error={errors.name}
        disabled={isSubmitting}
      />

      {/* Color */}
      <ColorPicker
        label="Color *"
        value={color}
        onChange={setColor}
        error={errors.color}
        disabled={isSubmitting}
      />

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
