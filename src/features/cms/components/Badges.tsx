"use client";

import React from "react";

import type { ContentStatus, ContentType } from "../types";

import { cn } from "@/lib/utils";

// Status Badge
interface IStatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

const STATUS_STYLES: Record<
  ContentStatus,
  { bg: string; text: string; label: string }
> = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
  PUBLISHED: { bg: "bg-green-100", text: "text-green-700", label: "Published" },
  ARCHIVED: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Archived" },
  SCHEDULED: { bg: "bg-blue-100", text: "text-blue-700", label: "Scheduled" },
};

const FALLBACK_STATUS_STYLE = {
  bg: "bg-gray-100",
  text: "text-gray-500",
  label: "Unknown",
};

export function StatusBadge({ status, className }: IStatusBadgeProps) {
  const styles = STATUS_STYLES[status] ?? FALLBACK_STATUS_STYLE;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles.bg,
        styles.text,
        className
      )}
    >
      {styles.label}
    </span>
  );
}

// Content Type Badge
interface ITypeBadgeProps {
  type: ContentType;
  className?: string;
}

const TYPE_STYLES: Record<
  ContentType,
  { bg: string; text: string; label: string }
> = {
  BANNER: { bg: "bg-purple-100", text: "text-purple-700", label: "Banner" },
  NEWS: { bg: "bg-indigo-100", text: "text-indigo-700", label: "News" },
  ANNOUNCEMENT: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    label: "Announcement",
  },
  TESTIMONIAL: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    label: "Testimonial",
  },
  FAQ: { bg: "bg-amber-100", text: "text-amber-700", label: "FAQ" },
  GALLERY: { bg: "bg-pink-100", text: "text-pink-700", label: "Gallery" },
  VIDEO: { bg: "bg-teal-100", text: "text-teal-700", label: "Video" },
  TEXT_BLOCK: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Text Block",
  },
  CONTACT_INFO: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Contact Info",
  },
  SOCIAL_LINKS: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    label: "Social Links",
  },
};

const FALLBACK_TYPE_STYLE = {
  bg: "bg-gray-100",
  text: "text-gray-500",
  label: "Other",
};

export function TypeBadge({ type, className }: ITypeBadgeProps) {
  const styles = TYPE_STYLES[type] ?? FALLBACK_TYPE_STYLE;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles.bg,
        styles.text,
        className
      )}
    >
      {styles.label}
    </span>
  );
}

// Tag Badge with custom color
interface ITagBadgeProps {
  name: string;
  color: string;
  onRemove?: () => void;
  className?: string;
}

export function TagBadge({ name, color, onRemove, className }: ITagBadgeProps) {
  // Determine if color is light for text contrast
  const isLight = isLightColor(color);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        className
      )}
      style={{
        backgroundColor: color,
        color: isLight ? "#1F2937" : "#FFFFFF",
      }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:opacity-75 focus:outline-none"
          aria-label={`Remove ${name} tag`}
        >
          ×
        </button>
      )}
    </span>
  );
}

// Active/Inactive Badge
interface IActiveBadgeProps {
  isActive: boolean;
  className?: string;
}

export function ActiveBadge({ isActive, className }: IActiveBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-green-500" : "bg-gray-400"
        )}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// Priority Badge
interface IPriorityBadgeProps {
  priority: number;
  className?: string;
}

export function PriorityBadge({ priority, className }: IPriorityBadgeProps) {
  const getPriorityLevel = (p: number) => {
    if (p >= 80)
      return { label: "High", bg: "bg-red-100", text: "text-red-700" };
    if (p >= 50)
      return { label: "Medium", bg: "bg-yellow-100", text: "text-yellow-700" };
    if (p >= 20)
      return { label: "Low", bg: "bg-blue-100", text: "text-blue-700" };
    return { label: "None", bg: "bg-gray-100", text: "text-gray-500" };
  };

  const level = getPriorityLevel(priority);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        level.bg,
        level.text,
        className
      )}
    >
      {level.label} ({priority})
    </span>
  );
}

// Utility function
function isLightColor(color: string): boolean {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return true;
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
