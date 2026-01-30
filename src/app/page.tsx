"use client";

import { useTranslations } from "next-intl";

import { AboutSection } from "@/components/landing/AboutSection";
import { AnnouncementSection } from "@/components/landing/Announcement";
import { ContactSection } from "@/components/landing/ContactSection";
import { EventsSection } from "@/components/landing/EventsSection";
import { FaqSection } from "@/components/landing/FAQSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Navbar } from "@/components/landing/Navbar";
import { SolutionsSection } from "@/components/landing/SolutionsSection";
import { TrustedPartnersSection } from "@/components/landing/TrustedPartnersSection";
import { landingContent } from "@/lib/constants/landing";

export default function HomePage() {
  const tLanding = useTranslations("landing");
  const tCommon = useTranslations("common");
  const { heroBadges, stats, features, solutions, quickLinks, socials } =
    landingContent;

  return (
    <main className="bg-slate-950 text-slate-50 min-h-screen">
      <Navbar tLanding={tLanding} tCommon={tCommon} />
      <HeroSection
        tLanding={tLanding}
        tCommon={tCommon}
        heroBadges={heroBadges}
        stats={stats}
      />

      <FeaturesSection tLanding={tLanding} features={features} />

      <EventsSection />

      <AnnouncementSection />

      <SolutionsSection tLanding={tLanding} solutions={solutions} />

      <TrustedPartnersSection />

      <AboutSection tLanding={tLanding} />

      <FaqSection tLanding={tLanding} />

      <ContactSection tLanding={tLanding} />

      <LandingFooter
        tLanding={tLanding}
        quickLinks={quickLinks}
        socials={socials}
      />
    </main>
  );
}
