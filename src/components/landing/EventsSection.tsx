"use client";

import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export type Event = {
  id: number;
  title: string;
  image: string;
  description: string;
  date: string;
  time: string;
};

export type EventsSectionProps = {
  events?: Event[];
};

export function EventsSection({ events }: EventsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Default events matching the design
  const defaultEvents: Event[] = [
    {
      id: 1,
      title: "Comedy Knights",
      image: "/events/comedy-knights.jpg",
      description:
        "timeless description of SNL:Sunday Night Live (SNL) is Rwanda's first dedicated English stand-up",
      date: "Jan 23, 2026",
      time: "7:00 PM",
    },
    {
      id: 2,
      title: "Kigali Tech Summit",
      image: "/events/kigali-tech-summit.jpg",
      description:
        "An unforgettable night of Kivumbi and Mike. Rwanda's finest performers Join us for a live show packed with top...",
      date: "Dec 13, 2025",
      time: "6:00 PM",
    },
    {
      id: 3,
      title: "Throwback Thursdays",
      image: "/events/throwback-thursdays.jpg",
      description: "Oldies Music festival is back again this 6th December",
      date: "Dec 6, 2025",
      time: "6:00 PM",
    },
    {
      id: 4,
      title: "Rhythms of Rwanda",
      image: "/events/rhythms-of-rwanda.jpg",
      description:
        "Echoes of Kigali is a vibrant DJ concert experience presented by DJ Tyga. The event promises top DJs to...",
      date: "Nov 29, 2025",
      time: "6:00 PM",
    },
  ];

  const displayEvents = events || defaultEvents;
  const maxIndex = Math.max(0, displayEvents.length - itemsPerView);

  // Derive valid index
  const validCurrentIndex = Math.min(currentIndex, maxIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#0A1628] via-[#0D2137] to-[#0A2540] py-16 sm:py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-5 py-2 rounded-full border border-sky-400/40 bg-sky-500/10 text-xs font-semibold uppercase tracking-widest text-sky-300 backdrop-blur mb-6">
            Recent Events
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white italic">
            Highlights of Our Exciting
            <br />
            Happenings
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous events"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Events Grid */}
          <div className="overflow-hidden mx-8 sm:mx-12 lg:mx-16">
            <div
              className="flex gap-4 sm:gap-5 lg:gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${validCurrentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {displayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * (itemsPerView === 1 ? 16 : 20)) / itemsPerView}px)`,
                  }}
                >
                  <div className="group bg-gradient-to-b from-[#0D2844] to-[#0A1F35] rounded-xl overflow-hidden border border-white/5 hover:border-sky-500/30 transition-all duration-300 h-full flex flex-col">
                    {/* Event Image */}
                    <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden">
                      {/* Fallback gradient for missing images - behind the image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-700 to-purple-800 z-0" />
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                      />
                      {/* Overlay gradient on top */}
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-purple-600/20 z-20" />
                    </div>

                    {/* Event Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-grow">
                        {event.description}
                      </p>

                      {/* Date, Time & Button */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex flex-col gap-1 text-xs sm:text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span>{event.time}</span>
                          </div>
                        </div>

                        <Link
                          href="#"
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                        >
                          Register to Attend
                        </Link>
                      </div>
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
            aria-label="Next events"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:hidden">
          {displayEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index
                  ? "bg-sky-400 w-6"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
