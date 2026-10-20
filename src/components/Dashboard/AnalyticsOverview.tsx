import React from 'react';
import { TrendingUp, ShoppingBag, MapPin, AlertTriangle, Users, DollarSign } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AnalyticsOverview: React.FC = () => {
  const { orders, products, cart } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

  // Neighborhood analytics calculation
  const neighborhoodMap: Record<string, { count: number; revenue: number }> = {};
  orders.forEach(order => {
    const nName = order.neighborhood.name;
    if (!neighborhoodMap[nName]) {
      neighborhoodMap[nName] = { count: 0, revenue: 0 };
    }
    neighborhoodMap[nName].count += 1;
    neighborhoodMap[nName].revenue += order.total;
  });

  const neighborhoodStats = Object.entries(neighborhoodMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue);

  // Top selling produce
  const productSalesMap: Record<string, { name: string; units: number; revenue: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const pId = item.product.id;
      if (!productSalesMap[pId]) {
        productSalesMap[pId] = { name: item.product.name, units: 0, revenue: 0 };
      }
      productSalesMap[pId].units += item.quantity;
      productSalesMap[pId].revenue += item.quantity * item.product.price;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Total KES Revenue</span>
            <DollarSign className="w-4 h-4 text-[#173b28]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
            KES {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <span className="text-[#173b28] font-semibold">+18.4%</span>
            <span>vs previous harvest cycle</span>
          </div>
        </div>

        {/* Metric 2: Completed & Active Orders */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Delivered &amp; Dispatched</span>
            <ShoppingBag className="w-4 h-4 text-[#173b28]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
            {totalOrders}
          </div>
          <div className="text-[11px] text-stone-500">
            Nairobi metro fulfillment
          </div>
        </div>

        {/* Metric 3: Average Order Value */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Average Basket (AOV)</span>
            <TrendingUp className="w-4 h-4 text-[#173b28]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
            KES {averageOrderValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500">
            Average fresh produce basket
          </div>
        </div>

        {/* Metric 4: Low Stock Alert */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Stock Replenishment</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? 'text-[#b85d38]' : 'text-stone-400'}`} />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
            {lowStockCount}
          </div>
          <div className="text-[11px] text-stone-500">
            Produce items near harvest limit
          </div>
        </div>
      </div>

      {/* Two Column Section: Top Neighborhoods & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Neighborhood Distribution */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-stone-900 text-sm sm:text-base">
                Nairobi Delivery Distribution
              </h3>
              <p className="text-xs text-stone-500">
                Order concentration and logistics revenue by neighborhood
              </p>
            </div>
            <MapPin className="w-4 h-4 text-[#173b28]" />
          </div>

          <div className="space-y-3">
            {neighborhoodStats.map((item, idx) => {
              const maxRev = neighborhoodStats[0]?.revenue || 1;
              const percent = Math.round((item.revenue / maxRev) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-stone-500">{item.count} {item.count === 1 ? 'order' : 'orders'}</span>
                      <span className="font-mono font-semibold text-stone-900 tabular-nums">
                        KES {item.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#173b28] rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Fresh Produce Items */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-stone-900 text-sm sm:text-base">
                Highest Grossing Farm Items
              </h3>
              <p className="text-xs text-stone-500">
                Fresh produce ranking by sales volume in KES
              </p>
            </div>
            <ShoppingBag className="w-4 h-4 text-[#173b28]" />
          </div>

          <div className="divide-y divide-stone-100">
            {topProducts.map((p, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 font-mono text-stone-400 font-medium">0{idx + 1}.</span>
                  <span className="font-medium text-stone-900">{p.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    KES {p.revenue.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-stone-400">
                    {p.units} units sold
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
