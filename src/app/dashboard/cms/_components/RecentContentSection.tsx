"use client";

import { Clock, FileEdit, FileText, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { TypeBadge, StatusBadge } from "@/features/cms/components";
import type { IMarketingContent } from "@/features/cms/types";

interface IRecentContentListProps {
  contents: IMarketingContent[];
  loading?: boolean;
}

export function RecentContentList({
  contents,
  loading,
}: IRecentContentListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
          >
            <div className="h-10 w-10 bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <FileEdit className="h-12 w-12 mb-2 opacity-50" />
        <p>No content created yet</p>
        <Link
          href="/dashboard/cms/content/new"
          className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
        >
          Create your first content
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contents.slice(0, 5).map((content) => (
        <Link
          key={content.id}
          href={`/dashboard/cms/content/${content.id}`}
          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {content.featuredImage ? (
            <Image
              src={content.featuredImage}
              alt={content.title}
              width={40}
              height={40}
              className="rounded object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {content.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <TypeBadge type={content.type} />
              <StatusBadge status={content.status} />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(content.createdAt).toLocaleDateString()}
          </div>
        </Link>
      ))}
    </div>
  );
}

interface IRecentContentSectionProps {
  contents: IMarketingContent[];
  loading?: boolean;
}

export function RecentContentSection({
  contents,
  loading,
}: IRecentContentSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          Recent Content
        </h2>
        <Link
          href="/dashboard/cms/content"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <RecentContentList contents={contents} loading={loading} />
    </div>
  );
}
