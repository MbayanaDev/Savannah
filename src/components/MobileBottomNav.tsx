import React from 'react';
import { useStore } from '../context/StoreContext';
import profileImg from '../assets/images/profile.png';
import shopImg from '../assets/images/shop.png';
import arcanaDoorImg from '../assets/images/arcana_door.png';
import savannahIconImg from '../assets/images/savannah_icon.png';
import ordersImg from '../assets/images/orders.png';

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
      setViewMode('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'orders') {
      setViewMode('orders');
      if (orders.length > 0) {
        setActiveTrackOrder(orders[0]);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'arcana') {
      setViewMode('arcana');
    } else {
      setViewMode('store');
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-5 h-[68px] max-w-md mx-auto">
        {/* Tab 1: Shop */}
        <button
          onClick={() => handleTabClick('shop')}
          className={`flex flex-col items-center justify-end h-full pb-2 pt-1 min-w-0 transition-all cursor-pointer ${
            activeMobileTab === 'shop' && viewMode === 'store'
              ? 'text-[#173b28] font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Shop"
          aria-label="Shop"
        >
          <div className="h-8 w-full flex items-center justify-center relative mb-1 shrink-0">
            <img
              src={shopImg}
              alt="Shop"
              className={`w-7.5 h-7.5 object-contain transition-transform ${
                activeMobileTab === 'shop' && viewMode === 'store'
                  ? 'scale-110 drop-shadow-[0_2px_4px_rgba(23,59,40,0.3)]'
                  : 'opacity-85 hover:opacity-100'
              }`}
            />
          </div>
          <div className="h-4 w-full flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold tracking-tight text-center whitespace-nowrap leading-none">
              Shop
            </span>
          </div>
        </button>

        {/* Tab 2: Savannah Arcana */}
        <button
          onClick={() => handleTabClick('arcana')}
          className={`flex flex-col items-center justify-end h-full pb-2 pt-1 min-w-0 transition-all cursor-pointer group ${
            activeMobileTab === 'arcana' || viewMode === 'arcana'
              ? 'text-emerald-800 font-bold'
              : 'text-stone-500 hover:text-emerald-800'
          }`}
          title="Savannah Arcana: Exclusive Door to Solar, Farmers & Integrity"
          aria-label="Savannah Arcana"
        >
          <div className="h-8 w-full flex items-center justify-center relative mb-1 shrink-0">
            <img
              src={arcanaDoorImg}
              alt="Savannah Arcana"
              className={`w-7.5 h-7.5 object-contain transition-transform group-hover:scale-110 ${
                activeMobileTab === 'arcana' || viewMode === 'arcana'
                  ? 'scale-110 drop-shadow-[0_2px_4px_rgba(23,59,40,0.3)]'
                  : 'opacity-85 hover:opacity-100'
              }`}
            />
            {(activeMobileTab === 'arcana' || viewMode === 'arcana') && (
              <span className="absolute top-0 right-1/2 translate-x-4 w-1.5 h-1.5 rounded-full bg-amber-400 ring-1 ring-white" />
            )}
          </div>
          <div className="h-4 w-full flex items-center justify-center shrink-0">
            <span className="text-[10.5px] sm:text-[11px] font-bold tracking-tighter text-center whitespace-nowrap leading-none px-0.5">
              Savannah Arcana
            </span>
          </div>
        </button>

        {/* Tab 3: Cart */}
        <button
          onClick={() => handleTabClick('cart')}
          className="relative flex flex-col items-center justify-end h-full pb-2 pt-1 min-w-0 text-stone-700 transition-all cursor-pointer group"
          title="Shopping Basket"
          aria-label="Shopping Basket"
        >
          <div className="h-8 w-full flex items-center justify-center relative mb-1 shrink-0">
            <img
              src={savannahIconImg}
              alt="Basket"
              className="w-8 h-7.5 object-contain transition-transform group-hover:scale-110 active:scale-95 drop-shadow-[0_1px_2px_rgba(23,59,40,0.15)]"
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 right-1/2 translate-x-4.5 bg-[#b85d38] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <div className="h-4 w-full flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold tracking-tight text-center whitespace-nowrap leading-none text-stone-700">
              Basket
            </span>
          </div>
        </button>

        {/* Tab 4: Orders */}
        <button
          onClick={() => handleTabClick('orders')}
          className={`flex flex-col items-center justify-end h-full pb-2 pt-1 min-w-0 transition-all cursor-pointer ${
            activeMobileTab === 'orders' || viewMode === 'orders'
              ? 'text-[#173b28] font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Orders"
          aria-label="Orders"
        >
          <div className="h-8 w-full flex items-center justify-center relative mb-1 shrink-0">
            <img
              src={ordersImg}
              alt="Orders"
              className={`w-7.5 h-7.5 object-contain transition-transform ${
                activeMobileTab === 'orders' || viewMode === 'orders'
                  ? 'scale-110 drop-shadow-[0_2px_4px_rgba(23,59,40,0.3)]'
                  : 'opacity-85 hover:opacity-100'
              }`}
            />
          </div>
          <div className="h-4 w-full flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold tracking-tight text-center whitespace-nowrap leading-none">
              Orders
            </span>
          </div>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center justify-end h-full pb-2 pt-1 min-w-0 transition-all cursor-pointer ${
            activeMobileTab === 'profile' || viewMode === 'profile' || isProfileOpen
              ? 'text-[#173b28] font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Profile"
          aria-label="Profile"
        >
          <div className="h-8 w-full flex items-center justify-center relative mb-1 shrink-0">
            <img
              src={profileImg}
              alt="Profile"
              className={`w-7.5 h-7.5 object-contain rounded-full transition-transform ${
                activeMobileTab === 'profile' || viewMode === 'profile' || isProfileOpen
                  ? 'scale-110 drop-shadow-[0_2px_4px_rgba(23,59,40,0.3)] ring-1.5 ring-[#173b28]'
                  : 'opacity-85 hover:opacity-100'
              }`}
            />
          </div>
          <div className="h-4 w-full flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold tracking-tight text-center whitespace-nowrap leading-none">
              Profile
            </span>
          </div>
        </button>
      </div>
    </nav>
  );
};
