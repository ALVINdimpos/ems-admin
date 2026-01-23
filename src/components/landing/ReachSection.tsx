import Image from "next/image";
import Link from "next/link";

import { TranslateFn } from "@/lib/constants/landing";

type ReachSectionProps = {
  tLanding: TranslateFn;
};

export function ReachSection({ tLanding }: ReachSectionProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16">
      <div className="absolute inset-0 opacity-60">
        <Image
          src="/Rectangle%20157978.png"
          alt={tLanding("reach.backgroundAlt")}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 lg:px-6">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-10 shadow-2xl backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <p className="w-fit rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                {tLanding("reach.pill")}
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {tLanding("reach.title")}
              </h2>
              <p className="text-base text-slate-300">
                {tLanding("reach.description")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
                >
                  {tLanding("reach.ctaPrimary")}
                </Link>
                <Link
                  href="/about"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60"
                >
                  {tLanding("reach.ctaSecondary")}
                </Link>
              </div>
            </div>
            <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
              <Image
                src="/globe.svg"
                alt={tLanding("reach.globeAlt")}
                fill
                sizes="100vw"
                className="object-contain p-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
