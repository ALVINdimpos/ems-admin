"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import Input from "@/components/ui/Input";
import { cmsApi } from "@/features/cms/api";
import {
  RichTextEditor,
  MediaUpload,
  TagBadge,
} from "@/features/cms/components";
import { useCategories, useTags } from "@/features/cms/hooks";
import { createContentSchema } from "@/features/cms/schemas";
import type { ContentType, ContentStatus } from "@/features/cms/types";
import type { IUploadProgress } from "@/features/cms/utils/chunkedUpload";

// Content status options
const STATUS_OPTIONS: {
  value: ContentStatus;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "DRAFT",
    label: "Draft",
    description: "Save as draft, not visible to users",
    color: "text-gray-600",
  },
  {
    value: "PUBLISHED",
    label: "Published",
    description: "Visible to users immediately",
    color: "text-green-600",
  },
  {
    value: "SCHEDULED",
    label: "Scheduled",
    description: "Will be published at scheduled date",
    color: "text-blue-600",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    description: "Hidden from users, kept for records",
    color: "text-orange-600",
  },
];

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
  { value: "NEWS", label: "News", description: "News articles and updates" },
  {
    value: "ANNOUNCEMENT",
    label: "Announcement",
    description: "Important announcements",
  },
  {
    value: "TESTIMONIAL",
    label: "Testimonial",
    description: "Customer testimonials",
  },
  { value: "FAQ", label: "FAQ", description: "Frequently asked questions" },
  {
    value: "GALLERY",
    label: "Gallery",
    description: "Image galleries",
  },
  { value: "VIDEO", label: "Video", description: "Video content" },
  {
    value: "TEXT_BLOCK",
    label: "Text Block",
    description: "Custom text blocks",
  },
  {
    value: "CONTACT_INFO",
    label: "Contact Info",
    description: "Contact information",
  },
  {
    value: "SOCIAL_LINKS",
    label: "Social Links",
    description: "Social media links",
  },
];

export default function NewContentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<IUploadProgress | null>(
    null
  );

  /** Raw image File objects to be sent with content creation */
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { tags, isLoading: isTagsLoading } = useTags();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createContentSchema),
    defaultValues: {
      type: "BANNER" as const,
      content: "",
      status: "DRAFT" as ContentStatus,
      isActive: true,
      order: 0,
      images: [],
      videos: [],
      links: [],
      metadata: { sponsor: "" },
    },
  } as any);

  const [images, setImages] = useState<
    Array<{ url: string; altText: string; order: number }>
  >([]);
  const [videos, setVideos] = useState<
    Array<{ url: string; title: string; order: number }>
  >([]);
  const [links, setLinks] = useState<Array<{ url: string; label: string }>>([]);

  // Handle form submission
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(null);

    try {
      const response = await cmsApi.content.create(
        {
          ...data,
          images,
          videos,
          links,
          tagIds: selectedTagIds,
        },
        imageFiles.length > 0 ? imageFiles : undefined,
        (progress) => setUploadProgress(progress)
      );

      if (response.success && response.data) {
        router.push(`/dashboard/cms/content/${response.data.id}`);
      } else {
        setSubmitError(response.error || "Failed to create content");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
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

  // Handle media upload — store raw files for chunked upload with content
  const handleMediaUpload = useCallback(async (files: File[]) => {
    // Store the raw files for submission with the content payload
    setImageFiles((prev) => [...prev, ...files]);
    // Return local preview URLs so the UI can show thumbnails immediately
    return files.map((file) => URL.createObjectURL(file));
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

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
            Content Details
          </h2>

          {/* Title */}
          <Input
            label="Title *"
            placeholder="Enter content title"
            error={
              typeof errors.title?.message === "string"
                ? errors.title.message
                : undefined
            }
            {...register("title")}
          />

          {/* Subtitle */}
          <Input
            label="Subtitle"
            placeholder="Optional subtitle for the content"
            {...register("subtitle")}
          />

          {/* Type */}
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
                {(errors.type?.message as any) || "Invalid type"}
              </p>
            )}
          </div>

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
                {typeof errors.summary?.message === "string"
                  ? errors.summary.message
                  : "Invalid summary"}
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
                error={
                  typeof errors.content?.message === "string"
                    ? errors.content.message
                    : undefined
                }
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

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Images
            </label>
            <div className="space-y-3 mb-3">
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.url}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Alt: {image.altText || "Not set"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <MediaUpload
                  value={images.map((img) => img.url)}
                  onChange={(urls) => {
                    const urlArray = Array.isArray(urls) ? urls : [urls];
                    const newImages = urlArray.map((url, idx) => ({
                      url,
                      altText: "",
                      order: images.length + idx,
                    }));
                    setImages((prev) => [...prev, ...newImages]);
                  }}
                  accept="image/*"
                  maxSize={5}
                  placeholder="Drop images here or click to upload"
                  onUpload={handleMediaUpload}
                />
              )}
            />
          </div>

          {/* Videos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Videos
            </label>
            <div className="space-y-3 mb-3">
              {videos.map((video, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {video.url}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Title: {video.title || "Not set"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setVideos((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Controller
              name="videos"
              control={control}
              render={({ field }) => (
                <MediaUpload
                  value={videos.map((vid) => vid.url)}
                  onChange={(urls) => {
                    const urlArray = Array.isArray(urls) ? urls : [urls];
                    const newVideos = urlArray.map((url, idx) => ({
                      url,
                      title: "",
                      order: videos.length + idx,
                    }));
                    setVideos((prev) => [...prev, ...newVideos]);
                  }}
                  accept="video/*"
                  maxSize={100}
                  placeholder="Drop videos here or click to upload"
                  onUpload={handleMediaUpload}
                />
              )}
            />
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Links
            </label>
            <div className="space-y-3 mb-3">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {link.label || link.url}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {link.url}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setLinks((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Input
                placeholder="Link URL"
                id={`link-url-new`}
                value=""
                onChange={(e) => {
                  // To be implemented with a proper form state
                }}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Link Label (optional)"
                  id={`link-label-new`}
                  value=""
                  onChange={(e) => {
                    // To be implemented with a proper form state
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    // To be implemented
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
            Organization & Scheduling
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

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Order
            </label>
            <input
              type="number"
              {...register("order", { valueAsNumber: true })}
              min={0}
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600">
                {typeof errors.order?.message === "string"
                  ? errors.order.message
                  : "Invalid order"}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="datetime-local"
                {...register("startDate")}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">
                  {typeof errors.startDate?.message === "string"
                    ? errors.startDate.message
                    : "Invalid start date"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="datetime-local"
                {...register("endDate")}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">
                  {typeof errors.endDate?.message === "string"
                    ? errors.endDate.message
                    : "Invalid end date"}
                </p>
              )}
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

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status *
            </label>
            <select
              {...register("status")}
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — {option.description}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {typeof errors.status?.message === "string"
                  ? errors.status.message
                  : "Invalid status"}
              </p>
            )}
          </div>
        </div>

        {/* SEO & Metadata Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200">
            SEO Settings & Metadata
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

          <Input
            label="Sponsor"
            placeholder="Optional sponsor name"
            {...register("metadata.sponsor")}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          {/* Upload Progress */}
          {uploadProgress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-700">
                  Uploading {uploadProgress.fileName}
                </p>
                <span className="text-sm text-blue-600">
                  {uploadProgress.percent}%
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.percent}%` }}
                />
              </div>
              <p className="text-xs text-blue-500 mt-1">
                Chunk {uploadProgress.currentChunk} of{" "}
                {uploadProgress.totalChunks}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
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
        </div>
      </form>
    </div>
  );
}
