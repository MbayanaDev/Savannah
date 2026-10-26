import React from 'react';
import { Leaf, HeartHandshake, ShieldCheck, Sprout, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const PurposePage: React.FC = () => {
  return (
    <PageLayout
      badge="Our Mission & Social Impact"
      title="Our Purpose"
      subtitle="Fostering equitable grower compensation for Kenyan farming families while delivering pure, chemical-free nutrition to urban Nairobi doorsteps."
      currentPage="Our Purpose"
    >
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Core Mission Banner */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 text-[#173b28] font-bold text-sm">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>The Farm-to-Table Ethical Charter</span>
          </div>

          <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-900 leading-snug">
            Rewiring Kenya&apos;s Agricultural Supply Chain for Fairness and Health
          </h2>

          <div className="text-stone-700 text-xs sm:text-sm leading-relaxed space-y-4">
            <p>
              In Kenya, smallholder farmers produce over 70% of the food consumed in urban centers like Nairobi. Yet paradoxically, the traditional multi-tiered broker system captures the majority of consumer value, leaving rural farmers vulnerable to erratic farmgate pricing and deferred payments.
            </p>
            <p>
              Simultaneously, urban households frequently receive produce that has traveled for days in high ambient heat, chemically expedited with ripening agents like calcium carbide, stripped of its micro-nutrients.
            </p>
            <p>
              <strong>Savannah Fresh exists to bridge this gap.</strong> We provide a direct, cold-chain marketplace where growers receive transparent, guaranteed pricing paid straight to their M-Pesa accounts, while Nairobi households receive produce harvested the very same morning.
            </p>
          </div>
        </section>

        {/* 4 Pillars of Impact */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-900">
              Up to 78% Farmgate Value
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We eliminate 3 to 5 intermediary brokers. This ensures the majority of every shilling you spend directly builds rural resilience, school fees, and quality seeds for Kenyan farm families.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-900">
              Regenerative Soil Stewardship
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We incentivize organic composting, natural companion planting, and zero synthetic pesticides to replenish highland soils in Limuru and Kinangop for generations to come.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-900">
              Zero Chemical Ripening
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We strictly forbid artificial ripening accelerators, calcium carbide, and post-harvest synthetic waxes. Our produce ripens naturally on the vine under Kenyan sunshine.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-900">
              Reducing Post-Harvest Loss
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Kenya loses an estimated 30-40% of fresh produce between farm and plate. Our morning harvest demand matching dramatically lowers spoilage and food waste across Nairobi.
            </p>
          </div>
        </section>

        {/* Community Proof */}
        <section className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Measurable Impact Across Kenya</span>
          </div>
          <h3 className="font-display font-bold text-lg sm:text-xl">
            Over 120 Smallholder Families Empowered
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            From the misty ridges of Nyandarua to the fertile valleys of Kiambu and Meru, every Savannah Fresh basket delivered directly connects a Nairobi home to an honest, hard-working Kenyan grower.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};
