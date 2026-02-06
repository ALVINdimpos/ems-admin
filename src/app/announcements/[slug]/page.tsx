"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AnnouncementDetailSkeleton } from "../_components";

import {
  AnnouncementDetailHeader,
  AnnouncementContent,
  AnnouncementSidebar,
  AnnouncementNotFound,
} from "./_components";

import { cmsApi } from "@/features/cms/api";
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
        // Get all active announcements and find by title/slug
        const decodedSlug = decodeURIComponent(slug);
        const allContent = await cmsApi.content.getAll({
          type: "ANNOUNCEMENT",
          isActive: true,
        });

        if (allContent.success && allContent.data) {
          const found = allContent.data.data.find(
            (c) =>
              c.title.toLowerCase().replace(/\s+/g, "-") ===
                slug.toLowerCase() ||
              c.title === decodedSlug ||
              c.title.toLowerCase() === slug.toLowerCase()
          );
          if (found) {
            setAnnouncement(found);
            return;
          }
        }

        setError("Announcement not found");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, [slug]);

  if (isLoading) {
    return <AnnouncementDetailSkeleton />;
  }

  if (error || !announcement) {
    return <AnnouncementNotFound error={error} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <AnnouncementDetailHeader
        title={announcement.title}
        summary={announcement.summary}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnnouncementContent content={announcement.content} />
          </div>

          {/* Sidebar */}
          <AnnouncementSidebar announcement={announcement} />
        </div>
      </div>
    </main>
  );
}
