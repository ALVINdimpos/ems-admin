"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface IQuickActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function QuickAction({
  href,
  icon,
  title,
  description,
}: IQuickActionProps) {
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
