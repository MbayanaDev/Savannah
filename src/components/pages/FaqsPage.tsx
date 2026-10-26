import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { PageLayout } from './PageLayout';

interface FAQItem {
  id: string;
  category: 'delivery' | 'payments' | 'quality' | 'orders';
  question: string;
  answer: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'delivery',
    question: 'How fast is delivery across Nairobi?',
    answer: 'Orders placed before 2:00 PM are delivered same-day within 45 to 90 minutes depending on your neighborhood zone (Kilimani, Westlands, Lavington, Karen, Kileleshwa, South C, Runda, Muthaiga, and more). We also provide scheduled delivery slots (Morning 8-11 AM, Afternoon 1-4 PM, and Evening 5-8 PM).'
  },
  {
    id: 'faq-2',
    category: 'payments',
    question: 'How do I pay with M-Pesa or Cash?',
    answer: 'We accept Lipa na M-Pesa Buy Goods Till 892019 with immediate real-time verification upon order placement. You can also choose Cash on Delivery to inspect your produce at your doorstep prior to paying our rider, or pay with Visa/Mastercard.'
  },
  {
    id: 'faq-3',
    category: 'quality',
    question: 'What is your 100% Doorstep Freshness Guarantee?',
    answer: 'Every harvest basket is packed the same morning it leaves the farm. When our delivery rider arrives, you are invited to inspect your fruits, vegetables, and greens right at your doorstep. If any item is bruised or does not meet your expectations, we issue an instant replacement or immediate M-Pesa refund within 2 hours.'
  },
  {
    id: 'faq-4',
    category: 'quality',
    question: 'Where does Savannah Fresh source its produce?',
    answer: 'We coordinate directly with certified family smallholder farms in Kiambu, Kinangop, Limuru highlands, and Meru. We bypass brokers and commercial storage depots, ensuring crops reach your kitchen within hours of sunrise harvesting without chemical shelf-life extenders.'
  },
  {
    id: 'faq-5',
    category: 'orders',
    question: 'Is there a minimum order amount?',
    answer: 'No minimum order is required! Whether you need a single bunch of fresh coriander or a full weekly household basket, we are happy to deliver. All orders of KES 2,500 or more unlock automatic free express delivery.'
  },
  {
    id: 'faq-6',
    category: 'delivery',
    question: 'Can you deliver to residential gates, apartments, or office receptions?',
    answer: 'Yes! You can specify your apartment gate number, building floor, or office reception desk in the delivery address and drop-off notes. Our riders are familiar with estate security protocols across Nairobi.'
  },
  {
    id: 'faq-7',
    category: 'quality',
    question: 'How do you keep delicate herbs and greens fresh during transit?',
    answer: 'Sensitive leafy greens like sukuma wiki, spinach, and fresh aromatics are hydro-cooled and packed in breathable, eco-friendly moisture-retaining kraft pouches inside insulated cooler bags on our delivery bikes.'
  },
  {
    id: 'faq-8',
    category: 'orders',
    question: 'How can I track my order status?',
    answer: 'You can tap "Orders and Tracking" in the top menu or bottom navigation bar at any time to see live packing, dispatch, rider contact details, and doorstep ETA.'
  }
];

export const FaqsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'delivery' | 'payments' | 'quality' | 'orders'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <PageLayout
      badge="Frequently Asked Questions"
      title="How Can We Help You?"
      subtitle="Everything you need to know about express Nairobi delivery, Lipa na M-Pesa payments, smallholder farm sourcing, and our 100% freshness guarantee."
      currentPage="FAQs"
    >
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Search & Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. delivery speed, M-Pesa, organic guarantee, returns)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173b28]/20 focus:border-[#173b28] text-stone-800 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {(['all', 'delivery', 'payments', 'quality', 'orders'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap capitalize ${
                  categoryFilter === cat
                    ? 'bg-[#173b28] text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs transition-all hover:border-stone-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer gap-4"
                  >
                    <span className="font-display font-semibold text-xs sm:text-sm text-stone-900 leading-snug">
                      {faq.question}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center bg-white rounded-xl border border-stone-200 p-6 space-y-2">
              <HelpCircle className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="font-medium text-stone-700 text-sm">No matching questions found</p>
              <p className="text-xs text-stone-400">Try adjusting your search terms or select another category above.</p>
            </div>
          )}
        </div>

        {/* Direct Help Desk Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display font-bold text-sm sm:text-base text-stone-900">
              Have a question about your specific estate delivery?
            </h4>
            <p className="text-xs text-stone-500">
              Our Nairobi customer care and dispatch desk is ready to assist daily from 7:00 AM to 7:00 PM.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://wa.me/254700892019?text=Hello%20Savannah%20Fresh%2C%20I%20have%20a%20question%20about%20orders"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href="tel:+254700892019"
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              <span>+254 700 892 019</span>
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
