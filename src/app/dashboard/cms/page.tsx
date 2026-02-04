"use client";

import {
  FileText,
  FolderTree,
  Tags,
  TrendingUp,
  Send,
  BarChart3,
} from "lucide-react";
import React from "react";

import {
  QuickAction,
  ContentTypeChart,
  StatusChart,
  RecentContentSection,
  DashboardHeader,
} from "./_components";

import { StatCard } from "@/features/cms/components";
import { useCmsStats } from "@/features/cms/hooks";
import type { ContentType, ContentStatus } from "@/features/cms/types";

export default function CmsPage() {
  const { stats, isLoading, error } = useCmsStats();

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
      <DashboardHeader
        title="CMS Dashboard"
        description="Manage your marketing content, categories, and tags"
        createHref="/dashboard/cms/content/new"
        createLabel="Create Content"
      />

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
          loading={isLoading}
        />
        <StatCard
          title="Published"
          value={displayStats.contentByStatus.PUBLISHED || 0}
          icon={Send}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          loading={isLoading}
        />
        <StatCard
          title="Categories"
          value={`${displayStats.activeCategories}/${displayStats.totalCategories}`}
          icon={FolderTree}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          loading={isLoading}
        />
        <StatCard
          title="Tags"
          value={`${displayStats.activeTags}/${displayStats.totalTags}`}
          icon={Tags}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          loading={isLoading}
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
            loading={isLoading}
          />
        </div>

        {/* Content by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            Content by Status
          </h2>
          <StatusChart
            data={displayStats.contentByStatus}
            loading={isLoading}
          />
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
      <RecentContentSection
        contents={displayStats.recentContent}
        loading={isLoading}
      />
    </div>
  );
}
