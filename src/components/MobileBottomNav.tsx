import React from 'react';
import { Home, Zap, ShoppingBag, PackageCheck, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const {
    activeMobileTab,
    setActiveMobileTab,
    cartCount,
    setIsCartOpen,
    viewMode,
    setViewMode,
    orders,
    setActiveTrackOrder,
    isProfileOpen,
    setIsProfileOpen
  } = useStore();

  const handleTabClick = (tab: string) => {
    setActiveMobileTab(tab);
    if (tab === 'cart') {
      setIsCartOpen(true);
    } else if (tab === 'profile') {
      setIsProfileOpen(true);
    } else if (tab === 'orders') {
      setViewMode('store');
      if (orders.length > 0) {
        setActiveTrackOrder(orders[0]);
      }
    } else {
      setViewMode('store');
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-5 items-center h-15 max-w-md mx-auto">
        {/* Tab 1: Shop */}
        <button
          onClick={() => handleTabClick('shop')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors cursor-pointer ${
            activeMobileTab === 'shop' && viewMode === 'store'
              ? 'text-[#173b28] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Shop</span>
        </button>

        {/* Tab 2: Express (renamed from Aisles) */}
        <button
          onClick={() => {
            handleTabClick('express');
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors cursor-pointer ${
            activeMobileTab === 'express' && viewMode === 'store'
              ? 'text-[#173b28] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Express</span>
        </button>

        {/* Tab 3: Cart */}
        <button
          onClick={() => handleTabClick('cart')}
          className="relative flex flex-col items-center justify-center min-h-[48px] py-1 text-stone-700 transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#173b28]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#b85d38] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1 text-stone-700">Basket</span>
        </button>

        {/* Tab 4: Orders */}
        <button
          onClick={() => handleTabClick('orders')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors cursor-pointer ${
            activeMobileTab === 'orders'
              ? 'text-[#173b28] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <PackageCheck className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Orders</span>
        </button>

        {/* Tab 5: Profile (replacing Hub) */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors cursor-pointer ${
            activeMobileTab === 'profile' || isProfileOpen
              ? 'text-[#173b28] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
