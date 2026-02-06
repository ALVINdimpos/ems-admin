"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import Input from "@/components/ui/Input";

/**
 * Convert an ISO date string to the `datetime-local` input format (YYYY-MM-DDTHH:mm).
 * Returns an empty string if the value is falsy or unparseable.
 */
function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  // Offset to local time
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}
import { cmsApi } from "@/features/cms/api";
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

// Content status options
const STATUS_OPTIONS: {
  value: ContentStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "DRAFT",
    label: "Draft",
    description: "Save as draft, not visible to users",
  },
  {
    value: "PUBLISHED",
    label: "Published",
    description: "Visible to users immediately",
  },
  {
    value: "SCHEDULED",
    label: "Scheduled",
    description: "Will be published at scheduled date",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    description: "Hidden from users, kept for records",
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

  const [images, setImages] = useState<
    Array<{ url: string; altText: string; order: number }>
  >([]);
  const [videos, setVideos] = useState<
    Array<{ url: string; title: string; order: number }>
  >([]);
  const [links, setLinks] = useState<Array<{ url: string; label: string }>>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UpdateContentFormData>({
    resolver: zodResolver(updateContentSchema),
  });

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
          setValue("subtitle", data.subtitle);
          setValue("summary", data.summary);
          setValue("content", data.content);
          setValue("categoryId", data.categoryId || "");
          setValue("isActive", data.isActive);
          setValue("status", data.status || "DRAFT");
          setValue("order", data.order || 0);
          setValue("startDate", toDatetimeLocal(data.startDate));
          setValue("endDate", toDatetimeLocal(data.endDate));

          // Set media arrays
          if (data.images && data.images.length > 0) {
            setImages(data.images);
          }
          if (data.videos && data.videos.length > 0) {
            setVideos(data.videos);
          }
          if (data.links && data.links.length > 0) {
            setLinks(data.links);
          }

          // Set metadata
          if (data.metadata) {
            setValue("metadata.seoTitle", data.metadata.seoTitle);
            setValue("metadata.seoDescription", data.metadata.seoDescription);
            setValue("metadata.sponsor", data.metadata.sponsor);
          }
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
      // Strip status — backend uses isActive, not status
      const { status, ...rest } = data as UpdateContentFormData & {
        status?: string;
      };

      const response = await cmsApi.content.update(contentId, {
        ...rest,
        images,
        videos,
        links,
        tagIds: selectedTagIds,
        isActive: status === "PUBLISHED",
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

  // Loading state
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

  // Not found state
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
                {typeof errors.type?.message === "string"
                  ? errors.type.message
                  : "Invalid type"}
              </p>
            )}
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
                {typeof errors.summary?.message === "string"
                  ? errors.summary.message
                  : "Invalid summary"}
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
                  error={
                    typeof errors.content?.message === "string"
                      ? errors.content.message
                      : undefined
                  }
                />
              )}
            />
          </div>

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
                      Alt Text: {image.altText || "Not set"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                id="newLinkUrl"
                placeholder="Link URL"
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                id="newLinkLabel"
                placeholder="Link Label"
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const urlInput = document.getElementById(
                  "newLinkUrl"
                ) as HTMLInputElement | null;
                const labelInput = document.getElementById(
                  "newLinkLabel"
                ) as HTMLInputElement | null;
                if (urlInput?.value && labelInput?.value) {
                  setLinks((prev) => [
                    ...prev,
                    { url: urlInput.value, label: labelInput.value },
                  ]);
                  urlInput.value = "";
                  labelInput.value = "";
                }
              }}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 transition-colors text-sm font-medium"
            >
              Add Link
            </button>
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
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href={`/dashboard/cms/content/${contentId}`}
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
