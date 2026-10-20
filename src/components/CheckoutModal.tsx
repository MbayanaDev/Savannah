import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Phone, User, Clock, Loader2, Sparkles, MapPin, Zap, ChevronDown, Bike } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NAIROBI_NEIGHBORHOODS } from '../data/neighborhoods';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    selectedNeighborhood,
    setSelectedNeighborhood,
    savedAddresses,
    selectAddress,
    activeSavedAddress,
    createOrder,
    showToast
  } = useStore();

  const [name, setName] = useState('Kelvin Munene');
  const [phone, setPhone] = useState('0722 890 123');
  const [email, setEmail] = useState('kelvin.munene@gmail.com');
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'express' | 'scheduled'>('express');
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<'today' | 'tomorrow'>('today');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('2:00 PM - 5:00 PM (Afternoon)');

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

  useEffect(() => {
    if (activeSavedAddress) {
      setAddress(`${activeSavedAddress.apartment}, ${activeSavedAddress.street}, ${activeSavedAddress.region}`);
      if (activeSavedAddress.instructions) {
        setDropoffNote(activeSavedAddress.instructions);
      }
    }
  }, [activeSavedAddress]);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cod'>('mpesa');

  // M-Pesa STK Push Simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkPromptActive, setStkPromptActive] = useState(false);
  const [stkCountdown, setStkCountdown] = useState(5);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      showToast('Please fill in your delivery contact and address details', 'warning');
      return;
    }

    if (paymentMethod === 'mpesa') {
      setIsProcessing(true);
      setStkPromptActive(true);
      setStkCountdown(4);

      // Simulate STK push interaction
      const interval = setInterval(() => {
        setStkCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(async () => {
        clearInterval(interval);
        try {
          await createOrder({
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            deliveryAddress: address,
            deliverySlot,
            dropoffNote,
            paymentMethod: 'mpesa'
          });
          setIsProcessing(false);
          setStkPromptActive(false);
          setIsCheckoutOpen(false);
        } catch (err) {
          console.error(err);
          setIsProcessing(false);
          setStkPromptActive(false);
        }
      }, 4500);

    } else {
      // Direct Card or COD checkout
      setIsProcessing(true);
      setTimeout(async () => {
        try {
          await createOrder({
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            deliveryAddress: address,
            deliverySlot,
            dropoffNote,
            paymentMethod
          });
          setIsProcessing(false);
          setIsCheckoutOpen(false);
        } catch (err) {
          console.error(err);
          setIsProcessing(false);
        }
      }, 1200);
    }
  };

  const handleBack = () => {
    if (isProcessing) return;
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBack}
              disabled={isProcessing}
              className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-700 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 -ml-1"
              aria-label="Back to Cart"
            >
              <ArrowLeft className="w-5 h-5 text-stone-800" />
            </button>
            <h3 className="font-display font-bold text-base sm:text-lg text-stone-900">
              Checkout
            </h3>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {/* Section: Delivery Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-stone-900">
              Your order will be delivered to:
            </h4>

            {/* Container with Name and Chosen Address */}
            <div className="bg-stone-50/80 border border-stone-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="font-bold text-stone-900 text-sm">
                      {name}
                    </div>
                    <div className="text-xs font-semibold text-stone-800 leading-snug break-words">
                      {activeSavedAddress 
                        ? `${activeSavedAddress.apartment}, ${activeSavedAddress.street}` 
                        : address}
                    </div>
                    <div className="text-[11px] text-stone-500 leading-tight">
                      {activeSavedAddress ? activeSavedAddress.region : selectedNeighborhood.name}, Nairobi
                    </div>
                    {activeSavedAddress?.reference && (
                      <div className="text-[10px] text-stone-400 leading-tight pt-0.5">
                        Ref: {activeSavedAddress.reference}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChangingAddress(!isChangingAddress)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <span>{isChangingAddress ? 'Close' : 'Change'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isChangingAddress ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Saved Address Switcher Drawer */}
              {isChangingAddress && (
                <div className="mt-3 pt-3 border-t border-stone-200 space-y-2 animate-in fade-in duration-150">
                  <div className="text-[11px] font-semibold text-stone-600">
                    Select a drop-off location:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between gap-1 ${
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

            {/* Below that: Delivery Container */}
            <div className="bg-stone-50/80 border border-stone-200/90 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <Bike className="w-4 h-4 text-[#173b28]" />
                  Delivery
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  {selectedNeighborhood.name}
                </span>
              </div>

              {/* Radio buttons for Express and Scheduled */}
              <div className="flex items-center gap-6 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="express"
                    checked={deliveryType === 'express'}
                    onChange={() => {
                      setDeliveryType('express');
                      setDeliverySlot(`${selectedDeliveryDate === 'today' ? 'Today' : 'Tomorrow'}, 45 mins (Express)`);
                    }}
                    className="w-4 h-4 text-[#173b28] focus:ring-[#173b28] accent-[#173b28] cursor-pointer"
                  />
                  <span className={`text-xs font-semibold ${deliveryType === 'express' ? 'text-stone-900' : 'text-stone-600'}`}>
                    Express
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="scheduled"
                    checked={deliveryType === 'scheduled'}
                    onChange={() => {
                      setDeliveryType('scheduled');
                      setDeliverySlot(`${selectedDeliveryDate === 'today' ? 'Today' : 'Tomorrow'} (${selectedTimeWindow})`);
                    }}
                    className="w-4 h-4 text-[#173b28] focus:ring-[#173b28] accent-[#173b28] cursor-pointer"
                  />
                  <span className={`text-xs font-semibold ${deliveryType === 'scheduled' ? 'text-stone-900' : 'text-stone-600'}`}>
                    Scheduled
                  </span>
                </label>
              </div>

              {/* Savannah Express notice */}
              <p className="text-xs text-stone-600">
                Order Savannah Express for delivery in 45 minutes 7am-7pm.
              </p>

              {/* Subheader: Select Delivery Date */}
              <div className="space-y-2 pt-1 border-t border-stone-200/60">
                <h5 className="text-xs font-semibold text-stone-900">
                  Select Delivery Date
                </h5>

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
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                      selectedDeliveryDate === 'today'
                        ? 'border-[#173b28] bg-[#EBF5ED] text-[#173b28] ring-1 ring-[#173b28]'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-xs font-bold">Today</span>
                    <span className="text-[11px] font-medium opacity-80">{todayDateStr}</span>
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
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                      selectedDeliveryDate === 'tomorrow'
                        ? 'border-[#173b28] bg-[#EBF5ED] text-[#173b28] ring-1 ring-[#173b28]'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-xs font-bold">Tomorrow</span>
                    <span className="text-[11px] font-medium opacity-80">{tomorrowDateStr}</span>
                  </button>
                </div>
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

              {/* Free delivery threshold statement */}
              <p className="text-xs text-stone-600 pt-1 border-t border-stone-200/60">
                Shop kes 3500 and more for free delivery
              </p>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#173b28]" />
              Recipient & Contact Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kelvin Munene"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173b28]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center justify-between">
                  <span>Safaricom M-Pesa Phone</span>
                  <span className="text-[10px] text-stone-400">For STK push</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="0722 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173b28]/30 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Drop-off Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Leave with gate guard if not picking call"
                value={dropoffNote}
                onChange={(e) => setDropoffNote(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173b28]/30"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#173b28]" />
              Payment Selection
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: M-Pesa */}
              <button
                type="button"
                onClick={() => setPaymentMethod('mpesa')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'mpesa'
                    ? 'border-[#009A44] bg-[#F2FBF5] shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#009A44]">Lipa na M-Pesa</span>
                  {paymentMethod === 'mpesa' && <Check className="w-4 h-4 text-[#009A44]" />}
                </div>
                <div className="text-[11px] text-stone-600 mt-1">
                  Instant STK Push to your Safaricom phone
                </div>
              </button>

              {/* Option 2: Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'card'
                    ? 'border-[#173b28] bg-[#EBF5ED] shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">Credit / Debit Card</span>
                  {paymentMethod === 'card' && <Check className="w-4 h-4 text-[#173b28]" />}
                </div>
                <div className="text-[11px] text-stone-600 mt-1">
                  Visa & Mastercard Kenya accepted
                </div>
              </button>

              {/* Option 3: Cash / M-Pesa on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-[#173b28] bg-[#EBF5ED] shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">Pay on Delivery</span>
                  {paymentMethod === 'cod' && <Check className="w-4 h-4 text-[#173b28]" />}
                </div>
                <div className="text-[11px] text-stone-600 mt-1">
                  Pay rider via M-Pesa or cash upon arrival
                </div>
              </button>
            </div>
          </div>

          {/* Interactive M-Pesa STK Push Simulation Overlay */}
          {stkPromptActive && (
            <div className="p-4 rounded-2xl bg-[#009A44] text-white shadow-xl space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    M-Pesa STK Push Initiated
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                  {stkCountdown}s
                </span>
              </div>

              <div className="bg-white/10 p-3 rounded-xl text-xs space-y-1">
                <div className="font-semibold text-stone-100">
                  Simulating STK Push to {phone}
                </div>
                <div className="text-stone-200 text-[11px]">
                  &ldquo;Do you want to pay Savannah Fresh Grocers KES {cartTotal.toLocaleString()}? Enter M-Pesa PIN.&rdquo;
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Awaiting Safaricom confirmation handshake...</span>
              </div>
            </div>
          )}

          {/* Cost Summary Box */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Produce Subtotal ({cart.length} items)</span>
              <span className="font-mono tabular-nums text-stone-900 font-medium">
                KES {cartSubtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee to {selectedNeighborhood.name}</span>
              <span className="font-mono tabular-nums font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-[#173b28] font-bold">FREE (Above KES {selectedNeighborhood.freeThreshold})</span>
                ) : (
                  `KES ${deliveryFee}`
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
              <span>Total Payable</span>
              <span className="font-mono tabular-nums text-[#173b28]">
                KES {cartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full min-h-[50px] px-6 rounded-xl bg-[#173b28] hover:bg-[#122e20] active:scale-98 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing M-Pesa Handshake...</span>
                </>
              ) : (
                <>
                  <span>
                    Confirm &amp; Pay KES {cartTotal.toLocaleString()}
                  </span>
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
