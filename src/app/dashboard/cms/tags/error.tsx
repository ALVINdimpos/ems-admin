"use client";

import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function TagsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tags Error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Failed to load tags
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          We couldn&apos;t load the tags. Please try again.
        </p>

        {error.digest && (
          <p className="text-xs text-gray-400 mb-4 font-mono bg-gray-50 py-1 px-2 rounded">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/dashboard/cms"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CMS
          </Link>
        </div>
      </div>
    </div>
  );
}
