"use client";

import { useState } from "react";

import {
  AnnouncementsHeader,
  AnnouncementsFilter,
  AnnouncementsList,
  AnnouncementsSkeleton,
  AnnouncementEmptyState,
  ErrorAlert,
} from "./_components";

import { useAnnouncements } from "@/features/cms/hooks";

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <AnnouncementsHeader />

      {/* Filters & Search */}
      <AnnouncementsFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        totalCount={filteredAnnouncements.length}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <AnnouncementsSkeleton />
        ) : error ? (
          <ErrorAlert message={error} />
        ) : sortedAnnouncements.length === 0 ? (
          <AnnouncementEmptyState searchQuery={searchQuery} />
        ) : (
          <AnnouncementsList announcements={sortedAnnouncements} />
        )}
      </div>
    </main>
  );
}
