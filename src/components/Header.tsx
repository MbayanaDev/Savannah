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
  SlidersHorizontal,
  User,
  Truck
} from 'lucide-react';
import { MajesticDoorIcon } from './icons/MajesticDoorIcon';
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
    categoriesList,
    subcategoriesList,
    isSupabaseLive,
    syncCategoriesFromSupabase,
    setActiveMobileTab,
    orders,
    setActiveTrackOrder,
    searchQuery,
    setSearchQuery,
    showToast,
    isProfileOpen,
    setIsProfileOpen,
    currentUser
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
    ? subcategoriesList
    : subcategoriesList.filter(sub => 
        sub.category === selectedCategory || 
        sub.categoryId === selectedCategory ||
        (selectedCategory === 'Veg' && (
          sub.categoryId === 'd54bb4bf-9351-4b65-be84-8fe4c6c5e007' ||
          sub.slug === 'cooking-staples' || 
          sub.slug === 'salads-crunchy-greens' || 
          sub.slug === 'staple-greens' || 
          sub.slug === 'pods-legumes'
        )) ||
        (selectedCategory === 'Fruits' && (
          sub.slug === 'tropical-staples' || 
          sub.slug === 'citrus-juicing' || 
          sub.slug === 'orchard-berries'
        )) ||
        (selectedCategory === 'Aromatics' && (
          sub.categoryId === 'a2c5bba0-1bdb-44d9-8fbf-c7c08ab450e7' ||
          sub.slug === 'fresh-aromatics' || 
          sub.slug === 'fresh-herbs'
        ))
      );

  const shopperName = currentUser?.name
    ? currentUser.name.trim().split(' ')[0]
    : orders.length > 0 && orders[0].customerName
      ? orders[0].customerName.trim().split(' ')[0]
      : 'Shopper';



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
    setViewMode('orders');
    if (orders.length > 0) {
      setActiveTrackOrder(orders[0]);
    } else {
      setActiveTrackOrder(SEED_ORDERS[0]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleUtilities = () => {
    setIsNeighborhoodModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/98 backdrop-blur-md border-b border-stone-200/90 shadow-2xs w-full max-w-full overflow-x-clip">
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
            {viewMode === 'orders' ? (
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 cursor-pointer text-center group"
                title="Orders"
              >
                <div className="w-6 h-6 rounded-md bg-[#173b28] flex items-center justify-center text-white shadow-2xs">
                  <PackageCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-display font-extrabold text-sm sm:text-base text-[#173b28] tracking-tight whitespace-nowrap flex items-center gap-1.5">
                  <span>Orders</span>
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#173b28]/10 text-[#173b28] border border-[#173b28]/20">
                    {orders.length}
                  </span>
                </span>
              </button>
            ) : (
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
            )}
          </div>

          {/* Right Column: Delivery Icon Button on Orders Page / Cart Icon Button on Store */}
          <div className="flex items-center justify-end gap-1.5">
            {/* Quick Neighborhood Badge (Desktop, store only) */}
            {viewMode !== 'orders' && (
              <button
                onClick={() => setIsNeighborhoodModalOpen(true)}
                className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md border border-stone-200 bg-white hover:border-stone-300 text-[11px] text-stone-700 transition-colors cursor-pointer mr-0.5"
                title="Change Delivery Area"
              >
                <MapPin className="w-3 h-3 text-[#173b28]" />
                <span className="truncate max-w-[105px] font-medium">{selectedNeighborhood.name}</span>
              </button>
            )}

            {/* Account / Profile Button */}
            {viewMode !== 'orders' && (
              <button
                onClick={() => {
                  setViewMode('profile');
                  setActiveMobileTab('profile');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-stone-800 hover:bg-stone-200/60 active:scale-95 transition-all cursor-pointer ${
                  viewMode === 'profile' ? 'bg-stone-200/80 ring-1 ring-stone-300' : ''
                }`}
                aria-label="Account Profile"
                title={currentUser ? currentUser.name : 'Account Profile'}
              >
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-stone-700" />
                )}
              </button>
            )}

            {/* On Orders page: Delivery button. On Store: Cart button */}
            {viewMode === 'orders' ? (
              <button
                onClick={() => setIsNeighborhoodModalOpen(true)}
                className="relative flex items-center justify-center w-8 h-8 rounded-lg text-stone-800 hover:bg-stone-200/60 active:scale-95 transition-all cursor-pointer -mr-1"
                aria-label="Delivery locations"
                title="Delivery"
              >
                <Truck className="w-5 h-5 text-[#173b28]" />
              </button>
            ) : (
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
            )}
          </div>
        </div>

        {/* Search Container: Search bar */}
        {viewMode === 'store' && (
          <div className="pb-1 pt-0.5">
            <div className="max-w-7xl mx-auto px-4 mb-0.5">
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
          <div id="header-nav-bar" className="bg-[#FBF9F5] border-t border-stone-200/80 overflow-x-auto scrollbar-none pt-1 pb-1 px-3 sm:px-6 transition-all duration-200">
            {!showSubcategoriesInHeader ? (
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 sm:gap-6 md:gap-8 whitespace-nowrap animate-in fade-in duration-200">
                {categoriesList.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleNavClick(cat.id)}
                      className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group focus:outline-none transition-all pt-0.5 pb-0.5 px-1 bg-transparent"
                    >
                      <img
                        src={
                          cat.id === 'All' || cat.label?.toLowerCase() === 'all' || cat.slug === 'all'
                            ? '/icons/categories/all.png'
                            : (cat.image || '/icons/categories/all.png')
                        }
                        alt={cat.label}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          isActive
                            ? 'ring-2 ring-[#173b28] ring-offset-2 shadow-xs'
                            : 'opacity-90 group-hover:opacity-100'
                        }`}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallbackTried) {
                            target.dataset.fallbackTried = '1';
                            target.src = '/public/icons/categories/all.png';
                          } else if (target.dataset.fallbackTried === '1') {
                            target.dataset.fallbackTried = '2';
                            target.src = '/src/assets/images/all.png';
                          }
                        }}
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`text-xs sm:text-sm tracking-tight text-center transition-colors whitespace-nowrap ${
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
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 sm:gap-6 md:gap-8 whitespace-nowrap animate-in fade-in duration-200">
                {/* All subcategory in active category */}
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    showToast(`Showing all in ${selectedCategory}`, 'info');
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group focus:outline-none transition-all pt-0.5 pb-0.5 px-1 bg-transparent"
                  title="View all produce in this aisle"
                >
                  <img
                    src="/icons/categories/all.png"
                    alt="All"
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      selectedSubcategory === null
                        ? 'ring-2 ring-[#173b28] ring-offset-2 shadow-xs'
                        : 'opacity-90 group-hover:opacity-100'
                    }`}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallbackTried) {
                        target.dataset.fallbackTried = '1';
                        target.src = '/public/icons/categories/all.png';
                      } else if (target.dataset.fallbackTried === '1') {
                        target.dataset.fallbackTried = '2';
                        target.src = '/src/assets/images/all.png';
                      }
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`text-xs sm:text-sm tracking-tight text-center transition-colors whitespace-nowrap ${
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
                      className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group focus:outline-none transition-all pt-0.5 pb-0.5 px-1 bg-transparent"
                      title={`Filter by ${subcat.name}`}
                    >
                      <img
                        src={subcat.image}
                        alt={subcat.name}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          isSelected
                            ? 'ring-2 ring-[#173b28] ring-offset-2 shadow-xs'
                            : 'opacity-90 group-hover:opacity-100'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`text-xs sm:text-sm tracking-tight text-center transition-colors whitespace-nowrap ${
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
            <div className="w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col border-r border-stone-200 animate-in slide-in-from-left duration-200">
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
                  {categoriesList.map((cat) => {
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
                {/* Orders and Account */}
                <div className="pt-2 border-t border-stone-100 space-y-1">
                  {/* Orders */}
                  <button
                    onClick={handleTrackRecentOrder}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-stone-800 hover:bg-stone-100 hover:text-[#173b28] transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#173b28] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                        <PackageCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-stone-900">Orders</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#173b28]/10 text-[#173b28] border border-[#173b28]/20">
                        {orders.length}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  {/* Account Settings */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsProfileOpen(true);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-stone-800 hover:bg-stone-100 hover:text-[#173b28] transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200/90 text-stone-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                        <User className="w-4 h-4 text-stone-600" />
                      </div>
                      <span className="font-semibold text-stone-900">{currentUser ? 'Account settings' : 'Sign up / Log in'}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Savannah Arcana */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setViewMode('arcana');
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-emerald-950 bg-gradient-to-r from-emerald-50 via-white to-amber-50/50 hover:from-emerald-100/80 hover:to-amber-100/70 transition-all flex items-center justify-between cursor-pointer border border-emerald-300/80 mt-1 shadow-2xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#173b28] text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                        <MajesticDoorIcon className="w-4.5 h-4.5 text-amber-300" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-stone-900 tracking-tight">Savannah Arcana</span>
                          <span className="text-[9px] bg-amber-400/20 text-amber-900 border border-amber-300/60 px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">CO-CREATE</span>
                        </div>
                        <span className="text-[10px] text-emerald-800 font-medium">Growing honest food together</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-800 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Contact CTA: Call leading favicon + "talk to us" + WhatsApp trailing favicon */}
                  <div
                    className="w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-stone-800 hover:bg-emerald-50/50 hover:text-emerald-950 transition-colors flex items-center justify-between border border-stone-200/90 bg-white shadow-2xs group mt-1.5"
                  >
                    <a
                      href="tel:+254700892019"
                      className="flex items-center gap-2.5 group/call cursor-pointer"
                      title="Call Savannah Fresh (+254 700 892 019)"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#34C759] flex items-center justify-center text-white shadow-xs shrink-0 group-hover/call:scale-105 transition-transform">
                        <Phone className="w-4 h-4 fill-white text-white" />
                      </div>
                      <span className="font-semibold text-stone-900 group-hover/call:text-emerald-950 capitalize">talk to us</span>
                    </a>
                    <a
                      href="https://wa.me/254700892019?text=Hello%20Savannah%20Fresh%2C%20I%20would%20like%20to%20talk%20to%20support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-xs shrink-0 hover:scale-105 transition-transform cursor-pointer"
                      title="Chat on WhatsApp"
                    >
                      <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
