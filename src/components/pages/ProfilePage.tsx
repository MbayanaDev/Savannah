import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  LogOut, 
  Check,
  MapPin,
  ChevronDown,
  Plus,
  Trash2,
  X,
  AlertCircle,
  Home,
  Briefcase,
  Users,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import savannahLogo from '../../assets/images/savannah_logo.png';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    signOut,
    signInWithGoogle,
    savedAddresses,
    deleteSavedAddress,
    deliveryZones,
    isLoadingAddresses,
    isLoadingDeliveryZones,
    activeSavedAddress,
    selectAddress,
    addSavedAddress,
    setViewMode,
    setActiveMobileTab,
    showToast
  } = useStore();

  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isAddressesExpanded, setIsAddressesExpanded] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newRegion, setNewRegion] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [formError, setFormError] = useState('');

  const getAddressIcon = (label?: string, iconName?: string) => {
    const key = `${iconName || ''} ${label || ''}`.toLowerCase();
    if (key.includes('home')) {
      return <Home className="w-3.5 h-3.5 text-emerald-700 shrink-0" />;
    }
    if (key.includes('work') || key.includes('office')) {
      return <Briefcase className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
    }
    if (key.includes('friend') || key.includes('family')) {
      return <Users className="w-3.5 h-3.5 text-stone-600 shrink-0" />;
    }
    return <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />;
  };

  const handleSignOut = async () => {
    await signOut();
    setViewMode('store');
    setActiveMobileTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleSignup = async () => {
    setIsLoadingGoogle(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const defaultSavedAddress =
    savedAddresses.find(address => address.isDefault) ?? savedAddresses[0];

  const handleDeleteAddress = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const addressToDelete = savedAddresses.find(a => a.id === id);

    try {
      await deleteSavedAddress(id);
      showToast(`Removed "${addressToDelete?.label || 'Address'}"`, 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Could not delete address.',
        'warning'
      );
    }
  };

  const handleOpenAddAddress = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedAddresses.length >= 4) {
      showToast('Maximum of 4 saved addresses reached', 'warning');
      return;
    }
    setIsAddressesExpanded(true);
    setIsAddingAddress(true);
    setFormError('');
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (savedAddresses.length >= 4) {
      setFormError('You can only save up to 4 addresses.');
      return;
    }

    if (!newLabel.trim() || !newStreet.trim() || !newApartment.trim() || !newRegion) {
      setFormError('Please complete the address label, delivery zone, street and building details.');
      return;
    }

    try {
      const selectedZone = deliveryZones.find(
        zone => zone.zone_id === newRegion
      );

      if (!selectedZone) {
        setFormError('Please select a valid delivery zone.');
        return;
      }

      await addSavedAddress({
        label: newLabel.trim(),
        tag: newLabel.trim(),
        region: selectedZone.name,
        deliveryZoneId: selectedZone.zone_id,
        street: newStreet.trim(),
        apartment: newApartment.trim(),
        reference: '',
        instructions: newInstructions.trim(),
        iconName: 'pin'
      });

      setIsAddingAddress(false);
      setNewLabel('Home');
      setNewRegion(deliveryZones[0]?.zone_id ?? '');
      setNewStreet('');
      setNewApartment('');
      setNewInstructions('');
      setFormError('');

      showToast('Delivery address saved.', 'success');
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Could not save address.'
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewMode('store');
        setActiveMobileTab('shop');
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

  useEffect(() => {
    if (!newRegion && deliveryZones.length > 0) {
      setNewRegion(deliveryZones[0].zone_id);
    }
  }, [deliveryZones, newRegion]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => {
        setViewMode('store');
        setActiveMobileTab('shop');
      }}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Account Profile"
    >
      <div
        className="relative w-[85vw] max-w-[85vw] h-full bg-[#FBF9F5] rounded-none shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-white border-b border-stone-200/90 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 shadow-2xs">
          <h2 className="font-display font-bold text-base sm:text-lg text-stone-900 leading-tight">
            Account Profile
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewMode('store');
                setActiveMobileTab('shop');
              }}
              className="w-8 h-8 rounded-full hover:bg-stone-100 active:scale-95 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-5 sm:py-6 space-y-6">
          {!currentUser ? (
            /* Guest / Signed Out State: Unified container with Log In and Sign Up */
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-md mx-auto space-y-6">
              {/* Brand Logo & Intro */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center mx-auto">
                  <img
                    src={savannahLogo}
                    alt="Savannah Fresh"
                    className="h-14 sm:h-16 w-auto max-w-[220px] object-contain drop-shadow-xs"
                  />
                </div>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                  Your direct link to freshly harvested highland produce from Kenyan smallholder farmers.
                </p>
              </div>

              {/* CTAs stacked one on top of the other */}
              <div className="flex flex-col gap-4 pt-1">
                {/* 1. Log In CTA Block (Top) */}
                <div className="p-4 sm:p-5 rounded-xl bg-stone-50/90 border border-stone-200 text-left space-y-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#173b28] uppercase tracking-wider">
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In</span>
                    </div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 leading-snug">
                      Returning Customer
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Access saved addresses and track ongoing harvest deliveries.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoadingGoogle}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 active:scale-98 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-60"
                    aria-label="Log in with Google"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="truncate">
                      {isLoadingGoogle ? 'Signing in...' : 'Log In with Google'}
                    </span>
                  </button>
                </div>

                {/* 2. Sign Up CTA Block (Bottom / Stacked) */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#173b28]/5 border border-[#173b28]/20 text-left space-y-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#173b28] uppercase tracking-wider">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up</span>
                    </div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 leading-snug">
                      New Member
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Create an account for one-click checkout and harvest member deals.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoadingGoogle}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#173b28] hover:bg-[#122e20] active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-60"
                    aria-label="Sign up with Google"
                  >
                    <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="truncate">
                      {isLoadingGoogle ? 'Signing up...' : 'Sign Up with Google'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Signed-In Profile View */
            <div className="space-y-6">
              {/* Profile Header Hero Card */}
              <div className="bg-white rounded-xl border border-stone-200/90 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-[#173b28]/15 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#173b28] text-white flex items-center justify-center text-sm sm:text-base font-bold font-display shadow-2xs shrink-0">
                      {currentUser.name
                        ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                        : 'SF'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h1 className="font-display font-bold text-base sm:text-lg text-stone-900 tracking-tight leading-tight">
                        {currentUser.name}
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-0.5 gap-x-3 mt-0.5 text-xs text-stone-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{currentUser.email}</span>
                      </div>
                      {currentUser.phone && (
                        <div className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{currentUser.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-1">
                      {activeSavedAddress ? (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-600">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="text-stone-500">Default:</span>
                          <span className="font-medium text-stone-800">
                            {activeSavedAddress.label} ({activeSavedAddress.region})
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>No default address selected</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="self-end sm:self-center inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign out</span>
                </button>
              </div>

              {/* Delivery Addresses Section */}
              <div className="bg-[#FCFBF8] rounded-xl border border-stone-200 shadow-2xs overflow-hidden transition-all">
                {/* Header with Chevron toggle */}
                <button
                  type="button"
                  onClick={() => setIsAddressesExpanded(prev => !prev)}
                  className="w-full px-5 py-4 bg-[#FCFBF8] hover:bg-stone-50/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  aria-expanded={isAddressesExpanded}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-3">
                    <MapPin className="w-5 h-5 text-[#173b28] shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 tracking-tight group-hover:text-[#173b28] transition-colors truncate">
                          Delivery Addresses
                        </h3>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#173b28]/10 text-[#173b28]">
                          {savedAddresses.length}/4
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5 truncate">
                        {savedAddresses.length === 0 ? (
                          <span className="text-stone-500">No addresses saved yet — click to add</span>
                        ) : defaultSavedAddress ? (
                          <span className="flex items-center gap-1.5">
                            <span className="text-stone-400">Default:</span>
                            <span className="font-semibold text-stone-800">{defaultSavedAddress.label}</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-emerald-800 font-medium">{defaultSavedAddress.region}</span>
                            {defaultSavedAddress.apartment && (
                              <span className="text-stone-400 hidden sm:inline truncate">
                                ({defaultSavedAddress.apartment})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span>Select or manage your Nairobi drop-off locations</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-stone-200 text-stone-600 group-hover:text-stone-900 flex items-center justify-center transition-colors shrink-0">
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAddressesExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Collapsible Content */}
                {isAddressesExpanded && (
                  <div className="p-4 sm:p-5 pt-3 sm:pt-4 space-y-4 border-t border-stone-200/80">
                    {/* Section: Your drop-off locations */}
                    <div className="flex items-center justify-between px-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-stone-900 text-sm tracking-tight">
                          Your drop-off locations
                        </span>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                          {savedAddresses.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {savedAddresses.length < 4 && !isAddingAddress && (
                          <button
                            type="button"
                            onClick={handleOpenAddAddress}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                            <span>add address</span>
                          </button>
                        )}
                        <span className="text-[10px] text-stone-400 italic">
                          up to 4 addresses
                        </span>
                      </div>
                    </div>

                    {/* Add Address Form */}
                    {isAddingAddress && (
                      <form onSubmit={handleSaveNewAddress} className="bg-stone-50/80 rounded-xl border border-stone-200 p-4 space-y-3.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-700">
                            Add New Address ({savedAddresses.length + 1} of 4)
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingAddress(false);
                              setFormError('');
                            }}
                            className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200/60 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {formError && (
                          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{formError}</span>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                              Address Label
                            </label>
                            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                              {['Home', 'Work', 'Friend', 'Family'].map(preset => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => setNewLabel(preset)}
                                  className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                                    newLabel === preset 
                                      ? 'bg-[#173b28] text-white border-[#173b28]' 
                                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                                  }`}
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                            <input
                              type="text"
                              value={newLabel}
                              onChange={e => setNewLabel(e.target.value)}
                              placeholder="e.g. Home, Office, Gym"
                              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28]"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                                Nairobi Neighborhood / Area
                              </label>
                              <select
                                value={newRegion}
                                onChange={e => setNewRegion(e.target.value)}
                                disabled={isLoadingDeliveryZones || deliveryZones.length === 0}
                                required
                                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28] cursor-pointer disabled:bg-stone-100"
                              >
                                <option value="">
                                  {isLoadingDeliveryZones ? 'Loading delivery zones...' : 'Select a delivery zone'}
                                </option>

                                {deliveryZones.map(zone => (
                                  <option key={zone.zone_id} value={zone.zone_id}>
                                    {zone.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                                Street / Road
                              </label>
                              <input
                                type="text"
                                value={newStreet}
                                onChange={e => setNewStreet(e.target.value)}
                                placeholder="e.g. Dennis Pritt Road"
                                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28]"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                              Building / Apartment / House #
                            </label>
                            <input
                              type="text"
                              value={newApartment}
                              onChange={e => setNewApartment(e.target.value)}
                              placeholder="e.g. Silver Oak Court, Apt 3B"
                              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                              Drop-off Instructions (Optional)
                            </label>
                            <input
                              type="text"
                              value={newInstructions}
                              onChange={e => setNewInstructions(e.target.value)}
                              placeholder="e.g. Ring buzzer 3B. Gate code 4022. Call on arrival."
                              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingAddress(false);
                              setFormError('');
                            }}
                            className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#173b28] hover:bg-[#1f4e35] rounded-lg shadow-2xs cursor-pointer active:scale-98 transition-all"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Empty State */}
                    {savedAddresses.length === 0 ? (
                      <div className="bg-stone-50/70 rounded-xl border border-dashed border-stone-300 p-6 sm:p-8 text-center space-y-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-[#173b28] mx-auto flex items-center justify-center shadow-2xs">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-stone-900 text-sm">
                            No delivery addresses saved yet
                          </h4>
                          <p className="text-xs text-stone-500 max-w-sm mx-auto">
                            Add up to 4 frequent Nairobi delivery locations (Home, Work, or Family) for lightning-fast checkout.
                          </p>
                        </div>
                        {!isAddingAddress && (
                          <button
                            type="button"
                            onClick={handleOpenAddAddress}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#173b28] hover:bg-[#1f4e35] text-white text-xs font-semibold shadow-2xs cursor-pointer active:scale-98 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Delivery Address</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Address Cards Grid: Matching Delivery Address Modal */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {savedAddresses.map((addr) => {
                          const Icon = getAddressIcon(addr.label, addr.iconName);
                          const isSelected = activeSavedAddress?.id === addr.id;

                          return (
                            <div
                              key={addr.id}
                              onClick={() => selectAddress(addr.id)}
                              className={`group relative flex flex-col justify-between p-3 rounded-xl border transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'bg-emerald-50/20 border-emerald-700 shadow-xs ring-1 ring-emerald-700/20'
                                  : 'bg-white hover:bg-stone-50/70 border-stone-200/90 hover:border-stone-300 shadow-2xs'
                              }`}
                            >
                              <div className="space-y-1">
                                {/* Row 1: Header with Leading Icon, Label, Default badge, and Delete button */}
                                <div className="flex items-center justify-between gap-1.5 mb-0.5">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {Icon}
                                    <span className="font-display font-bold text-stone-900 text-xs break-words">
                                      {addr.label}
                                    </span>
                                    {addr.isDefault && (
                                      <span className="text-[9.5px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded leading-none shrink-0">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteAddress(addr.id, e)}
                                    className="w-5 h-5 flex items-center justify-center rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                                    title={`Delete ${addr.label}`}
                                    aria-label={`Delete ${addr.label}`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Row 2: Street / Road */}
                                <div className="text-stone-800 text-xs font-semibold leading-snug break-words">
                                  {addr.street}
                                </div>

                                {/* Row 3: Delivery Region */}
                                {addr.region && (
                                  <div className="text-emerald-800 text-[11px] font-medium leading-snug break-words">
                                    {addr.region}
                                  </div>
                                )}

                                {/* Row 4: Apartment */}
                                <div className="text-stone-600 text-[11.5px] leading-snug break-words">
                                  {addr.apartment}
                                </div>

                                {/* Row 5: Instructions */}
                                {addr.instructions && (
                                  <div className="pt-0.5 text-[10px] text-stone-500 italic leading-tight break-words">
                                    &ldquo;{addr.instructions}&rdquo;
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Addresses Section ends */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
