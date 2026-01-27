import { Calendar, Check, User } from "lucide-react";
import Link from "next/link";

import { Solution, TranslateFn } from "@/lib/constants/landing";

type SolutionsSectionProps = {
  tLanding: TranslateFn;
  solutions: Solution[];
};

const CheckIcon = ({
  className,
  color,
}: {
  className?: string;
  color: string;
}) => <Check className={className} style={{ color }} />;

const UserIcon = () => <User className="h-9 w-9 text-white" />;

const CalendarIcon = () => <Calendar className="h-9 w-9 text-white" />;

export function SolutionsSection({
  tLanding,
  solutions,
}: SolutionsSectionProps) {
  const solutionConfig = [
    {
      accent: "#1EBEF6",
      iconBg: "#1F455E",
      icon: <UserIcon />,
    },
    {
      accent: "#2CE39A",
      iconBg: "#1F3F39",
      icon: <CalendarIcon />,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#0E1725]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(53,146,255,0.12),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(44,227,154,0.16),transparent_28%),radial-gradient(circle_at_60%_80%,rgba(18,36,64,0.8),transparent_50%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:px-10 lg:px-16">
        <div className="mx-auto mb-8 sm:mb-10 flex max-w-3xl flex-col items-center text-center">
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-white/5 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            {/* <span className="h-2 w-2 rounded-full bg-[#1EBEF6]" /> */}
            {tLanding("solutions.pill")}
          </div>
          <h2 className="text-balance text-2xl sm:text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">
            {tLanding("solutions.title")}
          </h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            {tLanding("solutions.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {solutions.map((solution, index) => {
            const config = solutionConfig[index];
            return (
              <div
                key={solution.titleKey}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 lg:p-8 shadow-[0_20px_70px_-35px_rgba(0,0,0,0.8)] backdrop-blur"
              >
                <div
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
                  <span
                    className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl"
                    style={{ backgroundColor: config.iconBg }}
                  >
                    {config.icon}
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">
                      {tLanding(solution.titleKey)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {tLanding(solution.descriptionKey)}
                    </p>
                  </div>
                </div>

                <ul className="mb-8 space-y-3 text-sm text-slate-200">
                  {solution.highlightKeys.map((itemKey) => (
                    <li
                      key={itemKey}
                      className="flex items-start gap-3 leading-relaxed"
                    >
                      <span
                        className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/5"
                        style={{ color: config.accent }}
                      >
                        <CheckIcon className="h-4 w-4" color={config.accent} />
                      </span>
                      <span>{tLanding(itemKey)}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={solution.ctaHref}
                  className="inline-flex items-center justify-center w-full sm:w-auto sm:min-w-[155px] px-6 h-10 sm:h-12 rounded-lg sm:rounded-[10px] text-xs sm:text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1725] bg-[#1298E5] text-white shadow-lg"
                >
                  {tLanding(solution.ctaLabelKey)}
                </Link>

                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-20 "
                  style={{
                    background: `radial-gradient(circle, ${config.accent} 0%, transparent 60%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
