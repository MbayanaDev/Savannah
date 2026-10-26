import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Play, 
  Pause, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  HeartHandshake, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

export interface FarmerTestimonial {
  id: string;
  name: string;
  role: string;
  demographic: string;
  category: string;
  location: string;
  county: string;
  elevation: string;
  acreage: string;
  crops: string[];
  quote: string;
  impactMetric: string;
  payoutSpeed: string;
  npsScore: string;
  partnerSince: string;
  photo: string;
  farmPhoto: string;
}

export const FARMER_TESTIMONIALS: FarmerTestimonial[] = [
  {
    id: 'mama-beatrice',
    name: 'Mama Beatrice Njeri',
    role: 'Lead Smallholder & Women Self-Help Founder',
    demographic: 'Woman Smallholder Pioneer (52 yrs)',
    category: 'Women in Agriculture',
    location: 'Limuru Highland Valley',
    county: 'Kiambu County',
    elevation: '2,240m above sea level',
    acreage: '4.2 Acres Organic Greens',
    crops: ['Highland Sukuma Wiki', 'Traditional Spinach', 'Managu (African Nightshade)'],
    quote: 'Traditional market brokers used to reject up to 40% of my harvest at Wakulima Market claiming market oversupply, then delay payment for weeks with unfair scale deductions. With Savannah Arcana, 100% of my certified harvest is weighed on calibrated digital scales right at my farm gate. The money lands directly into my M-Pesa before lunchtime. That reliable income funded my youngest daughter\'s university degree in Nairobi.',
    impactMetric: '+68% higher net income vs. broker middlemen',
    payoutSpeed: 'M-Pesa payout within 90 minutes',
    npsScore: '+94 NPS (10/10)',
    partnerSince: 'Partner since 2023',
    photo: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a47?auto=format&fit=crop&w=700&q=80',
    farmPhoto: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'dennis-kiprono',
    name: 'Dennis Kiprono',
    role: 'Next-Gen Youth Agri-Preneur & Composting Lead',
    demographic: 'Youth Farmer (28 yrs)',
    category: 'Youth Empowerment',
    location: 'Kinangop Plateau',
    county: 'Nyandarua County',
    elevation: '2,620m above sea level',
    acreage: '3.5 Acres High-Altitude Loam',
    crops: ['Nantes Sweet Carrots', 'Crisp Beetroot', 'Snow Peas'],
    quote: 'Most young Kenyans flee the rural areas thinking agriculture is backwards. Savannah Fresh equipped us with soil moisture sensors, zero-chemical companion protocols, and guaranteed off-take contracts before planting. I now earn more from my three acres than my previous desk job in Nakuru, and our soil organic matter is the highest it has been in two generations.',
    impactMetric: 'Zero synthetic pesticides · 100% soil organic matter recovery',
    payoutSpeed: 'Instant digital harvest settlement',
    npsScore: '+92 NPS (10/10)',
    partnerSince: 'Partner since 2024',
    photo: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80',
    farmPhoto: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lucy-wangari',
    name: 'Lucy Wangari',
    role: 'Naivasha Herb Cooperative Chairwoman',
    demographic: 'Woman Cooperative Leader (39 yrs)',
    category: 'Women\'s Collective',
    location: 'Naivasha Spring Basin',
    county: 'Nakuru County',
    elevation: '1,890m above sea level',
    acreage: '45 Member Collective (18 Acres)',
    crops: ['Heirloom Sweet Mint', 'Rosemary', 'Thyme', 'Fresh Coriander (Dhania)'],
    quote: 'Our 45 women members used to lose substantial portions of delicate herbs to wilting during transport under the midday sun. Savannah Fresh connects us directly to a solar refrigerated micro-collection truck at 6:30 AM every day. Every cent is split transparently through our cooperative saccos. When Nairobi consumers scan the QR code on our herb packs, they see our faces and our dignity.',
    impactMetric: '45 smallholder women empowered with cold chain access',
    payoutSpeed: 'Same-day sacco mobile disbursement',
    npsScore: '+90 NPS (10/10)',
    partnerSince: 'Partner since 2023',
    photo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80',
    farmPhoto: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'peter-karanja',
    name: 'Mzee Peter Karanja',
    role: 'Veteran Agroforester & Bio-Compost Mentor',
    demographic: 'Elder Indigenous Farmer (61 yrs)',
    category: 'Agroforestry & Soil Health',
    location: 'Kangema Slopes',
    county: 'Murang\'a County',
    elevation: '1,750m above sea level',
    acreage: '6.0 Acres Integrated Agroforest',
    crops: ['Export-Grade Hass Avocados', 'Tree Tomatoes (Tamarillo)', 'Traditional Pumpkin Greens'],
    quote: 'I have worked these volcanic soils for forty years. Commercial chemical sprays previously wiped out the native honeybees and turned the soil acidic. Through Savannah Arcana\'s training on bio-slurry and beneficial predatory insects, our orchard has come alive again. Honeybees have returned to our 14 hives, and our Hass avocados taste pure, creamy, and untainted.',
    impactMetric: '300+ beehives restored & pesticide residue 0.00 ppm',
    payoutSpeed: 'Lipa na M-Pesa direct farm payment',
    npsScore: '+95 NPS (10/10)',
    partnerSince: 'Partner since 2022',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    farmPhoto: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'faith-cherono',
    name: 'Faith Cherono',
    role: 'Precision Solar Drip & Greenhouse Lead',
    demographic: 'Youth Agronomist & Tech Grower (25 yrs)',
    category: 'Agri-Tech & Water Conservation',
    location: 'Subukia Escarpment',
    county: 'Rift Valley',
    elevation: '2,100m above sea level',
    acreage: '2.8 Acres Solar Drip Irrigation',
    crops: ['Sweet Colored Bell Peppers', 'Baby Cucumbers', 'Vine Cherry Tomatoes'],
    quote: 'As a young university agronomy graduate, I wanted to prove that farming in Kenya could be high-tech, climate-resilient, and deeply honorable. Under Savannah Arcana\'s GAP program, we set up gravity-fed solar drip irrigation that cuts water use by 60%. Nairobi families receive crisp, sweet peppers harvested only hours prior, and our farm is 100% solar powered.',
    impactMetric: '60% water conservation via solar-powered micro-drip',
    payoutSpeed: 'Automated bi-weekly settlement',
    npsScore: '+93 NPS (10/10)',
    partnerSince: 'Partner since 2024',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
    farmPhoto: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
  }
];

