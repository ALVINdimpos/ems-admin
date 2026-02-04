import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AnnouncementDetailLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-sky-600/20 via-blue-600/20 to-purple-600/20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="animate-pulse">
            <div className="flex gap-2 mb-4">
              <div className="w-24 h-6 rounded-full bg-slate-700" />
              <div className="w-20 h-6 rounded-full bg-slate-700" />
            </div>
            <div className="w-3/4 h-12 rounded bg-slate-700 mb-4" />
            <div className="w-full h-6 rounded bg-slate-700" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8 animate-pulse">
              <div className="space-y-4">
                <div className="w-full h-5 rounded bg-slate-700" />
                <div className="w-full h-5 rounded bg-slate-700" />
                <div className="w-3/4 h-5 rounded bg-slate-700" />
                <div className="w-full h-5 rounded bg-slate-700" />
                <div className="w-5/6 h-5 rounded bg-slate-700" />
                <div className="w-full h-5 rounded bg-slate-700" />
                <div className="w-2/3 h-5 rounded bg-slate-700" />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="space-y-6 animate-pulse">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
              <div className="w-16 h-4 rounded bg-slate-700 mb-4" />
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-slate-700" />
                  <div className="flex-1">
                    <div className="w-16 h-3 rounded bg-slate-700 mb-1" />
                    <div className="w-32 h-4 rounded bg-slate-700" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-slate-700" />
                  <div className="flex-1">
                    <div className="w-16 h-3 rounded bg-slate-700 mb-1" />
                    <div className="w-40 h-4 rounded bg-slate-700" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
              <div className="w-12 h-4 rounded bg-slate-700 mb-4" />
              <div className="flex flex-wrap gap-2">
                <div className="w-16 h-6 rounded-full bg-slate-700" />
                <div className="w-20 h-6 rounded-full bg-slate-700" />
                <div className="w-14 h-6 rounded-full bg-slate-700" />
              </div>
            </div>

            <div className="w-full h-12 rounded-xl bg-slate-700" />
          </aside>
        </div>
      </div>
    </main>
  );
}
