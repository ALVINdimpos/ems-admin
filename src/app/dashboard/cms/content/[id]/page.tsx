"use client";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Share2,
  Clock,
  FolderOpen,
  Tag,
  Calendar,
  CheckCircle,
  Archive,
  Loader2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { ContentDeleteDialog } from "../_components";

import Modal from "@/components/ui/Modal";
import { cmsApi } from "@/features/cms/api";
import { TypeBadge, TagBadge } from "@/features/cms/components";
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

  // Handle publish/activate
  const handleActivate = async (id: string) => {
    setIsActionLoading(true);
    try {
      const response = await cmsApi.content.update(id, { isActive: true });
      if (response.success && response.data) {
        setContent(response.data);
      } else {
        setError(response.error || "Failed to activate content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle archive/deactivate
  const handleArchive = async (id: string) => {
    setIsActionLoading(true);
    try {
      const response = await cmsApi.content.archive(id);
      if (response.success && response.data) {
        setContent(response.data);
      } else {
        setError(response.error || "Failed to deactivate content");
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

        {/* Type Indicator */}
        <div className="flex items-center gap-2">
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
          </div>

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
          {content.images && content.images.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {content.images.map((image, index) => {
                  const isValid =
                    image.url.startsWith("http://") ||
                    image.url.startsWith("https://") ||
                    image.url.startsWith("/");
                  return (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative"
                    >
                      {isValid ? (
                        <Image
                          src={image.url}
                          alt={image.altText || `Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          Invalid image URL
                        </div>
                      )}
                    </div>
                  );
                })}
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

            {/* Active Status Actions */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              {content.isActive ? (
                <button
                  onClick={() => handleArchive(content.id)}
                  disabled={isActionLoading}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {isActionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => handleActivate(content.id)}
                  disabled={isActionLoading}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isActionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Activate
                </button>
              )}
            </div>
          </div>

          {/* Other Actions */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <button
              onClick={handleDuplicate}
              disabled={isActionLoading}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isActionLoading ? (
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

          {/* Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Information
            </h3>

            {/* Category */}
            {content.category && (
              <div>
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
              <div
                className={
                  content.category ? "pt-4 border-t border-gray-200" : ""
                }
              >
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Tag className="h-4 w-4" />
                  <span>Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Dates</h3>
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
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteConfirmOpen}
          onClose={() => {
            if (!isDeleting) {
              setIsDeleteConfirmOpen(false);
            }
          }}
          title=""
          size="sm"
          showCloseButton={false}
          backdropClassName="bg-black/60 backdrop-blur-sm"
        >
          {content && (
            <ContentDeleteDialog
              content={content}
              onConfirm={handleDelete}
              onCancel={() => setIsDeleteConfirmOpen(false)}
              isDeleting={isDeleting}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
