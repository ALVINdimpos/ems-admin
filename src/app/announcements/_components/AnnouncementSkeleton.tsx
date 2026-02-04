export function AnnouncementsSkeleton() {
  return (
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
  );
}

export function AnnouncementDetailSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-slate-800 rounded" />
          <div className="h-12 w-3/4 bg-slate-800 rounded" />
          <div className="h-6 w-1/2 bg-slate-800 rounded" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-800 rounded" />
            <div className="h-4 w-2/3 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
