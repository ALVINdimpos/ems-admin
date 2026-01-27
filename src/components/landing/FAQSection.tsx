"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

import { TranslateFn } from "@/lib/constants/landing";

type FaqSectionProps = {
  tLanding: TranslateFn;
};

type FaqItem = {
  questionKey: string;
  answerKey: string;
};

export function FaqSection({ tLanding }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      questionKey: "faq.items.q1.question",
      answerKey: "faq.items.q1.answer",
    },
    {
      questionKey: "faq.items.q2.question",
      answerKey: "faq.items.q2.answer",
    },
    {
      questionKey: "faq.items.q3.question",
      answerKey: "faq.items.q3.answer",
    },
    {
      questionKey: "faq.items.q4.question",
      answerKey: "faq.items.q4.answer",
    },
    {
      questionKey: "faq.items.q5.question",
      answerKey: "faq.items.q5.answer",
    },
    {
      questionKey: "faq.items.q6.question",
      answerKey: "faq.items.q6.answer",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#0D2137]" />
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-sky-500/5 blur-3xl rounded-full" />

      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-xs font-semibold uppercase tracking-wider text-sky-300 backdrop-blur mb-4">
            {tLanding("faq.pill")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            {tLanding("faq.title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            {tLanding("faq.description")}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? "border-sky-500/40 bg-sky-500/5"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-6 text-left"
                aria-expanded={openIndex === index}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`hidden sm:flex w-10 h-10 rounded-lg items-center justify-center flex-shrink-0 transition-colors ${
                      openIndex === index
                        ? "bg-sky-500/20 text-sky-400"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-base sm:text-lg font-semibold transition-colors ${
                      openIndex === index ? "text-white" : "text-slate-200"
                    }`}
                  >
                    {tLanding(faq.questionKey)}
                  </span>
                </div>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    openIndex === index
                      ? "bg-sky-500/20 text-sky-400 rotate-180"
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 sm:pl-20">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {tLanding(faq.answerKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {tLanding("faq.cta.title")}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-lg mx-auto">
              {tLanding("faq.cta.description")}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 h-11 sm:h-12 rounded-lg bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25 hover:bg-sky-400 transition"
            >
              {tLanding("faq.cta.button")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
