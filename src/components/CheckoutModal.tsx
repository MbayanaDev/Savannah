import React, { useState, useEffect, use } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, ChevronDown, Bike, Zap, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NAIROBI_NEIGHBORHOODS } from '../data/neighborhoods';
import { supabase } from '../lib/supabase';

function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');

  if (/^254[17]\d{8}$/.test(digits)) {
    return digits;
  }

  if (/^0[17]\d{8}$/.test(digits)) {
    return `254${digits.slice(1)}`;
  }

  if (/^[17]\d{8}$/.test(digits)) {
    return `254${digits}`;
  }

  return null;
}

export const CheckoutModal: React.FC = () => {
  const {
    currentUser,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    selectedNeighborhood,
    setSelectedNeighborhood,
    savedAddresses,
    selectAddress,
    activeSavedAddress,
    createOrder,
    initiateKcbPayment,
    clearCart,
    setViewMode,
    showToast
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'express' | 'scheduled'>('express');
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<'today' | 'tomorrow'>('today');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('2:00 PM - 5:00 PM (Afternoon)');
  const [isAddressSectionOpen, setIsAddressSectionOpen] = useState(true);
  const [isDeliveryMethodOpen, setIsDeliveryMethodOpen] = useState(true);
  const [isDeliveryDateOpen, setIsDeliveryDateOpen] = useState(true);

  const today = new Date();
  const todayDateStr = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDateStr = tomorrow.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const [address, setAddress] = useState(
    activeSavedAddress
      ? `${activeSavedAddress.apartment}, ${activeSavedAddress.street}, ${activeSavedAddress.region}`
      : 'Silver Oak Court, Apt 3B, Dennis Pritt'
  );
  const [deliverySlot, setDeliverySlot] = useState('Today, 45 mins (Express)');
  const [dropoffNote, setDropoffNote] = useState(
    activeSavedAddress?.instructions || 'Ring buzzer 3B. Leave at door if no answer.'
  );
  const baseDeliveryFee = deliveryType === 'express' ? 350 : 200;
  const effectiveDeliveryFee = cart.length === 0 ? 0 : cartSubtotal >= 3500 ? 0 : baseDeliveryFee;


  useEffect(() => {
    if (activeSavedAddress) {
      setAddress(`${activeSavedAddress.apartment}, ${activeSavedAddress.street}, ${activeSavedAddress.region}`);
      if (activeSavedAddress.instructions) {
        setDropoffNote(activeSavedAddress.instructions);
      }
    }
  }, [activeSavedAddress]);


  const [isProcessing, setIsProcessing] = useState(false);

  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<
    'idle' | 'pending' | 'failed' | 'unknown'
  >('idle');
  const [paymentAttemptKey, setPaymentAttemptKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const client = supabase;

    if (!currentUser?.id || !client) {
      setName('');
      setPhone('');
      return;
    }

    setName(currentUser.name);
    setPhone('');

    const loadProfilePhone = async () => {
      const { data, error } = await client
        .from('profiles')
        .select('phone')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.warn('[Checkout] Could not load profile phone:', error.message);
        return;
      }

      setPhone(data?.phone ?? '');
    };

    void loadProfilePhone();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, currentUser?.name]);


  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      showToast('Please fill in your delivery contact and address details', 'warning');
      return;
    }

    if (paymentState === 'unknown' || paymentState === 'pending') {
      showToast(
        'This payment attempt cannot safely be retried yet.',
        'warning'
      );
      return;
    }

    const normalizedPhone = normalizeKenyanPhone(phone);

    if (!normalizedPhone) {
      showToast(
        'Enter a valid Kenyan mobile number, e.g. 0712345678.',
        'warning'
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Create the order only once. Payment retries reuse this order.
      let orderId = createdOrderId;

      if (!orderId) {
        const order = await createOrder({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          deliveryAddress: address.trim(),
          deliverySlot,
          deliveryMethod: deliveryType,
          dropoffNote: dropoffNote.trim(),
        });

        orderId = order.id;
        setCreatedOrderId(order.id);
      }

      // A new key is needed only after an explicit payment rejection.
      const idempotencyKey =
        paymentState === 'failed'
          ? crypto.randomUUID()
          : paymentAttemptKey ?? crypto.randomUUID();

      setPaymentAttemptKey(idempotencyKey);

      const result = await initiateKcbPayment(
        orderId,
        normalizedPhone,
        idempotencyKey
      );

      if (result.status === 'pending') {
        setPaymentState('pending');
        clearCart();
        setIsCheckoutOpen(false);
        setViewMode('orders');

        showToast(
          'STK request sent. Complete the payment on your phone.',
          'success'
        );
        return;
      }

      if (result.status === 'failed') {
        setPaymentState('failed');

        showToast(
          result.error || 'KCB rejected the payment request. You can retry.',
          'warning'
        );
        return;
      }

      // Includes unknown, initiating, and any unexpected status.
      setPaymentState('unknown');
      clearCart();
      setIsCheckoutOpen(false);
      setViewMode('orders');

      showToast(
        'Payment confirmation is uncertain. Your order was created; check its status before taking further action.',
        'warning'
      );
    } catch (err) {
      console.error('[Checkout] Checkout failed:', err);

      showToast(
        err instanceof Error
          ? err.message
          : 'Checkout could not be completed.',
        'warning'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (isProcessing) return;
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Compact */}
        <div className="px-4 py-2 sm:px-5 sm:py-2.5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={isProcessing}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-stone-100 text-stone-700 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 -ml-1"
              aria-label="Back to Cart"
            >
              <ArrowLeft className="w-4 h-4 text-stone-800" />
            </button>
            <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 leading-none">
              Checkout
            </h3>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="overflow-y-auto overscroll-contain flex-1 px-4 pt-2.5 pb-4 sm:px-6 sm:pt-3 sm:pb-5 space-y-4">
          {/* Section: Delivery Location */}
          <div className="space-y-3">
            {/* Main Container Header - No chevron */}
            <div className="flex items-center gap-2 min-w-0 pb-1.5 border-b border-stone-200/70">
              <Bike className="w-4 h-4 text-[#173b28] shrink-0" />
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider shrink-0">
                Delivery
              </span>
            </div>

              {/* Section 1: Delivery Location Details */}
              <div className="space-y-1.5 pb-2.5 border-b border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setIsAddressSectionOpen(!isAddressSectionOpen)}
                  className="w-full text-left cursor-pointer group select-none flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] sm:text-xs font-semibold text-stone-700">
                      Your order will be delivered to:
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-500 group-hover:text-stone-800 transition-transform duration-200 ${isAddressSectionOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {!isAddressSectionOpen && (
                    <div className="pt-0.5 flex items-start gap-2 min-w-0 text-left animate-in fade-in duration-150">
                      <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3 h-3" />
                      </div>
                      <div className="min-w-0 flex-1 leading-snug">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          <span>{name}</span>
                          <span className="font-normal text-stone-400 mx-1.5">·</span>
                          <span className="font-semibold text-stone-800">
                            {activeSavedAddress
                              ? `${activeSavedAddress.apartment}, ${activeSavedAddress.street}`
                              : address}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          {activeSavedAddress ? activeSavedAddress.region : selectedNeighborhood.name}, Nairobi{activeSavedAddress?.reference ? ` · Ref: ${activeSavedAddress.reference}` : ''}
                        </div>
                      </div>
                    </div>
                  )}
                </button>

                {isAddressSectionOpen && (
                  <div className="space-y-1.5 pt-0.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-800 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1 leading-tight">
                          <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                            <span>{name}</span>
                            <span className="font-normal text-stone-400 mx-1.5">·</span>
                            <span className="font-semibold text-stone-800">
                              {activeSavedAddress
                                ? `${activeSavedAddress.apartment}, ${activeSavedAddress.street}`
                                : address}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 truncate mt-0.5">
                            {activeSavedAddress ? activeSavedAddress.region : selectedNeighborhood.name}, Nairobi{activeSavedAddress?.reference ? ` · Ref: ${activeSavedAddress.reference}` : ''}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsChangingAddress(!isChangingAddress);
                        }}
                        className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-emerald-300 rounded-md text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        <span>{isChangingAddress ? 'Close' : 'Change'}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isChangingAddress ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Saved Address Switcher Drawer */}
                    {isChangingAddress && (
                      <div className="mt-2 pt-2 border-t border-stone-200 space-y-1.5 animate-in fade-in duration-150">
                        <div className="text-[11px] font-semibold text-stone-600">
                          Select a drop-off location:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {savedAddresses.map((addr) => {
                            const isSelected = activeSavedAddress?.id === addr.id;
                            return (
                              <button
                                type="button"
                                key={addr.id}
                                onClick={() => {
                                  selectAddress(addr.id);
                                  setIsChangingAddress(false);
                                }}
                                className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between gap-0.5 ${
                                  isSelected
                                    ? 'border-[#173b28] bg-[#EBF5ED] text-[#173b28] ring-1 ring-[#173b28]'
                                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs">{addr.label}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-[#173b28]" />}
                                </div>
                                <div className="text-[11px] text-stone-600 line-clamp-1">
                                  {addr.apartment}, {addr.street}
                                </div>
                                <div className="text-[10px] text-stone-400">{addr.region}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 2: Delivery Method */}
              <div className="space-y-2 pb-2.5 border-b border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setIsDeliveryMethodOpen(!isDeliveryMethodOpen)}
                  className="w-full text-left cursor-pointer group select-none flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-semibold text-stone-800">
                      How should we deliver your order?
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-500 group-hover:text-stone-800 transition-transform duration-200 ${isDeliveryMethodOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {!isDeliveryMethodOpen && (
                    <div className="text-[11px] text-stone-600 font-medium animate-in fade-in duration-150">
                      <span className="font-bold text-stone-900">{deliveryType === 'express' ? 'Express (45 mins)' : 'Scheduled'}</span> · {effectiveDeliveryFee === 0 ? 'Free' : `KES ${effectiveDeliveryFee.toLocaleString()}`}
                    </div>
                  )}
                </button>

                {isDeliveryMethodOpen && (
                  <div className="space-y-2 pt-0.5 animate-in fade-in duration-150">
                    <div className="flex flex-col gap-2.5 pt-0.5">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="express"
                          checked={deliveryType === 'express'}
                          onChange={() => {
                            setDeliveryType('express');
                            setDeliverySlot(`${selectedDeliveryDate === 'today' ? 'Today' : 'Tomorrow'}, 45 mins (Express)`);
                            setIsDeliveryDateOpen(true);
                          }}
                          className="w-4 h-4 mt-0.5 text-[#173b28] focus:ring-[#173b28] accent-[#173b28] cursor-pointer shrink-0"
                        />
                        <div className="flex flex-col leading-tight">
                          <div className="flex items-center gap-1.5">
                            <Zap className={`w-3.5 h-3.5 ${deliveryType === 'express' ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
                            <span className={`text-xs font-semibold ${deliveryType === 'express' ? 'text-stone-900' : 'text-stone-700'}`}>
                              Express
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-stone-500 font-medium pl-5">
                            KES 350
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="scheduled"
                          checked={deliveryType === 'scheduled'}
                          onChange={() => {
                            setDeliveryType('scheduled');
                            setDeliverySlot(`${selectedDeliveryDate === 'today' ? 'Today' : 'Tomorrow'} (${selectedTimeWindow})`);
                            setIsDeliveryDateOpen(true);
                          }}
                          className="w-4 h-4 mt-0.5 text-[#173b28] focus:ring-[#173b28] accent-[#173b28] cursor-pointer shrink-0"
                        />
                        <div className="flex flex-col leading-tight">
                          <div className="flex items-center gap-1.5">
                            <Clock className={`w-3.5 h-3.5 ${deliveryType === 'scheduled' ? 'text-[#173b28]' : 'text-stone-400'}`} />
                            <span className={`text-xs font-semibold ${deliveryType === 'scheduled' ? 'text-stone-900' : 'text-stone-700'}`}>
                              Scheduled
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-stone-500 font-medium pl-5">
                            KES 200
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Savannah Express notice */}
                    <p className="text-xs text-stone-600">
                      Order Savannah Express for delivery in 45 minutes 7am-7pm.
                    </p>
                  </div>
                )}
              </div>

              {/* Section 3: Select Delivery Date */}
              <div className="space-y-2 pb-2.5 border-b border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setIsDeliveryDateOpen(!isDeliveryDateOpen)}
                  className="w-full text-left cursor-pointer group select-none flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between w-full">
                    <h5 className="text-xs font-semibold text-stone-900">
                      Select Delivery Date
                    </h5>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-500 group-hover:text-stone-800 transition-transform duration-200 ${isDeliveryDateOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {!isDeliveryDateOpen && (
                    <div className="text-[11px] text-stone-600 font-medium animate-in fade-in duration-150">
                      <span className="font-bold text-stone-900">{selectedDeliveryDate === 'today' ? 'Today' : 'Tomorrow'}</span> · {selectedDeliveryDate === 'today' ? todayDateStr : tomorrowDateStr}{deliveryType === 'scheduled' ? ` (${selectedTimeWindow})` : ''}
                    </div>
                  )}
                </button>

                {isDeliveryDateOpen && (
                  <div className="space-y-2 pt-0.5 animate-in fade-in duration-150">
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDeliveryDate('today');
                          if (deliveryType === 'express') {
                            setDeliverySlot('Today, 45 mins (Express)');
                          } else {
                            setDeliverySlot(`Today (${selectedTimeWindow})`);
                          }
                        }}
                        className={`py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-center gap-0.5 ${
                          selectedDeliveryDate === 'today'
                            ? 'border-[#173b28] bg-[#EBF5ED] text-[#173b28] ring-1 ring-[#173b28]'
                            : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight">Today</span>
                        <span className="text-[11px] font-medium opacity-80 leading-tight">{todayDateStr}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDeliveryDate('tomorrow');
                          if (deliveryType === 'express') {
                            setDeliverySlot('Tomorrow, 45 mins (Express)');
                          } else {
                            setDeliverySlot(`Tomorrow (${selectedTimeWindow})`);
                          }
                        }}
                        className={`py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-center gap-0.5 ${
                          selectedDeliveryDate === 'tomorrow'
                            ? 'border-[#173b28] bg-[#EBF5ED] text-[#173b28] ring-1 ring-[#173b28]'
                            : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight">Tomorrow</span>
                        <span className="text-[11px] font-medium opacity-80 leading-tight">{tomorrowDateStr}</span>
                      </button>
                    </div>

                    {/* Slot picker for Scheduled if selected */}
                    {deliveryType === 'scheduled' && (
                      <div className="pt-1 space-y-1.5 animate-in fade-in duration-150">
                        <div className="text-[11px] font-medium text-stone-600">
                          Preferred window:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            '8:00 AM - 11:00 AM (Morning)',
                            '2:00 PM - 5:00 PM (Afternoon)',
                            '5:00 PM - 8:00 PM (Evening)'
                          ].map((slot) => (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => {
                                setSelectedTimeWindow(slot);
                                setDeliverySlot(`${selectedDeliveryDate === 'today' ? 'Today' : 'Tomorrow'} (${slot})`);
                              }}
                              className={`p-2 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                                selectedTimeWindow === slot
                                  ? 'border-[#173b28] bg-white text-[#173b28] font-bold shadow-2xs'
                                  : 'border-stone-200 bg-white/70 hover:bg-white text-stone-700'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 4: Contact Phone Number */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900">
                    Contact Phone Number
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">
                    · For delivery updates
                  </span>
                </div>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  required
                  className="w-full h-11 bg-white border border-stone-200/90 hover:border-stone-300 focus:border-[#173b28] focus:ring-2 focus:ring-[#173b28]/20 rounded-xl px-3 text-xs sm:text-sm font-semibold text-stone-900 placeholder-stone-400 shadow-2xs transition-all outline-none"
                />

                <p className="text-[11px] text-stone-500 leading-tight">
                  We'll use this number as your contact phone number for the order.
                </p>
              </div>

          </div>


          </div>

          {/* Sticky Elevated Footer - Always Visible */}
          <div className="sticky bottom-0 z-30 bg-white/98 backdrop-blur-md border-t border-stone-200/90 px-3 py-2.5 sm:px-4 sm:py-3 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] space-y-2">
            {/* Order and delivery fee with divider */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 px-2 sm:px-3 mx-auto py-0.5 text-sm sm:text-base">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm font-medium text-stone-600">
                  Estimated subtotal
                </span>
                <span className="text-base font-bold text-stone-950 font-mono">
                  KES {cartSubtotal.toLocaleString()}
                </span>
              </div>
              <span className="h-4 sm:h-5 w-px bg-stone-300" aria-hidden="true" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base font-semibold text-stone-700">Delivery fee:</span>
                <span className="text-base sm:text-lg font-bold text-stone-950 font-mono">
                  {effectiveDeliveryFee === 0 ? (
                    <span className="text-[#173b28] font-bold">Free</span>
                  ) : (
                    `KES ${effectiveDeliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isProcessing ||
                paymentState === 'unknown' ||
                paymentState === 'pending'
              }
              className="relative z-40 w-full min-h-[46px] sm:min-h-[48px] px-4 py-2.5 rounded-xl bg-[#173b28] hover:bg-[#122e20] active:scale-98 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {createdOrderId ? 'Requesting payment...' : 'Creating order...'}
                  </span>
                </>
              ) : paymentState === 'failed' ? (
                <>
                  <span>Retry payment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Place order & pay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
