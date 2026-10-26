import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, UserCheck } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const PrivacyPage: React.FC = () => {
  return (
    <PageLayout
      badge="Data Protection & Privacy"
      title="Privacy Policy"
      subtitle="How Savannah Fresh Nairobi collects, uses, and protects your personal delivery details and contact information in full compliance with the Kenya Data Protection Act."
      currentPage="Privacy Policy"
    >
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Core Notice */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#173b28]">
              <Lock className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-stone-900">
                Your Privacy Matters to Us
              </h2>
              <p className="text-xs text-stone-500">Effective Date: January 1, 2026 · Nairobi, Kenya</p>
            </div>
          </div>

          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            At Savannah Fresh, we treat your personal data with the same integrity and respect as our morning harvest. We comply strictly with the <strong>Kenya Data Protection Act, 2019 (KDPA)</strong> and never monetize, sell, or rent customer information to third parties.
          </p>
        </section>

        {/* Detailed Sections */}
        <section className="space-y-5 pt-2">
          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-800">1</span>
              <span>Information We Collect</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We collect only the minimum information necessary to execute fresh grocery delivery across Nairobi:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-stone-600 space-y-1.5 leading-relaxed">
              <li><strong>Contact Information:</strong> Your name, phone number, and email address.</li>
              <li><strong>Delivery Coordinates:</strong> Neighborhood (e.g. Kilimani, Westlands, Karen), estate gate, building name, and apartment or house number.</li>
              <li><strong>Order History:</strong> Produce items purchased, delivery preferences, and order notes.</li>
              <li><strong>Transaction Records:</strong> M-Pesa transaction reference codes for payment verification. (We never store debit/credit card numbers or PINs).</li>
            </ul>
          </div>

          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-800">2</span>
              <span>How We Use Your Data</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Your details are used exclusively for:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-stone-600 space-y-1.5 leading-relaxed">
              <li>Packing and dispatching produce to your exact doorstep.</li>
              <li>Direct telephone or SMS coordination between our delivery rider and your estate gate.</li>
              <li>Sending digital receipts and real-time dispatch updates.</li>
              <li>Processing customer care inquiries and 100% freshness refunds via M-Pesa.</li>
            </ul>
          </div>

          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-800">3</span>
              <span>Zero Third-Party Sharing &amp; Data Security</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We never share your personal information with external advertisers, data brokers, or marketing syndicates. Payment processing is conducted through certified financial gateways (Safaricom M-Pesa Buy Goods Till 892019) with end-to-end SSL/TLS 256-bit encryption.
            </p>
          </div>

          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-800">4</span>
              <span>Your Rights Under Kenyan Law</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              You maintain the right to access, rectify, or request permanent deletion of your stored delivery addresses and account profile at any time. Simply contact our Data Protection Officer at <strong>hello@savannahfresh.co.ke</strong>.
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};
