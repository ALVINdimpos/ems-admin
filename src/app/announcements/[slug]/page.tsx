"use client";

import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { cmsApi } from "@/features/cms/api/cmsApi";
import type { IMarketingContent } from "@/features/cms/types";

export default function AnnouncementDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [announcement, setAnnouncement] = useState<IMarketingContent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to get by slug first
        let response = await cmsApi.content.getBySlug(slug);

        // If not found by slug, try searching by title (for URL-encoded titles)
        if (!response.success || !response.data) {
          const decodedSlug = decodeURIComponent(slug);
          const allContent = await cmsApi.content.getAll({
            type: "ANNOUNCEMENT",
            status: "PUBLISHED",
          });

          if (allContent.success && allContent.data) {
            const found = allContent.data.data.find(
              (c) =>
                c.slug === slug ||
                c.slug === decodedSlug ||
                c.title.toLowerCase().replace(/\s+/g, "-") ===
                  slug.toLowerCase() ||
                c.title === decodedSlug
            );
            if (found) {
              response = { success: true, data: found };
            }
          }
        }

        if (response.success && response.data) {
          setAnnouncement(response.data);
        } else {
          setError("Announcement not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 bg-slate-800 rounded" />
            <div className="h-12 w-3/4 bg-slate-800 rounded" />
            <div className="h-6 w-1/2 bg-slate-800 rounded" />
            <div className="space-y-4">
              <div className="h-4 w-full bg-slate-800 rounded" />
              <div className="h-4 w-full bg-slate-800 rounded" />
              <div className="h-4 w-2/3 bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !announcement) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Announcement Not Found
            </h1>
            <p className="text-slate-400 mb-6">
              {error ||
                "The announcement you're looking for doesn't exist or has been removed."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600/20 via-blue-600/20 to-purple-600/20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wide border border-sky-500/30">
              Announcement
            </span>
            {announcement.status === "PUBLISHED" && (
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">
                Published
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {announcement.title}
          </h1>

          {announcement.summary && (
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              {announcement.summary}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-p:text-slate-300 prose-p:leading-relaxed
                  prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-ul:text-slate-300 prose-ol:text-slate-300
                  prose-li:marker:text-sky-400"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Date Info */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                Details
              </h3>

              <div className="space-y-4">
                {announcement.publishedAt && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Published</p>
                      <p className="text-sm text-white">
                        {formatDate(announcement.publishedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {announcement.createdAt && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Created</p>
                      <p className="text-sm text-white">
                        {formatDate(announcement.createdAt)} at{" "}
                        {formatTime(announcement.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {announcement.author && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Author</p>
                      <p className="text-sm text-white">
                        {announcement.author.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {announcement.tags && announcement.tags.length > 0 && (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {announcement.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        border: `1px solid ${tag.color}40`,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            {announcement.category && (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Category
                </h3>
                <span className="inline-block px-4 py-2 bg-slate-700/50 text-white rounded-lg text-sm">
                  {announcement.category.name}
                </span>
              </div>
            )}

            {/* Back to Announcements */}
            <Link
              href="/#announcements"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Announcements
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
