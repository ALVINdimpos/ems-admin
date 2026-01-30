"use client";

import { locales, localeNames } from "@/i18n/config";
import { useLocaleContext } from "@/providers/LocaleProvider";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleContext();

  return (
    <div className="flex items-center gap-1 rounded-[10px] border border-white/20 bg-white/5 p-1 backdrop-blur">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
            locale === loc
              ? "bg-[#1298E5] text-white shadow-md"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
          aria-label={`Switch to ${localeNames[loc]}`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
