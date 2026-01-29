"use client";

import {
  FileText,
  FolderTree,
  Tags,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  BarChart3,
  Send,
  FileEdit,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { StatCard, StatusBadge, TypeBadge } from "@/features/cms/components";
import { useCMSStats } from "@/features/cms/hooks";
import type { ContentType, ContentStatus } from "@/features/cms/types";

// Quick action card component
interface IQuickActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function QuickAction({ href, icon, title, description }: IQuickActionProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
    </Link>
  );
}

// Content type distribution chart (simplified bar chart)
interface IDistributionChartProps {
  data: Record<ContentType, number>;
  loading?: boolean;
}

function ContentTypeChart({ data, loading }: IDistributionChartProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  const types = Object.entries(data) as [ContentType, number][];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
            <div className="h-6 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <BarChart3 className="h-12 w-12 mb-2 opacity-50" />
        <p>No content yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {types
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => {
          const percentage = Math.round((count / total) * 100);
          return (
            <div key={type}>
              <div className="flex items-center justify-between mb-1">
                <TypeBadge type={type} />
                <span className="text-sm font-medium text-gray-600">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}

// Status distribution component
interface IStatusChartProps {
  data: Record<ContentStatus, number>;
  loading?: boolean;
}

function StatusChart({ data, loading }: IStatusChartProps) {
  const statuses = Object.entries(data) as [ContentStatus, number][];
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2" />
            <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {statuses.map(([status, count]) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div
            key={status}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
            <StatusBadge status={status} />
            <div className="text-xs text-gray-500 mt-1">{percentage}%</div>
          </div>
        );
      })}
    </div>
  );
}

export default function CmsPage() {
  const { stats, loading, error } = useCMSStats();

  // Default stats for loading/empty state
  const defaultStats = {
    totalContent: 0,
    contentByType: {} as Record<ContentType, number>,
    contentByStatus: {
      DRAFT: 0,
      PUBLISHED: 0,
      ARCHIVED: 0,
      SCHEDULED: 0,
    } as Record<ContentStatus, number>,
    activeCategories: 0,
    totalCategories: 0,
    activeTags: 0,
    totalTags: 0,
    recentContent: [],
    popularContent: [],
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage your marketing content, categories, and tags
          </p>
        </div>
        <Link
          href="/dashboard/cms/content/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          Create Content
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Content"
          value={displayStats.totalContent}
          icon={FileText}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          loading={loading}
        />
        <StatCard
          title="Published"
          value={displayStats.contentByStatus.PUBLISHED || 0}
          icon={Send}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          loading={loading}
        />
        <StatCard
          title="Categories"
          value={`${displayStats.activeCategories}/${displayStats.totalCategories}`}
          icon={FolderTree}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          loading={loading}
        />
        <StatCard
          title="Tags"
          value={`${displayStats.activeTags}/${displayStats.totalTags}`}
          icon={Tags}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content by Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            Content by Type
          </h2>
          <ContentTypeChart
            data={displayStats.contentByType}
            loading={loading}
          />
        </div>

        {/* Content by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            Content by Status
          </h2>
          <StatusChart data={displayStats.contentByStatus} loading={loading} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            href="/dashboard/cms/content"
            icon={<FileText className="h-6 w-6" />}
            title="Manage Content"
            description="View, edit, and organize all marketing content"
          />
          <QuickAction
            href="/dashboard/cms/categories"
            icon={<FolderTree className="h-6 w-6" />}
            title="Manage Categories"
            description="Organize content with categories"
          />
          <QuickAction
            href="/dashboard/cms/tags"
            icon={<Tags className="h-6 w-6" />}
            title="Manage Tags"
            description="Create and manage content tags"
          />
        </div>
      </div>

      {/* Recent Content */}
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

        {loading ? (
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
        ) : displayStats.recentContent.length === 0 ? (
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
        ) : (
          <div className="space-y-3">
            {displayStats.recentContent.slice(0, 5).map((content) => (
              <Link
                key={content.id}
                href={`/dashboard/cms/content/${content.id}`}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {content.featuredImage ? (
                  <img
                    src={content.featuredImage}
                    alt=""
                    className="h-10 w-10 rounded object-cover"
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
        )}
      </div>
    </div>
  );
}

