import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import Link from "next/link";

import type { IMarketingContent } from "@/features/cms/types";

interface IAnnouncementSidebarProps {
  announcement: IMarketingContent;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AnnouncementSidebar({
  announcement,
}: IAnnouncementSidebarProps) {
  return (
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
                <p className="text-sm text-white">{announcement.author.name}</p>
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
  );
}
