import React from 'react';
import { 
  X, 
  User, 
  MapPin, 
  PackageCheck, 
  Zap, 
  Phone, 
  Mail, 
  ChevronRight, 
  ShieldCheck, 
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProfileModal: React.FC = () => {
  const { 
    isProfileOpen, 
    setIsProfileOpen, 
    selectedNeighborhood, 
    activeSavedAddress,
    setIsNeighborhoodModalOpen,
    setIsUtilitiesModalOpen,
    orders,
    setActiveTrackOrder,
    setViewMode,
    showToast
  } = useStore();

  if (!isProfileOpen) return null;

  const handleOpenOrders = () => {
    setIsProfileOpen(false);
    if (orders.length > 0) {
      setActiveTrackOrder(orders[0]);
    } else {
      showToast('No active orders right now', 'info');
    }
  };

  const handleOpenUtilities = () => {
    setIsProfileOpen(false);
    setIsUtilitiesModalOpen(true);
  };

  const handleSwitchToMerchantHub = () => {
    setIsProfileOpen(false);
    setViewMode('admin');
    showToast('Switched to Merchant Operations Hub', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#FCFBF8] rounded-2xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-stone-900 tracking-tight">
              Shopper Profile
            </h3>
            <p className="text-xs text-stone-500">
              Account settings, delivery details &amp; preferences
            </p>
          </div>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close profile modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* User Card */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center gap-3.5 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#173b28] text-white flex items-center justify-center text-sm font-bold font-display shadow-xs shrink-0">
              KM
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-bold text-sm text-stone-900 truncate">
                  Kelvin Munene
                </h4>
                <span title="Verified Member" className="inline-flex">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </span>
              </div>

              <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5 font-mono">
                <Phone className="w-3 h-3 text-stone-400" />
                <span>+254 700 892 019</span>
              </div>

              <div className="text-[11px] text-stone-400 truncate flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-stone-400" />
                <span className="truncate">klvnmunenembaya@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Delivery Location Section */}
          <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
              Delivery Destination
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-stone-800 min-w-0 pr-2">
                <MapPin className="w-4 h-4 text-[#173b28] shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-stone-900 truncate">
                    {activeSavedAddress ? `${activeSavedAddress.label} (${activeSavedAddress.region})` : selectedNeighborhood.name}
                  </div>
                  {activeSavedAddress && (
                    <div className="text-[11px] text-stone-500 truncate">
                      {activeSavedAddress.apartment}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsNeighborhoodModalOpen(true);
                }}
                className="text-xs font-semibold text-[#173b28] hover:underline cursor-pointer shrink-0"
              >
                Change
              </button>
            </div>
          </div>

          {/* Quick Actions List */}
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            <button
              type="button"
              onClick={handleOpenOrders}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900">My Orders &amp; Tracking</div>
                  <div className="text-[11px] text-stone-500">View real-time farm-to-table deliveries</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
            </button>

            <button
              type="button"
              onClick={handleOpenUtilities}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-emerald-600 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900">KPLC Tokens &amp; Airtime</div>
                  <div className="text-[11px] text-stone-500">Instant tokens and Safaricom top-up</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
            </button>

            <button
              type="button"
              onClick={handleSwitchToMerchantHub}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900">Merchant Operations Hub</div>
                  <div className="text-[11px] text-stone-500">Dispatch, inventory &amp; farm co-op admin</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
            </button>
          </div>

          {/* Member Badge & Sign Out */}
          <div className="pt-2 text-center space-y-2">
            <p className="text-[11px] text-stone-400">
              Savannah Fresh Farm Direct · Nairobi, Kenya
            </p>
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                showToast('Signed out of session', 'info');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-400">
          <span>Safe &amp; Encrypted Session</span>
          <span>v2.4</span>
        </div>
      </div>
    </div>
  );
};
