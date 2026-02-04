"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

interface IDashboardHeaderProps {
  title: string;
  description: string;
  createHref: string;
  createLabel: string;
}

export function DashboardHeader({
  title,
  description,
  createHref,
  createLabel,
}: IDashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 mt-1">{description}</p>
      </div>
      <Link
        href={createHref}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Plus className="h-4 w-4" />
        {createLabel}
      </Link>
    </div>
  );
}
