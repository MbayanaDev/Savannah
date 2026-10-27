import React from 'react';
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Facebook, Linkedin, Instagram } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ViewMode } from '../../types';

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
  title,
  subtitle,
  currentPage,
  headerImage,
  headerImageAlt,
  children
}) => {
  const { setViewMode } = useStore();

  const handleBackToShop = () => {
    setViewMode('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (mode: ViewMode) => {
    setViewMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-800 flex flex-col justify-between">
      <div>
        {/* Top Breadcrumb & Back Bar */}
        <div className="bg-white border-b border-stone-200/80 sticky top-11 sm:top-12 z-20 shadow-2xs">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
            <button
              onClick={handleBackToShop}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#173b28] hover:text-[#122e20] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Fresh Produce</span>
            </button>

            <div className="text-xs text-stone-500 font-medium">
              <span className="cursor-pointer hover:underline" onClick={handleBackToShop}>Home</span>
              <span className="mx-1.5 text-stone-400">/</span>
              <span className="text-stone-900 font-semibold">{currentPage}</span>
            </div>
          </div>
        </div>

        {/* Main Page Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-8 sm:pt-6 sm:pb-10 space-y-6">
          {headerImage && (
            <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-stone-200/80 bg-stone-100 mb-2">
              <img
                src={headerImage}
                alt={headerImageAlt || title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {title && (
            <div className="text-center space-y-1.5 pb-1">
              <h1 className="font-display font-black text-xl sm:text-3xl text-stone-900 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}

          {/* Bottom Store CTA Banner */}
          <div className="mt-10 p-6 bg-[#173b28] rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display font-bold text-base sm:text-lg">Experience Farm-Fresh Flavor Today</h3>
              <p className="text-xs text-emerald-200/90">Browse today&apos;s morning harvest catalog with doorstep delivery in 45-90 minutes across Nairobi.</p>
            </div>
            <button
              onClick={handleBackToShop}
              className="px-5 py-2.5 rounded-xl bg-white text-[#173b28] hover:bg-stone-100 font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 shadow-xs active:scale-98"
            >
              Start Shopping Now
            </button>
          </div>
        </main>
      </div>

      {/* Standalone Page Footer with Dedicated Navigation to Each Page */}
      <footer className="border-t border-stone-200 py-6 md:py-10 text-stone-600 text-xs md:text-sm mt-12 bg-white/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
            {/* Column 1: Brand & Contact */}
            <div className="flex flex-col gap-2">
              <div 
                onClick={handleBackToShop}
                className="flex items-center gap-2 cursor-pointer w-fit group"
              >
                <div className="w-6 h-6 rounded bg-[#173b28] flex items-center justify-center text-white font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                  S
                </div>
                <span className="font-display font-extrabold text-sm md:text-base text-[#173b28] tracking-tight">
                  Savannah Fresh
                </span>
              </div>
              <div className="flex flex-col gap-1 text-xs text-stone-600">
                <a href="tel:+254700892019" className="hover:text-[#173b28] transition-colors flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>+254 700 892 019</span>
                </a>
                <a href="mailto:hello@savannahfresh.co.ke" className="hover:text-[#173b28] transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>hello@savannahfresh.co.ke</span>
                </a>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Nairobi, Kenya</span>
                </div>
                <a 
                  href="https://wa.me/254700892019?text=Hello%20Savannah%20Fresh%2C%20I%20have%20an%20inquiry" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-emerald-700 font-semibold hover:underline pt-0.5 inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Support (Daily 7am - 7pm)</span>
                </a>
              </div>
            </div>

            {/* Column 2: Distinct Navigation Links to Each Page */}
            <div className="flex flex-col gap-1.5 text-xs text-left">
              <span className="font-bold text-stone-800 text-xs uppercase tracking-wider">Pages</span>
              <button 
                onClick={() => navigateTo('about')} 
                className={`text-left transition-colors cursor-pointer ${currentPage === 'About Us' ? 'text-[#173b28] font-bold' : 'text-stone-600 hover:text-[#173b28]'}`}
              >
                About Us
              </button>
              <button 
                onClick={() => navigateTo('faqs')} 
                className={`text-left transition-colors cursor-pointer ${currentPage === 'FAQs' ? 'text-[#173b28] font-bold' : 'text-stone-600 hover:text-[#173b28]'}`}
              >
                FAQs
              </button>
              <button 
                onClick={() => navigateTo('purpose')} 
                className={`text-left transition-colors cursor-pointer ${currentPage === 'Our Purpose' ? 'text-[#173b28] font-bold' : 'text-stone-600 hover:text-[#173b28]'}`}
              >
                Our Purpose
              </button>
              <button 
                onClick={() => navigateTo('refunds')} 
                className={`text-left transition-colors cursor-pointer ${currentPage === 'Refunds & Fresh Guarantee' ? 'text-[#173b28] font-bold' : 'text-stone-600 hover:text-[#173b28]'}`}
              >
                Refunds &amp; Fresh Guarantee
              </button>
              <button 
                onClick={() => navigateTo('privacy')} 
                className={`text-left transition-colors cursor-pointer ${currentPage === 'Privacy Policy' ? 'text-[#173b28] font-bold' : 'text-stone-600 hover:text-[#173b28]'}`}
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigateTo('terms')} 
                className={`text-left transition-colors cursor-pointer ${currentPage === 'Terms & Conditions' ? 'text-[#173b28] font-bold' : 'text-stone-600 hover:text-[#173b28]'}`}
              >
                Terms &amp; Conditions
              </button>
              <button 
                onClick={() => navigateTo('arcana')} 
                className={`text-left transition-colors cursor-pointer flex items-center gap-1.5 ${currentPage === 'Savannah Arcana' ? 'text-[#173b28] font-bold' : 'text-emerald-800 hover:text-[#173b28]'}`}
              >
                <span>Savannah Arcana</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">ECO &amp; SOLAR</span>
              </button>
            </div>

            {/* Column 3: Social & Trust */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-stone-800 text-xs uppercase tracking-wider">Connect with us</span>
              <div className="flex items-center gap-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors" aria-label="Facebook">
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-3.5 h-3.5 fill-current" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-stone-700 hover:bg-[#173b28] text-white flex items-center justify-center transition-colors" aria-label="Instagram">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[11px] text-stone-400 max-w-[200px] leading-relaxed pt-1">
                Fresh produce delivered daily across Nairobi neighborhoods.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-stone-200 text-xs text-stone-400 text-center">
            &copy; {new Date().getFullYear()} Savannah Fresh Nairobi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
