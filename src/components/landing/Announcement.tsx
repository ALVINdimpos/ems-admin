"use client";

import { Bell, Calendar, ChevronRight, Megaphone } from "lucide-react";
import Link from "next/link";

import { useAnnouncements } from "@/features/cms/hooks";
import type { IMarketingContent } from "@/features/cms/types";

interface IAnnouncementCardProps {
  announcement: IMarketingContent;
  isFirst?: boolean;
}

function AnnouncementCard({ announcement, isFirst }: IAnnouncementCardProps) {
  const formattedDate = announcement.publishedAt
    ? new Date(announcement.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  if (isFirst) {
    // Featured announcement card (larger)
    return (
      <div className="group bg-gradient-to-br from-sky-500/20 via-blue-600/15 to-purple-600/20 rounded-2xl p-6 sm:p-8 border border-sky-400/30 hover:border-sky-400/50 transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-sky-400/20 text-sky-300 text-xs font-semibold uppercase tracking-wide">
                Featured
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
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              {announcement.summary}
            </p>
            <Link
              href={`/announcements/${announcement.id}`}
              className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-semibold transition-colors group/link"
            >
              Read more
              <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Regular announcement card
  return (
    <div className="group bg-gradient-to-b from-[#0D2844]/80 to-[#0A1F35]/80 rounded-xl p-5 border border-white/5 hover:border-sky-500/30 transition-all duration-300 backdrop-blur-sm">
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
          <Link
            href={`/announcements/${announcement.id}`}
            className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs font-semibold transition-colors"
          >
            Learn more
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      {/* Featured skeleton */}
      <div className="lg:col-span-2 bg-gradient-to-br from-sky-500/10 to-purple-600/10 rounded-2xl p-6 sm:p-8 border border-sky-400/20 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-700" />
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              <div className="w-16 h-5 rounded-full bg-slate-700" />
              <div className="w-24 h-5 rounded bg-slate-700" />
            </div>
            <div className="w-3/4 h-7 rounded bg-slate-700 mb-3" />
            <div className="w-full h-4 rounded bg-slate-700 mb-2" />
            <div className="w-2/3 h-4 rounded bg-slate-700" />
          </div>
        </div>
      </div>
      {/* Regular skeletons */}
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-[#0D2844]/50 rounded-xl p-5 border border-white/5 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-700" />
            <div className="flex-1">
              <div className="w-20 h-3 rounded bg-slate-700 mb-2" />
              <div className="w-full h-5 rounded bg-slate-700 mb-2" />
              <div className="w-3/4 h-4 rounded bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnnouncementSection() {
  const { announcements, isLoading, error } = useAnnouncements(5);

  // Don't render the section at all if there's an error or no announcements
  if (!isLoading && (error || announcements.length === 0)) {
    return null;
  }

  return (
    <section className="relative w-full bg-gradient-to-b from-[#0A2540] via-[#0D2137] to-[#0A1628] py-16 sm:py-20 lg:py-28">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-sky-500/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-5 py-2 rounded-full border border-sky-400/40 bg-sky-500/10 text-xs font-semibold uppercase tracking-widest text-sky-300 backdrop-blur mb-6">
            Latest Updates
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Announcements &amp;
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Important News
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Stay informed with the latest updates, features, and important
            notices from our team.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Featured announcement (first one) */}
            {announcements[0] && (
              <div className="lg:col-span-2">
                <AnnouncementCard announcement={announcements[0]} isFirst />
              </div>
            )}

            {/* Other announcements */}
            {announcements.slice(1).map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        {announcements.length > 0 && (
          <div className="text-center mt-10 sm:mt-12">
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
            >
              View All Announcements
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
