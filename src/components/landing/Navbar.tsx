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
    <header className="flex w-full h-[100px] mx-auto items-center justify-between gap-4 bg-[#0A1628] px-8">
      <Link href="/" className="flex items-center gap-3">
        <div className="relative w-[92px] h-[77px]">
          <Image
            src="/logo.png"
            alt={tLanding("brand.product")}
            fill
            sizes="92px"
            className="object-contain"
            priority
          />
        </div>
        <span className="sr-only">{tLanding("brand.name")}</span>
      </Link>
      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        <Link
          href="/auth/login"
          className="w-[122px] h-11 flex items-center justify-center rounded-[10px] border border-white/40 bg-slate-900/60 text-sm font-medium text-white transition hover:border-white/70 hover:bg-slate-900/80"
        >
          {tCommon("login")}
        </Link>
        <Link
          href="/auth/register"
          className="w-[150px] h-11 flex items-center justify-center rounded-[10px] bg-[#1298E5] text-sm font-semibold text-white shadow-lg transition hover:bg-[#1298E5]/90"
        >
          {tCommon("register")}
        </Link>
      </div>
    </header>
  );
}
