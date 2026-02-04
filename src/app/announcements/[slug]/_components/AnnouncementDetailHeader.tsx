import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface IAnnouncementDetailHeaderProps {
  title: string;
  summary?: string;
  status?: string;
}

export function AnnouncementDetailHeader({
  title,
  summary,
  status,
}: IAnnouncementDetailHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-sky-600/20 via-blue-600/20 to-purple-600/20 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wide border border-sky-500/30">
            Announcement
          </span>
          {status === "PUBLISHED" && (
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">
              Published
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          {title}
        </h1>

        {summary && (
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
            {summary}
          </p>
        )}
      </div>
    </div>
  );
}
