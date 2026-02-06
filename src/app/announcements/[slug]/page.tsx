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
  const id = params.slug as string;

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
        // Fetch the single published announcement by ID (public endpoint)
        const response = await cmsApi.content.getPublishedById(id);

        if (response.success && response.data) {
          setAnnouncement(response.data);
        } else {
          setError(response.error || "Announcement not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

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
