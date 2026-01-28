export type TranslateFn = (
  key: string,
  values?: Record<string, string | number>
) => string;

export type HeroBadge = {
  titleKey: string;
  subtitleKey: string;
  position: string;
  gradient: string;
};

export type Stat = {
  labelKey: string;
  valueKey: string;
};

export type FeatureItem = {
  titleKey: string;
  descriptionKey: string;
  icon: string;
};

export type Solution = {
  titleKey: string;
  descriptionKey: string;
  icon: string;
  ctaLabelKey: string;
  ctaHref: string;
  highlightKeys: string[];
};

export type QuickLink = {
  labelKey: string;
  href: string;
};

export const landingContent = {
  heroBadges: [
    {
      titleKey: "hero.badges.analytics.title",
      subtitleKey: "hero.badges.analytics.subtitle",
      position: "left-6 top-10",
      gradient: "from-purple-500/80 via-indigo-500/80 to-sky-400/70",
    },
    {
      titleKey: "hero.badges.checkin.title",
      subtitleKey: "hero.badges.checkin.subtitle",
      position: "right-4 bottom-10",
      gradient: "from-amber-400/90 via-orange-500/80 to-rose-500/70",
    },
  ] as HeroBadge[],

  stats: [
    {
      labelKey: "hero.stats.events.label",
      valueKey: "hero.stats.events.value",
    },
    {
      labelKey: "hero.stats.approval.label",
      valueKey: "hero.stats.approval.value",
    },
    {
      labelKey: "hero.stats.accuracy.label",
      valueKey: "hero.stats.accuracy.value",
    },
  ] as Stat[],

  features: [
    {
      titleKey: "features.items.analytics.title",
      descriptionKey: "features.items.analytics.description",
      icon: "📊",
    },
    {
      titleKey: "features.items.badging.title",
      descriptionKey: "features.items.badging.description",
      icon: "🎫",
    },
    {
      titleKey: "features.items.bulkComms.title",
      descriptionKey: "features.items.bulkComms.description",
      icon: "✉️",
    },
    {
      titleKey: "features.items.verification.title",
      descriptionKey: "features.items.verification.description",
      icon: "✓",
    },
    {
      titleKey: "features.items.badgeDesign.title",
      descriptionKey: "features.items.badgeDesign.description",
      icon: "🎨",
    },
    {
      titleKey: "features.items.registration.title",
      descriptionKey: "features.items.registration.description",
      icon: "📋",
    },
  ] as FeatureItem[],

  solutions: [
    {
      titleKey: "solutions.attendees.title",
      descriptionKey: "solutions.attendees.description",
      icon: "AT",
      ctaLabelKey: "solutions.attendees.cta",
      ctaHref: "/auth/register",
      highlightKeys: [
        "solutions.attendees.highlights.item1",
        "solutions.attendees.highlights.item2",
        "solutions.attendees.highlights.item3",
        "solutions.attendees.highlights.item4",
        "solutions.attendees.highlights.item5",
      ],
    },
    {
      titleKey: "solutions.organizers.title",
      descriptionKey: "solutions.organizers.description",
      icon: "ORG",
      ctaLabelKey: "solutions.organizers.cta",
      ctaHref: "/contact",
      highlightKeys: [
        "solutions.organizers.highlights.item1",
        "solutions.organizers.highlights.item2",
        "solutions.organizers.highlights.item3",
        "solutions.organizers.highlights.item4",
        "solutions.organizers.highlights.item5",
      ],
    },
  ] as Solution[],

  quickLinks: [
    { labelKey: "footer.links.about", href: "/about" },
    { labelKey: "footer.links.blog", href: "#" },
    { labelKey: "footer.links.solutions", href: "#" },
    { labelKey: "footer.links.careers", href: "#" },
  ] as QuickLink[],

  socials: ["X", "IN", "FB", "MAIL"],
};
