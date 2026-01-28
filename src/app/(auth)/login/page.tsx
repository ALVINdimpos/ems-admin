"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import logo from "../../../../public/logo.png";

import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  const t = useTranslations("auth.login");

  return (
    <main
      className="relative h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/login-background-image.png')" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <section className="relative z-10 w-full max-w-[370px] max-h-[95vh] overflow-y-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-[10px] shadow-xl px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image
              src={logo}
              alt="Company Logo"
              width={140}
              height={80}
              className="h-[50px] sm:h-[70px] w-auto object-contain"
            />
          </Link>
        </div>
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-[22px] font-bold text-white mb-1">
            {t("title")}
          </h1>
          <p className="text-white/70 text-xs sm:text-sm">{t("subtitle")}</p>
        </div>

        <LoginForm />
        <div className="mt-5">
          <p className="text-center text-white/40 text-xs mt-3">
            {t("contactUs")}
          </p>
        </div>
      </section>
    </main>
  );
}
