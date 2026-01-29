import { FeatureItem, TranslateFn } from "@/lib/constants/landing";

type FeaturesSectionProps = {
  tLanding: TranslateFn;
  features: FeatureItem[];
};

export function FeaturesSection({ tLanding, features }: FeaturesSectionProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#01406B] to-[#021621]" />
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex flex-col gap-12 lg:gap-16">
        <div className="text-center space-y-3 w-full border-sky-500/40">
          <p className="mx-auto w-fit flex items-center justify-center rounded-full border border-sky-500/40 px-4 py-2 font-semibold text-sm leading-5 tracking-[-0.15px] text-center text-sky-300 font-bold">
            {tLanding("features.pill")}
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-white lg:text-4xl">
            {tLanding("features.title")}
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            {tLanding("features.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.titleKey}
              className="w-full min-h-[250px] sm:min-h-[280px] rounded-2xl border border-[#1A2F3F]/50 bg-[#0A2942]/60 p-5 sm:p-6 shadow-lg backdrop-blur-[10px] transition hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-sky-500/15 flex flex-col"
            >
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-[#0D3A5C]/80 text-xl sm:text-2xl">
                <span aria-hidden>{feature.icon}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                {tLanding(feature.titleKey)}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tLanding(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
