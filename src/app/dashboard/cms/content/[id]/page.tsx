"use client";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Share2,
  Clock,
  Eye,
  User,
  FolderOpen,
  Tag,
  Calendar,
  CheckCircle,
  Archive,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { cmsApi } from "@/features/cms/api/cmsApi";
import { StatusBadge, TypeBadge, TagBadge } from "@/features/cms/components";
import type { IMarketingContent } from "@/features/cms/types";

export default function ContentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<IMarketingContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch content details
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await cmsApi.content.getById(contentId);
        if (response.success && response.data) {
          setContent(response.data);
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
  }, [contentId]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await cmsApi.content.delete(contentId);
      if (response.success) {
        router.push("/dashboard/cms/content");
      } else {
        setError(response.error || "Failed to delete content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  // Handle publish
  const handlePublish = async () => {
    setIsActionLoading(true);
    try {
      const response = await cmsApi.content.publish(contentId);
      if (response.success && response.data) {
        setContent(response.data);
      } else {
        setError(response.error || "Failed to publish content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle archive
  const handleArchive = async () => {
    setIsActionLoading(true);
    try {
      const response = await cmsApi.content.archive(contentId);
      if (response.success && response.data) {
        setContent(response.data);
      } else {
        setError(response.error || "Failed to archive content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle duplicate
  const handleDuplicate = async () => {
    setIsActionLoading(true);
    try {
      const response = await cmsApi.content.duplicate(contentId);
      if (response.success && response.data) {
        router.push(`/dashboard/cms/content/${response.data.id}`);
      } else {
        setError(response.error || "Failed to duplicate content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsActionLoading(false);
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

  // Error state
  if (error && !content) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/dashboard/cms/content"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Content
        </Link>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
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
          <p className="text-amber-700">Content not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/cms/content"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Content
        </Link>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <StatusBadge status={content.status} />
          <TypeBadge type={content.type} />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
          <div>
            <p className="font-medium text-red-700">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {content.title}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Slug:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {content.slug}
              </code>
            </p>
          </div>

          {/* Featured Image */}
          {content.featuredImage && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={content.featuredImage}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Summary */}
          {content.summary && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Summary
              </h3>
              <p className="text-gray-600">{content.summary}</p>
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Content
            </h3>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </div>

          {/* Media */}
          {content.mediaUrls && content.mediaUrls.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Media
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {content.mediaUrls.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Fields */}
          {content.metadata && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">
                SEO Information
              </h3>

              {content.metadata.seoTitle && (
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    SEO Title
                  </label>
                  <p className="text-gray-900 mt-1">
                    {content.metadata.seoTitle}
                  </p>
                </div>
              )}

              {content.metadata.seoDescription && (
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    SEO Description
                  </label>
                  <p className="text-gray-900 mt-1">
                    {content.metadata.seoDescription}
                  </p>
                </div>
              )}

              {content.metadata.keywords &&
                content.metadata.keywords.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Keywords
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {content.metadata.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {content.metadata.openGraphImage && (
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Open Graph Image
                  </label>
                  <p className="text-gray-600 text-sm mt-1 break-all">
                    {content.metadata.openGraphImage}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Actions
            </h3>

            {/* Edit Button */}
            <Link
              href={`/dashboard/cms/content/${contentId}/edit`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Edit className="h-4 w-4" />
              Edit Content
            </Link>

            {/* Status Actions */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              {content.status !== "PUBLISHED" && (
                <button
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Publish
                </button>
              )}

              {content.status !== "ARCHIVED" && (
                <button
                  onClick={handleArchive}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                  Archive
                </button>
              )}
            </div>

            {/* Other Actions */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <button
                onClick={handleDuplicate}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Duplicate
              </button>

              <button className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {/* Delete Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Content
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Information
            </h3>

            {/* View Count */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Eye className="h-4 w-4" />
                <span>Views</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {content.viewCount}
              </p>
            </div>

            {/* Priority */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">Priority</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${content.priority}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {content.priority}
                </span>
              </div>
            </div>

            {/* Category */}
            {content.category && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>Category</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {content.category.name}
                </p>
              </div>
            )}

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Tag className="h-4 w-4" />
                  <span>Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                  ))}
                </div>

                {/* Author */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Author</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">
                      {content.author?.name || "Unknown"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {content.author?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <p className="text-gray-900 text-sm">
                  {formatDate(content.createdAt)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Clock className="h-4 w-4" />
                  <span>Last Updated</span>
                </div>
                <p className="text-gray-900 text-sm">
                  {formatDate(content.updatedAt)}
                </p>
              </div>

              {content.publishedAt && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Published</span>
                  </div>
                  <p className="text-gray-900 text-sm">
                    {formatDate(content.publishedAt)}
                  </p>
                </div>
              )}

              {content.scheduledAt && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Scheduled For</span>
                  </div>
                  <p className="text-gray-900 text-sm">
                    {formatDate(content.scheduledAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Content?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &ldquo;{content.title}&rdquo;? This action
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

