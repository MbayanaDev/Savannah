import React from 'react';
import { Leaf, HeartHandshake, Truck, MapPin, CheckCircle2, ShieldCheck, Clock, Users } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const AboutPage: React.FC = () => {
  return (
    <PageLayout
      badge="About Our Journey · Nairobi"
      title="About Savannah Fresh"
      subtitle="Connecting conscientious Nairobi families with verified smallholder farms in Kiambu, Kinangop, and Meru for morning-harvested goodness."
      currentPage="About Us"
    >
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Story Section */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#173b28] flex items-center justify-center text-white font-bold text-lg shadow-xs">
              S
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                Ethical Farm-to-Table Grocery for Nairobi
              </h2>
              <p className="text-xs text-stone-500">Cultivating community trust, sustainable agriculture, and transparent food systems.</p>
            </div>
          </div>

          <div className="text-stone-700 text-xs sm:text-sm leading-relaxed space-y-4">
            <p>
              Traditional fresh produce supply chains in Nairobi involve up to five middleman layers. Produce sits in open-air trucks, enduring hours of heat and multiple transit hubs before finally arriving at city markets. To survive this lengthy transit, crops are often picked under-ripe or treated with artificial preservatives.
            </p>
            <p>
              <strong>Savannah Fresh</strong> was built to bypass this system entirely. By coordinating directly with smallholder family farms in <strong>Limuru, Kinangop, Naivasha, and Meru</strong>, our field teams harvest crops in the early morning between 5:00 AM and 6:30 AM. Produce is washed in natural spring water, hydro-cooled, packed in breathable paper packaging, and delivered directly to your doorstep in 45 to 90 minutes.
            </p>
            <p>
              By cutting out unnecessary middlemen, we pay smallholder farmers above-market rates within 24 hours while giving city households fresher, chemical-free greens at competitive prices.
            </p>
          </div>

          {/* Farm-to-Fork Timeline */}
          <div className="pt-6 border-t border-stone-200">
            <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 mb-4">
              Our 4-Stage Daily Harvest Cycle
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>5:00 AM</span>
                </div>
                <h4 className="font-bold text-xs text-stone-900">Morning Harvest</h4>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Crops picked at peak dew freshness in Kiambu and Kinangop farms.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>7:00 AM</span>
                </div>
                <h4 className="font-bold text-xs text-stone-900">Cold-Chain Sorting</h4>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Hydro-cooling and quality inspection; zero chemical ripeners or waxes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>8:30 AM</span>
                </div>
                <h4 className="font-bold text-xs text-stone-900">Express Dispatch</h4>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Dispatched from local hubs in Westlands, Kilimani, and Karen.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>45-90 MIN</span>
                </div>
                <h4 className="font-bold text-xs text-stone-900">Doorstep Delivery</h4>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Inspect produce at your residential gate with our delivery rider.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Commitments */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
              100% Chemical-Free
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We never use artificial ripening agents, calcium carbide, or chemical shelf-life sprays. What you taste is pure natural vitality.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
              Fair Farmer Incomes
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              By removing predatory brokers, up to 78% of produce value goes straight back to the smallholder families growing your food.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
              Decentralized Express
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Neighborhood hubs across Nairobi allow us to fulfill orders in under 45-90 minutes while maintaining produce crispness.
            </p>
          </div>
        </section>

        {/* Provenance Spotlight */}
        <section className="space-y-4 pt-2">
          <h3 className="font-display font-bold text-base sm:text-lg text-stone-900">
            Our Smallholder Growing Regions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-stone-200 bg-white rounded-xl p-4 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-[#173b28]" />
                <span>Kinangop Plateau, Nyandarua County</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Volcanic high-elevation soil at 2,600m above sea level yields exceptionally sweet carrots, crunchy broccoli, beetroot, and traditional mountain herbs.
              </p>
            </div>

            <div className="border border-stone-200 bg-white rounded-xl p-4 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-[#173b28]" />
                <span>Limuru Highland Valley, Kiambu County</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Cool morning fog and natural spring irrigation cultivate crisp sukuma wiki, tender spinach, celery, fresh mint, coriander, and heirloom rosemary.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};
