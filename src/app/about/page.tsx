"use client";

import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-pink-100">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-gray-600">{t("description")}</p>
      </section>
    </main>
  );
}
