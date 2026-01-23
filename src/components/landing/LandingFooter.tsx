import Image from "next/image";
import Link from "next/link";

import { QuickLink, TranslateFn } from "@/lib/constants/landing";

type LandingFooterProps = {
  tLanding: TranslateFn;
  quickLinks: QuickLink[];
  socials: string[];
};

const SocialIcon = ({ name }: { name: string }) => {
  switch (name) {
    case "X":
      return (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5 5 14 14M19 5 5 19"
          />
        </svg>
      );
    case "IN":
      return (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="currentColor"
        >
          <path d="M6.94 8.56H4.3V19h2.64zM5.62 7.21a1.54 1.54 0 1 0 0-3.08 1.54 1.54 0 0 0 0 3.08Zm4.68 11.79H7.7V8.56h2.48v1.43h.04c.35-.67 1.2-1.38 2.47-1.38 2.64 0 3.13 1.74 3.13 4v6.36h-2.64v-5.64c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.98z" />
        </svg>
      );
    case "FB":
      return (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="currentColor"
        >
          <path d="M13.2 20.9v-7h2.35l.35-2.73H13.2V9.14c0-.79.22-1.32 1.36-1.32h1.45V5.33c-.25-.03-1.12-.11-2.12-.11-2.1 0-3.53 1.28-3.53 3.62v2.02H7.95v2.73h2.41v7z" />
        </svg>
      );
    case "MAIL":
      return (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 7.75 12 13l7.5-5.25"
          />
          <rect x={4} y={6} width={16} height={12} rx={2} />
        </svg>
      );
    default:
      return null;
  }
};

const ArrowIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      d="M5.5 5L11.7929 11.2929C12.1834 11.6834 12.1834 12.3166 11.7929 12.7071L5.5 19"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 5L19.7929 11.2929C20.1834 11.6834 20.1834 12.3166 19.7929 12.7071L13.5 19"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function LandingFooter({
  tLanding,
  quickLinks,
  socials,
}: LandingFooterProps) {
  return (
    <footer className="relative overflow-hidden bg-slate-950 pb-12 pt-10">
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

      <div className="relative max-w-6xl mx-auto px-4 lg:px-6 space-y-10">
        <Image
          src="/logo.png"
          alt={tLanding("brand.product")}
          width={100}
          height={50}
          className="h-auto w-auto"
        />
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-base font-semibold text-white">
                  {tLanding("brand.product")}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 max-w-sm">
              {tLanding("footer.description")}
            </p>
            <div className="flex gap-3">
              {socials.map((item) => (
                <button
                  key={item}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-white/80 transition hover:border-sky-500/50"
                  aria-label={`${item} ${tLanding("footer.socialLabel")}`}
                >
                  <SocialIcon name={item} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">
              {tLanding("footer.quickLinksTitle")}
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {quickLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-3 rounded-lg px-2 py-1 transition hover:text-white"
                  >
                    <span className="text-[#2CE39A] transition group-hover:translate-x-0.5">
                      <ArrowIcon />
                    </span>
                    {tLanding(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">
              {tLanding("footer.contact.title")}
            </h3>
            <p className="text-sm text-slate-300">
              {tLanding("footer.contact.address")}
            </p>
            <div>
              <p className="text-sm font-semibold text-white">
                {tLanding("footer.contact.phoneLabel")}
              </p>
              <p className="text-sm text-slate-300">
                {tLanding("footer.contact.phone")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400">
          <p>
            {tLanding("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#" className="hover:text-white">
              {tLanding("footer.legal.privacy")}
            </Link>
            <Link href="#" className="hover:text-white">
              {tLanding("footer.legal.terms")}
            </Link>
            <Link href="#" className="hover:text-white">
              {tLanding("footer.legal.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
