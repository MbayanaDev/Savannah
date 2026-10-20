import React, { useState } from 'react';
import { Plus, Search, AlertCircle, Check, Edit2, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category, Product } from '../../types';

export const InventoryManager: React.FC = () => {
  const { products, updateProductStock, updateProductPrice, addNewProduct, categories } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Veg');
  const [origin, setOrigin] = useState('');
  const [price, setPrice] = useState(250);
  const [unit, setUnit] = useState('500g bunch');
  const [stock, setStock] = useState(30);
  const [description, setDescription] = useState('');
  const [organicCertified, setOrganicCertified] = useState(true);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.origin.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !origin.trim()) return;

    addNewProduct({
      name,
      category,
      origin,
      price: Number(price),
      unit,
      stock: Number(stock),
      lowStockThreshold: 10,
      image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
      harvestTime: 'Picked fresh this morning',
      organicCertified,
      description: description || 'Fresh artisanal harvest straight from Kenyan highland farms.',
      storageTip: 'Store in cool dry conditions or refrigerate crisper.',
      nutrition: ['Farm Fresh', 'Non-GMO', 'Naturally Grown']
    });

    setIsAddModalOpen(false);
    setName('');
    setOrigin('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search farm inventory by produce or farm origin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173b28]/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none font-medium text-stone-700"
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#173b28] hover:bg-[#122e20] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fresh Batch</span>
          </button>
        </div>
      </div>

      {/* Products Inventory Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Produce</th>
                <th className="py-3 px-4">Farm Origin</th>
                <th className="py-3 px-4">Price (KES)</th>
                <th className="py-3 px-4">Live Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold;
                const isOut = p.stock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Produce Name & Image */}
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-semibold text-stone-900">{p.name}</div>
                        <div className="text-[11px] text-stone-400">{p.unit}</div>
                      </div>
                    </td>

                    {/* Origin & Category */}
                    <td className="py-3 px-4 text-stone-600">
                      <div>{p.origin}</div>
                      <div className="text-[10px] text-stone-400">{p.category}</div>
                    </td>

                    {/* Price with inline quick edit */}
                    <td className="py-3 px-4 font-mono font-bold text-stone-900 tabular-nums">
                      <div className="flex items-center gap-1">
                        <span>KES</span>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => updateProductPrice(p.id, Number(e.target.value))}
                          className="w-20 px-1.5 py-0.5 border border-stone-200 rounded font-mono text-xs focus:ring-1 focus:ring-[#173b28] focus:outline-none"
                        />
                      </div>
                    </td>

                    {/* Stock Count */}
                    <td className="py-3 px-4 font-mono font-semibold text-stone-900 tabular-nums">
                      <span className={isOut ? 'text-rose-600' : isLow ? 'text-[#b85d38]' : 'text-stone-900'}>
                        {p.stock} units
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="text-[11px] text-rose-700 font-semibold">Out of Stock</span>
                      ) : isLow ? (
                        <span className="text-[11px] text-[#b85d38] font-semibold">Low Stock</span>
                      ) : (
                        <span className="text-[11px] text-[#173b28] font-semibold">Available</span>
                      )}
                    </td>

                    {/* Stock Stepper */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center bg-stone-100 rounded-lg border border-stone-200 p-0.5">
                        <button
                          onClick={() => updateProductStock(p.id, p.stock - 5)}
                          className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold transition-colors cursor-pointer"
                          title="Deduct 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => updateProductStock(p.id, p.stock - 1)}
                          className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold transition-colors cursor-pointer"
                          title="Deduct 1"
                        >
                          -1
                        </button>
                        <span className="px-2 font-mono font-bold text-stone-900">
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateProductStock(p.id, p.stock + 1)}
                          className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold transition-colors cursor-pointer"
                          title="Add 1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => updateProductStock(p.id, p.stock + 10)}
                          className="px-2 py-1 text-[#173b28] hover:text-[#122e20] font-bold transition-colors cursor-pointer"
                          title="Add 10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Produce Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display font-bold text-base text-stone-900">
                Register New Farm Harvest Batch
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kinangop Sweet Parsnips"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Selling Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500g bunch / 1 kg"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Farm Origin / Co-op</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Limuru Organic Cooperative, Kiambu"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Price (KES)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Harvested Stock Units</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="orgCheck"
                  checked={organicCertified}
                  onChange={(e) => setOrganicCertified(e.target.checked)}
                  className="rounded text-[#173b28]"
                />
                <label htmlFor="orgCheck" className="text-stone-700 font-medium">
                  Certified Organic / Naturally Cultivated
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#173b28] hover:bg-[#122e20] text-white rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Save &amp; Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
