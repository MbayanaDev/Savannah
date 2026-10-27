import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: 'vision' | 'mission' | 'promise';
  tag: string;
  title: string;
  tagColor: string;
  image: string;
  statement: string;
}

const SLIDES: Slide[] = [
  {
    id: 'vision',
    tag: 'LONG-TERM ASPIRATION',
    title: 'Our Vision',
    tagColor: 'text-amber-800',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=640&h=360&q=80',
    statement: "To become Kenya's most trusted farm-to-kitchen brand by connecting consumers with honest, traceable, and high-quality produce while creating sustainable value for farming communities."
  },
  {
    id: 'mission',
    tag: 'FOUNDATIONAL MANDATE',
    title: 'Our Mission',
    tagColor: 'text-emerald-800',
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
    statement: "To make fresh, high-quality produce traceably accessible at fair prices by connecting farmers directly with households and businesses through responsible sourcing, handling, and dependable delivery."
  },
  {
    id: 'promise',
    tag: 'CORE COMMITMENT',
    title: 'Our Promise',
    tagColor: 'text-emerald-900',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=640&h=360&q=80',
    statement: "Freshness you can trace. Quality you can taste. Honesty you can trust."
  }
];

export const VisionMissionCarousel: React.FC = () => {
  // We append the first slide at the end to create a seamless infinite leftward sliding transition
  const extendedSlides = [...SLIDES, SLIDES[0]];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 10000ms transition interval, stopped while hovered or held
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setWithTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 10000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused]);

  // When transition completes at the cloned slide (index 3), jump instantly back to index 0 without animation
  const handleTransitionEnd = () => {
    if (currentIndex >= SLIDES.length) {
      setWithTransition(false);
      setCurrentIndex(0);
      // Re-enable transition on the next animation frame for future slides
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWithTransition(true);
    if (currentIndex === 0) {
      setCurrentIndex(SLIDES.length - 1);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const goToSlide = (idx: number) => {
    setWithTransition(true);
    setCurrentIndex(idx);
  };

  const normalizedIndex = currentIndex % SLIDES.length;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onPointerDown={() => setIsPaused(true)}
      onPointerUp={() => setIsPaused(false)}
      className="relative w-full overflow-hidden select-none cursor-default py-0"
      aria-roledescription="carousel"
      aria-label="Vision, Mission, and Promise Carousel"
    >
      {/* Sliding Track: moves old slide left (-100%) while new slide emerges from the right */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex w-full ${
          withTransition ? 'transition-transform duration-700 ease-in-out' : ''
        }`}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {extendedSlides.map((slide, idx) => {
          return (
            <div key={`${slide.id}-${idx}`} className="w-full shrink-0 flex flex-col justify-center">
              <div className="clearfix">
                {/* Leading 16:9 Image floated left */}
                <div className="float-left mr-3.5 sm:mr-4.5 mb-0.5 sm:mb-1 w-32 sm:w-44 md:w-52 aspect-[16/9] rounded-xl overflow-hidden shadow-xs border border-stone-200/90 bg-stone-100">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Eyebrow, Title and long text starting right below the header */}
                <div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest ${slide.tagColor} font-extrabold block leading-tight`}
                  >
                    {slide.tag}
                  </span>
                  <h4 className="font-display font-extrabold text-lg sm:text-2xl text-stone-900 tracking-tight leading-tight mt-0.5 mb-1">
                    {slide.title}
                  </h4>
                  <p className="italic text-stone-700 text-xs sm:text-sm md:text-[15px] leading-relaxed">
                    &ldquo;{slide.statement}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Below all the text: Minimalist position indicator and forward / back navigation */}
      <div className="flex items-center justify-between pt-2">
        {/* Minimalist position indicator */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                normalizedIndex === idx
                  ? 'w-5 h-1 bg-[#173b28]'
                  : 'w-1.5 h-1 bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>

        {/* Minimalist forward and back navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="w-6 h-6 rounded-md hover:bg-stone-200/70 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="w-6 h-6 rounded-md hover:bg-stone-200/70 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
