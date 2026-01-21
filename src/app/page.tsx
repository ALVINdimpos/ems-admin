"use client";

import { useTranslations } from "next-intl";

import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 text-black">
      <div className="absolute top-4 right-4">
        <LocaleSwitcher />
      </div>
      <section className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">{t("title")}</h1>
        <p className="text-black">{t("description")}</p>
        <p className="text-xl text-black mt-4">{t("welcome")}</p>
      </section>
    </main>
  );
}
