import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, MapPin, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { isSameCartItem } from '../lib/cartIdentity';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    freeDeliveryRemaining,
    cartTotal,
    selectedNeighborhood,
    activeSavedAddress,
    setIsNeighborhoodModalOpen,
    setIsCheckoutOpen
  } = useStore();

  if (!isCartOpen) return null;

  const freeDeliveryProgress = Math.min(
    100,
    Math.round((cartSubtotal / selectedNeighborhood.freeThreshold) * 100)
  );

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
      <div 
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-4 pt-3 pb-2 sm:px-5 sm:pt-3.5 sm:pb-2.5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#173b28]/10 text-[#173b28] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#173b28]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900 leading-tight">
                Your Cart
              </h3>
              <div className="text-xs text-stone-500">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Delivery & Shipping Threshold Bar */}
        <div className="px-4 py-2.5 sm:px-5 bg-[#FAF8F5] border-b border-stone-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-stone-600 min-w-0 pr-2">
                <MapPin className="w-3.5 h-3.5 text-[#173b28] shrink-0" />
                <span 
                  className="font-medium truncate max-w-[190px]"
                  title={activeSavedAddress ? `${activeSavedAddress.label} · ${activeSavedAddress.apartment}, ${activeSavedAddress.region}` : selectedNeighborhood.name}
                >
                  {activeSavedAddress ? `${activeSavedAddress.label} (${activeSavedAddress.region})` : selectedNeighborhood.name}
                </span>
              </div>
              <button
                onClick={() => setIsNeighborhoodModalOpen(true)}
                className="text-[11px] text-[#173b28] font-medium underline underline-offset-2 hover:text-[#122e20] cursor-pointer shrink-0"
              >
                Change Area
              </button>
            </div>

            {/* Free shipping progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-600">
                  {freeDeliveryRemaining > 0 ? (
                    <>Add <span className="font-bold font-mono text-[#173b28]">KES {freeDeliveryRemaining.toLocaleString()}</span> for free delivery</>
                  ) : (
                    <span className="font-semibold text-[#173b28] flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Qualified for FREE delivery!
                    </span>
                  )}
                </span>
                <span className="font-mono text-stone-500">{freeDeliveryProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#173b28] transition-all duration-300 rounded-full"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2.5 sm:px-5 sm:py-3 space-y-2 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-semibold text-stone-800 text-base">Your basket is empty</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Fill it up with fresh Limuru greens, ripe Murang&apos;a avocados, or sourdough bread from Tigoni.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 bg-[#173b28] text-white text-xs font-semibold rounded-xl hover:bg-[#122e20] transition-colors cursor-pointer"
                >
                  Explore Fresh Harvest
                </button>
              </div>
            ) : (
              <>
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-2 first:pt-0 flex items-center gap-3">
                    {/* Thumbnail */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                      referrerPolicy="no-referrer"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-stone-900 text-xs sm:text-sm line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="text-[11px] text-stone-500 truncate flex items-center gap-1.5 flex-wrap">
                        <span>{product.unit}</span>
                        {product.selectedSpecification && (
                          <span className="text-[10px] text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {product.selectedSpecification.product_specification.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            {product.selectedSpecification.note ? ` · ${product.selectedSpecification.note}` : ''}
                          </span>
                        )}
                      </div>
                      <div className="font-mono font-bold text-xs sm:text-sm text-stone-900 mt-1 tabular-nums">
                        KES {(product.price * quantity).toLocaleString()}
                        {quantity > 1 && (
                          <span className="text-[10px] text-stone-400 font-normal ml-1">
                            (@ KES {product.price})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Delete/remove button to the right below of counter */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center bg-stone-100 rounded-lg border border-stone-200 p-0.5">
                        <button
                          onClick={() => updateQuantity(product, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono font-semibold text-xs text-stone-900 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer disabled:opacity-40"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete/remove icon button to the right below of the counter */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(product)}
                        className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title={`Remove ${product.name}`}
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Clear CTA at bottom of cart item area */}
                <div className="pt-2 pb-0.5 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} total {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-stone-400 hover:text-rose-600 font-medium flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Clear all items from cart"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Produce Subtotal</span>
                  <span className="font-mono tabular-nums text-stone-900 font-medium">
                    KES {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>
                    Delivery ({selectedNeighborhood.name})
                  </span>
                  <span className="font-mono tabular-nums font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-[#173b28] font-bold">FREE</span>
                    ) : (
                      `KES ${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-[#173b28]">
                    KES {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full min-h-[48px] px-6 rounded-xl bg-[#173b28] hover:bg-[#122e20] active:scale-98 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
  );
};
