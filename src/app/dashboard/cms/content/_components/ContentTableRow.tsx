"use client";

import { MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ContentActionMenu } from "./ContentActionMenu";

import { StatusBadge, TypeBadge, TagBadge } from "@/features/cms/components";
import type { IMarketingContent } from "@/features/cms/types";

interface IContentTableRowProps {
  content: IMarketingContent;
  isSelected: boolean;
  isMenuOpen: boolean;
  onSelect: () => void;
  onMenuToggle: () => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContentTableRow({
  content,
  isSelected,
  isMenuOpen,
  onSelect,
  onMenuToggle,
  onPublish,
  onArchive,
  onDelete,
}: IContentTableRowProps) {
  return (
    <tr className={`hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`}>
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {content.featuredImage ? (
            <Image
              src={content.featuredImage}
              alt={content.title}
              width={40}
              height={40}
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
              No img
            </div>
          )}
          <div>
            <Link
              href={`/dashboard/cms/content/${content.id}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {content.title}
            </Link>
            {content.summary && (
              <p className="text-sm text-gray-500 truncate max-w-xs">
                {content.summary}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <TypeBadge type={content.type} />
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={content.status} />
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">
        {content.category?.name || "-"}
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {content.tags?.slice(0, 2).map((tag) => (
            <TagBadge key={tag.id} name={tag.name} color={tag.color} />
          ))}
          {content.tags && content.tags.length > 2 && (
            <span className="text-xs text-gray-500">
              +{content.tags.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {new Date(content.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-4">
        <div className="relative flex justify-end">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>

          {isMenuOpen && (
            <ContentActionMenu
              contentId={content.id}
              status={content.status}
              onPublish={onPublish}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
