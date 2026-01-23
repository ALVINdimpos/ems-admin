import { FeatureItem, TranslateFn } from "@/lib/constants/landing";

type FeaturesSectionProps = {
  tLanding: TranslateFn;
  features: FeatureItem[];
};

export function FeaturesSection({ tLanding, features }: FeaturesSectionProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#01406B] to-[#021621]" />
      <div className="relative w-[1475px] h-[1068px] pt-20 pr-6 pl-28 mx-auto flex flex-col gap-16">
        <div className="text-center space-y-3 w-full px-4 lg:px-0 border-sky-500/40">
          <p className="mx-auto w-[200.21px] h-[34.5px] flex items-center justify-center rounded-full border border-sky-500/40  px-4 py-2 font-normal text-[14px] leading-5 tracking-[-0.15px] text-center text-sky-300 font-bold">
            {tLanding("features.pill")}
          </p>

          <h2 className="text-3xl t-40 font-bold text-white sm:text-4xl">
            {tLanding("features.title")}
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            {tLanding("features.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 ">
          {features.map((feature) => (
            <div
              key={feature.titleKey}
              className="w-[391.66px] h-[298px] rounded-2xl border border-[#1A2F3F]/50 bg-[#0A2942]/60 p-6 shadow-lg backdrop-blur-[10px] transition hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-sky-500/15 flex flex-col"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D3A5C]/80 text-2xl">
                <span aria-hidden>{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
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
