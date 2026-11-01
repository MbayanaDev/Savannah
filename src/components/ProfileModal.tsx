import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  LogOut,
  Loader2,
  PackageCheck,
  ChevronRight,
  UserCheck,
  LogIn,
  UserPlus,
  User
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import savannahLogo from '../assets/images/savannah_logo.png';

export const ProfileModal: React.FC = () => {
  const { 
    isProfileOpen, 
    setIsProfileOpen, 
    selectedNeighborhood, 
    activeSavedAddress,
    setIsNeighborhoodModalOpen,
    currentUser,
    signInWithGoogle,
    signOut,
    orders,
    setViewMode,
    setActiveTrackOrder,
    setActiveMobileTab
  } = useStore();

  const [authAction, setAuthAction] = useState<'login' | 'signup' | null>(null);

  if (!isProfileOpen) return null;

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setAuthAction(action);
    try {
      await signInWithGoogle();
      setIsProfileOpen(false);
      setViewMode('profile');
      setActiveMobileTab('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setAuthAction(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleViewOrders = () => {
    setIsProfileOpen(false);
    setViewMode('orders');
    if (orders.length > 0) {
      setActiveTrackOrder(orders[0]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsProfileOpen(false)}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
      <div 
        className="relative w-full max-w-md bg-[#FCFBF8] rounded-2xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-stone-900 tracking-tight flex items-center gap-2">
              {currentUser ? (
                <>
                  <User className="w-4.5 h-4.5 text-[#173b28] shrink-0" />
                  <span>Account settings</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4.5 h-4.5 text-[#173b28] shrink-0" />
                  <span>Account Access</span>
                </>
              )}
            </h3>
            <p className="text-xs text-stone-500">
              {currentUser 
                ? 'Account settings, delivery details & preferences'
                : 'Log in to your account or create a new one'}
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
        <div className="overflow-y-auto overscroll-contain flex-1 p-5 space-y-4">
          {!currentUser ? (
            /* Not Signed In: Separated Log In and Sign Up CTAs */
            <div className="space-y-4">
              <div className="space-y-1.5 text-center pt-1 pb-1">
                <div className="flex items-center justify-center mx-auto mb-2">
                  <img
                    src={savannahLogo}
                    alt="Savannah Fresh"
                    className="h-12 w-auto max-w-[190px] object-contain drop-shadow-xs"
                  />
                </div>
                <h4 className="font-display font-bold text-base sm:text-lg text-stone-900">
                  Welcome to Savannah Fresh
                </h4>
                <p className="text-xs text-stone-500">
                  Choose an option below to continue
                </p>
              </div>

              {/* 1. Log In CTA Section */}
              <div className="bg-stone-50/90 border border-stone-200 rounded-xl p-3.5 space-y-2.5 text-left transition-all hover:border-stone-300">
                <div>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-200/80 text-stone-700">
                    Existing User
                  </span>
                  <h5 className="font-display font-bold text-sm text-stone-900 mt-1 flex items-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    Log In
                  </h5>
                  <p className="text-xs text-stone-600">
                    Access your saved addresses, track recent orders, and reorder.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAuthAction('login')}
                  disabled={Boolean(authAction)}
                  className="w-full flex items-center justify-center gap-2.5 py-2 px-3 rounded-lg bg-white hover:bg-stone-100 active:scale-98 text-stone-800 font-semibold text-xs border border-stone-300 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {authAction === 'login' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
                  ) : (
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>{authAction === 'login' ? 'Logging in...' : 'Log in with Google'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-stone-400 bg-[#FCFBF8] px-2.5">
                  Or
                </div>
              </div>

              {/* 2. Sign Up CTA Section */}
              <div className="bg-emerald-50/50 border border-emerald-200/90 rounded-xl p-3.5 space-y-2.5 text-left transition-all hover:border-emerald-300">
                <div>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    New Customer
                  </span>
                  <h5 className="font-display font-bold text-sm text-stone-900 mt-1 flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    Sign Up
                  </h5>
                  <p className="text-xs text-stone-600">
                    Create your account to unlock fresh farm deliveries to your doorstep.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAuthAction('signup')}
                  disabled={Boolean(authAction)}
                  className="w-full flex items-center justify-center gap-2.5 py-2 px-3 rounded-lg bg-[#173b28] hover:bg-[#122e20] active:scale-98 text-white font-semibold text-xs border border-[#173b28] shadow-2xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {authAction === 'signup' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                  )}
                  <span>{authAction === 'signup' ? 'Signing up...' : 'Sign up with Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Signed In View */
            <>
              {/* User Card */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center gap-3.5 shadow-2xs">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#173b28] text-white flex items-center justify-center text-sm font-bold font-display shadow-xs shrink-0">
                    {currentUser.name
                      ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                      : 'SF'}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-bold text-sm text-stone-900 truncate">
                      {currentUser.name}
                    </h4>
                    <span title="Verified Member" className="inline-flex">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
                      <UserCheck className="w-2.5 h-2.5" />
                      Google Connected
                    </span>
                  </div>

                  {currentUser.phone && (
                    <div className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-mono">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{currentUser.phone}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-stone-400 truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-stone-400" />
                    <span className="truncate">{currentUser.email}</span>
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

              {/* Quick Action: Orders */}
              <button
                type="button"
                onClick={handleViewOrders}
                className="w-full p-3.5 bg-white hover:bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between transition-colors cursor-pointer text-left shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#173b28] flex items-center justify-center">
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900">Past Orders &amp; Tracking</div>
                    <div className="text-[11px] text-stone-500">{orders.length} order{orders.length === 1 ? '' : 's'} recorded</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              {/* Sign Out */}
              <div className="pt-2 text-center space-y-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
