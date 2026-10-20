import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SUBCATEGORIES_CONFIG } from '../data/products';

interface CarouselImage {
  id: string;
  image: string;
  alt: string;
}

const CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: 'harvest-basket',
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
    alt: 'Highland organic fresh produce basket with greens, avocados and sourdough'
  },
  {
    id: 'hass-avocado',
    image: '/src/assets/images/product_hass_avocado_1792228088344.jpg',
    alt: "Tree-ripened Murang'a creamy Hass avocados"
  },
  {
    id: 'spinach-kale',
    image: '/src/assets/images/product_spinach_kale_1792228088029.jpg',
    alt: 'Misty highland fresh organic spinach and crisp curly sukuma kale'
  },
  {
    id: 'passion-fruit',
    image: '/src/assets/images/product_passion_fruit_1792228088974.jpg',
    alt: 'Sweet golden Kenyan passion fruits'
  },
  {
    id: 'highland-aromatics',
    image: '/src/assets/images/category_aromatics_1792245411534.jpg',
    alt: 'Vibrant highland dhania coriander, garlic, ginger and chilies'
  },
  {
    id: 'artisan-sourdough',
    image: '/src/assets/images/product_sourdough_loaf_1792228088760.jpg',
    alt: 'Crispy stone-ground artisan sourdough loaf'
  }
];

