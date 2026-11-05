import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { Product, VariantSpecification } from '../types';
import { useStore } from '../context/StoreContext';
import { isSameCartItem } from '../lib/cartIdentity';

interface ProductCardProps {
  product: Product;
}

export const formatSpecName = (spec: string): string => {
  return spec
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useStore();

  // The container dropdown gets data from product_variants column specifications (jsonb array)
  const specifications: VariantSpecification[] = useMemo(() => {
    if (product.specifications && product.specifications.length > 0) {
      return product.specifications;
    }
    if (product.variants && product.variants.length > 0) {
      for (const v of product.variants) {
        if (v.specifications && v.specifications.length > 0) {
          return v.specifications;
        }
      }
    }
    return [
      {
        product_specification: 'ripe',
        count: product.stock > 0 ? product.stock : 24,
        in_stock: product.stock > 0,
        is_default: true,
        note: 'Ready to eat',
        price_adjustment: 0
      }
    ];
  }, [product]);

  // Default when container is shown is where column "specifications" key "is_default": true
  const defaultSpecIndex = useMemo(() => {
    const idx = specifications.findIndex(s => Boolean(s.is_default ?? s.isDefault));
    return idx >= 0 ? idx : 0;
  }, [specifications]);

  const [selectedSpecIndex, setSelectedSpecIndex] = useState(defaultSpecIndex);

  useEffect(() => {
    setSelectedSpecIndex(defaultSpecIndex);
  }, [defaultSpecIndex]);

  const currentSpec = specifications[selectedSpecIndex] || specifications[defaultSpecIndex] || specifications[0];

  const basePrice = useMemo(() => {
    if (product.variants?.[0]?.price !== undefined && product.variants[0].price !== null) {
      return Number(product.variants[0].price);
    }
    return Number(product.price || 0);
  }, [product]);

  const priceAdjustment = Number(currentSpec?.price_adjustment || 0);
  const displayPrice = Math.max(0, basePrice + priceAdjustment);

  const rawCompareAtPrice = product.variants?.[0]?.compareAtPrice ?? product.compareAtPrice;
  const compareAtPrice = useMemo(() => {
    if (rawCompareAtPrice == null) return null;
    const baseCompare = Number(rawCompareAtPrice);
    if (isNaN(baseCompare) || baseCompare <= 0) return null;
    return baseCompare + priceAdjustment;
  }, [rawCompareAtPrice, priceAdjustment]);

  const currentStock = currentSpec ? (currentSpec.in_stock ? currentSpec.count : 0) : product.stock;
  const isOutOfStock = currentStock <= 0;

  const variantProduct = useMemo(() => {
    return {
      ...product,
      variantId: product.variants?.[0]?.id || product.variantId,
      price: displayPrice,
      compareAtPrice: compareAtPrice,
      stock: currentStock,
      selectedSpecification: currentSpec
    };
  }, [product, displayPrice, compareAtPrice, currentStock, currentSpec]);

  const cartItem = cart.find(item =>
      isSameCartItem(item.product, variantProduct)
  );

  const quantity = cartItem?.quantity ?? 0;

  // Top right pill reads key "tag" from specifications
  const specTag = currentSpec?.tag || product.selectedSpecification?.tag || specifications.find(s => s.tag)?.tag;

  // Weight, packaging, and approx_count attributes
  const estWeightGrams =
    product.est_weight_grams ??
    product.estWeightGrams ??
    product.variants?.[0]?.est_weight_grams ??
    product.variants?.[0]?.estWeightGrams ??
    null;
  const packagingUnit =
    product.packaging_unit ??
    product.packagingUnit ??
    product.variants?.[0]?.packaging_unit ??
    product.variants?.[0]?.packagingUnit ??
    'g';
  const packaging = product.packaging || product.variants?.[0]?.packaging || '';
  const approxCount =
    product.approx_count ??
    product.approxCount ??
    product.variants?.[0]?.approx_count ??
    product.variants?.[0]?.approxCount ??
    null;

  // {"Approx "+{"est_weight_grams"}+{"unit"}+{"packaging"} with "unit" being column packaging_unit
  const packagingPart = packaging ? (packaging.startsWith(' ') ? packaging : ` ${packaging.trim()}`) : '';
  const weightPackagingText = estWeightGrams
    ? `Approx ${estWeightGrams}${packagingUnit}${packagingPart}`
    : (packaging ? `Approx ${packaging.trim()}` : product.unit);

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-stone-300">
      {/* Product Image Slot (decreased height: compact widescreen) */}
      <div className="relative h-36 sm:h-40 md:h-44 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Top right pill reads key "tag" from specifications column */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10 pointer-events-none">
          {specTag ? (
            <span className="text-[10px] font-semibold text-[#173b28] bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs border border-emerald-900/10">
              {specTag}
            </span>
          ) : product.organicCertified ? (
            <span className="text-[10px] font-semibold text-[#173b28] bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs">
              Organic
            </span>
          ) : null}
          {isOutOfStock && (
            <span className="text-[10px] font-semibold text-rose-700 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1.5">
          {/* 1. Product Name */}
          <h3 className="font-display font-semibold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2">
            {product.name}
          </h3>

          {/* 2. Weight & Packaging on left, Specifications Dropdown on the right */}
          <div className="flex items-center justify-between gap-2 pt-0.5 min-w-0">
            <div className="flex flex-col min-w-0 pr-1 truncate">
              <span
                className="text-xs text-stone-700 font-medium truncate"
                title={`${weightPackagingText}${approxCount ? ` (approx ${approxCount} pcs)` : ''}`}
              >
                {weightPackagingText}
              </span>
              {approxCount != null && (
                <span className="text-[10px] text-stone-500 font-normal leading-tight truncate">
                  approx {approxCount} pcs
                </span>
              )}
            </div>

            {/* Specifications Dropdown from product_variants.specifications jsonb */}
            {specifications.length > 0 && (
              <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                <select
                  value={selectedSpecIndex}
                  onChange={(e) => setSelectedSpecIndex(Number(e.target.value))}
                  className="appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-medium py-1 pl-2 pr-6 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-[#173b28] focus:border-[#173b28] cursor-pointer transition-colors shadow-2xs max-w-[155px] sm:max-w-[170px] truncate"
                  aria-label={`Select specification for ${product.name}`}
                >
                  {specifications.map((spec, idx) => {
                    const noteText = spec.note || formatSpecName(spec.product_specification || 'Standard');
                    return (
                      <option key={idx} value={idx} disabled={!spec.in_stock || spec.count <= 0}>
                        {noteText}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Specification Description with leading green icon */}
          {(currentSpec?.description || currentSpec?.note) && (
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium pt-0.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="truncate">{currentSpec.description || currentSpec.note}</span>
              {currentSpec.count > 0 && (
                <span className="text-[10px] text-stone-400 font-normal shrink-0">({currentSpec.count} left)</span>
              )}
            </div>
          )}
        </div>

        {/* Footer: Price on the left, Counter / Add CTA on the right in the same row */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline flex-wrap gap-1.5 sm:gap-2 min-w-0">
            {compareAtPrice != null && compareAtPrice > 0 && (
              <span className="font-mono text-sm sm:text-base text-stone-400 line-through tabular-nums leading-tight">
                kes {compareAtPrice.toLocaleString()}
              </span>
            )}
            <span className="font-mono font-extrabold text-xl sm:text-2xl text-stone-900 tabular-nums leading-tight tracking-tight">
              kes {displayPrice.toLocaleString()}
            </span>
          </div>

          {/* Compact Counter or Add CTA in the footer row */}
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {isOutOfStock ? (
              <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-400 text-[10px] font-medium">
                Restocking
              </span>
            ) : quantity > 0 ? (
              <div className="flex items-center bg-stone-100 rounded-lg border border-stone-200 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => updateQuantity(variantProduct, quantity - 1)}
                  className="w-6.5 h-6.5 flex items-center justify-center text-stone-700 hover:text-stone-900 active:scale-90 transition-transform cursor-pointer"
                  aria-label={`Decrease quantity of ${product.name}`}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center font-mono font-semibold text-xs text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => addToCart(variantProduct, 1)}
                  disabled={quantity >= currentStock}
                  className="w-6.5 h-6.5 flex items-center justify-center text-stone-700 hover:text-stone-900 active:scale-90 transition-transform cursor-pointer disabled:opacity-40"
                  aria-label={`Increase quantity of ${product.name}`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(variantProduct, 1)}
                className="h-7 px-2.5 rounded-lg bg-[#173b28] hover:bg-[#122e20] active:scale-95 text-white font-medium text-xs flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                aria-label={`Add ${product.name} to basket`}
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
