"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import Input from "@/components/ui/Input";
import { cmsApi } from "@/features/cms/api/cmsApi";
import {
  RichTextEditor,
  MediaUpload,
  TagBadge,
} from "@/features/cms/components";
import { useCategories, useTags } from "@/features/cms/hooks";
import {
  createContentSchema,
  type CreateContentFormData,
} from "@/features/cms/schemas";
import type { ContentType, ContentStatus } from "@/features/cms/types";

// Content type options
const CONTENT_TYPES: {
  value: ContentType;
  label: string;
  description: string;
}[] = [
  {
    value: "BANNER",
    label: "Banner",
    description: "Homepage or section banners",
  },
  { value: "HERO", label: "Hero", description: "Hero section content" },
  {
    value: "PROMOTION",
    label: "Promotion",
    description: "Promotional content",
  },
  {
    value: "ANNOUNCEMENT",
    label: "Announcement",
    description: "Important announcements",
  },
  { value: "BLOG", label: "Blog", description: "Blog posts and articles" },
  {
    value: "TESTIMONIAL",
    label: "Testimonial",
    description: "Customer testimonials",
  },
  { value: "FAQ", label: "FAQ", description: "Frequently asked questions" },
  {
    value: "FEATURE",
    label: "Feature",
    description: "Product/service features",
  },
];

// Status options
const STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "SCHEDULED", label: "Scheduled" },
];

export default function NewContentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { tags, isLoading: isTagsLoading } = useTags();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateContentFormData>({
    resolver: zodResolver(createContentSchema),
    defaultValues: {
      type: "BLOG",
      status: "DRAFT",
      content: "",
      priority: 0,
      isActive: true,
    },
  });

  const watchStatus = watch("status");

  // Handle form submission
  const onSubmit = async (data: CreateContentFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await cmsApi.content.create({
        ...data,
        tagIds: selectedTagIds,
      });

      if (response.success && response.data) {
        router.push(`/dashboard/cms/content/${response.data.id}`);
      } else {
        setSubmitError(response.error || "Failed to create content");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle tag selection
  const toggleTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }, []);

  // Handle media upload
  const handleMediaUpload = useCallback(async (files: File[]) => {
    const response = await cmsApi.media.uploadMultiple(files);
    if (response.success && response.data) {
      return response.data.urls;
    }
    throw new Error("Upload failed");
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/cms/content"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Content</h1>
            <p className="text-gray-500 mt-1">
              Add new marketing content to your CMS
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
          <div className="flex-1">
            <p className="font-medium">Error creating content</p>
            <p className="text-sm mt-1">{submitError}</p>
          </div>
          <button
            onClick={() => setSubmitError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
            Content Details
          </h2>

          {/* Title */}
          <Input
            label="Title *"
            placeholder="Enter content title"
            error={errors.title?.message}
            {...register("title")}
          />

          {/* Type and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Content Type *
              </label>
              <select
                {...register("type")}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scheduled Date (show only when status is SCHEDULED) */}
          {watchStatus === "SCHEDULED" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Scheduled Date *
              </label>
              <input
                type="datetime-local"
                {...register("scheduledAt")}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.scheduledAt && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.scheduledAt.message}
                </p>
              )}
            </div>
          )}

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Summary
            </label>
            <textarea
              {...register("summary")}
              placeholder="Brief summary of the content"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-600">
                {errors.summary.message}
              </p>
            )}
          </div>

          {/* Rich Text Content */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label="Content *"
                value={field.value}
                onChange={field.onChange}
                placeholder="Write your content here..."
                error={errors.content?.message}
                minHeight={300}
              />
            )}
          />
        </div>

        {/* Media Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
            Media
          </h2>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Featured Image
            </label>
            <Controller
              name="featuredImage"
              control={control}
              render={({ field }) => (
                <MediaUpload
                  value={field.value}
                  onChange={(url) =>
                    field.onChange(Array.isArray(url) ? url[0] : url)
                  }
                  accept="image/*"
                  maxSize={5}
                  placeholder="Drop an image here or click to upload"
                  onUpload={async (files) => {
                    const urls = await handleMediaUpload(files);
                    return urls;
                  }}
                />
              )}
            />
          </div>

          {/* Additional Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Additional Media
            </label>
            <Controller
              name="mediaUrls"
              control={control}
              render={({ field }) => (
                <MediaUpload
                  value={field.value || []}
                  onChange={(urls) => field.onChange(urls)}
                  multiple
                  maxFiles={10}
                  accept="image/*,video/*"
                  placeholder="Drop files here or click to upload"
                  onUpload={handleMediaUpload}
                />
              )}
            />
          </div>
        </div>

        {/* Organization Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
            Organization
          </h2>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <select
              {...register("categoryId")}
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isCategoriesLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[60px]">
              {isTagsLoading ? (
                <p className="text-sm text-gray-500">Loading tags...</p>
              ) : tags.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No tags available.{" "}
                  <Link
                    href="/dashboard/cms/tags"
                    className="text-blue-600 hover:underline"
                  >
                    Create some
                  </Link>
                </p>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`transition-opacity ${
                      selectedTagIds.includes(tag.id)
                        ? "opacity-100 ring-2 ring-offset-1 ring-blue-500 rounded-full"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <TagBadge name={tag.name} color={tag.color} />
                  </button>
                ))
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Click to select/deselect tags
            </p>
          </div>

          {/* Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Priority (0-100)
              </label>
              <input
                type="number"
                {...register("priority", { valueAsNumber: true })}
                min={0}
                max={100}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Expiration Date
              </label>
              <input
                type="datetime-local"
                {...register("expiresAt")}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active (visible to users)
            </label>
          </div>
        </div>

        {/* SEO Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
            SEO Settings
          </h2>

          <Input
            label="SEO Title"
            placeholder="SEO optimized title (max 70 characters)"
            maxLength={70}
            {...register("metadata.seoTitle")}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              SEO Description
            </label>
            <textarea
              {...register("metadata.seoDescription")}
              placeholder="Meta description (max 160 characters)"
              maxLength={160}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/dashboard/cms/content"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Content
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
