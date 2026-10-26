import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Store, ArrowLeft } from 'lucide-react';
import { AnalyticsOverview } from './AnalyticsOverview';
import { InventoryManager } from './InventoryManager';
import { OrderDispatch } from './OrderDispatch';
import { useStore } from '../../context/StoreContext';

export const AdminDashboard: React.FC = () => {
  const { setViewMode, setActiveMobileTab, orders, isSupabaseLive } = useStore();
  const [subTab, setSubTab] = useState<'analytics' | 'inventory' | 'orders'>('analytics');

  const pendingOrdersCount = orders.filter(o => o.status === 'new' || o.status === 'packing').length;

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24 md:pb-16">
      {/* Dashboard Top Header */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setViewMode('store');
                setActiveMobileTab('shop');
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <span className="text-stone-300">|</span>
            <div>
              <h1 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                Savannah Fresh Hub Operations
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  isSupabaseLive 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseLive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                  {isSupabaseLive ? 'Supabase DB Linked (categories, products, variants)' : 'Supabase: Ready for Anon Key'}
                </span>
                <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">xkzktrrtjjenjnbnheba.supabase.co</span>
              </div>
            </div>
          </div>

          {/* Segmented Sub Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs w-full sm:w-auto">
            <button
              onClick={() => setSubTab('analytics')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                subTab === 'analytics'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setSubTab('inventory')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                subTab === 'inventory'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setSubTab('orders')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                subTab === 'orders'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Dispatch &amp; Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="bg-[#b85d38] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {subTab === 'analytics' && <AnalyticsOverview />}
        {subTab === 'inventory' && <InventoryManager />}
        {subTab === 'orders' && <OrderDispatch />}
      </div>
    </div>
  );
};
