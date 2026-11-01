import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Truck, 
  Bike, 
  ShieldCheck, 
  Package,
  Zap,
  CalendarClock,
  ChevronDown, 
  Navigation,
  CreditCard,
  Check,
  PackageCheck,
  Trash2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const OrdersPage: React.FC = () => {
  const {
    activeTrackOrder,
    setActiveTrackOrder,
    updateOrderStatus,
    deleteOrder,
    orders,
    showToast,
    setViewMode,
    setActiveMobileTab
  } = useStore();

  const handleClose = () => {
    setActiveTrackOrder(null);
    setViewMode('store');
    setActiveMobileTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!activeTrackOrder && orders.length > 0) {
      setActiveTrackOrder(orders[0]);
    }
  }, [activeTrackOrder, orders, setActiveTrackOrder]);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    activeTrackOrder ? activeTrackOrder.id : (orders[0]?.id || null)
  );

  useEffect(() => {
    if (activeTrackOrder && !expandedOrderId) {
      setExpandedOrderId(activeTrackOrder.id);
    }
  }, [activeTrackOrder]);

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'new', label: 'Confirmed', desc: 'Received at hub & harvest assigned' },
    { status: 'packing', label: 'Packed', desc: 'Chilled in reusable insulated cooler' },
    { status: 'out_for_delivery', label: 'Dispatched', desc: 'Rider dispatched to your neighborhood' },
    { status: 'delivered', label: 'Delivered', desc: 'Handed over at your doorstep' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'new': return 0;
      case 'packing': return 1;
      case 'out_for_delivery': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const getOrderStatusUpdate = (order: Order) => {
    if (order.status === 'delivered') {
      return {
        label: 'Delivered',
        detail: 'Successfully delivered to your doorstep.'
      };
    }

    if (order.status === 'out_for_delivery') {
      return {
        label: 'Dispatched',
        detail: order.riderName 
          ? `Rider ${order.riderName} is en route to ${order.neighborhood.name}.`
          : `Rider is on the way to ${order.neighborhood.name}.`
      };
    }

    if (order.status === 'packing') {
      return {
        label: 'Packed',
        detail: 'Chilled in cold cooler bags, awaiting rider dispatch.'
      };
    }

    // Status is 'new' ("Confirmed")
    const isExpress = order.deliverySlot?.toLowerCase().includes('express');
    if (isExpress) {
      return {
        label: 'Express Order',
        detail: 'Fast delivery requested (dispatches in 45–60 mins).'
      };
    }

    let hour = 9;
    if (order.createdAt) {
      const dt = new Date(order.createdAt);
      if (!isNaN(dt.getTime())) {
        hour = dt.getHours();
      }
    }

    if (hour < 10) {
      return {
        label: 'Morning Order',
        detail: 'Placed before 10:00 AM (Scheduled morning slot).'
      };
    } else if (hour < 15) {
      return {
        label: 'Afternoon Order',
        detail: 'Placed before 3:00 PM (Scheduled afternoon slot).'
      };
    } else if (hour < 18) {
      return {
        label: 'Evening Order',
        detail: 'Placed before 6:00 PM (Scheduled evening slot).'
      };
    } else {
      return {
        label: 'Next Day Morning Order',
        detail: 'Placed past 6:00 PM (Scheduled for tomorrow morning harvest).'
      };
    }
  };

  const advanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    if (currentStatus === 'new') {
      updateOrderStatus(orderId, 'packing');
      showToast('Order status updated to Packed', 'info');
    } else if (currentStatus === 'packing') {
      updateOrderStatus(orderId, 'out_for_delivery', {
        riderName: 'Juma Otieno',
        riderPhone: '+254 722 409 881',
        riderVehicle: 'Honda ACE 125 (KMDF 849K)'
      });
      showToast('Order dispatched with rider Juma Otieno', 'info');
    } else if (currentStatus === 'out_for_delivery') {
      updateOrderStatus(orderId, 'delivered');
      showToast('Order marked as Delivered', 'success');
    }
  };

  const parseVehicleDetails = (vehicleStr?: string) => {
    if (!vehicleStr) {
      return { vehicleType: 'Motorcycle', reg: '' };
    }

    // Extract registration inside parentheses e.g. "(KMDF 849K)"
    const regMatch = vehicleStr.match(/\(([^)]+)\)/);
    const reg = regMatch ? regMatch[1].trim() : '';
    const cleanName = vehicleStr.replace(/\([^)]+\)/, '').trim();

    const lower = cleanName.toLowerCase();
    let vehicleCategory = 'Motorcycle';
    if (lower.includes('van') || lower.includes('eco-van')) {
      vehicleCategory = 'Van';
    } else if (lower.includes('ebike') || lower.includes('e-bike')) {
      vehicleCategory = 'e-Bike';
    } else if (lower.includes('bicycle')) {
      vehicleCategory = 'Bicycle';
    } else {
      vehicleCategory = 'Motorcycle';
    }

    // Brand name: first word of cleanName
    const brand = cleanName.split(' ')[0] || '';
    const vehicleType = brand && !cleanName.toLowerCase().startsWith(vehicleCategory.toLowerCase())
      ? `${brand} · ${vehicleCategory}`
      : vehicleCategory;

    return {
      vehicleType,
      reg: reg || cleanName
    };
  };

  const getStatusBadgeConfig = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return {
          container: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
          dot: 'bg-emerald-500',
          borderLeft: '',
          expandedBorder: '',
          label: 'Delivered'
        };
      case 'out_for_delivery':
        return {
          container: 'bg-amber-50 text-amber-900 border border-amber-200/90',
          dot: 'bg-amber-500 animate-ping',
          borderLeft: '',
          expandedBorder: '',
          label: 'Dispatched'
        };
      case 'packing':
        return {
          container: 'bg-blue-50 text-blue-800 border border-blue-200/80',
          dot: 'bg-blue-500',
          borderLeft: '',
          expandedBorder: '',
          label: 'Packed'
        };
      default:
        return {
          container: 'bg-stone-100 text-stone-700 border border-stone-200',
          dot: 'bg-stone-400',
          borderLeft: '',
          expandedBorder: '',
          label: 'Confirmed'
        };
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
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

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={handleClose}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
      role="dialog"
      aria-modal="true"
      aria-label="My Orders"
    >
      <div
        className="relative w-[85vw] max-w-[85vw] h-full bg-white rounded-none shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-white border-b border-stone-200/90 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#173b28] text-white flex items-center justify-center shadow-2xs">
              <PackageCheck className="w-4 h-4" />
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg text-stone-900 leading-tight">
              My Orders
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#173b28]/10 text-[#173b28] border border-[#173b28]/20">
              {orders.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full hover:bg-stone-100 active:scale-95 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable orders list within sidesheet */}
        <div className="w-full flex-1 min-h-0 bg-stone-50/40 overflow-y-auto overscroll-contain overflow-x-hidden p-1.5 sm:p-2.5 space-y-2">
              {orders.length === 0 ? (
                <div className="p-8 text-center bg-white border-0 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#173b28] flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-display font-bold text-stone-900 text-sm">No orders placed yet</p>
                    <p className="text-xs text-stone-500">Your harvest orders and live delivery tracking will appear here.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 bg-[#173b28] text-white text-xs font-semibold rounded-lg hover:bg-[#122e20] transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map((o) => {
                  const isExpanded = expandedOrderId === o.id;
                  const stepIdx = getStepIndex(o.status);
                  const badge = getStatusBadgeConfig(o.status);
                  const isExpress = o.deliverySlot?.toLowerCase().includes('express');
                  const leadItem = o.items[0];
                  const leadImage = leadItem?.product?.image || (leadItem as any)?.image;
                  const leadName = leadItem?.product?.name || (leadItem as any)?.name || 'Order Item';

                  return (
                    <div
                      key={o.id}
                      className={`w-full bg-white transition-all duration-200 border-b border-stone-200 last:border-b-0 ${
                        isExpanded 
                          ? 'bg-stone-50/40' 
                          : 'hover:bg-stone-50/30'
                      }`}
                    >
                      {/* Minimalist summary header - clickable to expand downward */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setExpandedOrderId(isExpanded ? null : o.id);
                          }
                        }}
                        className={`w-full px-2 sm:px-3 py-2.5 sm:py-3 text-left transition-colors cursor-pointer select-none ${
                          isExpanded ? 'bg-stone-50/70' : 'hover:bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          {/* Leading image to contents */}
                          <div className="relative w-12 h-12 rounded-xl bg-stone-100 border border-stone-200/90 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                            {leadImage ? (
                              <img
                                src={leadImage}
                                alt={leadName}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-stone-400" />
                            )}
                            {o.items.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-tl-md leading-none">
                                +{o.items.length - 1}
                              </span>
                            )}
                          </div>

                          {/* Order details info */}
                          <div className="flex-1 min-w-0">
                            {/* Single row combining order number, express/scheduled tag, price, item count, and status badge */}
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0 leading-tight">
                              <span className="font-mono font-bold text-stone-900 text-sm sm:text-base tracking-tight shrink-0">
                                Order #{o.id}
                              </span>

                              {/* Scheduled / Express indicator moved next to Order # */}
                              {isExpress ? (
                                <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-semibold text-amber-700">
                                  <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
                                    <Zap className="w-2 h-2 text-amber-600 fill-amber-500" />
                                  </span>
                                  <span>Express</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-semibold text-stone-600">
                                  <span className="w-3.5 h-3.5 rounded bg-stone-100 border border-stone-200/80 text-stone-700 flex items-center justify-center shrink-0">
                                    <CalendarClock className="w-2 h-2 text-stone-600" />
                                  </span>
                                  <span>Scheduled</span>
                                </span>
                              )}

                              <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                              {/* Price */}
                              <span className="font-bold text-[#173b28] text-xs sm:text-sm">
                                KES {o.total.toLocaleString()}
                              </span>

                              <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                              {/* Item count */}
                              <span className="text-stone-600 text-[11px] sm:text-xs font-medium">
                                {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                              </span>

                              <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                              {/* Status: Confirmed / Packing / Dispatched / Delivered */}
                              <span className={`inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-semibold ${
                                o.status === 'delivered'
                                  ? 'text-emerald-700'
                                  : o.status === 'out_for_delivery'
                                  ? 'text-amber-700'
                                  : o.status === 'packing'
                                  ? 'text-blue-700'
                                  : 'text-stone-600'
                              }`}>
                                <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${
                                  o.status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                                    : o.status === 'out_for_delivery'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200/80'
                                    : o.status === 'packing'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200/80'
                                    : 'bg-stone-100 text-stone-700 border border-stone-200/80'
                                }`}>
                                  {o.status === 'delivered' ? (
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                  ) : o.status === 'out_for_delivery' ? (
                                    <Truck className="w-2.5 h-2.5" />
                                  ) : o.status === 'packing' ? (
                                    <Package className="w-2.5 h-2.5" />
                                  ) : (
                                    <Clock className="w-2.5 h-2.5" />
                                  )}
                                </span>
                                <span>{badge.label} ({stepIdx + 1}/4)</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteOrder(o.id);
                              }}
                              className="w-7 h-7 rounded-md hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                              title={`Remove order #${o.id}`}
                              aria-label={`Remove order #${o.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <ChevronDown
                              className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-emerald-800' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Downward expanded details */}
                      {isExpanded && (
                        <div className="px-2 sm:px-3 pb-3 pt-2 border-t-0 border-t-transparent bg-stone-50/40 space-y-2 animate-in slide-in-from-top-1 duration-150">
                          {/* Minimalist Horizontal Live Progress with icons and dividers */}
                          <div className="space-y-1.5">
                            {/* Horizontal status icons separated by dividers with active divider and icon highlighted */}
                            <div className="w-full pt-0.5">
                              <div className="flex items-center w-full">
                                {steps.map((step, idx) => {
                                  const isPassed = idx <= stepIdx;
                                  const isCurrent = idx === stepIdx;
                                  const IconComponent =
                                     step.status === 'new' ? Clock :
                                     step.status === 'packing' ? Package :
                                     step.status === 'out_for_delivery' ? Truck : CheckCircle2;

                                  return (
                                    <React.Fragment key={step.status}>
                                      {/* Status Icon Node */}
                                      <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                          isCurrent
                                            ? 'bg-[#173b28] text-white ring-3 ring-emerald-600/30 shadow-xs scale-105'
                                            : isPassed
                                            ? 'bg-[#173b28] text-white'
                                            : 'bg-stone-100 text-stone-400 border border-stone-200'
                                        }`}
                                        title={step.label}
                                      >
                                        <IconComponent className="w-3.5 h-3.5 shrink-0" />
                                      </div>

                                      {/* Divider between icons with active divider highlighted */}
                                      {idx < steps.length - 1 && (
                                        <div
                                          className={`h-0.5 flex-1 mx-1.5 rounded-full transition-colors duration-300 ${
                                            idx < stepIdx ? 'bg-[#173b28]' : 'bg-stone-200'
                                          }`}
                                        />
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </div>

                              {/* Step labels */}
                              <div className="flex justify-between items-center text-[9.5px] font-semibold mt-1 px-0.5">
                                {steps.map((step, idx) => {
                                  const isCurrent = idx === stepIdx;
                                  const isPassed = idx <= stepIdx;
                                  return (
                                    <span
                                      key={step.status}
                                      className={`truncate ${
                                        isCurrent ? 'text-[#173b28]' : isPassed ? 'text-stone-700' : 'text-stone-400'
                                      }`}
                                    >
                                      {step.label}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Only the description at the bottom with smaller font */}
                            <div className="text-[10px] text-stone-500 pt-0.5 leading-normal">
                              {steps[stepIdx]?.desc}
                            </div>
                          </div>

                          {/* Delivered State */}
                          {o.status === 'delivered' && (
                            <div className="pt-2 border-t-0 border-t-transparent flex flex-col items-center justify-center text-center">
                              <Check strokeWidth={3.5} className="w-5 h-5 text-emerald-600 mb-1" />
                              <div className="text-stone-600 text-[11px] font-medium leading-tight">
                                Delivered with love and care
                              </div>
                            </div>
                          )}

                          {/* Rider Information if out for delivery */}
                          {o.status === 'out_for_delivery' && o.riderName && (() => {
                            const vehicleInfo = parseVehicleDetails(o.riderVehicle);
                            return (
                              <div className="pt-2 border-t-0 border-t-transparent flex items-center justify-between gap-3 text-xs">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs leading-tight">
                                    <Bike className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                                    <span>{o.riderName}</span>
                                  </div>
                                  <div className="text-stone-600 text-[11px] font-medium leading-tight mt-0.5">
                                    {vehicleInfo.vehicleType}
                                  </div>
                                  {vehicleInfo.reg && (
                                    <div className="text-stone-400 text-[10px] font-mono leading-tight mt-0.5">
                                      {vehicleInfo.reg}
                                    </div>
                                  )}
                                </div>

                                <a
                                  href={`tel:${o.riderPhone}`}
                                  title={`Call ${o.riderName} (${o.riderPhone})`}
                                  aria-label={`Call ${o.riderName}`}
                                  className="w-8 h-8 rounded-full bg-[#173b28] hover:bg-[#122e20] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-2xs cursor-pointer"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            );
                          })()}

                          {/* Delivery Location & Time Details */}
                          <div className="pt-2 border-t-0 border-t-transparent text-xs space-y-1.5">
                            {o.status !== 'delivered' && (
                              isExpress ? (
                                <div className="flex items-center gap-1.5 text-stone-800 text-[11px]">
                                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                  <span className="font-semibold text-stone-900">
                                    In {o.status === 'out_for_delivery' ? '15' : '25'} minutes
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-stone-700 text-[11px]">
                                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                  <span className="font-medium">{o.deliverySlot}</span>
                                </div>
                              )
                            )}

                            <div className="flex items-start gap-2 text-stone-700">
                              <MapPin className="w-3.5 h-3.5 text-[#173b28] shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <div className="font-semibold text-stone-900">{o.neighborhood.name}</div>
                                <div className="text-stone-600 text-[11px] mt-0.5">{o.deliveryAddress}</div>
                                {o.dropoffNote && (
                                  <div className="text-stone-500 text-[10.5px] italic mt-0.5">
                                    &ldquo;{o.dropoffNote}&rdquo;
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-stone-700">
                              <CreditCard className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span>
                                <span className="font-semibold text-stone-900">Payment Status:</span>{' '}
                                <span className={o.paymentStatus === 'paid' ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                                  {o.paymentStatus === 'paid'
                                    ? (o.paymentMethod === 'cash' || o.paymentMethod === 'cod')
                                       ? (o.mpesaCode ? `Paid by Cash (Ref: ${o.mpesaCode})` : 'Paid by Cash')
                                      : `Paid by Mpesa (Ref: ${o.mpesaCode || 'QKM63256030WA'})`
                                    : 'Pay on delivery'}
                                </span>
                              </span>
                            </div>

                            <div className="pt-1.5 flex items-center justify-end">
                              <button
                                type="button"
                                onClick={() => deleteOrder(o.id)}
                                className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10.5px] font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove order</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      );
  };
