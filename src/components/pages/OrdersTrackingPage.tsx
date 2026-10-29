import React, { useState, useEffect, useMemo } from 'react';
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
  Pencil, 
  Plus, 
  ArrowLeftRight, 
  Home, 
  Briefcase, 
  Search, 
  RotateCcw, 
  MessageCircle, 
  Leaf, 
  ArrowRight, 
  X,
  ShoppingBag,
  ExternalLink,
  Receipt
} from 'lucide-react';
import { PageLayout } from './PageLayout';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

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

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const stored = localStorage.getItem('savannah_saved_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((a: any) => ({
          ...a,
          icon: a.label.toLowerCase().includes('work') ? Briefcase : a.label.toLowerCase().includes('home') ? Home : MapPin
        }));
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAVED_ADDRESSES;
  });

  const [defaultAddressId, setDefaultAddressId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('arcana_default_address_id') || localStorage.getItem('savannah_default_address_id');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'home';
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddressId);
  const [isChangingDefault, setIsChangingDefault] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [isReplacingAddress, setIsReplacingAddress] = useState<boolean>(false);
  const [addressToReplaceId, setAddressToReplaceId] = useState<string>('');
  const [isAllAddressesExpanded, setIsAllAddressesExpanded] = useState<boolean>(true);

  // Sync saved addresses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savannah_saved_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.error(e);
    }
  }, [savedAddresses]);

  useEffect(() => {
    try {
      localStorage.setItem('arcana_default_address_id', defaultAddressId);
    } catch (e) {
      console.error(e);
    }
  }, [defaultAddressId]);

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
      subtitle="Track your live harvest dispatches, view order breakdown, and manage your delivery drop-off locations."
    >
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200 -mt-2">
        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
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
              Saved Places
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black font-display text-stone-900">
                {savedAddresses.length}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Drop-offs</span>
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

        {/* SECTION 2: DROP-OFF LOCATIONS / SAVED ADDRESSES CONTAINER */}
        <section className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#173b28] shrink-0" />
              <div>
                <h2 className="font-display font-extrabold text-base sm:text-lg text-stone-900 tracking-tight">
                  Your Drop-Off Locations
                </h2>
                <p className="text-xs text-stone-500">
                  Save up to 4 doorstep locations with gate instructions and landmark references.
                </p>
              </div>
            </div>

            {savedAddresses.length >= 4 ? (
              <button
                type="button"
                onClick={handleOpenReplace}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Replace address</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="text-xs font-semibold text-white bg-[#173b28] hover:bg-[#122e20] px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add address</span>
              </button>
            )}
          </div>

          {/* Preferred Default Address Featured Card */}
          {preferredAddress && (() => {
            const PrefIcon = preferredAddress.icon;
            return (
              <div className="bg-stone-50/70 hover:bg-stone-50 border border-emerald-700/25 rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all relative">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <PrefIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-display font-bold text-stone-900 text-sm truncate">
                      {preferredAddress.label}
                    </span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full leading-none shrink-0">
                      Default Delivery Place
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsChangingDefault(true)}
                    className="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-emerald-300/80 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                  >
                    Change default
                  </button>
                </div>

                <div className="space-y-0.5 text-xs pt-1">
                  <div className="text-stone-800 font-semibold leading-tight">
                    {preferredAddress.street}{preferredAddress.region ? `, ${preferredAddress.region}` : ''}
                  </div>
                  <div className="text-stone-600 text-[11.5px] leading-tight">
                    {preferredAddress.apartment}
                  </div>
                  {preferredAddress.reference && (
                    <div className="text-stone-400 text-[11px] leading-tight">
                      Landmark: {preferredAddress.reference}
                    </div>
                  )}
                  {preferredAddress.instructions && (
                    <div className="pt-1 text-[11px] text-stone-500 italic leading-tight">
                      Instructions: &ldquo;{preferredAddress.instructions}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* All Saved Addresses Grid */}
          <div className="pt-2">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                All Saved Addresses ({savedAddresses.length}/4)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedAddresses.map((addr) => {
                const Icon = addr.icon;
                const isDefault = defaultAddressId === addr.id;

                return (
                  <div
                    key={addr.id}
                    className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all text-left ${
                      isDefault
                        ? 'bg-emerald-50/30 border-emerald-700/60 shadow-xs ring-1 ring-emerald-700/20'
                        : 'bg-white hover:bg-stone-50/70 border-stone-200/90 hover:border-stone-300 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isDefault ? 'text-emerald-800' : 'text-stone-500'}`} />
                          <span className="font-display font-bold text-stone-900 text-xs sm:text-sm">
                            {addr.label}
                          </span>
                          {isDefault && (
                            <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(addr)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                            title={`Edit ${addr.label}`}
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-stone-800 text-xs font-semibold leading-snug">
                        {addr.street}
                      </div>

                      {addr.region && (
                        <div className="text-emerald-800 text-[11px] font-medium leading-snug">
                          {addr.region}
                        </div>
                      )}

                      <div className="text-stone-600 text-[11px] leading-snug">
                        {addr.apartment}
                      </div>

                      {addr.reference && (
                        <div className="text-stone-400 text-[10.5px] leading-tight">
                          Ref: {addr.reference}
                        </div>
                      )}

                      {addr.instructions && (
                        <div className="pt-0.5 text-[10.5px] text-stone-500 italic leading-snug">
                          &ldquo;{addr.instructions}&rdquo;
                        </div>
                      )}
                    </div>

                    {!isDefault && (
                      <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleSelectDefault(addr.id)}
                          className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                        >
                          Set as default
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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

      {/* Add / Edit / Replace Delivery Address Modal */}
      {(editingAddress || isAddingAddress || isReplacingAddress) && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => { setEditingAddress(null); setIsAddingAddress(false); setIsReplacingAddress(false); }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md p-5 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                {isReplacingAddress ? (
                  <ArrowLeftRight className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
                ) : isAddingAddress ? (
                  <Plus className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
                ) : (
                  <Pencil className="w-4 h-4 text-emerald-800" />
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
              {isReplacingAddress && (
                <div className="bg-emerald-50/60 border border-emerald-200/90 p-2.5 rounded-xl space-y-1">
                  <label className="block font-semibold text-emerald-900 text-xs">
                    Select address to replace:
                  </label>
                  <select
                    value={addressToReplaceId}
                    onChange={(e) => setAddressToReplaceId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 text-xs font-medium cursor-pointer"
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} &mdash; {addr.street}, {addr.region}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-emerald-800/80 leading-tight">
                    The chosen place will be replaced with the updated location details below.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Place Name / Label
                </label>
                <input
                  type="text"
                  required
                  value={editForm.label}
                  onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 font-medium"
                  placeholder="e.g. Home, Work, Apartment"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Street / Road
                </label>
                <input
                  type="text"
                  required
                  value={editForm.street}
                  onChange={(e) => setEditForm(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Dennis Pritt Road"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Delivery Region / Area
                </label>
                <input
                  type="text"
                  required
                  value={editForm.region}
                  onChange={(e) => setEditForm(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Kilimani, Lavington, Westlands"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Apartment &amp; House Number
                </label>
                <input
                  type="text"
                  required
                  value={editForm.apartment}
                  onChange={(e) => setEditForm(prev => ({ ...prev, apartment: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Silver Oak Court, Apt 3B"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Reference / Landmark
                </label>
                <input
                  type="text"
                  value={editForm.reference}
                  onChange={(e) => setEditForm(prev => ({ ...prev, reference: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Near Shell petrol station opposite Friends supermarket"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Delivery Instructions
                </label>
                <input
                  type="text"
                  value={editForm.instructions}
                  onChange={(e) => setEditForm(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  placeholder="e.g. Ring buzzer 3B. Leave at door if no answer."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => { setEditingAddress(null); setIsAddingAddress(false); setIsReplacingAddress(false); }}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  {isReplacingAddress ? 'Replace Address' : isAddingAddress ? 'Add Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Default Address Modal */}
      {isChangingDefault && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsChangingDefault(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-800" />
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
              Select which saved place should be your primary preferred doorstep location for upcoming orders:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {savedAddresses.map((addr) => {
                const Icon = addr.icon;
                const isCurrentDefault = defaultAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectDefault(addr.id)}
                    className={`flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isCurrentDefault
                        ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600/30'
                        : 'bg-white hover:bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isCurrentDefault ? 'text-emerald-800' : 'text-stone-400'}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-xs text-stone-900">
                            {addr.label}
                          </span>
                          {isCurrentDefault && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded font-mono">
                              DEFAULT
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
                      <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDefault(addr.id);
                        }}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline shrink-0 ml-2 py-1 px-2 cursor-pointer"
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
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
