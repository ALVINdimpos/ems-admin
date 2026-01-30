"use client";

import { IntlProvider } from "next-intl";
import { createContext, useContext, useState } from "react";

import enMessages from "../../lang/en.json";

import frMessages from "../../lang/fr.json";

import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

const messages = {
  en: enMessages,
  fr: frMessages,
};

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Helper to get initial locale from cookie
function getInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  const savedLocale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="))
    ?.split("=")[1] as Locale | undefined;

  if (savedLocale && (savedLocale === "en" || savedLocale === "fr")) {
    return savedLocale;
  }

  return defaultLocale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Save to cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider
        locale={locale}
        messages={messages[locale] as typeof enMessages | typeof frMessages}
        timeZone="UTC"
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return context;
}
