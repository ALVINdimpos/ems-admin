import { ArrowLeft, Megaphone } from "lucide-react";
import Link from "next/link";

export function AnnouncementsHeader() {
  return (
    <div className="bg-gradient-to-r from-sky-600/20 via-blue-600/20 to-purple-600/20 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <Megaphone className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Announcements
            </h1>
            <p className="text-slate-400 mt-1">
              Stay updated with our latest news and updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
