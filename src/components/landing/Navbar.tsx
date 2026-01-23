"use client";
import Image from "next/image";
import Link from "next/link";

import LocaleSwitcher from "@/components/LocaleSwitcher";
import { TranslateFn } from "@/lib/constants/landing";

type NavbarProps = {
  tLanding: TranslateFn;
  tCommon: TranslateFn;
};

export function Navbar({ tLanding, tCommon }: NavbarProps) {
  return (
    <header className="flex w-full min-h-[80px] lg:h-[100px] mx-auto items-center justify-between gap-2 sm:gap-4 bg-[#0A1628] px-4 sm:px-6 lg:px-8 py-4">
      <Link href="/" className="flex items-center gap-2 sm:gap-3">
        <div className="relative w-[60px] h-[50px] sm:w-[76px] sm:h-[63px] lg:w-[92px] lg:h-[77px]">
          <Image
            src="/logo.png"
            alt={tLanding("brand.product")}
            fill
            sizes="(max-width: 640px) 60px, (max-width: 1024px) 76px, 92px"
            className="object-contain"
            priority
          />
        </div>
        <span className="sr-only">{tLanding("brand.name")}</span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <LocaleSwitcher />
        <Link
          href="/auth/login"
          className="hidden sm:flex w-[100px] sm:w-[122px] h-9 sm:h-11 items-center justify-center rounded-lg sm:rounded-[10px] border border-white/40 bg-slate-900/60 text-xs sm:text-sm font-medium text-white transition hover:border-white/70 hover:bg-slate-900/80"
        >
          {tCommon("login")}
        </Link>
        <Link
          href="/auth/register"
          className="w-[110px] sm:w-[150px] h-9 sm:h-11 flex items-center justify-center rounded-lg sm:rounded-[10px] bg-[#1298E5] text-xs sm:text-sm font-semibold text-white shadow-lg transition hover:bg-[#1298E5]/90"
        >
          {tCommon("register")}
        </Link>
      </div>
    </header>
  );
}
