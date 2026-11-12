import React, { useState, useMemo } from 'react';
import {
  PackageCheck,
  Clock,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  Bike,
  ChevronDown,
  Zap,
  CalendarClock,
  Check,
  CreditCard,
  Search,
  RotateCcw,
  MessageCircle,
  Leaf,
  ArrowRight,
  ShoppingBag,
  Receipt
} from 'lucide-react';
import { PageLayout } from './PageLayout';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const OrdersTrackingPage: React.FC = () => {
  const {
    orders,
    activeTrackOrder,
    setActiveTrackOrder,
    updateOrderStatus,
    addToCart,
    showToast,
    setViewMode
  } = useStore();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    activeTrackOrder ? activeTrackOrder.id : orders[0]?.id || null
  );

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');


  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'new', label: 'Confirmed', desc: 'Received at fulfillment hub & harvest assigned' },
    { status: 'packing', label: 'Packed', desc: 'Solar hydro-cooled in insulated reusable containers' },
    { status: 'out_for_delivery', label: 'Dispatched', desc: 'Dedicated courier rider en route to your doorstep' },
    { status: 'delivered', label: 'Delivered', desc: 'Handed over at your doorstep with fresh guarantee' }
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

  const advanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    if (currentStatus === 'new') {
      updateOrderStatus(orderId, 'packing');
      showToast('Order status updated to Packed & Chilled', 'info');
    } else if (currentStatus === 'packing') {
      updateOrderStatus(orderId, 'out_for_delivery', {
        riderName: 'Juma Otieno',
        riderPhone: '+254 722 409 881',
        riderVehicle: 'Honda ACE 125 (KMDF 849K)'
      });
      showToast('Order dispatched with rider Juma Otieno', 'info');
    } else if (currentStatus === 'out_for_delivery') {
      updateOrderStatus(orderId, 'delivered');
      showToast('Order marked as Delivered. Enjoy your fresh harvest!', 'success');
    }
  };

  const parseVehicleDetails = (vehicleStr?: string) => {
    if (!vehicleStr) {
      return { vehicleType: 'Motorcycle', reg: '' };
    }
    const regMatch = vehicleStr.match(/\(([^)]+)\)/);
    const reg = regMatch ? regMatch[1].trim() : '';
    const cleanName = vehicleStr.replace(/\([^)]+\)/, '').trim();

    const lower = cleanName.toLowerCase();
    let vehicleCategory = 'Motorcycle';
    if (lower.includes('van') || lower.includes('eco-van')) {
      vehicleCategory = 'Electric Van';
    } else if (lower.includes('ebike') || lower.includes('e-bike')) {
      vehicleCategory = 'Solar e-Bike';
    } else if (lower.includes('bicycle')) {
      vehicleCategory = 'Cargo Bicycle';
    } else {
      vehicleCategory = 'Motorcycle';
    }

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
          container: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          dot: 'bg-emerald-600',
          borderLeft: 'border-l-emerald-600',
          expandedBorder: 'border-emerald-600 ring-1 ring-emerald-600/20',
          label: 'Delivered'
        };
      case 'out_for_delivery':
        return {
          container: 'bg-amber-50 text-amber-900 border-amber-200/90',
          dot: 'bg-amber-500 animate-ping',
          borderLeft: 'border-l-amber-500',
          expandedBorder: 'border-amber-500 ring-1 ring-amber-500/25',
          label: 'Dispatched'
        };
      case 'packing':
        return {
          container: 'bg-blue-50 text-blue-800 border-blue-200/80',
          dot: 'bg-blue-500',
          borderLeft: 'border-l-blue-500',
          expandedBorder: 'border-blue-500 ring-1 ring-blue-500/25',
          label: 'Packed & Chilled'
        };
      default:
        return {
          container: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-400',
          borderLeft: 'border-l-stone-400',
          expandedBorder: 'border-stone-400 ring-1 ring-stone-400/25',
          label: 'Confirmed'
        };
    }
  };

  const handleReorder = (order: Order) => {
    let count = 0;
    order.items.forEach(item => {
      addToCart(item.product, item.quantity);
      count += item.quantity;
    });
    showToast(`Added ${count} fresh items from Order #${order.id} back to your basket!`, 'success');
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Status filter
      if (statusFilter === 'active' && o.status === 'delivered') return false;
      if (statusFilter === 'delivered' && o.status !== 'delivered') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesItem = o.items.some(i => i.product.name.toLowerCase().includes(q));
        const matchesNeighborhood = o.neighborhood.name.toLowerCase().includes(q);
        return matchesId || matchesItem || matchesNeighborhood;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const activeOrdersCount = orders.filter(o => o.status !== 'delivered').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <PageLayout
      currentPage="Orders"
      title="Orders"
      subtitle="Track your live harvest dispatches and view your order history and delivery details."
    >
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200 -mt-2">
        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] sm:text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              Active Orders
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black font-display text-amber-600">
                {activeOrdersCount}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">In-transit</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] sm:text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              Completed
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black font-display text-emerald-800">
                {deliveredOrdersCount}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Delivered</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[10.5px] sm:text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              Dispatch Standard
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base sm:text-lg font-black font-display text-[#173b28]">
                45-90 min
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Cold-chain</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: ORDERS CONTAINER */}
        <section className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
          {/* Header row with Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <PackageCheck className="w-5 h-5 text-[#173b28] shrink-0" />
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-stone-900 tracking-tight">
                  Your Orders
                </h2>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200/80">
                  {filteredOrders.length}
                </span>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-xl bg-stone-100/90 p-0.5 border border-stone-200/70 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === 'active'
                      ? 'bg-white text-amber-700 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Active ({activeOrdersCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('delivered')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === 'delivered'
                      ? 'bg-white text-emerald-800 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Delivered ({deliveredOrdersCount})
                </button>
              </div>

              {/* Search by Order ID or crop */}
              <div className="relative min-w-[160px] sm:min-w-[190px]">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID or crop..."
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-stone-800">
                  {searchQuery ? 'No matching orders found' : 'No orders in this category'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {searchQuery
                    ? 'Try checking for a typo or clearing your search term.'
                    : 'Explore today’s harvest catalog with doorstep dispatch across Nairobi.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewMode('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-[#173b28] hover:bg-[#122e20] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Browse Fresh Produce</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-stone-200/80 rounded-2xl border border-stone-200/90 overflow-hidden bg-white">
              {filteredOrders.map((o) => {
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
                    {/* Collapsible Summary Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                      className={`w-full p-4 sm:p-5 text-left transition-colors cursor-pointer ${
                        isExpanded ? 'bg-stone-50/70' : 'hover:bg-stone-50/40'
                      }`}
                    >
                      {/* Row 1: Order number, fulfillment stage, Chevron */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono font-bold text-stone-900 text-sm sm:text-base tracking-tight">
                            Order #{o.id}
                          </span>

                          <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 truncate">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              o.status === 'delivered'
                                ? 'bg-emerald-600'
                                : o.status === 'out_for_delivery'
                                ? 'bg-amber-500 animate-pulse'
                                : o.status === 'packing'
                                ? 'bg-blue-500'
                                : 'bg-[#173b28]'
                            }`} />
                            <span className="font-semibold text-stone-800">
                              Stage {stepIdx + 1}/4:
                            </span>
                            <span className="text-stone-500 truncate">{steps[stepIdx]?.label}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline-block text-[11px] font-mono text-stone-400">
                            {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-emerald-800' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* Row 2: Price, items count, Status badge, Express badge */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs mt-1.5 leading-tight">
                        <span className="font-bold text-[#173b28] font-mono text-sm">
                          KES {o.total.toLocaleString()}
                        </span>

                        <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                        <span className="text-stone-600 font-medium">
                          {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                        </span>

                        <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          o.status === 'delivered'
                            ? 'text-emerald-700'
                            : o.status === 'out_for_delivery'
                            ? 'text-amber-700'
                            : o.status === 'packing'
                            ? 'text-blue-700'
                            : 'text-stone-600'
                        }`}>
                          {o.status === 'delivered' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          ) : o.status === 'out_for_delivery' ? (
                            <Truck className="w-3.5 h-3.5 shrink-0" />
                          ) : o.status === 'packing' ? (
                            <Package className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span>{badge.label}</span>
                        </span>

                        <span className="text-stone-300 text-[9px] select-none">&bull;</span>

                        {isExpress ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                            <span>Express Delivery (45m)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-stone-600">
                            <CalendarClock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                            <span>Scheduled Window</span>
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Downward Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-5 pt-3 border-t border-stone-100 bg-stone-50/40 space-y-4 animate-in slide-in-from-top-1 duration-150">
                        {/* Live Step Progress Tracker */}
                        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-stone-800 font-display flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-600" />
                              Fulfillment Milestone
                            </span>

                            {/* Testing Simulator Helper */}
                            {o.status !== 'delivered' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  advanceStatus(o.id, o.status);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                                title="Advance order status to test live tracker"
                              >
                                <RotateCcw className="w-3 h-3 text-emerald-700" />
                                <span>Advance stage</span>
                              </button>
                            )}
                          </div>

                          {/* Nodes & Connecting Dividers */}
                          <div className="w-full pt-1">
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
                                    <div
                                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                        isCurrent
                                          ? 'bg-[#173b28] text-white ring-4 ring-emerald-600/25 shadow-xs scale-105'
                                          : isPassed
                                          ? 'bg-[#173b28] text-white'
                                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                                      }`}
                                      title={step.label}
                                    >
                                      <IconComponent className="w-4 h-4 shrink-0" />
                                    </div>

                                    {idx < steps.length - 1 && (
                                      <div
                                        className={`h-1 flex-1 mx-2 rounded-full transition-colors duration-300 ${
                                          idx < stepIdx ? 'bg-[#173b28]' : 'bg-stone-200'
                                        }`}
                                      />
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </div>

                            <div className="flex justify-between items-center text-[10.5px] sm:text-xs font-semibold mt-2 px-0.5">
                              {steps.map((step, idx) => {
                                const isCurrent = idx === stepIdx;
                                const isPassed = idx <= stepIdx;
                                return (
                                  <span
                                    key={step.status}
                                    className={`truncate ${
                                      isCurrent ? 'text-[#173b28] font-bold' : isPassed ? 'text-stone-800' : 'text-stone-400'
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          <div className="text-xs text-stone-600 pt-1 leading-normal border-t border-stone-100 mt-2">
                            {steps[stepIdx]?.desc}
                          </div>
                        </div>

                        {/* Rider Information (When dispatched or delivered) */}
                        {o.status === 'out_for_delivery' && o.riderName && (() => {
                          const vehicleInfo = parseVehicleDetails(o.riderVehicle);
                          return (
                            <div className="bg-amber-50/60 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                                  <Bike className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                                    <span>{o.riderName}</span>
                                    <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                                      Courier Rider
                                    </span>
                                  </div>
                                  <div className="text-stone-700 text-xs mt-0.5 font-medium">
                                    {vehicleInfo.vehicleType}
                                    {vehicleInfo.reg ? ` (${vehicleInfo.reg})` : ''}
                                  </div>
                                  <div className="text-stone-500 text-[11px] mt-0.5 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>Estimated arrival: ~15 to 25 minutes</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <a
                                  href={`tel:${o.riderPhone}`}
                                  className="px-3 py-1.5 rounded-xl bg-[#173b28] hover:bg-[#122e20] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>Call Rider</span>
                                </a>
                                <a
                                  href={`https://wa.me/${o.riderPhone?.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(o.riderName)}%2C%20regarding%20Savannah%20Order%20${o.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Itemized Basket Breakdown */}
                        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                            <span className="font-display font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                              <Receipt className="w-4 h-4 text-emerald-800" />
                              <span>Order Items ({o.items.length})</span>
                            </span>

                            {/* Reorder Button */}
                            <button
                              type="button"
                              onClick={() => handleReorder(o)}
                              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3 h-3 text-emerald-700" />
                              <span>Reorder All</span>
                            </button>
                          </div>

                          <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto pr-1">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {item.product.image && (
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-200/80"
                                      loading="lazy"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <div className="font-semibold text-stone-900 truncate">
                                      {item.product.name}
                                    </div>
                                    <div className="text-[11px] text-stone-500 font-mono">
                                      {item.product.unit || 'Standard Bunch'}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="font-mono font-bold text-stone-900">
                                    KES {(item.product.price * item.quantity).toLocaleString()}
                                  </div>
                                  <div className="text-[10px] text-stone-400 font-mono">
                                    {item.quantity} × KES {item.product.price.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Financial Summary */}
                          <div className="pt-2 border-t border-stone-100 space-y-1 text-xs text-stone-600">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span className="font-mono font-medium">KES {o.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Doorstep Delivery:</span>
                              <span className="font-mono font-medium">
                                {o.deliveryFee === 0 ? 'Free Delivery' : `KES ${o.deliveryFee.toLocaleString()}`}
                              </span>
                            </div>
                            <div className="flex justify-between text-stone-900 font-bold pt-1 border-t border-stone-100 text-sm">
                              <span>Total Paid:</span>
                              <span className="font-mono text-[#173b28]">KES {o.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Location & Payment Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Drop-off Address */}
                          <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs space-y-1">
                            <div className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
                              <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                              <span>Drop-off Address</span>
                            </div>
                            <div className="font-semibold text-stone-900">{o.neighborhood.name}</div>
                            <div className="text-stone-600 text-[11px]">{o.deliveryAddress}</div>
                            {o.dropoffNote && (
                              <div className="text-stone-500 text-[10.5px] italic pt-0.5">
                                Note: &ldquo;{o.dropoffNote}&rdquo;
                              </div>
                            )}
                          </div>

                          {/* Payment & Sustainability Info */}
                          <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs space-y-1">
                            <div className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
                              <CreditCard className="w-3.5 h-3.5 text-emerald-800" />
                              <span>Payment &amp; Packing</span>
                            </div>
                            <div className="text-[11px] text-stone-700">
                              <span className="font-semibold text-stone-900">Payment: </span>
                              <span className={o.paymentStatus === 'paid' ? 'text-emerald-800 font-bold' : 'text-amber-800'}>
                                {o.paymentStatus === 'paid'
                                  ? (o.paymentMethod === 'cash' || o.paymentMethod === 'cod')
                                    ? (o.mpesaCode ? `Paid Cash (Ref: ${o.mpesaCode})` : 'Paid Cash on Delivery')
                                    : `Paid via M-Pesa (${o.mpesaCode || 'QKM63256030WA'})`
                                  : 'Pay on delivery'}
                              </span>
                            </div>
                            <div className="text-[10.5px] text-stone-500 flex items-center gap-1 pt-1">
                              <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Solar-hydro cooled &middot; Returnable crate packaging</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: ARCANA SUSTAINABILITY & COLD-CHAIN IMPACT CONTAINER */}
        <section className="bg-gradient-to-br from-emerald-900 to-[#173b28] rounded-3xl p-5 sm:p-6 text-white shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300">
              Savannah Arcana Initiative
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                Zero-Tailpipe Last-Mile Deliveries &amp; Returnable Crating
              </h3>
              <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed">
                Your orders are packed in solar hydro-cooled, food-safe insulated crates and delivered via electric cargo vehicles. Hand your empty crates back to our courier rider on your next delivery to claim a 50 KES credit rebate.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setViewMode('arcana');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-extrabold rounded-xl transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-center"
            >
              Explore Green Deliveries
            </button>
          </div>
        </section>

        {/* SECTION 4: DISPATCH ASSISTANCE & SUPPORT */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-xs sm:text-sm">
                Need live delivery assistance?
              </div>
              <div className="text-[11px] text-stone-500">
                Direct hotline: +254 700 892 019 &middot; Daily 7:00 AM &ndash; 7:00 PM
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/254700892019?text=Hello%20Savannah%20Fresh%2C%20I%20have%20an%20inquiry%20regarding%20my%20delivery"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

    </PageLayout>
  );
};
