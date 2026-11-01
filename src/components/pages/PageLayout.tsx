import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PageLayoutProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  currentPage: string;
  headerImage?: string;
  headerImageAlt?: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  badge,
  title,
  subtitle,
  currentPage,
  headerImage,
  headerImageAlt,
  children
}) => {
  const { setViewMode } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleBackToShop = () => {
    setViewMode('store');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBackToShop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={handleBackToShop}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title || currentPage}
    >
      <div
        className="relative w-[85vw] max-w-[85vw] h-full bg-[#FBF9F5] rounded-none shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Top Header */}
        <div className="bg-white border-b border-stone-200/90 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="font-display font-bold text-base sm:text-lg text-stone-900 leading-tight tracking-tight truncate">
              {currentPage}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToShop}
              className="w-8 h-8 rounded-full hover:bg-stone-100 active:scale-95 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: Fits inside the 80% vertical height */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-8 py-5 sm:py-6 space-y-6"
        >
          {headerImage && (
            <div className="relative w-full h-36 sm:h-48 md:h-56 rounded-2xl overflow-hidden shadow-xs border border-stone-200/80 bg-stone-100 mb-2">
              <img
                src={headerImage}
                alt={headerImageAlt || title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {title && (
            <div className="text-center space-y-1 pb-1">
              <h1 className="font-display font-black text-xl sm:text-2xl text-stone-900 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};
