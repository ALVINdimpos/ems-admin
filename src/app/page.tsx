"use client";

import { useTranslations } from "next-intl";

import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Navbar } from "@/components/landing/Navbar";
import { SolutionsSection } from "@/components/landing/SolutionsSection";
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

      <SolutionsSection tLanding={tLanding} solutions={solutions} />

      {/* <ReachSection tLanding={tLanding} /> */}

      <LandingFooter
        tLanding={tLanding}
        quickLinks={quickLinks}
        socials={socials}
      />
    </main>
  );
}
