"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
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
  updateContentSchema,
  type UpdateContentFormData,
} from "@/features/cms/schemas";
import type {
  ContentType,
  ContentStatus,
  IMarketingContent,
} from "@/features/cms/types";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "BANNER", label: "Banner" },
  { value: "HERO", label: "Hero" },
  { value: "PROMOTION", label: "Promotion" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "BLOG", label: "Blog" },
  { value: "TESTIMONIAL", label: "Testimonial" },
  { value: "FAQ", label: "FAQ" },
  { value: "FEATURE", label: "Feature" },
];

const STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "SCHEDULED", label: "Scheduled" },
];

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<IMarketingContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { categories } = useCategories();
  const { tags } = useTags();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateContentFormData>({
    resolver: zodResolver(updateContentSchema),
  });

  const watchStatus = watch("status");

  // Fetch content to edit
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await cmsApi.content.getById(contentId);
        if (response.success && response.data) {
          const data = response.data;
          setContent(data);
          setSelectedTagIds(data.tags?.map((t) => t.id) || []);

          // Set form values
          setValue("title", data.title);
          setValue("type", data.type);
          setValue("status", data.status);
          setValue("summary", data.summary);
          setValue("content", data.content);
          setValue("featuredImage", data.featuredImage);
          setValue("categoryId", data.categoryId);
          setValue("priority", data.priority);
        } else {
          setError(response.error || "Failed to load content");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId, setValue]);

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

  // Handle form submission
  const onSubmit = async (data: UpdateContentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await cmsApi.content.update(contentId, {
        ...data,
        tagIds: selectedTagIds,
      });

      if (response.success && response.data) {
        router.push(`/dashboard/cms/content/${response.data.id}`);
      } else {
        setError(response.error || "Failed to update content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/dashboard/cms/content"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Content
        </Link>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700">{error || "Content not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/cms/content/${contentId}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
            <p className="text-gray-500 mt-1">
              Update &ldquo;{content.title}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
          <div className="flex-1">
            <p className="font-medium">Error updating content</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
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
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <select
                {...register("type")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                {...register("status")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <textarea
              {...register("summary")}
              placeholder="Brief description of the content"
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.summary && (
              <p className="text-red-600 text-sm mt-1">
                {errors.summary.message}
              </p>
            )}
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.content?.message}
                />
              )}
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              {...register("featuredImage")}
            />
            {errors.featuredImage && (
              <p className="text-red-600 text-sm mt-1">
                {errors.featuredImage.message}
              </p>
            )}
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Media
            </label>
            <MediaUpload
              value={watch("mediaUrls") || []}
              onChange={(value) =>
                setValue("mediaUrls", Array.isArray(value) ? value : [value])
              }
              onUpload={handleMediaUpload}
              multiple
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              {...register("categoryId")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {tags.length === 0 ? (
                <p className="text-gray-500 text-sm">No tags available</p>
              ) : (
                tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                      className="w-4 h-4 border border-gray-300 rounded"
                    />
                    <TagBadge name={tag.name} color={tag.color} />
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
            Settings
          </h2>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority (0-100)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                {...register("priority", { valueAsNumber: true })}
                min="0"
                max="100"
                className="flex-1"
              />
              <input
                type="number"
                {...register("priority", { valueAsNumber: true })}
                min="0"
                max="100"
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center"
              />
            </div>
          </div>

          {/* Scheduled Publish */}
          {watchStatus === "SCHEDULED" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule For *
              </label>
              <Input
                type="datetime-local"
                {...register("scheduledAt")}
                error={errors.scheduledAt?.message}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 justify-end">
          <Link
            href={`/dashboard/cms/content/${contentId}`}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
