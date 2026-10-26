import React from 'react';
import { HeartHandshake } from 'lucide-react';

export const OurFarmerPartnerNetwork: React.FC = () => {

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#173b28] via-[#102d1e] to-stone-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold tracking-wide">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Smallholder Parity &amp; Equity System</span>
          </div>

          <h3 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
            Our Farmer-Partner Network
          </h3>

          <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed">
            We partner directly with over <strong>1,480+ family smallholders</strong> across five high-altitude Kenyan counties. By replacing speculative middlemen brokers with transparent farm-gate weighing, pre-planting purchase contracts, and instant mobile payouts, we return <strong>78.4% of every retail shilling</strong> back to the soil stewards.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-lg bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
              📍 5 Highland Counties
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/10 text-amber-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
              ⚡ 24-Hr M-Pesa Settlement
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
              🌱 100% Traceable to Farm Coordinates
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
