import { ArrowLeft, Megaphone } from "lucide-react";
import Link from "next/link";

export default function AnnouncementsLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
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

      {/* Loading Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="w-full sm:w-80 h-10 bg-slate-800/50 rounded-lg animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-32 h-10 bg-slate-800/50 rounded-lg animate-pulse" />
            <div className="w-24 h-5 bg-slate-800/50 rounded animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          {/* Featured skeleton */}
          <div className="bg-gradient-to-br from-sky-500/10 to-purple-600/10 rounded-2xl p-6 sm:p-8 border border-sky-400/20 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-700" />
              <div className="flex-1">
                <div className="flex gap-2 mb-3">
                  <div className="w-16 h-5 rounded-full bg-slate-700" />
                  <div className="w-24 h-5 rounded bg-slate-700" />
                </div>
                <div className="w-3/4 h-7 rounded bg-slate-700 mb-3" />
                <div className="w-full h-4 rounded bg-slate-700 mb-2" />
                <div className="w-2/3 h-4 rounded bg-slate-700" />
              </div>
            </div>
          </div>

          {/* Regular skeletons */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#0D2844]/50 rounded-xl p-5 border border-white/5 animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-700" />
                  <div className="flex-1">
                    <div className="w-20 h-3 rounded bg-slate-700 mb-2" />
                    <div className="w-full h-5 rounded bg-slate-700 mb-2" />
                    <div className="w-3/4 h-4 rounded bg-slate-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
