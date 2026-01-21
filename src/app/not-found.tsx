"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("errors.404");

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <section className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {t("description")}
        </p>
        <Link href="/">
          <Button size="lg">{t("backHome")}</Button>
        </Link>
      </section>
    </main>
  );
}
