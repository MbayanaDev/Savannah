import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Zap, Phone, Mail, MapPin, MessageCircle, Facebook, Linkedin, Instagram, BookOpen } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { HeroBanner } from './HeroBanner';
import { Category } from '../types';

export const Storefront: React.FC = () => {
  const {
    products,
    categories,
    subcategoriesList,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    searchQuery,
    setSearchQuery,
    setIsNeighborhoodModalOpen,
    setViewMode
  } = useStore();

  const [sortBy, setSortBy] = useState<'Relevance' | 'Price' | 'New'>('Relevance');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || 
                            (selectedCategory as string) === 'All Fresh' || 
                            product.category === selectedCategory || 
                            product.categoryId === selectedCategory;

    const matchedSubcat = selectedSubcategory
      ? subcategoriesList.find(s => s.id === selectedSubcategory || s.name === selectedSubcategory || s.subcategoryId === selectedSubcategory || s.slug === selectedSubcategory)
      : null;

    const matchesSubcategory = !selectedSubcategory || 
                               product.subcategory === selectedSubcategory || 
                               product.subcategoryId === selectedSubcategory ||
                               Boolean(matchedSubcat && (product.subcategory === matchedSubcat.name || product.subcategoryId === matchedSubcat.subcategoryId));
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      product.name.toLowerCase().includes(q) ||
      product.origin.toLowerCase().includes(q) ||
      (product.brand && product.brand.toLowerCase().includes(q)) ||
      (product.sku && product.sku.toLowerCase().includes(q)) ||
      (product.productCode && product.productCode.toLowerCase().includes(q)) ||
      (product.variants && product.variants.some(v => v.name.toLowerCase().includes(q) || v.sku.toLowerCase().includes(q))) ||
      product.category.toLowerCase().includes(q) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(q)) ||
      (product.nutrition && product.nutrition.some(n => n.toLowerCase().includes(q)));

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'Price') {
      const getPrice = (item: (typeof filteredProducts)[0]) => {
        const base = item.variants?.[0]?.price != null ? Number(item.variants[0].price) : Number(item.price || 0);
        const specs = item.variants?.[0]?.specifications || item.specifications || [];
        const defaultSpec = specs.find(s => s.is_default || s.isDefault) || specs[0];
        const adj = Number(defaultSpec?.price_adjustment || 0);
        return Math.max(0, base + adj);
      };
      return list.sort((a, b) => getPrice(a) - getPrice(b));
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
          {/* Left: XX items available, with CTA below it */}
          <div className="flex flex-col items-start w-fit">
            <div className="flex items-center text-xs text-stone-500 whitespace-nowrap">
              <span>
                <span className="font-semibold text-stone-900">{sortedProducts.length}</span> items available
              </span>
            </div>
            <button
              onClick={() => setSortBy('Price')}
              className="inline-flex items-center text-[10px] text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer font-medium hover:underline mt-0.5 group"
              title="Sort items by price: lowest to highest"
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
      <footer className="border-t border-stone-200 py-3.5 md:py-8 text-stone-600 text-[10px] md:text-sm mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-start gap-12 sm:gap-24 md:gap-36 mx-4 sm:mx-8 md:mx-14 lg:mx-20">
            {/* First Column: Logo, Phone, Email, Location, WhatsApp */}
            <div className="flex flex-col gap-0.5 md:gap-1.5 shrink-0">
              {/* Logo */}
              <div className="flex items-center gap-1.5 md:gap-2 pb-0.5 md:pb-1">
                <div className="w-5 h-5 md:w-7 md:h-7 rounded bg-[#173b28] flex items-center justify-center text-white font-bold text-[10px] md:text-xs shadow-2xs">
                  S
                </div>
                <span className="font-display font-extrabold text-xs md:text-base text-[#173b28] tracking-tight">
                  Savannah Fresh
                </span>
              </div>

              {/* Phone Number */}
              <div>
                <a
                  href="tel:+254700892019"
                  className="inline-flex items-center gap-1.5 md:gap-2 text-stone-600 hover:text-[#173b28] md:text-sm transition-colors"
                >
                  <Phone className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-stone-400 shrink-0" />
                  <span>+254 700 892 019</span>
                </a>
              </div>

              {/* Email */}
              <div>
                <a
                  href="mailto:hello@savannahfresh.co.ke"
                  className="inline-flex items-center gap-1.5 md:gap-2 text-stone-600 hover:text-[#173b28] md:text-sm transition-colors"
                >
                  <Mail className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-stone-400 shrink-0" />
                  <span>hello@savannahfresh.co.ke</span>
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 md:gap-2 text-stone-600 md:text-sm">
                <MapPin className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-stone-400 shrink-0" />
                <span>Nairobi, Kenya,</span>
              </div>

              {/* Chat with us on WhatsApp & Operating Hours */}
              <div className="flex flex-col leading-tight w-fit pt-0.5">
                <a
                  href="https://wa.me/254700892019?text=Hello%20Savannah%20Fresh%2C%20I%20would%20like%20to%20inquire%20about%20produce%20orders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 md:gap-2 text-emerald-700 hover:text-emerald-800 font-semibold md:text-sm transition-colors leading-tight"
                >
                  <MessageCircle className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-emerald-600 shrink-0" />
                  <span>Chat with us on WhatsApp</span>
                </a>
                <span className="text-[8.5px] md:text-xs text-stone-500 leading-tight text-right w-full">
                  Daily from 7am-7pm
                </span>
              </div>
            </div>

            {/* Second Column: About, FAQs, Purpose, Privacy Policy, Terms and Conditions & Connect with us */}
            <div className="flex flex-col gap-2 md:gap-3 items-start text-left shrink-0">
              {/* Informational Links */}
              <div className="flex flex-col gap-0.5 md:gap-1.5 items-start text-left text-[10px] md:text-sm">
                <button
                  type="button"
                  onClick={() => setViewMode('about')}
                  className="text-left text-stone-600 hover:text-[#173b28] md:text-sm md:font-medium transition-colors cursor-pointer w-fit"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('faqs')}
                  className="text-left text-stone-600 hover:text-[#173b28] md:text-sm md:font-medium transition-colors cursor-pointer w-fit"
                >
                  FAQs
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('purpose')}
                  className="text-left text-stone-600 hover:text-[#173b28] md:text-sm md:font-medium transition-colors cursor-pointer w-fit"
                >
                  Our Purpose
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('refunds')}
                  className="text-left text-stone-600 hover:text-[#173b28] md:text-sm md:font-medium transition-colors cursor-pointer w-fit"
                >
                  Refunds &amp; Fresh Guarantee
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('privacy')}
                  className="text-left text-stone-600 hover:text-[#173b28] md:text-sm md:font-medium transition-colors cursor-pointer w-fit"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('terms')}
                  className="text-left text-stone-600 hover:text-[#173b28] md:text-sm md:font-medium transition-colors cursor-pointer w-fit"
                >
                  Terms &amp; Conditions
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('arcana')}
                  className="text-left text-emerald-800 hover:text-[#173b28] md:text-sm font-semibold transition-colors cursor-pointer w-fit flex items-center gap-1.5"
                >
                  <span>Savannah Arcana</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono px-1 rounded">SCIENCE</span>
                </button>
              </div>

              {/* Connect with us */}
              <div className="flex flex-col gap-1 md:gap-1.5 pt-0.5 items-start text-left">
                <div className="font-semibold text-stone-800 text-[10px] md:text-xs">
                  Connect with us
                </div>
                <div className="flex items-center justify-start gap-1.5 md:gap-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                    title="Facebook"
                  >
                    <Facebook className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <Instagram className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setViewMode('blog')}
                    className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Blog posts"
                    title="Blog posts"
                  >
                    <BookOpen className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle bottom copyright note */}
          <div className="pt-2 md:pt-4 mt-2 md:mt-4 border-t border-stone-200/50 flex items-center justify-between text-[9px] md:text-xs text-stone-400">
            <span>&copy; {new Date().getFullYear()} Savannah Fresh Nairobi. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
