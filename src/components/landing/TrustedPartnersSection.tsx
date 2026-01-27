"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export type Partner = {
  id: number;
  name: string;
  logo: string;
};

export type TrustedPartnersSectionProps = {
  partners?: Partner[];
};

export function TrustedPartnersSection({
  partners,
}: TrustedPartnersSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Default partners matching the design - BNR, RDB, Francophonie
  const defaultPartners: Partner[] = [
    {
      id: 1,
      name: "National Bank of Rwanda",
      logo: "/partners/bnr.png",
    },
    {
      id: 2,
      name: "Rwanda Development Board",
      logo: "/partners/rdb.png",
    },
    {
      id: 3,
      name: "Conférence Internationale de la Francophonie",
      logo: "/partners/francophonie.png",
    },
  ];

  const displayPartners = partners || defaultPartners;
  const maxIndex = Math.max(0, displayPartners.length - itemsPerView);

  // Derive valid index
  const validCurrentIndex = Math.min(currentIndex, maxIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#0A2540] via-[#0D2137] to-[#0A1628] py-16 sm:py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-5 py-2 rounded-full border border-sky-400/40 bg-sky-500/10 text-xs font-semibold uppercase tracking-widest text-sky-300 backdrop-blur">
            Trusted Partners
          </span>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous partners"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Partners Grid */}
          <div className="overflow-hidden mx-8 sm:mx-12 lg:mx-16">
            <div
              className="flex gap-8 sm:gap-12 lg:gap-16 transition-transform duration-500 ease-in-out items-center justify-center"
              style={{
                transform: `translateX(-${validCurrentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {displayPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (itemsPerView === 1 ? 32 : 48)) / itemsPerView}px)`,
                  }}
                >
                  <div className="relative w-full h-24 sm:h-28 lg:h-32 flex items-center justify-center group">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={200}
                      height={100}
                      className="object-contain max-h-full w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling;
                        if (fallback) {
                          (fallback as HTMLElement).style.display = "flex";
                        }
                      }}
                    />
                    {/* Fallback text for missing logos */}
                    <div
                      className="hidden absolute inset-0 items-center justify-center text-center"
                      style={{ display: "none" }}
                    >
                      <span className="text-white/60 text-sm sm:text-base font-medium px-4">
                        {partner.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next partners"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:hidden">
          {displayPartners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index
                  ? "bg-sky-400 w-6"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to partner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