export const FarmerVoicesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const total = FARMER_TESTIMONIALS.length;
  const current = FARMER_TESTIMONIALS[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay effect
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      handleNext();
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, handleNext]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div 
      className="space-y-4"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Section Header with Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-800 font-extrabold">
              Smallholder Partner Testimonials
            </span>
          </div>
          <h4 className="font-display font-extrabold text-lg sm:text-xl text-stone-900 mt-0.5">
            Voices from the Soil: Our Partner Farmers
          </h4>
          <p className="text-xs text-stone-600 max-w-xl">
            Real testimonies of dignity, guaranteed M-Pesa payouts, and chemical-free regenerative farming from our 1,480+ smallholder network.
          </p>
        </div>

        {/* Navigation & Autoplay Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-xs font-mono font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
            {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause auto-advance" : "Resume auto-advance"}
            className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-colors shadow-2xs cursor-pointer"
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 flex items-center justify-center text-stone-700 transition-all shadow-2xs cursor-pointer active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 flex items-center justify-center text-stone-700 transition-all shadow-2xs cursor-pointer active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Carousel Card */}
      <div 
        className="relative bg-gradient-to-br from-stone-50 via-white to-emerald-50/20 rounded-3xl border-2 border-stone-200/90 shadow-md overflow-hidden transition-all duration-300"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          
          {/* Left Column: Farmer Portrait & Geographical Footprint */}
          <div className="lg:col-span-5 relative overflow-hidden bg-stone-900 min-h-[260px] lg:min-h-full">
            <img 
              src={current.photo} 
              alt={current.name} 
              className="w-full h-full object-cover object-center filter brightness-[0.92] transition-transform duration-700 hover:scale-102"
              referrerPolicy="no-referrer"
            />
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#173b28]/90 text-amber-300 backdrop-blur-xs border border-amber-400/40 shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {current.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-black/60 text-emerald-200 backdrop-blur-xs border border-white/20">
                {current.partnerSince}
              </span>
            </div>

            {/* Bottom Gradient Overlay with Farm GPS */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{current.location}, {current.county}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-stone-300">
                <span>Elevation: {current.elevation}</span>
                <span>•</span>
                <span>Plot: {current.acreage}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Farmer Quote & Impact Metrics */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Header inside content */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h5 className="font-display font-extrabold text-xl text-stone-900 tracking-tight">
                      {current.name}
                    </h5>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                      {current.npsScore}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-medium">
                    {current.role} · <span className="text-stone-500">{current.demographic}</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                  <Quote className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              {/* The Quote */}
              <div className="relative pl-3 border-l-3 border-amber-400">
                <blockquote className="text-stone-800 text-xs sm:text-sm md:text-base leading-relaxed italic font-serif">
                  &quot;{current.quote}&quot;
                </blockquote>
              </div>

              {/* Crops Grown */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] uppercase tracking-wider font-mono font-bold text-stone-500">
                  Certified Organic Harvest:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {current.crops.map((crop, i) => (
                    <span 
                      key={i} 
                      className="text-[11px] font-medium bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md border border-stone-200/80"
                    >
                      🌱 {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Impact Highlights Bar */}
            <div className="pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-900 block font-mono">Realized Economic Benefit</span>
                  <span className="text-[11px] font-bold text-emerald-800">{current.impactMetric}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-900 block font-mono">Payment Guarantee</span>
                  <span className="text-[11px] font-bold text-amber-800">{current.payoutSpeed}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Quick Select Thumbnails Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {FARMER_TESTIMONIALS.map((farmer, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={farmer.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all border cursor-pointer ${
                isActive 
                  ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm scale-102 ring-2 ring-emerald-500/50' 
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              <img 
                src={farmer.photo} 
                alt={farmer.name} 
                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/20"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold truncate leading-tight">
                  {farmer.name.split(' ')[0]} {farmer.name.split(' ')[1] || ''}
                </div>
                <div className={`text-[9px] truncate ${isActive ? 'text-emerald-200' : 'text-stone-500'}`}>
                  {farmer.location.split(' ')[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {FARMER_TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex 
                ? 'w-6 h-2 bg-emerald-700' 
                : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