export const HeroBanner: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const { 
    selectedNeighborhood, 
    setIsNeighborhoodModalOpen,
    selectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    setSelectedCategory,
    showToast
  } = useStore();

  // Duplicate items to form a seamless infinite loop in the thread feed
  const feedItems = [
    ...CAROUSEL_IMAGES,
    ...CAROUSEL_IMAGES,
    ...CAROUSEL_IMAGES
  ];

  // Dynamic live feed ticker items with delivery ETA & farm dispatch updates
  const tickerItems = [
    {
      id: 'dispatch',
      image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
      content: (
        <>
          <span>Dispatching now to </span>
          <strong className="text-[#173b28] underline decoration-[#173b28]/30 font-semibold">{selectedNeighborhood.name}</strong>
          <span className="text-stone-500"> ({selectedNeighborhood.minMins}-{selectedNeighborhood.maxMins} mins ETA)</span>
        </>
      )
    },
    {
      id: 'spinach',
      image: '/src/assets/images/product_spinach_kale_1792228088029.jpg',
      content: (
        <>
          <span>Limuru Highland Farm: </span>
          <strong className="text-[#173b28]">Morning mist harvest</strong>
          <span className="text-stone-500"> collards &amp; spinach packed</span>
        </>
      )
    },
    {
      id: 'avocado',
      image: '/src/assets/images/product_hass_avocado_1792228088344.jpg',
      content: (
        <>
          <span>Murang&apos;a Organic: </span>
          <strong className="text-[#173b28]">Grade 1 Hass avocados</strong>
          <span className="text-stone-500"> ripe &amp; creamy</span>
        </>
      )
    },
    {
      id: 'sourdough',
      image: '/src/assets/images/product_sourdough_loaf_1792228088760.jpg',
      content: (
        <>
          <span>Hearth Bakery Tigoni: </span>
          <strong className="text-[#173b28]">Fresh warm crusty sourdough</strong>
          <span className="text-stone-500"> pulled from stone deck</span>
        </>
      )
    },
    {
      id: 'passion-fruit',
      image: '/src/assets/images/product_passion_fruit_1792228088974.jpg',
      content: (
        <>
          <span>Embu Orchards: </span>
          <strong className="text-[#173b28]">Tree-ripened purple passion fruits</strong>
          <span className="text-stone-500"> arrived at refrigerated hub</span>
        </>
      )
    },
    {
      id: 'cutoff',
      image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
      content: (
        <>
          <span>Order before </span>
          <strong className="text-[#173b28]">11:00 AM</strong>
          <span> for afternoon arrival · </span>
          <span className="text-stone-500">Lipa na M-Pesa native</span>
        </>
      )
    }
  ];

  const fullTickerList = [...tickerItems, ...tickerItems];

  // Subcategories to display depending on selected category
  const visibleSubcategories = selectedCategory === 'All'
    ? SUBCATEGORIES_CONFIG
    : SUBCATEGORIES_CONFIG.filter(sub => sub.category === selectedCategory);

  const handleSubcategoryClick = (subcatId: string) => {
    if (selectedSubcategory === subcatId) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcatId);
      showToast(`Filtered: ${subcatId}`, 'info');
      const catalog = document.getElementById('produce-catalog');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleFlashLightingClick = () => {
    // Flash harvest button action
    showToast('⚡ Flash Harvest: Showing popular fast-moving highland items!', 'info');
    setSelectedSubcategory(null);
    setSelectedCategory('All');
    const catalog = document.getElementById('produce-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full relative select-none">
      {/* 1. Live Feed above the carousel - 0 margin left & right */}
      <div className="relative w-full m-0 p-0 bg-stone-100/90 border-y border-stone-200/80 py-1.5 z-20">
        <div className="w-full overflow-hidden m-0 p-0">
          <div 
            className="animate-ticker cursor-pointer flex items-center gap-8 m-0 p-0"
            onClick={() => setIsNeighborhoodModalOpen(true)}
            title="Click to view delivery details or change neighborhood"
          >
            {fullTickerList.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-2 shrink-0 pr-4">
                {/* Leading Live Pulsing Dot */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#173b28] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#173b28]"></span>
                </span>

                {/* Icon Image Thumbnail */}
                <img
                  src={item.image}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover border border-stone-300 shrink-0 shadow-2xs"
                  referrerPolicy="no-referrer"
                />

                {/* Rich Text */}
                <div className="text-[11px] sm:text-xs text-stone-700 whitespace-nowrap">
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small circular floating button with lightning icon at the bottom-right of live feed / top-right of carousel */}
        <button
          onClick={handleFlashLightingClick}
          className="absolute right-4 sm:right-6 md:right-8 -bottom-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#173b28] hover:bg-[#205238] active:scale-90 text-amber-300 shadow-md hover:shadow-lg flex items-center justify-center border-2 border-white cursor-pointer transition-all hover:scale-110"
          title="Flash Harvest · Fast Highland Essentials"
          aria-label="Flash Harvest Essentials"
        >
          <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-amber-300 text-amber-300" />
        </button>
      </div>

      {/* 2. Banner Carousel - Image thread feed with NO left/right glare */}
      <div
        className="relative w-full overflow-hidden pt-3 sm:pt-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        aria-label="Fresh Harvest Image Thread Feed"
      >
        {/* Continuous thread feed track - Glare overlays intentionally removed */}
        <div
          className="animate-thread-feed gap-4 sm:gap-6 px-4"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {feedItems.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              className="w-[260px] sm:w-[350px] md:w-[400px] lg:w-[440px] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-stone-200/80 bg-stone-900 aspect-[16/7] transition-transform duration-300 hover:scale-[1.01]"
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading={idx < 4 ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Below the carousel: Subcategories in circular icon images with the name below icon image (No subcategories text/icon header) */}
      <div id="subcategories-bar" className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
        <div className="flex items-start justify-start sm:justify-center gap-3.5 sm:gap-6 overflow-x-auto scrollbar-none py-2 px-1">
          {/* "All" subcategory circular icon */}
          <button
            onClick={() => setSelectedSubcategory(null)}
            className="flex flex-col items-center gap-1.5 sm:gap-2 group shrink-0 cursor-pointer focus:outline-none px-1"
            title="View all produce in this aisle"
          >
            <img
              src="/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg"
              alt="All"
              className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover transition-all duration-200 group-hover:scale-105 select-none pointer-events-none ${
                selectedSubcategory === null
                  ? 'ring-2 ring-offset-2 ring-[#173b28] scale-105'
                  : 'opacity-90 hover:opacity-100'
              }`}
            />
            <span className={`text-[11px] sm:text-xs text-center leading-tight whitespace-nowrap transition-colors ${
              selectedSubcategory === null
                ? 'font-bold text-[#173b28]'
                : 'font-medium text-stone-700 group-hover:text-stone-900'
            }`}>
              All
            </span>
          </button>

          {/* Subcategory circular icons */}
          {visibleSubcategories.map((subcat) => {
            const isSelected = selectedSubcategory === subcat.id;
            return (
              <button
                key={subcat.id}
                onClick={() => handleSubcategoryClick(subcat.id)}
                className="flex flex-col items-center gap-1.5 sm:gap-2 group shrink-0 cursor-pointer focus:outline-none px-1"
                title={`Filter by ${subcat.name}`}
              >
                <img
                  src={subcat.image}
                  alt={subcat.name}
                  className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover transition-all duration-200 group-hover:scale-105 select-none pointer-events-none ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-[#173b28] scale-105'
                      : 'opacity-90 hover:opacity-100'
                  }`}
                />
                <span className={`text-[11px] sm:text-xs text-center leading-tight whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'font-bold text-[#173b28]'
                    : 'font-medium text-stone-700 group-hover:text-stone-900'
                }`}>
                  {subcat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
