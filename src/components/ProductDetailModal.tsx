import React from 'react';
import { X, ShieldCheck, Clock, MapPin, Sparkles, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    cart,
    addToCart,
    updateQuantity
  } = useStore();

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductDetail(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 p-0">
          {/* Image Header */}
          <div className="relative aspect-[16/10] sm:aspect-[2/1] w-full bg-stone-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <div className="flex items-center gap-2 text-xs text-[#8de29b] mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.origin}</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                {product.name}
              </h2>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-5">
            {/* Harvest & Quality Proof */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#173b28] shrink-0" />
                <div>
                  <div className="text-stone-500 text-[11px]">Harvested</div>
                  <div className="font-medium text-stone-900">{product.harvestTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#173b28] shrink-0" />
                <div>
                  <div className="text-stone-500 text-[11px]">Certification</div>
                  <div className="font-medium text-stone-900">
                    {product.organicCertified ? '100% Organic Verified' : 'Artisanal Batch'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1.5">
                Produce Profile
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Nutrition Highlights */}
            {product.nutrition && product.nutrition.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
                  Nutrition Highlights
                </h4>
                <div className="flex flex-wrap gap-2 text-xs text-stone-700">
                  {product.nutrition.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-lg">
                      <Sparkles className="w-3 h-3 text-[#173b28]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Tip */}
            {product.storageTip && (
              <div className="p-3.5 rounded-xl bg-[#F4F8F4] border border-[#d8ecd8] text-xs text-stone-700">
                <span className="font-semibold text-[#173b28]">Chef&apos;s Storage Tip: </span>
                {product.storageTip}
              </div>
            )}
          </div>
        </div>

        {/* Contiguous Sticky Purchase Module */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/80 backdrop-blur-sm flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-stone-500 font-medium">{product.unit}</div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
              KES {product.price.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOutOfStock ? (
              <div className="px-5 py-3 rounded-xl bg-stone-200 text-stone-500 text-xs font-semibold">
                Sold Out for Today
              </div>
            ) : quantity > 0 ? (
              <div className="flex items-center bg-white rounded-xl border border-stone-300 p-1 shadow-sm">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="min-h-[48px] px-6 rounded-xl bg-[#173b28] hover:bg-[#122e20] active:scale-98 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
