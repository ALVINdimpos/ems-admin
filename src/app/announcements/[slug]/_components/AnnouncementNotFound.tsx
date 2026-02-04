import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface IAnnouncementNotFoundProps {
  error?: string | null;
}

export function AnnouncementNotFound({ error }: IAnnouncementNotFoundProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Announcement Not Found
          </h1>
          <p className="text-slate-400 mb-6">
            {error ||
              "The announcement you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
