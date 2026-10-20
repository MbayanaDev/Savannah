import React, { useState, useMemo } from 'react';
import { Plus, Minus, Eye, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

interface ProductVariant {
  label: string;
  unit: string;
  priceMultiplier: number;
}

const getProductVariants = (p: Product): ProductVariant[] => {
  if (p.id === 'prod-spinach-kale') {
    return [
      { label: '500g bunch', unit: '500g crisp washed bunch', priceMultiplier: 1 },
      { label: '1 kg pack', unit: '1 kg family bunch', priceMultiplier: 1.85 },
      { label: '250g petite', unit: '250g single bunch', priceMultiplier: 0.6 }
    ];
  }
  if (p.id === 'prod-avocado-hass') {
    return [
      { label: '1 kg pack', unit: '1 kg pack (~4 ripe avocados)', priceMultiplier: 1 },
      { label: '2 kg family', unit: '2 kg box (~8 avocados)', priceMultiplier: 1.85 },
      { label: '500g snack', unit: '500g pack (~2 avocados)', priceMultiplier: 0.6 }
    ];
  }
  if (p.id === 'prod-sourdough-loaf') {
    return [
      { label: 'Whole loaf', unit: '750g stone-baked loaf', priceMultiplier: 1 },
      { label: 'Pre-sliced', unit: '750g artisan sliced loaf', priceMultiplier: 1 },
      { label: 'Half loaf', unit: '375g half loaf', priceMultiplier: 0.55 }
    ];
  }
  if (p.id === 'prod-heritage-eggs') {
    return [
      { label: 'Tray of 15', unit: 'Tray of 15 farm-fresh eggs', priceMultiplier: 1 },
      { label: 'Crate of 30', unit: 'Crate of 30 farm-fresh eggs', priceMultiplier: 1.9 },
      { label: 'Pack of 6', unit: 'Pack of 6 farm-fresh eggs', priceMultiplier: 0.45 }
    ];
  }
  if (p.id === 'prod-meadow-honey') {
    return [
      { label: '500g jar', unit: '500g unpasteurized glass jar', priceMultiplier: 1 },
      { label: '1 kg family', unit: '1 kg family glass jar', priceMultiplier: 1.85 },
      { label: '250g petite', unit: '250g taster jar', priceMultiplier: 0.55 }
    ];
  }
  if (p.unit.includes('kg')) {
    return [
      { label: 'Standard', unit: p.unit, priceMultiplier: 1 },
      { label: '2 kg family', unit: '2 kg bulk family pack', priceMultiplier: 1.85 },
      { label: '500g half', unit: '500g portion', priceMultiplier: 0.6 }
    ];
  }
  if (p.unit.includes('500g')) {
    return [
      { label: '500g bunch', unit: p.unit, priceMultiplier: 1 },
      { label: '1 kg pack', unit: '1 kg double pack', priceMultiplier: 1.85 },
      { label: '250g petite', unit: '250g portion', priceMultiplier: 0.6 }
    ];
  }
  return [
    { label: 'Standard', unit: p.unit, priceMultiplier: 1 },
    { label: 'Double pack', unit: `Double (${p.unit})`, priceMultiplier: 1.85 },
    { label: 'Single serve', unit: `Single (${p.unit})`, priceMultiplier: 0.6 }
  ];
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity, setSelectedProductDetail } = useStore();

  const variants = useMemo(() => getProductVariants(product), [product]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const currentVariant = variants[selectedVariantIndex] || variants[0];
  const displayedPrice = Math.round(product.price * currentVariant.priceMultiplier);
  const displayedUnit = currentVariant.unit;

  const variantProduct = useMemo(() => {
    if (currentVariant.priceMultiplier === 1 && currentVariant.unit === product.unit) {
      return product;
    }
    return {
      ...product,
      price: displayedPrice,
      unit: displayedUnit
    };
  }, [product, currentVariant, displayedPrice, displayedUnit]);

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-stone-300">
      {/* Product Image Slot (decreased height: compact widescreen) */}
      <div 
        onClick={() => setSelectedProductDetail(product)}
        className="relative h-36 sm:h-40 md:h-44 w-full bg-stone-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quiet top badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
          {product.organicCertified && (
            <span className="text-[10px] font-semibold text-[#173b28] bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs">
              Organic
            </span>
          )}
          {isLowStock && (
            <span className="text-[10px] font-semibold text-[#b85d38] bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] font-semibold text-rose-700 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick view hover icon on desktop */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProductDetail(product);
          }}
          className="hidden md:flex absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-[#173b28]"
          title="View farm & nutrition details"
          aria-label="View product details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1.5">
          {/* 1. Product Name */}
          <h3 
            onClick={() => setSelectedProductDetail(product)}
            className="font-display font-semibold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 cursor-pointer hover:text-[#173b28] transition-colors"
          >
            {product.name}
          </h3>

          {/* 2. SKU on the left, Dropdown for options/variants to the right */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-xs text-stone-600 font-normal truncate min-w-0" title={displayedUnit}>
              {displayedUnit}
            </span>

            {/* Options / Variants Dropdown */}
            <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
              <select
                value={selectedVariantIndex}
                onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                className="appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-medium py-1 pl-2.5 pr-6 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-[#173b28] focus:border-[#173b28] cursor-pointer transition-colors shadow-2xs"
                aria-label={`Select options or variants for ${product.name}`}
              >
                {variants.map((v, idx) => (
                  <option key={idx} value={idx}>
                    {v.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer: Price on the left, Counter / Add CTA on the right in the same row */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <span className="font-mono font-bold text-sm sm:text-base text-stone-900 tabular-nums">
            kes {displayedPrice.toLocaleString()}
          </span>

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
                  onClick={() => updateQuantity(product.id, quantity - 1)}
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
                  disabled={quantity >= product.stock}
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
