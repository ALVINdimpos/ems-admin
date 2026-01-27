"use client";

import { Award, Globe, Shield, Users } from "lucide-react";
import Image from "next/image";

import { TranslateFn } from "@/lib/constants/landing";

type AboutSectionProps = {
  tLanding: TranslateFn;
};

export function AboutSection({ tLanding }: AboutSectionProps) {
  const values = [
    {
      icon: <Shield className="w-6 h-6" />,
      titleKey: "about.values.security.title",
      descriptionKey: "about.values.security.description",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      titleKey: "about.values.global.title",
      descriptionKey: "about.values.global.description",
    },
    {
      icon: <Users className="w-6 h-6" />,
      titleKey: "about.values.community.title",
      descriptionKey: "about.values.community.description",
    },
    {
      icon: <Award className="w-6 h-6" />,
      titleKey: "about.values.excellence.title",
      descriptionKey: "about.values.excellence.description",
    },
  ];

  const stats = [
    { value: "10+", labelKey: "about.stats.years" },
    { value: "1,250+", labelKey: "about.stats.events" },
    { value: "500K+", labelKey: "about.stats.attendees" },
    { value: "50+", labelKey: "about.stats.countries" },
  ];

  return (
    <section id="about" className="relative w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0D2137] to-[#0A1628]" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-xs font-semibold uppercase tracking-wider text-sky-300 backdrop-blur mb-4">
            {tLanding("about.pill")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            {tLanding("about.title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto">
            {tLanding("about.description")}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center mb-16 sm:mb-20">
          {/* Image/Visual Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/logo.png"
                  alt={tLanding("about.imageAlt")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto">
                <div className="inline-flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {tLanding("about.badge.title")}
                    </p>
                    <p className="text-xs text-slate-300">
                      {tLanding("about.badge.subtitle")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Side */}
          <div className="order-1 lg:order-2 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {tLanding("about.story.title")}
            </h3>
            <div className="space-y-4 text-slate-300">
              <p className="text-sm sm:text-base leading-relaxed">
                {tLanding("about.story.paragraph1")}
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                {tLanding("about.story.paragraph2")}
              </p>
            </div>

            {/* Mission Statement */}
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 sm:p-6">
              <p className="text-sm font-semibold text-sky-300 mb-2">
                {tLanding("about.mission.label")}
              </p>
              <p className="text-base sm:text-lg text-white font-medium italic">
                &ldquo;{tLanding("about.mission.statement")}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                {tLanding(stat.labelKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Values Grid */}
        <div className="text-center mb-8 sm:mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {tLanding("about.valuesTitle")}
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            {tLanding("about.valuesSubtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={index}
              className="group p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-sky-500/40 hover:bg-sky-500/5"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-4 group-hover:bg-sky-500/20 transition">
                {value.icon}
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {tLanding(value.titleKey)}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tLanding(value.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
