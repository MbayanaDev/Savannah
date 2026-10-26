import React from 'react';
import { ShieldCheck, RefreshCw, MessageCircle, Phone, CheckCircle2, Clock, Check, AlertCircle } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const RefundsPage: React.FC = () => {
  return (
    <PageLayout
      badge="Risk-Free Produce Shopping"
      title="Refunds & Fresh Guarantee"
      subtitle="Shop with absolute confidence. Inspect produce at your doorstep or receive instant M-Pesa refunds and complimentary replacements within 30 minutes."
      currentPage="Refunds & Fresh Guarantee"
    >
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Core Guarantee Card */}
        <section className="space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                100% Doorstep Freshness Warranty
              </h2>
              <p className="text-xs text-stone-500">Every single basket is backed by our full money-back guarantee.</p>
            </div>
          </div>

          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            We understand that buying fresh food online requires trust. If any fruit, vegetable, or culinary herb delivered to your home does not meet the highest standard of crispness, vitality, and flavor, we make it right immediately—no arguments, no complicated bureaucracy.
          </p>
        </section>

        {/* 3 Step Resolution Process */}
        <section className="space-y-3">
          <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 px-1">
            How Our Freshness Guarantee Works
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center font-mono">
                01
              </div>
              <h4 className="font-display font-bold text-sm text-stone-900">
                Doorstep Inspection
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                When our rider arrives at your residential gate or building, you are welcome to inspect all produce items before taking receipt.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center font-mono">
                02
              </div>
              <h4 className="font-display font-bold text-sm text-stone-900">
                2-Hour Photo Window
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                If you notice an imperfection after unpacking, simply take a quick photo and send it to our WhatsApp dispatch line at <strong>+254 700 892 019</strong> within 2 hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center font-mono">
                03
              </div>
              <h4 className="font-display font-bold text-sm text-stone-900">
                Instant M-Pesa Refund
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                We will dispatch an immediate replacement on our next route or issue a direct refund to your M-Pesa number within 30 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Cancellation Policy Details */}
        <section className="space-y-4">
          <h3 className="font-display font-bold text-base sm:text-lg text-stone-900">
            Order Cancellation &amp; Modifications
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1 shadow-2xs">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Zero-Fee Pre-Dispatch Cancellation</span>
              </h4>
              <p className="text-stone-600">
                You can cancel or modify your order anytime before it leaves our packing hub with zero penalty. If an order has already departed with our rider, please contact dispatch immediately at +254 700 892 019.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1 shadow-2xs">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Damaged or Bruised Produce</span>
              </h4>
              <p className="text-stone-600">
                Given the delicate nature of soft fruits (strawberries, ripe Hass avocados, passion fruits), our riders carry produce in vibration-dampened thermal packs. Should any transit damage occur, replacements are 100% free.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Contact Bar */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display font-bold text-sm sm:text-base text-stone-900">
              Need assistance with an existing order?
            </h4>
            <p className="text-xs text-stone-500">
              Our Nairobi dispatch team is ready to assist via WhatsApp or telephone call.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://wa.me/254700892019?text=Hello%20Savannah%20Fresh%2C%20I%20need%20assistance%20with%20my%20produce%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Dispatch</span>
            </a>
            <a
              href="tel:+254700892019"
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              <span>+254 700 892 019</span>
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};
