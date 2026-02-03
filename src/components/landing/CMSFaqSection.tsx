"use client";

import { ChevronDown, HelpCircle, Loader2, Megaphone } from "lucide-react";
import { useState } from "react";

import { useFaq } from "@/features/cms/hooks";

interface IFaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FaqItem({ question, answer, isOpen, onToggle, index }: IFaqItemProps) {
  return (
    <div
      className={`rounded-xl sm:rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-sky-500/40 bg-sky-500/5"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-6 text-left"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`hidden sm:flex w-10 h-10 rounded-lg items-center justify-center flex-shrink-0 transition-colors ${
              isOpen
                ? "bg-sky-500/20 text-sky-400"
                : "bg-white/5 text-slate-400"
            }`}
          >
            <HelpCircle className="w-5 h-5" />
          </div>
          <span
            className={`text-base sm:text-lg font-semibold transition-colors ${
              isOpen ? "text-white" : "text-slate-200"
            }`}
          >
            {question}
          </span>
        </div>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
            isOpen
              ? "bg-sky-500/20 text-sky-400 rotate-180"
              : "bg-white/5 text-slate-400"
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      <div
        id={`faq-answer-${index}`}
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 sm:pl-20">
          <div
            className="text-sm sm:text-base text-slate-300 leading-relaxed prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="hidden sm:block w-10 h-10 rounded-lg bg-slate-700" />
            <div className="flex-1">
              <div className="h-5 w-3/4 bg-slate-700 rounded" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
        <Megaphone className="w-8 h-8 text-sky-400/50" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        No FAQs available
      </h3>
      <p className="text-sm text-slate-500 max-w-md">
        Check back later for frequently asked questions.
      </p>
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <HelpCircle className="w-8 h-8 text-red-400/50" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        Failed to load FAQs
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

export function CmsFaqSection() {
  const { faqs, isLoading, error, refresh } = useFaq(10);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Find answers to common questions about our event management platform
          </p>
        </div>

        {/* FAQ Items */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={refresh} />
        ) : faqs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => toggleFAQ(index)}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Loading indicator for refresh */}
        {isLoading && faqs.length > 0 && (
          <div className="flex justify-center mt-6">
            <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-lg mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is
              here to help.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 h-11 sm:h-12 rounded-lg bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25 hover:bg-sky-400 transition"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CmsFaqSection;
