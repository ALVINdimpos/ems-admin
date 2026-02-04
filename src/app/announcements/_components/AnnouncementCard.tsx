"use client";

import { Bell, Calendar, ChevronRight, Megaphone } from "lucide-react";
import Link from "next/link";

import type { IMarketingContent } from "@/features/cms/types";

interface IAnnouncementCardProps {
  announcement: IMarketingContent;
  variant?: "featured" | "default";
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FeaturedAnnouncementCard({
  announcement,
}: {
  announcement: IMarketingContent;
}) {
  const formattedDate = announcement.publishedAt
    ? formatDate(announcement.publishedAt)
    : null;

  return (
    <Link
      href={`/announcements/${announcement.slug}`}
      className="group block bg-gradient-to-br from-sky-500/20 via-blue-600/15 to-purple-600/20 rounded-2xl p-6 sm:p-8 border border-sky-400/30 hover:border-sky-400/50 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
          <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-sky-400/20 text-sky-300 text-xs font-semibold uppercase tracking-wide">
              Latest
            </span>
            {formattedDate && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">
            {announcement.title}
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4 line-clamp-2">
            {announcement.summary}
          </p>
          <span className="inline-flex items-center gap-2 text-sky-400 group-hover:text-sky-300 text-sm font-semibold transition-colors">
            Read more
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function AnnouncementCard({
  announcement,
  variant = "default",
}: IAnnouncementCardProps) {
  if (variant === "featured") {
    return <FeaturedAnnouncementCard announcement={announcement} />;
  }

  const formattedDate = announcement.publishedAt
    ? formatDate(announcement.publishedAt)
    : null;

  return (
    <Link
      href={`/announcements/${announcement.slug}`}
      className="group block bg-gradient-to-b from-[#0D2844]/80 to-[#0A1F35]/80 rounded-xl p-5 border border-white/5 hover:border-sky-500/30 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
          <Bell className="w-5 h-5 text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          {formattedDate && (
            <span className="flex items-center gap-1 text-xs text-slate-500 mb-1.5">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          )}
          <h4 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-sky-300 transition-colors line-clamp-1">
            {announcement.title}
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
            {announcement.summary}
          </p>
          <span className="inline-flex items-center gap-1 text-sky-400 group-hover:text-sky-300 text-xs font-semibold transition-colors">
            Read more
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
