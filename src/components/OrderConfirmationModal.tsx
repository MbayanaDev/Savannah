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
  PackageCheck, 
  Package,
  Zap,
  CalendarClock,
  ChevronDown, 
  Home, 
  Briefcase,
  Check,
  Navigation,
  CreditCard,
  Pencil,
  Plus,
  ArrowLeftRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';

interface SavedAddress {
  id: string;
  label: string;
  tag: string;
  icon: React.FC<{ className?: string }>;
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    tagBg: string;
    tagText: string;
  };
  street: string;
  region: string;
  apartment: string;
  reference: string;
  instructions: string;
}

const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'home',
    label: 'Home',
    tag: 'Default',
    icon: Home,
    colorTheme: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      tagBg: 'bg-emerald-700 text-white',
      tagText: 'text-white'
    },
    street: 'Dennis Pritt Road',
    region: 'Kilimani',
    apartment: 'Silver Oak Court, Apt 3B',
    reference: 'Near Shell petrol station opposite Friends supermarket',
    instructions: 'Ring buzzer 3B. Leave at door if no answer.'
  },
  {
    id: 'work',
    label: 'Work',
    tag: 'Office',
    icon: Briefcase,
    colorTheme: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      tagBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      tagText: 'text-slate-700'
    },
    street: 'Riverside Drive',
    region: 'Westlands',
    apartment: 'Riverside Green Offices, 4th Floor',
    reference: 'Opposite Riverside Square Mall, near Java House',
    instructions: 'Deliver to main reception desk.'
  },
  {
    id: 'kims',
    label: "Kim's place",
    tag: 'Friend',
    icon: MapPin,
    colorTheme: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      tagBg: 'bg-amber-100 text-amber-800 border border-amber-200',
      tagText: 'text-amber-800'
    },
    street: 'James Gichuru Road',
    region: 'Lavington',
    apartment: 'Maple Crest Villa #12',
    reference: 'Near Lavington Curve, opposite Shell station',
    instructions: 'Gate code 4022. Call on arrival.'
  },
  {
    id: 'karen',
    label: 'Karen Retreat',
    tag: 'Family',
    icon: Home,
    colorTheme: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      tagBg: 'bg-teal-100 text-teal-800 border border-teal-200',
      tagText: 'text-teal-800'
    },
    street: 'Bogani East Road',
    region: 'Karen',
    apartment: 'House 8, Acacia Mews',
    reference: 'Opposite Karen Country Club, near Gate 2',
    instructions: 'Gate intercom at pillar. Call on arrival.'
  }
];

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

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(INITIAL_SAVED_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('home');
  const [defaultAddressId, setDefaultAddressId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('greenspoon_default_address_id');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'home';
  });

  useEffect(() => {
    try {
      localStorage.setItem('greenspoon_default_address_id', defaultAddressId);
    } catch (e) {
      console.error(e);
    }
  }, [defaultAddressId]);
  const [isChangingDefault, setIsChangingDefault] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [isReplacingAddress, setIsReplacingAddress] = useState<boolean>(false);
  const [addressToReplaceId, setAddressToReplaceId] = useState<string>('');
  const [isAllAddressesExpanded, setIsAllAddressesExpanded] = useState<boolean>(false);

  const preferredAddress = savedAddresses.find(a => a.id === defaultAddressId) || savedAddresses[0];

  const handleSelectDefault = (id: string) => {
    setDefaultAddressId(id);
    setSelectedAddressId(id);
    const addr = savedAddresses.find(a => a.id === id);
    showToast(`Default delivery address changed to ${addr?.label || 'selected address'}`, 'success');
    setIsChangingDefault(false);
  };

  const [editForm, setEditForm] = useState({
    label: '',
    street: '',
    region: '',
    apartment: '',
    reference: '',
    instructions: ''
  });

  const handleOpenEdit = (addr: SavedAddress) => {
    setIsAddingAddress(false);
    setIsReplacingAddress(false);
    setEditingAddress(addr);
    setEditForm({
      label: addr.label,
      street: addr.street,
      region: addr.region || '',
      apartment: addr.apartment,
      reference: addr.reference,
      instructions: addr.instructions
    });
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsReplacingAddress(false);
    setEditForm({
      label: '',
      street: '',
      region: 'Kilimani',
      apartment: '',
      reference: '',
      instructions: ''
    });
    setIsAddingAddress(true);
  };

  const handleOpenReplace = () => {
    setEditingAddress(null);
    setIsAddingAddress(false);
    const initialId = savedAddresses[0]?.id || '';
    setAddressToReplaceId(initialId);
    setEditForm({
      label: '',
      street: '',
      region: 'Kilimani',
      apartment: '',
      reference: '',
      instructions: ''
    });
    setIsReplacingAddress(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReplacingAddress) {
      const targetAddr = savedAddresses.find(a => a.id === addressToReplaceId) || savedAddresses[0];
      const targetId = targetAddr.id;
      const replacedAddress: SavedAddress = {
        id: targetId,
        label: editForm.label.trim() || 'New Place',
        tag: targetAddr.tag || 'Saved',
        icon: targetAddr.icon || MapPin,
        colorTheme: targetAddr.colorTheme,
        street: editForm.street.trim(),
        region: editForm.region.trim() || 'Nairobi',
        apartment: editForm.apartment.trim(),
        reference: editForm.reference.trim(),
        instructions: editForm.instructions.trim()
      };
      setSavedAddresses(prev => prev.map(a => a.id === targetId ? replacedAddress : a));
      setSelectedAddressId(targetId);
      showToast(`Replaced "${targetAddr.label}" with "${replacedAddress.label}"`, 'success');
      setIsReplacingAddress(false);
      return;
    }

    if (isAddingAddress) {
      const newAddress: SavedAddress = {
        id: `addr-${Date.now()}`,
        label: editForm.label.trim() || 'New Place',
        tag: 'Saved',
        icon: MapPin,
        colorTheme: {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200/80',
          tagBg: 'bg-emerald-700 text-white',
          tagText: 'text-white'
        },
        street: editForm.street.trim(),
        region: editForm.region.trim() || 'Nairobi',
        apartment: editForm.apartment.trim(),
        reference: editForm.reference.trim(),
        instructions: editForm.instructions.trim()
      };
      setSavedAddresses(prev => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
      showToast(`Added "${newAddress.label}" to delivery addresses`, 'success');
      setIsAddingAddress(false);
      return;
    }

    if (!editingAddress) return;
    setSavedAddresses(prev =>
      prev.map(addr =>
        addr.id === editingAddress.id
          ? {
              ...addr,
              label: editForm.label.trim() || addr.label,
              street: editForm.street.trim() || addr.street,
              region: editForm.region.trim() || addr.region,
              apartment: editForm.apartment.trim() || addr.apartment,
              reference: editForm.reference.trim() || addr.reference,
              instructions: editForm.instructions.trim()
            }
          : addr
      )
    );
    showToast(`Saved changes for ${editForm.label || editingAddress.label}`, 'success');
    setEditingAddress(null);
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#FCFBF8] rounded-xl overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: "Orders and Tracking" with leading icon (not an icon button), matching body background color */}
        <div className="px-5 py-4 bg-[#FCFBF8] border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <PackageCheck className="w-5 h-5 text-[#173b28] shrink-0" />
            <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 tracking-tight truncate">
              Orders and Tracking
            </h3>
          </div>

          <button
            onClick={() => setActiveTrackOrder(null)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close tracking"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          {/* Section: Orders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-stone-900 text-sm tracking-tight">
                  Orders
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                  {orders.length}
                </span>
              </div>
            </div>

            {/* Scrollable orders list showing 5.5 collapsed containers */}
            <div className="space-y-2.5 max-h-[430px] overflow-y-auto pr-1">
              {orders.map((o) => {
                const isExpanded = expandedOrderId === o.id;
                const stepIdx = getStepIndex(o.status);
                const badge = getStatusBadgeConfig(o.status);
                const isExpress = o.deliverySlot?.toLowerCase().includes('express');

                return (
                  <div
                    key={o.id}
                    className={`rounded-lg border border-l-4 ${badge.borderLeft} bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:shadow-sm ${
                      isExpanded 
                        ? badge.expandedBorder 
                        : 'border-stone-200/90 hover:border-stone-300'
                    }`}
                  >
                    {/* Minimalist summary header - clickable to expand downward */}
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

          {/* Section: Delivery Addresses (2-column by n-rows minimalist grid) */}
          <div className="space-y-3 pt-2.5 mt-2 border-t border-stone-200/80">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-stone-900 text-sm tracking-tight">
                  Your drop-off locations
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                  {savedAddresses.length}
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                Saved Places
              </span>
            </div>

            {/* Preferred Address Container (Directly below text "Delivery Addresses") */}
            {preferredAddress && (() => {
              const PrefIcon = preferredAddress.icon;
              return (
                <div className="bg-stone-50/70 hover:bg-stone-50 border border-emerald-700/25 rounded-xl p-2.5 sm:p-3 shadow-2xs transition-all relative">
                  {/* Header with Leading Icon, Label, Default badge, and "Change default" CTA */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <PrefIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="font-display font-bold text-stone-900 text-xs truncate">
                        {preferredAddress.label}
                      </span>
                      <span className="text-[9.5px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded leading-none shrink-0">
                        Default
                      </span>
                    </div>
                    {/* Replaced edit icon button with "Change default" CTA */}
                    <button
                      type="button"
                      onClick={() => setIsChangingDefault(true)}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-emerald-300/80 rounded-md text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                    >
                      Change default
                    </button>
                  </div>

                  {/* Compact Content Stack */}
                  <div className="space-y-0.5 text-xs">
                    {/* Row 2: Street / Road and Delivery Region in one row separated by a comma */}
                    <div className="text-stone-800 font-semibold leading-tight break-words">
                      {preferredAddress.street}{preferredAddress.region ? `, ${preferredAddress.region}` : ''}
                    </div>

                    {/* Row 3: Apartment & House Number */}
                    <div className="text-stone-600 text-[11px] leading-tight break-words">
                      {preferredAddress.apartment}
                    </div>

                    {/* Row 4: Reference (smaller font) */}
                    {preferredAddress.reference && (
                      <div className="text-stone-400 text-[10px] leading-tight break-words">
                        {preferredAddress.reference}
                      </div>
                    )}

                    {/* Row 5: Instructions */}
                    {preferredAddress.instructions && (
                      <div className="pt-0.5 text-[10px] text-stone-500 italic leading-tight break-words">
                        &ldquo;{preferredAddress.instructions}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* "All Addresses" Section: Hidden by default behind an expand button */}
            {!isAllAddressesExpanded ? (
              <button
                type="button"
                onClick={() => setIsAllAddressesExpanded(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-display font-bold text-xs text-stone-900">
                    All Addresses
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600 border border-stone-200/60">
                    {savedAddresses.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>View All</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>
            ) : (
              <div className="space-y-3 pt-0.5 animate-in fade-in duration-150">
                {/* Subheading: All Addresses & dynamic CTA with collapse button */}
                <div className="flex items-start justify-between">
                  <button
                    type="button"
                    onClick={() => setIsAllAddressesExpanded(false)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 hover:text-stone-900 uppercase tracking-wider mt-0.5 cursor-pointer group"
                    title="Click to hide"
                  >
                    <span>All Addresses</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-stone-200/70 text-stone-700 font-normal">
                      {savedAddresses.length}
                    </span>
                    <ChevronDown className="w-3 h-3 rotate-180 text-stone-400 group-hover:text-stone-700 transition-transform" />
                  </button>
                  <div className="flex flex-col items-end leading-tight">
                    {savedAddresses.length >= 4 ? (
                      <button
                        type="button"
                        onClick={handleOpenReplace}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
                      >
                        <span>replace address</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenAdd}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>add address</span>
                      </button>
                    )}
                    <span className="text-[10px] text-stone-400 italic">
                      add up to 4 addresses
                    </span>
                  </div>
                </div>

                {/* 2 Column by n Rows Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {savedAddresses.map((addr) => {
                    const Icon = addr.icon;
                    const isSelected = selectedAddressId === addr.id;

                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          showToast(`Active delivery address set to ${addr.label}`, 'success');
                        }}
                        className={`group relative flex flex-col justify-between p-3 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-emerald-50/20 border-emerald-700 shadow-xs ring-1 ring-emerald-700/20'
                            : 'bg-white hover:bg-stone-50/70 border-stone-200/90 hover:border-stone-300 shadow-2xs'
                        }`}
                      >
                        {/* Content Ordered Row by Row (with wrapping enabled) */}
                        <div className="space-y-1">
                          {/* Row 1: Header with Leading Icon, Label, and Edit Button on the Top Right */}
                          <div className="flex items-center justify-between gap-1.5 mb-0.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-stone-500'}`} />
                              <span className="font-display font-bold text-stone-900 text-xs break-words">
                                {addr.label}
                              </span>
                            </div>
                            {/* Edit Icon Button at top right of the container */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(addr);
                              }}
                              className="w-5 h-5 flex items-center justify-center rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
                              title={`Edit ${addr.label}`}
                              aria-label={`Edit ${addr.label}`}
                            >
                              <Pencil className="w-2.5 h-2.5 text-stone-500" />
                            </button>
                          </div>

                          {/* Row 2: Street / Road */}
                          <div className="text-stone-800 text-xs font-semibold leading-snug break-words">
                            {addr.street}
                          </div>

                          {/* Row 3: Delivery Region (e.g. Kilimani, Lavington) */}
                          {addr.region && (
                            <div className="text-emerald-800 text-[11px] font-medium leading-snug break-words">
                              {addr.region}
                            </div>
                          )}

                          {/* Row 4: Apartment & House Number */}
                          <div className="text-stone-600 text-[11.5px] leading-snug break-words">
                            {addr.apartment}
                          </div>

                          {/* Row 5: Reference (smaller font) */}
                          {addr.reference && (
                            <div className="text-stone-400 text-[10px] leading-tight break-words">
                              {addr.reference}
                            </div>
                          )}

                          {/* Row 6: Description / Instructions */}
                          {addr.instructions && (
                            <div className="pt-0.5 mt-0.5 text-[10.5px] text-stone-500 italic leading-snug break-words">
                              &ldquo;{addr.instructions}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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

      {/* Delivery Address Form Modal (Add / Edit / Replace) */}
      {(editingAddress || isAddingAddress || isReplacingAddress) && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => { setEditingAddress(null); setIsAddingAddress(false); setIsReplacingAddress(false); }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                {isReplacingAddress ? (
                  <ArrowLeftRight className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                ) : isAddingAddress ? (
                  <Plus className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                ) : (
                  <Pencil className="w-4 h-4 text-emerald-700" />
                )}
                <h4 className="font-display font-bold text-sm text-stone-900">
                  {isReplacingAddress 
                    ? 'Replace Delivery Address' 
                    : isAddingAddress 
                    ? 'Add Delivery Address' 
                    : 'Edit Delivery Address'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => { setEditingAddress(null); setIsAddingAddress(false); setIsReplacingAddress(false); }}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              {/* When replacing, show dropdown of address to replace */}
              {isReplacingAddress && (
                <div className="bg-emerald-50/60 border border-emerald-200/90 p-2.5 rounded-lg space-y-1">
                  <label className="block font-semibold text-emerald-900 text-xs">
                    Select address to replace
                  </label>
                  <select
                    value={addressToReplaceId}
                    onChange={(e) => setAddressToReplaceId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 text-xs font-medium cursor-pointer"
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} — {addr.street}, {addr.region}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-emerald-800/80 leading-tight">
                    The chosen address will be replaced with the new location entered below.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Place Name / Label
                </label>
                <input
                  type="text"
                  required
                  value={editForm.label}
                  onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 font-medium"
                  placeholder="e.g. Home, Work, Apartment"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Street / Road
                </label>
                <input
                  type="text"
                  required
                  value={editForm.street}
                  onChange={(e) => setEditForm(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Dennis Pritt Road"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Delivery Region / Area
                </label>
                <input
                  type="text"
                  required
                  value={editForm.region}
                  onChange={(e) => setEditForm(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Kilimani, Lavington, Westlands"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Apartment & House Number
                </label>
                <input
                  type="text"
                  required
                  value={editForm.apartment}
                  onChange={(e) => setEditForm(prev => ({ ...prev, apartment: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Silver Oak Court, Apt 3B"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Reference / Landmark
                </label>
                <input
                  type="text"
                  value={editForm.reference}
                  onChange={(e) => setEditForm(prev => ({ ...prev, reference: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Near Shell petrol station opposite Friends supermarket"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Delivery Instructions
                </label>
                <input
                  type="text"
                  value={editForm.instructions}
                  onChange={(e) => setEditForm(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Ring buzzer 3B. Leave at door if no answer."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => { setEditingAddress(null); setIsAddingAddress(false); setIsReplacingAddress(false); }}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  {isReplacingAddress ? 'Replace Address' : isAddingAddress ? 'Add Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Default Address Modal Dialog */}
      {isChangingDefault && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsChangingDefault(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <h4 className="font-display font-bold text-sm text-stone-900">
                  Change Default Address
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingDefault(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-normal">
              Select which address you would like to set as your primary preferred delivery location:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {savedAddresses.map((addr) => {
                const Icon = addr.icon;
                const isCurrentDefault = defaultAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectDefault(addr.id)}
                    className={`flex items-start justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isCurrentDefault
                        ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600/30'
                        : 'bg-white hover:bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isCurrentDefault ? 'text-emerald-700' : 'text-stone-400'}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-xs text-stone-900">
                            {addr.label}
                          </span>
                          {isCurrentDefault && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                              Current Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11.5px] text-stone-800 font-medium truncate mt-0.5">
                          {addr.street}, {addr.region}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">
                          {addr.apartment}
                        </p>
                      </div>
                    </div>
                    {isCurrentDefault ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDefault(addr.id);
                        }}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0 ml-2 py-1 px-2 cursor-pointer"
                      >
                        Set default
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsChangingDefault(false)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
