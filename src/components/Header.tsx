import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  MapPin, 
  ChevronRight, 
  PackageCheck, 
  Phone, 
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';
import { CATEGORIES_CONFIG, SUBCATEGORIES_CONFIG } from '../data/products';
import { SEED_ORDERS } from '../data/seedOrders';

const DRAWER_BANNERS = [
  {
    id: 1,
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
    thumbImage: '/src/assets/images/product_spinach_kale_1792228088029.jpg',
    badge: 'DAWN HARVEST',
    title: 'Highland Farm Fresh',
    discountText: '-24% discount'
  },
  {
    id: 2,
    image: '/src/assets/images/product_hass_avocado_1792228088344.jpg',
    thumbImage: '/src/assets/images/product_hass_avocado_1792228088344.jpg',
    badge: 'SEASON PEAK',
    title: 'Creamy Hass Avocados',
    discountText: '-20% discount'
  },
  {
    id: 3,
    image: '/src/assets/images/product_spinach_kale_1792228088029.jpg',
    thumbImage: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
    badge: 'ORGANIC GREENS',
    title: 'Crisp Sukuma & Traditional Mboga',
    discountText: '-15% discount'
  },
  {
    id: 4,
    image: '/src/assets/images/category_aromatics_1792245411534.jpg',
    thumbImage: '/src/assets/images/category_aromatics_1792245411534.jpg',
    badge: 'FRESH HERBS',
    title: 'Kitchen Aromatics',
    discountText: '-25% discount'
  }
];

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    selectedNeighborhood,
    setIsNeighborhoodModalOpen,
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    setActiveMobileTab,
    orders,
    setActiveTrackOrder,
    searchQuery,
    setSearchQuery,
    showToast
  } = useStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubcategoriesInHeader, setShowSubcategoriesInHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const subcatEl = document.getElementById('subcategories-bar');
      const headerNavEl = document.getElementById('header-nav-bar');
      if (!subcatEl) {
        setShowSubcategoriesInHeader(false);
        return;
      }
      const headerBottom = headerNavEl
        ? headerNavEl.getBoundingClientRect().bottom
        : 95;
      const subcatTop = subcatEl.getBoundingClientRect().top;
      // When the subcategories are upscrolled and reach the categories header row
      setShowSubcategoriesInHeader(subcatTop <= headerBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [selectedCategory]);

  const [currentDrawerBanner, setCurrentDrawerBanner] = useState(0);

  useEffect(() => {
    if (!isMenuOpen) return;
    const interval = setInterval(() => {
      setCurrentDrawerBanner((prev) => (prev + 1) % DRAWER_BANNERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isMenuOpen]);

  const activeSubcategories = selectedCategory === 'All'
    ? SUBCATEGORIES_CONFIG
    : SUBCATEGORIES_CONFIG.filter(sub => sub.category === selectedCategory);

  const shopperName = orders.length > 0 && orders[0].customerName
    ? orders[0].customerName.trim().split(' ')[0]
    : 'Kelvin';



  const handleNavClick = (categoryName: Category) => {
    setSelectedCategory(categoryName);
    setViewMode('store');
    setActiveMobileTab('shop');
    setIsMenuOpen(false);
    const catalog = document.getElementById('produce-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTrackRecentOrder = () => {
    setIsMenuOpen(false);
    if (orders.length > 0) {
      setActiveTrackOrder(orders[0]);
    } else {
      setActiveTrackOrder(SEED_ORDERS[0]);
    }
  };

  const handleSwitchMode = () => {
    const nextMode = viewMode === 'store' ? 'admin' : 'store';
    setViewMode(nextMode);
    if (nextMode === 'admin') {
      setActiveMobileTab('admin');
    } else {
      setActiveMobileTab('shop');
    }
    setIsMenuOpen(false);
  };

  const handleUtilities = () => {
    setIsNeighborhoodModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/98 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
        {/* Compact Main Header Row: Left (Hamburger) | Center (Compact Logo & Name) | Right (Cart with Badge) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-11 sm:h-12 grid grid-cols-3 items-center">
          {/* Left Column: Compact Hamburger Menu Button */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-all cursor-pointer -ml-1.5"
              aria-label="Open menu"
              title="Menu"
            >
              <Menu className="w-5 h-5 text-stone-800" />
            </button>
          </div>

          {/* Center Column: Centered Compact Logo and Brand Name */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                setViewMode('store');
                setActiveMobileTab('shop');
              }}
              className="flex items-center gap-1.5 group cursor-pointer text-center"
            >
              <div className="w-6 h-6 rounded-md bg-[#173b28] flex items-center justify-center text-white font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="font-display font-extrabold text-sm sm:text-base text-[#173b28] tracking-tight whitespace-nowrap">
                Savannah Fresh
              </span>
            </button>
          </div>

          {/* Right Column: Cart Icon Button with Badge Count Notification */}
          <div className="flex items-center justify-end gap-1.5">
            {/* Quick Neighborhood Badge (Desktop) */}
            <button
              onClick={() => setIsNeighborhoodModalOpen(true)}
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md border border-stone-200 bg-white hover:border-stone-300 text-[11px] text-stone-700 transition-colors cursor-pointer mr-0.5"
              title="Change Delivery Area"
            >
              <MapPin className="w-3 h-3 text-[#173b28]" />
              <span className="truncate max-w-[105px] font-medium">{selectedNeighborhood.name}</span>
            </button>

            {/* Compact Cart Icon Button with Notification Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-8 h-8 rounded-lg text-stone-800 hover:bg-stone-200/60 active:scale-95 transition-all cursor-pointer -mr-1"
              aria-label="View shopping basket"
              title="Shopping Basket"
            >
              <ShoppingBag className="w-5 h-5 text-[#173b28]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#b85d38] text-white text-[9px] font-bold min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center shadow-2xs tabular-nums border-[1.5px] border-white animate-in zoom-in-75">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Container: Search bar */}
        {viewMode === 'store' && (
          <div className="pb-1.5 pt-0.5">
            <div className="max-w-7xl mx-auto px-4 mb-1.5">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fresh goodness from honest farms"
                  className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-white border border-stone-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173b28]/25 focus:border-[#173b28] text-stone-800 placeholder:text-stone-400 shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Row of Fresh Categories replacing the previous live feed row - Replaced by subcategories when upscrolled */}
        {viewMode === 'store' && (
          <div id="header-nav-bar" className="bg-[#FBF9F5] border-t border-stone-200/80 overflow-x-auto scrollbar-none py-2 px-3 sm:px-6 transition-all duration-200">
            {!showSubcategoriesInHeader ? (
              <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-3 sm:gap-6 md:gap-8 whitespace-nowrap animate-in fade-in duration-200">
                {CATEGORIES_CONFIG.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleNavClick(cat.id)}
                      className={`flex items-center gap-1.5 cursor-pointer shrink-0 group focus:outline-none transition-all px-1.5 sm:px-2 py-1 rounded-xl ${
                        isActive
                          ? 'border-2 border-[#173b28] bg-white shadow-2xs'
                          : 'border-2 border-transparent hover:border-stone-200/80 hover:bg-stone-100/50'
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-6 h-6 sm:w-7 sm:h-7 aspect-square rounded-md object-cover shrink-0 border border-stone-200/80 shadow-2xs transition-transform duration-200 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`text-xs sm:text-sm tracking-tight transition-colors ${
                          isActive
                            ? 'font-bold text-[#173b28]'
                            : 'font-medium text-stone-700 group-hover:text-stone-900'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-4 md:gap-6 whitespace-nowrap animate-in fade-in duration-200">
                {/* Back to Aisles */}
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-200/70 hover:bg-stone-200 px-2 py-1 rounded-xl shrink-0 cursor-pointer transition-colors"
                  title="Scroll back to all Aisles"
                >
                  ‹ Aisles
                </button>

                {/* All subcategory in active category */}
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    showToast(`Showing all in ${selectedCategory}`, 'info');
                  }}
                  className={`flex items-center gap-1.5 cursor-pointer shrink-0 group focus:outline-none transition-all px-1.5 sm:px-2 py-1 rounded-xl ${
                    selectedSubcategory === null
                      ? 'border-2 border-[#173b28] bg-white shadow-2xs'
                      : 'border-2 border-transparent hover:border-stone-200/80 hover:bg-stone-100/50'
                  }`}
                  title="View all produce in this aisle"
                >
                  <img
                    src="/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg"
                    alt="All"
                    className="w-6 h-6 sm:w-7 sm:h-7 aspect-square rounded-full object-cover shrink-0 border border-stone-200/80 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`text-xs sm:text-sm tracking-tight transition-colors whitespace-nowrap ${
                      selectedSubcategory === null
                        ? 'font-bold text-[#173b28]'
                        : 'font-medium text-stone-700 group-hover:text-stone-900'
                    }`}
                  >
                    All {selectedCategory !== 'All' ? selectedCategory : ''}
                  </span>
                </button>

                {/* Subcategories */}
                {activeSubcategories.map((subcat) => {
                  const isSelected = selectedSubcategory === subcat.id;
                  return (
                    <button
                      key={subcat.id}
                      onClick={() => {
                        if (selectedSubcategory === subcat.id) {
                          setSelectedSubcategory(null);
                        } else {
                          setSelectedSubcategory(subcat.id);
                        }
                      }}
                      className={`flex items-center gap-1.5 cursor-pointer shrink-0 group focus:outline-none transition-all px-1.5 sm:px-2 py-1 rounded-xl ${
                        isSelected
                          ? 'border-2 border-[#173b28] bg-white shadow-2xs'
                          : 'border-2 border-transparent hover:border-stone-200/80 hover:bg-stone-100/50'
                      }`}
                      title={`Filter by ${subcat.name}`}
                    >
                      <img
                        src={subcat.image}
                        alt={subcat.name}
                        className="w-6 h-6 sm:w-7 sm:h-7 aspect-square rounded-full object-cover shrink-0 border border-stone-200/80 shadow-2xs transition-transform duration-200 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`text-xs sm:text-sm tracking-tight transition-colors whitespace-nowrap ${
                          isSelected
                            ? 'font-bold text-[#173b28]'
                            : 'font-medium text-stone-700 group-hover:text-stone-900'
                        }`}
                      >
                        {subcat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Slide-out Menu Drawer from the Left */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="absolute inset-y-0 left-0 max-w-full flex pr-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col border-r border-stone-200 animate-in slide-in-from-left duration-200">
              {/* Drawer Top Header: Super informal Welcome greeting (compact height) */}
              <div className="px-3.5 py-2.5 border-b border-stone-200 flex items-center justify-between bg-[#FBF9F5]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-lg shrink-0" role="img" aria-label="wave">
                    👋
                  </span>
                  <span className="font-display font-extrabold text-xs sm:text-sm text-stone-900 tracking-tight truncate">
                    Welcome {shopperName}!
                  </span>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-7 h-7 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close menu"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delivery Area Indicator Strip (compact height) */}
              <div className="px-3.5 py-1.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-700 min-w-0">
                  <MapPin className="w-3 h-3 text-[#173b28] shrink-0" />
                  <span className="truncate">Area: <strong className="text-stone-900">{selectedNeighborhood.name}</strong></span>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsNeighborhoodModalOpen(true);
                  }}
                  className="text-[#173b28] font-semibold underline text-[10.5px] shrink-0 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Menu Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Produce Categories in 3-column responsive grid: No parent container, highlight text & image */}
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES_CONFIG.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleNavClick(cat.id)}
                        className="flex flex-col items-center justify-center p-1 text-center transition-all cursor-pointer group bg-transparent"
                      >
                        <img
                          src={cat.image}
                          alt={cat.label}
                          className={`w-12 h-12 aspect-square rounded-xl object-cover transition-all shadow-2xs group-hover:scale-105 ${
                            isActive
                              ? 'ring-2 ring-[#173b28] ring-offset-2 scale-105 shadow-md'
                              : 'border border-stone-200/80 opacity-80 group-hover:opacity-100'
                          }`}
                          referrerPolicy="no-referrer"
                        />
                        <span
                          className={`mt-1.5 text-xs leading-tight line-clamp-1 transition-colors ${
                            isActive
                              ? 'font-bold text-[#173b28] underline decoration-2 underline-offset-4'
                              : 'font-medium text-stone-700 group-hover:text-stone-900'
                          }`}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Featured Section with Auto-swiping Carousel */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-stone-800 px-0.5">
                    Featured
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden h-44 sm:h-48 border border-stone-200/80 shadow-xs group bg-stone-900">
                    {DRAWER_BANNERS.map((banner, index) => (
                      <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                          index === currentDrawerBanner ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      >
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders and Tracking (Merchant hub console and Orders & Hub heading removed) */}
                <div className="pt-2 border-t border-stone-100">
                  <button
                    onClick={handleTrackRecentOrder}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-stone-800 hover:bg-stone-100 hover:text-[#173b28] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <PackageCheck className="w-4 h-4 text-stone-500" />
                      <span>Orders and Tracking</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-stone-200 bg-stone-50 text-xs text-stone-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>Helpline: 0722 000 000</span>
                </div>
                <span className="font-mono text-[11px]">Nairobi, KE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
