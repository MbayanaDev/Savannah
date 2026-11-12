import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Truck,
  Bike,
  Package,
  Zap,
  CalendarClock,
  ChevronDown,
  Check,
  CreditCard
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';

export const OrderConfirmationModal: React.FC = () => {
  const {
    activeTrackOrder,
    setActiveTrackOrder,
    updateOrderStatus,
    orders,
    showToast
  } = useStore();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    activeTrackOrder ? activeTrackOrder.id : null
  );

  if (!activeTrackOrder) return null;

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
          borderLeft: 'border-l-emerald-600',
          expandedBorder: 'border-emerald-600 ring-1 ring-emerald-600/20',
          label: 'Delivered'
        };
      case 'out_for_delivery':
        return {
          container: 'bg-amber-50 text-amber-900 border border-amber-200/90',
          dot: 'bg-amber-500 animate-ping',
          borderLeft: 'border-l-amber-500',
          expandedBorder: 'border-amber-500 ring-1 ring-amber-500/25',
          label: 'Dispatched'
        };
      case 'packing':
        return {
          container: 'bg-blue-50 text-blue-800 border border-blue-200/80',
          dot: 'bg-blue-500',
          borderLeft: 'border-l-blue-500',
          expandedBorder: 'border-blue-500 ring-1 ring-blue-500/25',
          label: 'Packed'
        };
      default:
        return {
          container: 'bg-stone-100 text-stone-700 border border-stone-200',
          dot: 'bg-stone-400',
          borderLeft: 'border-l-stone-400',
          expandedBorder: 'border-stone-400 ring-1 ring-stone-400/25',
          label: 'Confirmed'
        };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setActiveTrackOrder(null)}
    >
      <div
        className="w-full max-w-xl md:max-w-2xl h-full bg-[#FCFBF8] shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Dismiss Button */}
        <div className="px-4 sm:px-6 pt-4 pb-1 flex items-center justify-end">
          <button
            onClick={() => setActiveTrackOrder(null)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
          {/* Scrollable list with no space between containers */}
          <div className="space-y-0 divide-y divide-stone-200/80 rounded-xl border border-stone-200/90 overflow-hidden bg-white max-h-[480px] sm:max-h-[540px] overflow-y-auto">
            {orders.map((o) => {
              const isExpanded = expandedOrderId === o.id;
              const stepIdx = getStepIndex(o.status);
              const badge = getStatusBadgeConfig(o.status);
              const isExpress = o.deliverySlot?.toLowerCase().includes('express');

              return (
                <div
                  key={o.id}
                  className={`border-x-0 border-l-0 border-r-0 border-t-0 border-b-0 bg-white overflow-hidden transition-all duration-200 ${
                    isExpanded
                      ? 'bg-stone-50/40'
                      : 'hover:bg-stone-50/30'
                  }`}
                >
                  {/* Clickable Order Container Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                    className={`w-full p-3.5 sm:p-4 text-left transition-colors cursor-pointer ${
                      isExpanded ? 'bg-stone-50/70' : 'hover:bg-stone-50/50'
                    }`}
                  >
                      {/* Row 1: Order number on the left with leading icon dot and "At fulfillment x/4", Chevron down on the same row on the right */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono font-bold text-stone-900 text-sm sm:text-base tracking-tight">
                            Order #{o.id}
                          </span>

                          <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 self-center ${
                              o.status === 'delivered'
                                ? 'bg-emerald-600'
                                : o.status === 'out_for_delivery'
                                ? 'bg-amber-500 animate-pulse'
                                : o.status === 'packing'
                                ? 'bg-blue-500'
                                : 'bg-[#173b28]'
                            }`} />
                            <span>At fulfillment {stepIdx + 1}/4</span>
                          </span>
                        </div>

                        <ChevronDown
                          className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-emerald-800' : ''
                          }`}
                        />
                      </div>

                      {/* Row 2: Order value, item count, status with trailing text, and scheduled/express with trailing text (compact) */}
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] mt-0.5 leading-tight">
                        <span className="font-bold text-[#173b28]">
                          KES {o.total.toLocaleString()}
                        </span>

                        <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                        <span className="text-stone-600 font-medium">
                          {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                        </span>

                        <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                        {/* Status with leading icon and trailing text */}
                        <span className={`inline-flex items-center gap-0.5 font-semibold ${
                          o.status === 'delivered'
                            ? 'text-emerald-700'
                            : o.status === 'out_for_delivery'
                            ? 'text-amber-700'
                            : o.status === 'packing'
                            ? 'text-blue-700'
                            : 'text-stone-600'
                        }`}>
                          {o.status === 'delivered' ? (
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                          ) : o.status === 'out_for_delivery' ? (
                            <Truck className="w-3 h-3 shrink-0" />
                          ) : o.status === 'packing' ? (
                            <Package className="w-3 h-3 shrink-0" />
                          ) : (
                            <Clock className="w-3 h-3 shrink-0" />
                          )}
                          <span>{badge.label}</span>
                        </span>

                        <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                        {/* Scheduled / Express with leading icon and trailing text */}
                        {isExpress ? (
                          <span className="inline-flex items-center gap-0.5 font-semibold text-amber-700">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                            <span>Express</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 font-semibold text-stone-600">
                            <CalendarClock className="w-3 h-3 text-stone-500 shrink-0" />
                            <span>Scheduled</span>
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Downward expanded details (unboxed children for compact feel) */}
                    {isExpanded && (
                      <div className="px-4 pb-3.5 pt-2 border-t border-stone-100 bg-stone-50/40 space-y-2.5 animate-in slide-in-from-top-1 duration-150">
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
                          <div className="pt-2 border-t border-stone-100 flex flex-col items-center justify-center text-center">
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
                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
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
                        <div className="pt-2 border-t border-stone-100 text-xs space-y-1.5">
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
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Phone className="w-3.5 h-3.5 text-stone-400" />
            <span>Need help?: +254 700 892 019</span>
          </div>
          <button
            onClick={() => setActiveTrackOrder(null)}
            className="px-4 py-2 bg-[#173b28] hover:bg-[#122e20] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>

    </div>
  );
};
