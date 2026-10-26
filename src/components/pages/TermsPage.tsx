import React from 'react';
import { FileText, Scale, Clock, AlertTriangle, ShieldCheck, Truck } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const TermsPage: React.FC = () => {
  return (
    <PageLayout
      badge="Service Agreement"
      title="Terms & Conditions"
      subtitle="Terms of service, delivery policies, payment commitments, and seasonal harvest protocols for Savannah Fresh customers across Nairobi."
      currentPage="Terms & Conditions"
    >
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Core Notice */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <Scale className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-stone-900">
                Customer Service Agreement
              </h2>
              <p className="text-xs text-stone-500">Last updated: January 2026 · Savannah Fresh Direct</p>
            </div>
          </div>

          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            By placing an order on Savannah Fresh, you agree to the following operational terms designed to guarantee fair trading, reliable Nairobi fulfillment, and farm-fresh quality.
          </p>
        </section>

        {/* Detailed Terms */}
        <section className="space-y-5 pt-2">
          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-800">1</span>
              <span>Fresh Produce &amp; Seasonal Harvest Yields</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Because Savannah Fresh works directly with smallholder family farms without cold-storage holding vaults, fresh produce availability is determined by morning harvest yields. In rare cases where morning rain or seasonal availability impacts a specific item, our dispatch team will notify you immediately with equivalent organic substitutes or an instant refund.
            </p>
          </div>

          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-800">2</span>
              <span>Delivery Timeframes &amp; Gate Protocols</span>
            </h3>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-stone-600 space-y-1.5 leading-relaxed">
              <li><strong>Express Window:</strong> Orders placed between 7:00 AM and 2:00 PM are delivered same-day in 45-90 minutes across covered Nairobi neighborhood zones.</li>
              <li><strong>Gate Access:</strong> Deliveries are handed over at estate residential security gates, apartment doors, or office receptions. Customers are responsible for authorizing rider entry with estate security guards.</li>
              <li><strong>Recipient Unavailability:</strong> If our delivery rider cannot contact the recipient after 15 minutes of arrival at the designated gate, our dispatch desk will arrange a scheduled redelivery slot.</li>
            </ul>
          </div>

          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-800">3</span>
              <span>Weights, Pricing &amp; Currency</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              All prices are quoted in <strong>Kenyan Shillings (KES)</strong> inclusive of applicable agricultural levies. Produce sold by weight (such as vegetables and fruits) is weighed on certified digital scales at dispatch, guaranteeing full weight value or generous overage.
            </p>
          </div>

          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-800">4</span>
              <span>Payment Methods &amp; M-Pesa Security</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Payments are supported via Lipa na M-Pesa (Buy Goods Till 892019), Cash on Delivery upon doorstep inspection, and major payment cards. Payments are verified in real time upon checkout.
            </p>
          </div>

          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-800">5</span>
              <span>Freshness Guarantee &amp; Liability</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Our 100% Freshness Guarantee allows doorstep inspection and a 2-hour photo reporting window via WhatsApp (+254 700 892 019). Savannah Fresh&apos;s total liability is limited to replacement of the produce or a full refund of the purchase price.
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};
