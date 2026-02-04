"use client";

import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface IErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AnnouncementDetailError({ error, reset }: IErrorProps) {
  useEffect(() => {
    console.error("Announcement detail error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Failed to load announcement
        </h1>
        <p className="text-slate-400 mb-6">
          We couldn&apos;t load this announcement. Please try again.
        </p>

        {error.message && (
          <p className="text-sm text-red-400/80 bg-red-500/10 rounded-lg p-3 mb-6 border border-red-500/20">
            {error.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/announcements"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Announcements
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
