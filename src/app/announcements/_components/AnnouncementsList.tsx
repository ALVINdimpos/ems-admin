"use client";

import { AnnouncementCard, FeaturedAnnouncementCard } from "./AnnouncementCard";

import type { IMarketingContent } from "@/features/cms/types";

interface IAnnouncementsListProps {
  announcements: IMarketingContent[];
}

export function AnnouncementsList({ announcements }: IAnnouncementsListProps) {
  if (announcements.length === 0) return null;

  const [featuredAnnouncement, ...restAnnouncements] = announcements;

  return (
    <div className="space-y-8">
      {/* Featured Announcement */}
      {featuredAnnouncement && (
        <FeaturedAnnouncementCard announcement={featuredAnnouncement} />
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
  );
}
