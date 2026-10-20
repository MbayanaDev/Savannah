import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Zap, Phone, Mail, MapPin, MessageCircle, Facebook, Linkedin, Instagram, BookOpen, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { HeroBanner } from './HeroBanner';
import { Category } from '../types';

export const Storefront: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    searchQuery,
    setSearchQuery,
    setIsNeighborhoodModalOpen
  } = useStore();

  const [sortBy, setSortBy] = useState<'Relevance' | 'Price' | 'New'>('Relevance');
  const [activeInfoModal, setActiveInfoModal] = useState<'about' | 'faqs' | 'purpose' | 'privacy' | 'terms' | 'refunds' | 'blog' | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || (selectedCategory as string) === 'All Fresh' || product.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.subcategory && product.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'Price') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'New') {
      return list.sort((a, b) => {
        const aIsToday = a.harvestTime.toLowerCase().includes('today') ? 1 : 0;
        const bIsToday = b.harvestTime.toLowerCase().includes('today') ? 1 : 0;
        if (aIsToday !== bIsToday) return bIsToday - aIsToday;
        return b.id.localeCompare(a.id);
      });
    }
    return list;
  }, [filteredProducts, sortBy]);

  return (
    <div className="pb-24 md:pb-16">
      {/* Editorial Campaign Hero */}
      <HeroBanner />

      {/* Catalog & Filter Section (compact margin below subcategories row) */}
      <section id="produce-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 mt-3 sm:mt-4">
        {/* Active Filter Chips Row (shown if search query is active) */}
        {searchQuery && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-2 text-xs bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
              <span className="text-stone-500">Filtered by:</span>
              <strong className="text-stone-900">&ldquo;{searchQuery}&rdquo;</strong>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#b85d38] hover:underline ml-1 font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Product Count, Offers indicator & Sort Control */}
        <div className="flex items-start justify-between pt-1">
          {/* Left: XX items available, with XX offers below it right-aligned to "XX items available" */}
          <div className="flex flex-col items-end w-fit">
            <div className="text-xs text-stone-500 whitespace-nowrap">
              <span className="font-semibold text-stone-900">{sortedProducts.length}</span> items available
            </div>
            <button
              onClick={() => setIsNeighborhoodModalOpen(true)}
              className="inline-flex items-center text-[10px] text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer font-medium hover:underline mt-0.5 group"
              title="View neighborhood delivery specials & offers"
            >
              <span>3 offers</span>
              <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-400 ml-0.5 -mt-1 group-hover:scale-110 transition-transform shrink-0" />
            </button>
          </div>

          {/* Right: Where the offers pill was: "Sort by" text + Dropdown with "Relevance", "Price", "New" */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-stone-500 font-medium whitespace-nowrap">
              Sort by
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'Relevance' | 'Price' | 'New')}
                className="appearance-none bg-white border border-stone-200 text-stone-800 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28] cursor-pointer shadow-2xs hover:border-stone-300 transition-colors"
                aria-label="Sort products"
              >
                <option value="Relevance">Relevance</option>
                <option value="Price">Price</option>
                <option value="New">New</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-stone-800 text-base">
              No produce matched your search
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn&apos;t find items matching &ldquo;{searchQuery}&rdquo;. Try browsing by our categories or clearing your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedSubcategory(null);
              }}
              className="mt-2 px-4 py-2 bg-[#173b28] text-white text-xs font-semibold rounded-xl hover:bg-[#122e20] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-3.5 text-stone-600 text-[10px] mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-start gap-12 sm:gap-24 md:gap-36 mx-4 sm:mx-8 md:mx-14 lg:mx-20">
            {/* First Column: Logo, Phone, Email, Location, WhatsApp (closer together vertically) */}
            <div className="flex flex-col gap-0.5 shrink-0">
              {/* Logo */}
              <div className="flex items-center gap-1.5 pb-0.5">
                <div className="w-5 h-5 rounded bg-[#173b28] flex items-center justify-center text-white font-bold text-[10px] shadow-2xs">
                  S
                </div>
                <span className="font-display font-extrabold text-xs text-[#173b28] tracking-tight">
                  Savannah Fresh
                </span>
              </div>

              {/* Phone Number */}
              <div>
                <a
                  href="tel:+254700892019"
                  className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#173b28] transition-colors"
                >
                  <Phone className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                  <span>+254 700 892 019</span>
                </a>
              </div>

              {/* Email */}
              <div>
                <a
                  href="mailto:hello@savannahfresh.co.ke"
                  className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#173b28] transition-colors"
                >
                  <Mail className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                  <span>hello@savannahfresh.co.ke</span>
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-stone-600">
                <MapPin className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                <span>Nairobi, Kenya,</span>
              </div>

              {/* Chat with us on WhatsApp & Operating Hours with no vertical space between them */}
              <div className="flex flex-col leading-tight w-fit">
                <a
                  href="https://wa.me/254700892019?text=Hello%20Savannah%20Fresh%2C%20I%20would%20like%20to%20inquire%20about%20produce%20orders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors leading-tight"
                >
                  <MessageCircle className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  <span>Chat with us on WhatsApp</span>
                </a>
                <span className="text-[8.5px] text-stone-500 leading-tight text-right w-full">
                  Daily from 7am-7pm
                </span>
              </div>
            </div>

            {/* Second Column: About, FAQs, Purpose, Privacy Policy, Terms and Conditions & Connect with us */}
            <div className="flex flex-col gap-2 items-start text-left shrink-0">
              {/* Informational Links */}
              <div className="flex flex-col gap-0.5 items-start text-left">
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('about')}
                  className="text-left text-stone-600 hover:text-[#173b28] transition-colors cursor-pointer w-fit"
                >
                  About
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('faqs')}
                  className="text-left text-stone-600 hover:text-[#173b28] transition-colors cursor-pointer w-fit"
                >
                  FAQs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('purpose')}
                  className="text-left text-stone-600 hover:text-[#173b28] transition-colors cursor-pointer w-fit"
                >
                  Purpose
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('privacy')}
                  className="text-left text-stone-600 hover:text-[#173b28] transition-colors cursor-pointer w-fit"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('terms')}
                  className="text-left text-stone-600 hover:text-[#173b28] transition-colors cursor-pointer w-fit"
                >
                  Terms and Conditions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInfoModal('refunds')}
                  className="text-left text-stone-600 hover:text-[#173b28] transition-colors cursor-pointer w-fit"
                >
                  Refunds and Cancellation
                </button>
              </div>

              {/* Connect with us */}
              <div className="flex flex-col gap-1 pt-0.5 items-start text-left">
                <div className="font-semibold text-stone-800 text-[10px]">
                  Connect with us
                </div>
                <div className="flex items-center justify-start gap-1.5">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-4 h-4 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                    title="Facebook"
                  >
                    <Facebook className="w-2.5 h-2.5 fill-current" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-4 h-4 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-2.5 h-2.5 fill-current" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-4 h-4 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <Instagram className="w-2.5 h-2.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveInfoModal('blog')}
                    className="w-4 h-4 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Blog posts"
                    title="Blog posts"
                  >
                    <BookOpen className="w-2.5 h-2.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle bottom copyright note */}
          <div className="pt-2 mt-2 border-t border-stone-200/50 flex items-center justify-between text-[9px] text-stone-400">
            <span>&copy; {new Date().getFullYear()} Savannah Fresh Nairobi. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Info Modal for About, FAQs, Purpose, Privacy Policy, Terms and Conditions, Refunds and Cancellation, and Blog posts */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-stone-200 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-display font-bold text-stone-900 text-sm">
                {activeInfoModal === 'about' && 'About Savannah Fresh Nairobi'}
                {activeInfoModal === 'faqs' && 'Frequently Asked Questions (FAQs)'}
                {activeInfoModal === 'purpose' && 'Our Farm-to-Table Purpose'}
                {activeInfoModal === 'privacy' && 'Privacy Policy'}
                {activeInfoModal === 'terms' && 'Terms and Conditions'}
                {activeInfoModal === 'refunds' && 'Refunds and Cancellation Policy'}
                {activeInfoModal === 'blog' && 'Savannah Harvest Blog & Stories'}
              </h3>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="w-6 h-6 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
              {activeInfoModal === 'about' && (
                <>
                  <p>
                    <strong>Savannah Fresh Nairobi</strong> is an ethical direct-from-farm grocer supplying premium fresh vegetables, heirloom herbs, and seasonal fruits to Nairobi households and kitchens.
                  </p>
                  <p>
                    We bypass long middleman supply chains by coordinating with certified smallholder farmers in Kiambu, Kinangop, and Meru, delivering nutrient-rich produce within hours of harvest.
                  </p>
                </>
              )}

              {activeInfoModal === 'faqs' && (
                <div className="space-y-2.5">
                  <div>
                    <h4 className="font-semibold text-stone-800">How fast is delivery in Nairobi?</h4>
                    <p className="text-stone-500 text-[11px]">Orders placed before 2:00 PM are delivered same-day within 45 to 90 minutes depending on your neighborhood zone.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-800">How do I pay?</h4>
                    <p className="text-stone-500 text-[11px]">We accept Lipa na M-Pesa Buy Goods Till 892019 and major credit/debit cards with instant confirmation.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-800">What if an item does not meet expectations?</h4>
                    <p className="text-stone-500 text-[11px]">We offer a 100% fresh guarantee. Contact us within 2 hours of delivery for an instant replacement or refund.</p>
                  </div>
                </div>
              )}

              {activeInfoModal === 'purpose' && (
                <>
                  <p>
                    Our mission is two-fold: ensuring fair, timely compensation for Kenyan smallholder farmers while guaranteeing city families access to clean, non-chemically forced produce.
                  </p>
                  <p>
                    Every purchase supports sustainable regenerative farming practices, reduced post-harvest food waste, and eco-friendly local logistics.
                  </p>
                </>
              )}

              {activeInfoModal === 'privacy' && (
                <>
                  <p>
                    Savannah Fresh collects only the information necessary to fulfill and deliver your produce orders: name, delivery address, phone number, and order preferences.
                  </p>
                  <p>
                    We never sell, rent, or distribute personal data to third parties. Payment details are processed directly through certified financial gateways (M-Pesa / Safaricom).
                  </p>
                </>
              )}

              {activeInfoModal === 'terms' && (
                <>
                  <p>
                    Fresh produce availability depends on seasonal harvest cycles and morning farm yields. In rare cases of farm stockouts, our dispatch team will notify you immediately.
                  </p>
                  <p>
                    Deliveries are made to specified residential gates or office reception desks. Inspection of goods upon delivery is encouraged.
                  </p>
                </>
              )}

              {activeInfoModal === 'refunds' && (
                <div className="space-y-2.5">
                  <div>
                    <h4 className="font-semibold text-stone-800">Order Cancellation</h4>
                    <p className="text-stone-500 text-[11px]">
                      You may cancel your order at any time before it leaves our dispatch hub with zero cancellation charges. If an order has already departed with our rider, please contact dispatch immediately at +254 700 892 019.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-800">100% Freshness Guarantee & Doorstep Inspection</h4>
                    <p className="text-stone-500 text-[11px]">
                      We inspect every produce basket before dispatch. We encourage all customers to inspect produce upon doorstep arrival.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Instant Replacements & M-Pesa Refunds</h4>
                    <p className="text-stone-500 text-[11px]">
                      If any item is bruised, damaged, or below freshness standards, notify us via WhatsApp (+254 700 892 019) within 2 hours of delivery with a photo. We will immediately dispatch a free replacement on the next available route or issue a direct M-Pesa refund to your phone number within 30 minutes.
                    </p>
                  </div>
                </div>
              )}

              {activeInfoModal === 'blog' && (
                <div className="space-y-2.5">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60">
                    <span className="text-[10px] text-emerald-800 font-semibold font-mono">OCTOBER HARVEST</span>
                    <h5 className="font-semibold text-stone-900 text-xs">Highland Greens from Mount Kenya&apos;s Slopes</h5>
                    <p className="text-stone-500 text-[11px]">Why cool Kinangop nights create the sweetest spinach and crunchiest bok choy.</p>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60">
                    <span className="text-[10px] text-emerald-800 font-semibold font-mono">FARM PRACTICES</span>
                    <h5 className="font-semibold text-stone-900 text-xs">Natural Pest Deterrents in Organic Kales</h5>
                    <p className="text-stone-500 text-[11px]">How companion planting with marigolds and wild rosemary protects our sukuma wiki.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-4 py-1.5 bg-[#173b28] hover:bg-[#122e20] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
