"use client";

import {
  ArrowLeft,
  Bell,
  Calendar,
  ChevronRight,
  Filter,
  Megaphone,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useAnnouncements } from "@/features/cms/hooks";
import type { IMarketingContent } from "@/features/cms/types";

interface IAnnouncementCardProps {
  announcement: IMarketingContent;
  variant?: "featured" | "default";
}

function AnnouncementCard({
  announcement,
  variant = "default",
}: IAnnouncementCardProps) {
  const formattedDate = announcement.publishedAt
    ? new Date(announcement.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  if (variant === "featured") {
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

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Featured skeleton */}
      <div className="bg-gradient-to-br from-sky-500/10 to-purple-600/10 rounded-2xl p-6 sm:p-8 border border-sky-400/20 animate-pulse">
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
    </div>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-6">
        <Megaphone className="w-10 h-10 text-sky-400/50" />
      </div>
      <h3 className="text-xl font-semibold text-slate-300 mb-2">
        {searchQuery ? "No announcements found" : "No announcements yet"}
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        {searchQuery
          ? `We couldn't find any announcements matching "${searchQuery}". Try a different search term.`
          : "Stay tuned! We'll share important updates and news here."}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}

export default function AnnouncementsPage() {
  const { announcements, isLoading, error } = useAnnouncements(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Filter announcements based on search query
  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort announcements
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const [featuredAnnouncement, ...restAnnouncements] = sortedAnnouncements;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600/20 via-blue-600/20 to-purple-600/20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Megaphone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Announcements
              </h1>
              <p className="text-slate-400 mt-1">
                Stay updated with our latest news and updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* Count */}
            <span className="text-sm text-slate-500">
              {filteredAnnouncements.length} announcement
              {filteredAnnouncements.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : sortedAnnouncements.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <div className="space-y-8">
            {/* Featured Announcement */}
            {featuredAnnouncement && (
              <AnnouncementCard
                announcement={featuredAnnouncement}
                variant="featured"
              />
            )}

            {/* Rest of Announcements */}
            {restAnnouncements.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {restAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
