import React, { useState } from 'react';
import { Package, Bike, CheckCircle2, Clock, Phone, MapPin, Search, ChevronRight, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const OrderDispatch: React.FC = () => {
  const { orders, updateOrderStatus, setActiveTrackOrder } = useStore();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);

  // Rider pool
  const riders = [
    { name: 'Juma Otieno', phone: '+254 711 409 882', vehicle: 'Honda ACE 125 (KMDF 849K)' },
    { name: 'David Mwangi', phone: '+254 722 301 945', vehicle: 'TVS Star HLX (KMEB 102T)' },
    { name: 'Kevin Ndung\'u', phone: '+254 720 994 102', vehicle: 'Kikapu Eco-Van (KDJ 319X)' }
  ];

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          o.neighborhood.name.toLowerCase().includes(search.toLowerCase()) ||
                          (o.mpesaCode && o.mpesaCode.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleAssignRider = (rider: typeof riders[0]) => {
    if (!assigningOrder) return;
    updateOrderStatus(assigningOrder.id, 'out_for_delivery', {
      riderName: rider.name,
      riderPhone: rider.phone,
      riderVehicle: rider.vehicle
    });
    setAssigningOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-white border border-stone-200 rounded-xl overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'new', label: 'New' },
            { id: 'packing', label: 'Packing' },
            { id: 'out_for_delivery', label: 'In Transit' },
            { id: 'delivered', label: 'Delivered' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#173b28] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order ID, client, M-Pesa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#173b28]"
          />
        </div>
      </div>

      {/* Orders List Cards */}
      <div className="space-y-3">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-stone-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            {/* Order Primary Details */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-sm sm:text-base text-stone-900">
                  #{order.id}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  order.status === 'new'
                    ? 'bg-amber-100 text-amber-900'
                    : order.status === 'packing'
                    ? 'bg-blue-100 text-blue-900'
                    : order.status === 'out_for_delivery'
                    ? 'bg-purple-100 text-purple-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                {order.paymentMethod === 'mpesa' && (
                  <span className="text-[10px] font-mono text-[#009A44] bg-[#F2FBF5] px-1.5 py-0.5 rounded border border-[#c1e8cc]">
                    M-Pesa: {order.mpesaCode}
                  </span>
                )}
              </div>

              {/* Customer and Location */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
                <span className="font-semibold text-stone-900">{order.customerName}</span>
                <span className="font-mono text-stone-400">·</span>
                <span className="font-mono">{order.customerPhone}</span>
                <span className="font-mono text-stone-400">·</span>
                <span className="flex items-center gap-1 font-medium text-stone-800">
                  <MapPin className="w-3 h-3 text-[#173b28]" />
                  {order.neighborhood.name}
                </span>
              </div>

              <div className="text-[11px] text-stone-500">
                {order.deliveryAddress} · <span className="text-stone-700">{order.deliverySlot}</span>
              </div>

              {/* Produce items overview */}
              <div className="text-[11px] text-stone-600 font-medium pt-1">
                {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
              </div>
            </div>

            {/* Financials & Status Progression Buttons */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
              <div className="text-left md:text-right">
                <div className="font-mono font-bold text-base text-stone-900 tabular-nums">
                  KES {order.total.toLocaleString()}
                </div>
                <div className="text-[10px] text-stone-400">
                  {order.deliveryFee === 0 ? 'Free Shipping' : `Incl. KES ${order.deliveryFee} delivery`}
                </div>
              </div>

              {/* State Action Buttons */}
              <div className="flex items-center gap-2">
                {order.status === 'new' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'packing')}
                    className="px-3 py-1.5 bg-[#173b28] hover:bg-[#122e20] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Pack Produce</span>
                  </button>
                )}

                {order.status === 'packing' && (
                  <button
                    onClick={() => setAssigningOrder(order)}
                    className="px-3 py-1.5 bg-[#173b28] hover:bg-[#122e20] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Dispatch Rider</span>
                  </button>
                )}

                {order.status === 'out_for_delivery' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Delivered</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTrackOrder(order)}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-stone-500 text-xs bg-white rounded-2xl border border-stone-200">
            No orders found under this status filter.
          </div>
        )}
      </div>

      {/* Rider Assignment Modal */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-stone-900">
                Dispatch Rider for #{assigningOrder.id}
              </h3>
              <p className="text-xs text-stone-500">
                Destination: {assigningOrder.neighborhood.name} ({assigningOrder.deliveryAddress})
              </p>
            </div>

            <div className="space-y-2">
              {riders.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAssignRider(r)}
                  className="w-full p-3 rounded-xl border border-stone-200 hover:border-[#173b28] hover:bg-[#F4F8F4] text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#173b28]/10 text-[#173b28] flex items-center justify-center">
                      <Bike className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-stone-900">{r.name}</div>
                      <div className="text-[11px] font-mono text-stone-500">{r.vehicle}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setAssigningOrder(null)}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
