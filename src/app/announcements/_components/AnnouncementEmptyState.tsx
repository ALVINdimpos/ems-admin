import { ArrowLeft, Megaphone } from "lucide-react";
import Link from "next/link";

interface IAnnouncementEmptyStateProps {
  searchQuery: string;
}

export function AnnouncementEmptyState({
  searchQuery,
}: IAnnouncementEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-6">
        <Megaphone className="w-10 h-10 text-sky-400/50" />
      </div>
      <h3 className="text-xl font-semibold text-slate-300 mb-2">
        {searchQuery ? "No announcements found" : "No announcements yet"}
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        {searchQuery
          ? `We couldn't find any announcements matching "${searchQuery}". Try a different search term.`
          : "Stay tuned! We'll share important updates and news here."}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
