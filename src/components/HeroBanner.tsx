import React, { useState, useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const subcategoriesBarRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isUpscroll, setIsUpscroll] = useState(false);
  const lastScrollY = useRef(0);
  const [headerHeight, setHeaderHeight] = useState(88);
  const [barHeight, setBarHeight] = useState(105);

  const [isSubcatNavPaused, setIsSubcatNavPaused] = useState(false);
  const [subcatDuration, setSubcatDuration] = useState(42);
  const resumeSubcatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subcatTrackRef = useRef<HTMLDivElement>(null);

  const handleSubcatInteractionStart = () => {
    setIsSubcatNavPaused(true);
    if (resumeSubcatTimeoutRef.current) {
      clearTimeout(resumeSubcatTimeoutRef.current);
    }
  };

  const handleSubcatInteractionEnd = () => {
    if (resumeSubcatTimeoutRef.current) {
      clearTimeout(resumeSubcatTimeoutRef.current);
    }
    resumeSubcatTimeoutRef.current = setTimeout(() => {
      setIsSubcatNavPaused(false);
    }, 1200);
  };

  useEffect(() => {
    const updateSticky = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop;
      const diff = currentY - lastScrollY.current;
      if (diff < -1) {
        setIsUpscroll(true);
      } else if (diff > 1) {
        setIsUpscroll(false);
      }
      lastScrollY.current = currentY;

      const searchBar = document.getElementById('header-search-bar');
      const mainRow = document.getElementById('header-main-row');
      let currentHeaderBottom = 88;
      if (searchBar) {
        const rect = searchBar.getBoundingClientRect();
        currentHeaderBottom = rect.bottom > 0 ? rect.bottom : (searchBar.offsetHeight + (mainRow?.offsetHeight || 48));
      } else if (mainRow) {
        const rect = mainRow.getBoundingClientRect();
        currentHeaderBottom = rect.bottom > 0 ? rect.bottom : (mainRow.offsetHeight || 48);
      } else {
        const headerEl = document.querySelector('header');
        if (headerEl) {
          const rect = headerEl.getBoundingClientRect();
          currentHeaderBottom = rect.bottom > 0 ? rect.bottom : 88;
        }
      }
      setHeaderHeight(currentHeaderBottom);

      if (subcategoriesBarRef.current && subcategoriesBarRef.current.offsetHeight > 0) {
        setBarHeight(subcategoriesBarRef.current.offsetHeight);
      }

      if (currentY <= 15) {
        setIsSticky(false);
        setIsUpscroll(false);
        return;
      }

      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const sentinelTop = sentinel.getBoundingClientRect().top;
      // Stays static at the top of the screen when scrolled past the carousel.
      // On downscroll and upscroll, rests directly at the top of the screen (top: 0px) as the rest of the page moves past.
      setIsSticky(sentinelTop <= 0);
    };

    window.addEventListener('scroll', updateSticky, { passive: true, capture: true });
    document.addEventListener('scroll', updateSticky, { passive: true, capture: true });
    window.addEventListener('resize', updateSticky, { passive: true });

    const rafId = requestAnimationFrame(updateSticky);
    updateSticky();

    // IntersectionObserver guarantees instant trigger on fast scrolling / touch flings
    const sentinel = sentinelRef.current;
    let observer: IntersectionObserver | null = null;
    if (sentinel && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        () => {
          updateSticky();
        },
        {
          root: null,
          threshold: [0, 0.25, 0.5, 0.75, 1]
        }
      );
      observer.observe(sentinel);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateSticky, true);
      document.removeEventListener('scroll', updateSticky, true);
      window.removeEventListener('resize', updateSticky);
      if (observer) observer.disconnect();
      if (resumeSubcatTimeoutRef.current) {
        clearTimeout(resumeSubcatTimeoutRef.current);
      }
    };
  }, []);

  const { 
    selectedNeighborhood, 
    setIsNeighborhoodModalOpen,
    selectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    setSelectedCategory,
    subcategoriesList,
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

  // Subcategories to display depending on selected category (linked to Supabase tables)
  const visibleSubcategories = selectedCategory === 'All'
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

  const handleSubcategoryClick = (subcatId: string | null) => {
    if (subcatId === null) {
      setSelectedSubcategory(null);
      showToast('Showing all produce', 'info');
      const catalog = document.getElementById('produce-catalog');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (selectedSubcategory === subcatId) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcatId);
      const matched = visibleSubcategories.find((s) => s.id === subcatId);
      showToast(`Filtered: ${matched?.name || subcatId}`, 'info');
      const catalog = document.getElementById('produce-catalog');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Base subcategory CTAs including "All"
  const baseSubcategoryItems = [
    {
      id: 'all',
      subcatId: null,
      name: 'All',
      image: '/icons/categories/all.png'
    },
    ...visibleSubcategories.map((sub) => ({
      id: sub.id,
      subcatId: sub.id,
      name: sub.name,
      image: sub.image
    }))
  ];

  // Repeat enough times so each half spans enough width for large viewports (guarantees seamless autoscroll)
  const repeatCount = Math.max(4, Math.ceil(24 / Math.max(1, baseSubcategoryItems.length)));
  const subcatHalf: typeof baseSubcategoryItems = [];
  for (let i = 0; i < repeatCount; i++) {
    subcatHalf.push(...baseSubcategoryItems);
  }
  const infiniteSubcategories = [...subcatHalf, ...subcatHalf];

  // Synchronize autoscroll pace (pixels per second) with category CTAs in Header
  useEffect(() => {
    const syncPace = () => {
      const subcatEl = subcatTrackRef.current;
      if (!subcatEl) return;
      const subcatWidth = subcatEl.scrollWidth;
      if (subcatWidth <= 0) return;

      // Find the category CTAs autoscroll track in the header
      const catTrack = document.querySelector('#header-nav-bar .animate-header-autoscroll') as HTMLElement | null;
      let targetPace = 18.5; // Default reference pace in px/s

      if (catTrack && catTrack.scrollWidth > 0) {
        // Category track travels half its total scrollWidth in 42s
        targetPace = (catTrack.scrollWidth / 2) / 42;
      }

      // Calculate matching duration so physical pixels/second is identical to category CTAs
      const calculatedDuration = (subcatWidth / 2) / targetPace;
      const rounded = Math.round(calculatedDuration * 10) / 10;
      setSubcatDuration((prev) => (Math.abs(prev - rounded) > 0.5 ? rounded : prev));
    };

    // Run immediately and shortly after layout paint
    syncPace();
    const timeout = setTimeout(syncPace, 150);

    window.addEventListener('resize', syncPace, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', syncPace);
    };
  }, [isSticky, visibleSubcategories.length]);

  const renderSubcategoryCTA = (
    subcat: { id: string; subcatId: string | null; name: string; image: string },
    key: string
  ) => {
    const isSelected = selectedSubcategory === subcat.subcatId;
    return (
      <button
        key={key}
        onClick={() => handleSubcategoryClick(subcat.subcatId)}
        className="flex flex-col items-center gap-1.5 sm:gap-2 group shrink-0 cursor-pointer focus:outline-none px-1"
        title={subcat.subcatId ? `Filter by ${subcat.name}` : 'View all produce in this aisle'}
      >
        <img
          src={subcat.image}
          alt={subcat.name}
          className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover transition-all duration-200 group-hover:scale-105 select-none pointer-events-none ${
            isSelected
              ? 'ring-2 ring-offset-2 ring-[#173b28] scale-105'
              : 'opacity-90 hover:opacity-100'
          }`}
          onError={(e) => {
            const target = e.currentTarget;
            if (subcat.subcatId === null) {
              if (!target.dataset.fallbackTried) {
                target.dataset.fallbackTried = '1';
                target.src = '/public/icons/categories/all.png';
              } else if (target.dataset.fallbackTried === '1') {
                target.dataset.fallbackTried = '2';
                target.src = '/src/assets/images/all.png';
              }
            }
          }}
        />
        <span
          className={`text-[11px] sm:text-xs text-center leading-tight whitespace-nowrap transition-colors ${
            isSelected
              ? 'font-bold text-[#173b28]'
              : 'font-medium text-stone-700 group-hover:text-stone-900'
          }`}
        >
          {subcat.name}
        </span>
      </button>
    );
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
    <section 
      className="w-full relative select-none transition-[padding-bottom] duration-150"
      style={{ paddingBottom: isSticky ? `${barHeight}px` : '0px' }}
    >
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
        {/* Stable Sentinel at bottom of carousel */}
        <div ref={sentinelRef} className="h-0 w-full pointer-events-none" />
      </div>

      {/* Invisible placeholder spacer when subcategories bar is fixed at top to prevent page content jumps */}
      {isSticky && (
        <div
          style={{ height: `${barHeight}px` }}
          className="w-full pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* 3. Below the carousel: Subcategories in circular icon images with the name below icon image (Static at top on scroll until reached, resting at top of screen on downscroll and upscroll, autoscrolling right to left when sticky at the top) */}
      <div
        id="subcategories-bar"
        ref={subcategoriesBarRef}
        onMouseEnter={handleSubcatInteractionStart}
        onMouseLeave={handleSubcatInteractionEnd}
        onTouchStart={handleSubcatInteractionStart}
        onTouchEnd={handleSubcatInteractionEnd}
        className={`w-full max-w-full overflow-hidden transition-[box-shadow] duration-150 ease-out select-none ${
          isSticky
            ? 'fixed top-0 left-0 right-0 z-50 bg-[#FBF9F5] border-b border-stone-200/90 shadow-md py-1.5 px-0'
            : 'w-full px-0 pt-4 sm:pt-5'
        }`}
        style={
          isSticky
            ? {
                top: '0px'
              }
            : undefined
        }
      >
        <div className="w-full px-0 overflow-hidden">
          {isSticky ? (
            /* When the subcategory nav container moves to the top, let the CTAs autoscroll from right to left just like how the categories do */
            <div
              ref={subcatTrackRef}
              className="animate-header-autoscroll flex items-center gap-3.5 sm:gap-6 md:gap-8 whitespace-nowrap px-2 sm:px-4 py-1"
              style={{
                animation: `headerAutoscrollRtl ${subcatDuration}s linear infinite`,
                animationPlayState: isSubcatNavPaused ? 'paused' : 'running'
              }}
            >
              {infiniteSubcategories.map((subcat, idx) =>
                renderSubcategoryCTA(subcat, `${subcat.id}-${idx}`)
              )}
            </div>
          ) : (
            <div className="flex items-start justify-start sm:justify-center gap-3 sm:gap-5 overflow-x-auto scrollbar-none py-1.5 px-2 sm:px-3">
              {baseSubcategoryItems.map((subcat) =>
                renderSubcategoryCTA(subcat, subcat.id)
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
