import { ArrowRight, Facebook, Linkedin, Mail, X } from "lucide-react";
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
      return <X className="h-5 w-5" />;
    case "IN":
      return <Linkedin className="h-5 w-5" />;
    case "FB":
      return <Facebook className="h-5 w-5" />;
    case "MAIL":
      return <Mail className="h-5 w-5" />;
    default:
      return null;
  }
};

const ArrowIcon = () => <ArrowRight className="h-4 w-4" />;

export function LandingFooter({
  tLanding,
  quickLinks,
  socials,
}: LandingFooterProps) {
  return (
    <footer className="relative overflow-hidden bg-slate-950 pb-8 sm:pb-12 pt-8 sm:pt-10">
      <div className="absolute inset-0 opacity-60">
        {/* <Image
          src="/login-background-image.png"
          alt={tLanding("reach.backgroundAlt")}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        /> */}
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <Image
          src="/logo.png"
          alt={tLanding("brand.product")}
          width={80}
          height={40}
          className="h-auto w-auto sm:w-[100px] sm:h-[50px]"
        />
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm sm:text-base font-semibold text-white">
                  {tLanding("brand.product")}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm">
              {tLanding("footer.description")}
            </p>
            <div className="flex gap-2 sm:gap-3">
              {socials.map((item) => (
                <button
                  key={item}
                  className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900 text-white/80 transition hover:border-sky-500/50"
                  aria-label={`${item} ${tLanding("footer.socialLabel")}`}
                >
                  <SocialIcon name={item} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              {tLanding("footer.quickLinksTitle")}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {quickLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-3 rounded-lg px-2 py-1 transition hover:text-white"
                  >
                    <span className="text-[#99A1AF] transition group-hover:translate-x-0.5">
                      <ArrowIcon />
                    </span>
                    {tLanding(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              {tLanding("footer.contact.title")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {tLanding("footer.contact.address")}
            </p>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {tLanding("footer.contact.phoneLabel")}
              </p>
              <p className="text-xs sm:text-sm text-slate-300">
                {tLanding("footer.contact.phone")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-t border-slate-800 pt-4 sm:pt-6 text-xs sm:text-sm text-slate-400">
          <p className="text-center sm:text-left w-full sm:w-auto">
            {tLanding("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start w-full sm:w-auto">
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
