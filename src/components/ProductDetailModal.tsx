import React, { useState, useMemo, useEffect } from 'react';
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

  const product = selectedProductDetail;
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    return product?.variants?.find(v => v.isDefault)?.id || product?.variants?.[0]?.id || '';
  });

  const specs = product?.specifications || product?.variants?.[0]?.specifications || [];

  const defaultSpecIndex = useMemo(() => {
    if (product?.selectedSpecification) {
      const matchIdx = specs.findIndex(
        s => s.product_specification === product.selectedSpecification?.product_specification &&
             s.note === product.selectedSpecification?.note
      );
      if (matchIdx >= 0) return matchIdx;
    }
    const idx = specs.findIndex(s => Boolean(s.is_default ?? s.isDefault));
    return idx >= 0 ? idx : 0;
  }, [specs, product?.selectedSpecification]);

  const [selectedSpecIndex, setSelectedSpecIndex] = useState(defaultSpecIndex);

  useEffect(() => {
    setSelectedSpecIndex(defaultSpecIndex);
  }, [defaultSpecIndex]);

  if (!product) return null;

  const currentVariant = product.variants?.find(v => v.id === selectedVariantId) || product.variants?.[0];
  const activeSpec = specs[selectedSpecIndex] || specs[0];
  const basePrice = currentVariant ? currentVariant.price : product.price;
  const activePriceAdjustment = Number(activeSpec?.price_adjustment || 0);
  const activePrice = Math.max(0, basePrice + activePriceAdjustment);

  const rawCompareAtPrice = currentVariant?.compareAtPrice ?? product.compareAtPrice;
  const activeCompareAtPrice = rawCompareAtPrice != null && Number(rawCompareAtPrice) > 0
    ? Number(rawCompareAtPrice) + activePriceAdjustment
    : null;

  const estWeight = currentVariant?.est_weight_grams ?? currentVariant?.estWeightGrams ?? currentVariant?.weightGrams ?? product.est_weight_grams ?? product.estWeightGrams;
  const packagingUnit = currentVariant?.packaging_unit ?? currentVariant?.packagingUnit ?? product.packaging_unit ?? product.packagingUnit ?? 'g';
  const packaging = currentVariant?.packaging || product.packaging || '';
  const approxCount = currentVariant?.approx_count ?? currentVariant?.approxCount ?? product.approx_count ?? product.approxCount ?? null;
  const packagingPart = packaging ? (packaging.startsWith(' ') ? packaging : ` ${packaging.trim()}`) : '';
  const weightPackagingText = estWeight
    ? `Approx ${estWeight}${packagingUnit}${packagingPart}`
    : (packaging ? `Approx ${packaging.trim()}` : product.unit);
  const activeUnit = weightPackagingText;
  const activeStock = activeSpec ? (activeSpec.in_stock ? activeSpec.count : 0) : (currentVariant ? currentVariant.stockQuantity : product.stock);
  const activeSku = currentVariant?.sku || product.sku;
  const specTag = activeSpec?.tag || product.selectedSpecification?.tag || specs.find(s => s.tag)?.tag;

  const variantProduct = {
    ...product,
    price: activePrice,
    compareAtPrice: activeCompareAtPrice,
    unit: activeUnit,
    stock: activeStock,
    selectedSpecification: activeSpec
  };

  const cartItem = cart.find(
    item =>
      item.product.id === product.id &&
      (!item.product.selectedSpecification ||
        item.product.selectedSpecification.product_specification === activeSpec?.product_specification)
  );
  const quantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = activeStock <= 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setSelectedProductDetail(null)}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
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
        <div className="overflow-y-auto overscroll-contain flex-1 p-0">
          {/* Image Header */}
          <div className="relative aspect-[16/10] sm:aspect-[2/1] w-full bg-stone-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Top pill reading key "tag" from specifications */}
            {specTag && (
              <div className="absolute top-4 left-5 z-10 pointer-events-none">
                <span className="text-xs font-semibold text-[#173b28] bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-sm border border-emerald-900/10">
                  {specTag}
                </span>
              </div>
            )}

            <div className="absolute bottom-4 left-5 right-5 text-white">
              <div className="flex items-center flex-wrap gap-2 text-xs text-[#8de29b] mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.origin}</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
                {activeSku && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px] bg-white/20 px-1.5 py-0.5 rounded text-white font-medium">
                      SKU: {activeSku}
                    </span>
                  </>
                )}
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

            {/* Database Specifications Selector (from product_variants.specifications) */}
            {specs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-900 block">
                    Ripeness &amp; Specification:
                  </label>
                  {(activeSpec?.description || activeSpec?.note) && (
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {activeSpec.description || activeSpec.note}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {specs.map((spec, idx) => {
                    const isSelected = selectedSpecIndex === idx;
                    const name = spec.product_specification.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    const adjText = spec.price_adjustment && spec.price_adjustment !== 0
                      ? `${spec.price_adjustment > 0 ? '+' : ''}${spec.price_adjustment} KES`
                      : null;
                    const isAvail = spec.in_stock && spec.count > 0;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!isAvail}
                        onClick={() => setSelectedSpecIndex(idx)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                          !isAvail
                            ? 'opacity-40 border-stone-200 bg-stone-50 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#173b28] bg-[#173b28]/5 ring-1 ring-[#173b28]'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900">{spec.note || name}</span>
                          {adjText && (
                            <span className="text-[10px] font-mono text-emerald-800 font-bold">{adjText}</span>
                          )}
                        </div>
                        {(spec.description || spec.note) && (
                          <div className="text-[11px] text-stone-600 mt-0.5">{spec.description || spec.note}</div>
                        )}
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {isAvail ? `${spec.count} available` : 'Out of stock'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Database Variants Selector */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-2 pt-2 border-t border-stone-200/80">
                <label className="text-xs font-semibold text-stone-900 block">
                  Select Pack Size / Variant:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = (currentVariant?.id === v.id);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#173b28] bg-[#173b28]/5 ring-1 ring-[#173b28]'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="font-semibold text-stone-900">{v.name}</div>
                        <div className="text-[11px] text-[#173b28] font-mono font-medium">KES {v.price.toLocaleString()}</div>
                        <div className="text-[10px] text-stone-500">{v.stockQuantity > 0 ? `${v.stockQuantity} in stock` : 'Out of stock'}</div>
                      </button>
                    );
                  })}
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
            <div className="text-[11px] text-stone-700 font-medium">{activeUnit}</div>
            {approxCount != null && (
              <div className="text-[10px] text-stone-500 font-normal">
                approx {approxCount} pcs
              </div>
            )}
            <div className="flex items-baseline flex-wrap gap-2 mt-0.5">
              {activeCompareAtPrice != null && activeCompareAtPrice > 0 && (
                <span className="text-sm sm:text-base font-mono text-stone-400 line-through tabular-nums leading-none">
                  KES {activeCompareAtPrice.toLocaleString()}
                </span>
              )}
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums tracking-tight">
                KES {activePrice.toLocaleString()}
              </span>
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
                  onClick={() => updateQuantity(product.id, quantity - 1, activeSpec?.product_specification)}
                  className="w-10 h-10 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => addToCart(variantProduct, 1)}
                  disabled={quantity >= activeStock}
                  className="w-10 h-10 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(variantProduct, 1)}
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
