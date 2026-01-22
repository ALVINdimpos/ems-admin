"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import LocaleSwitcher from "@/components/LocaleSwitcher";
import RegisterModal from "@/components/RegisterModel";

export default function HomePage() {
  const t = useTranslations("home");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 text-black">
      <div className="absolute top-4 right-4">
        <LocaleSwitcher />
      </div>
      <section className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">{t("title")}</h1>
        <p className="text-black">{t("description")}</p>
        <p className="text-xl text-black mt-4">{t("welcome")}</p>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-6 px-6 h-11 rounded-lg bg-[#1298E5] text-white font-semibold hover:bg-blue-600 transition"
        >
          Register Event
        </button>
      </section>
      <RegisterModal open={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}
