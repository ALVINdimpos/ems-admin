"use client";

import { ChartBar, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect, useCallback } from "react";

import RegisterModal from "../ui/Modal/RegistrationModel";

import { HeroBadge, Stat, TranslateFn } from "@/lib/constants/landing";
export type HeroSectionProps = {
  tLanding: TranslateFn;
  tCommon: TranslateFn;
  heroBadges: HeroBadge[];
  stats: Stat[];
};

export function HeroSection({
  tLanding,
  tCommon,
  heroBadges,
  stats,
}: HeroSectionProps) {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      line1: "Elevate",
      line2: "your events",
      highlight: "Heights",
    },
    {
      line1: "Transform",
      line2: "Your Occasions",
      highlight: "Standards",
    },
    {
      line1: "Amplify",
      line2: "Your Gatherings",
      highlight: "Horizons",
    },
  ];

  const handleSlideChange = useCallback(
    (index: number) => {
      if (index !== currentSlide) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide(index);
          setTimeout(() => setIsTransitioning(false), 50);
        }, 300);
      }
    },
    [currentSlide]
  );

  useEffect(() => {
    const slideInterval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [currentSlide, slides.length, handleSlideChange]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1298E5] to-[#175B6C]" />
      <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="absolute right-10 bottom-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2 w-full">
          <div className="space-y-6 sm:space-y-8 max-w-xl">
            {/* <p className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              {tLanding("hero.pill")}
            </p> */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl leading-tight font-bold text-white lg:text-6xl transition-opacity duration-700 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            >
              {slides[currentSlide].line1}
              <br />
              {slides[currentSlide].line2}
              <br />
              to new{" "}
              <span className="inline-block bg-gradient-to-r from-amber-100 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                {slides[currentSlide].highlight}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-white/80">
              {tLanding("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                href="#"
                onClick={() => {
                  setIsRegistrationModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
              >
                {tLanding("hero.ctaPrimary")}
                <span>→</span>
              </Link>
              {/* <Link
                href="/auth/login"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/70"
              >
                {tCommon("login")}
              </Link> */}
            </div>
          </div>

          <div className="relative w-full ">
            <div className="relative rounded-3xl border border-white/20 bg-slate-900/40 p-3 shadow-2xl backdrop-blur overflow-visible">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
                <Image
                  src="/dashboard.png"
                  alt={tLanding("hero.imageAlt")}
                  width={1200}
                  height={650}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
              {heroBadges.map((badge, index) => (
                <div
                  key={badge.titleKey}
                  className={`hidden lg:block absolute p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-2xl backdrop-blur-md transition-all z-10 ${
                    index === 0
                      ? "w-[180px] lg:w-[223px] h-[80px] lg:h-[100px] rotate-[9.93deg] top-[60px] lg:top-[77.53px] left-[-80px] lg:left-[-98.45px] bg-white/36"
                      : "w-[240px] lg:w-[293px] h-[70px] lg:h-[82px] -rotate-[8.45deg] top-[50px] lg:top-[67.14px] left-[320px] lg:left-[409.06px] bg-white/23"
                  }`}
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white font-bold text-lg lg:text-xl`}
                    >
                      {index === 0 ? <ChartBar /> : <Zap />}
                    </div>
                    <div>
                      <p className="text-xs lg:text-sm font-semibold text-white">
                        {tLanding(badge.titleKey)}
                      </p>
                      <p className="text-[10px] lg:text-xs text-white/90">
                        {tLanding(badge.subtitleKey)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="flex justify-center gap-3 mt-8 lg:mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      <RegisterModal
        open={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
}
