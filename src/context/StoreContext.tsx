import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, NairobiNeighborhood, CartItem, Order, Category, OrderStatus, SavedAddress } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { NAIROBI_NEIGHBORHOODS, DEFAULT_NEIGHBORHOOD } from '../data/neighborhoods';
import { INITIAL_SAVED_ADDRESSES } from '../data/savedAddresses';
import { SEED_ORDERS } from '../data/seedOrders';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (subcat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedNeighborhood: NairobiNeighborhood;
  setSelectedNeighborhood: (n: NairobiNeighborhood) => void;
  savedAddresses: SavedAddress[];
  setSavedAddresses: React.Dispatch<React.SetStateAction<SavedAddress[]>>;
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  activeSavedAddress: SavedAddress | undefined;
  selectAddress: (id: string) => void;
  addSavedAddress: (addr: Omit<SavedAddress, 'id'>) => SavedAddress;
  updateSavedAddress: (addr: SavedAddress) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  freeDeliveryRemaining: number;
  cartTotal: number;
  cartCount: number;
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    deliverySlot: string;
    dropoffNote?: string;
    paymentMethod: 'mpesa' | 'card' | 'cod';
    mpesaCode?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, riderDetails?: { riderName: string; riderPhone: string; riderVehicle: string }) => void;
  confirmOrderPayment: (orderId: string, mpesaCode: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  addNewProduct: (product: Omit<Product, 'id'>) => void;
  viewMode: 'store' | 'admin';
  setViewMode: (mode: 'store' | 'admin') => void;
  activeMobileTab: string;
  setActiveMobileTab: (tab: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isNeighborhoodModalOpen: boolean;
  setIsNeighborhoodModalOpen: (open: boolean) => void;
  isUtilitiesModalOpen: boolean;
  setIsUtilitiesModalOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (product: Product | null) => void;
  activeTrackOrder: Order | null;
  setActiveTrackOrder: (order: Order | null) => void;
  toast: { text: string; type?: 'success' | 'info' | 'warning' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state (saved to localStorage for persistence across reloads)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('greenspoon_products_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Selected Nairobi neighborhood
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NairobiNeighborhood>(() => {
    try {
      const saved = localStorage.getItem('greenspoon_neighborhood');
      if (saved) {
        const found = NAIROBI_NEIGHBORHOODS.find(n => n.id === JSON.parse(saved).id);
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_NEIGHBORHOOD;
  });

  // Saved addresses state (persisted)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem('greenspoon_saved_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAVED_ADDRESSES;
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('greenspoon_selected_address_id');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'home';
  });

  useEffect(() => {
    try {
      localStorage.setItem('greenspoon_saved_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.error(e);
    }
  }, [savedAddresses]);

  useEffect(() => {
    try {
      localStorage.setItem('greenspoon_selected_address_id', selectedAddressId);
    } catch (e) {
      console.error(e);
    }
  }, [selectedAddressId]);

  const activeSavedAddress = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];

  const selectAddress = (id: string) => {
    const addr = savedAddresses.find(a => a.id === id);
    if (!addr) return;
    setSelectedAddressId(id);

    // Sync neighborhood
    const regionLower = addr.region.toLowerCase();
    const matchingNeighborhood = NAIROBI_NEIGHBORHOODS.find(n => 
      n.name.toLowerCase().includes(regionLower) || 
      regionLower.includes(n.id.toLowerCase()) ||
      n.popularEstate.toLowerCase().includes(regionLower)
    );
    if (matchingNeighborhood) {
      setSelectedNeighborhood(matchingNeighborhood);
    }
    showToast(`Delivery location set to ${addr.label} (${addr.region})`, 'success');
  };

  const addSavedAddress = (newAddrData: Omit<SavedAddress, 'id'>): SavedAddress => {
    const newAddr: SavedAddress = {
      ...newAddrData,
      id: `addr_${Date.now()}`
    };
    setSavedAddresses(prev => [...prev, newAddr]);
    selectAddress(newAddr.id);
    return newAddr;
  };

  const updateSavedAddress = (updated: SavedAddress) => {
    setSavedAddresses(prev => prev.map(a => a.id === updated.id ? updated : a));
    showToast(`Updated "${updated.label}" address`, 'success');
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('greenspoon_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 2 }, // start with fresh avocados in cart for delightful first touch
      { product: INITIAL_PRODUCTS[1], quantity: 1 }  // and fresh organic greens
    ];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('greenspoon_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= SEED_ORDERS.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return SEED_ORDERS;
  });

  // Filters & Navigation
  const [selectedCategory, setSelectedCategoryState] = useState<Category>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const setSelectedCategory = (cat: Category) => {
    setSelectedCategoryState(cat);
    setSelectedSubcategory(null);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [activeMobileTab, setActiveMobileTab] = useState<string>('shop');

  // Modals & Panels
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  const [isUtilitiesModalOpen, setIsUtilitiesModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [activeTrackOrder, setActiveTrackOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ text: string; type?: 'success' | 'info' | 'warning' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('greenspoon_products_v3', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('greenspoon_neighborhood', JSON.stringify(selectedNeighborhood));
    } catch (e) {
      console.error(e);
    }
  }, [selectedNeighborhood]);

  useEffect(() => {
    try {
      localStorage.setItem('greenspoon_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('greenspoon_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeDelivery = cartSubtotal >= selectedNeighborhood.freeThreshold && cartSubtotal > 0;
  const deliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : selectedNeighborhood.deliveryFee;
  const freeDeliveryRemaining = Math.max(0, selectedNeighborhood.freeThreshold - cartSubtotal);
  const cartTotal = cartSubtotal + deliveryFee;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Handlers
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to basket`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Create Order
  const createOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    deliverySlot: string;
    dropoffNote?: string;
    paymentMethod: 'mpesa' | 'card' | 'cod';
    mpesaCode?: string;
  }): Promise<Order> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SF-${randomSuffix}`;
    const generatedMpesa = orderData.mpesaCode || `QKM${Math.floor(10000000 + Math.random() * 90000000)}WA`;

    const newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      neighborhood: selectedNeighborhood,
      deliveryAddress: orderData.deliveryAddress,
      deliverySlot: orderData.deliverySlot,
      dropoffNote: orderData.dropoffNote,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: 0,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod,
      mpesaCode: orderData.paymentMethod === 'mpesa' ? generatedMpesa : undefined,
      paymentStatus: 'paid',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    // Deduct stock from products
    setProducts(prev =>
      prev.map(prod => {
        const cartItem = cart.find(ci => ci.product.id === prod.id);
        if (cartItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartItem.quantity)
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveTrackOrder(newOrder);
    showToast(`Order #${newOrder.id} confirmed! Preparing harvest basket.`, 'success');

    return newOrder;
  };

  // Update order status (Admin / Dispatcher)
  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    riderDetails?: { riderName: string; riderPhone: string; riderVehicle: string }
  ) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        const now = new Date().toISOString();
        return {
          ...order,
          status,
          ...(riderDetails && {
            riderName: riderDetails.riderName,
            riderPhone: riderDetails.riderPhone,
            riderVehicle: riderDetails.riderVehicle,
            dispatchedAt: now
          }),
          ...(status === 'delivered' && { deliveredAt: now })
        };
      })
    );

    // Update active tracked order if currently viewing
    setActiveTrackOrder(curr => {
      if (curr && curr.id === orderId) {
        return {
          ...curr,
          status,
          ...(riderDetails && {
            riderName: riderDetails.riderName,
            riderPhone: riderDetails.riderPhone,
            riderVehicle: riderDetails.riderVehicle
          })
        };
      }
      return curr;
    });

    showToast(`Order #${orderId} marked as ${status.replace('_', ' ')}`);
  };

  // Confirm order M-Pesa payment
  const confirmOrderPayment = (orderId: string, mpesaCode: string) => {
    const validCode = mpesaCode.trim().toUpperCase() || `QKM${Math.floor(10000000 + Math.random() * 90000000)}WA`;
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          paymentStatus: 'paid',
          paymentMethod: 'mpesa',
          mpesaCode: validCode
        };
      })
    );
    setActiveTrackOrder(curr => {
      if (curr && curr.id === orderId) {
        return {
          ...curr,
          paymentStatus: 'paid',
          paymentMethod: 'mpesa',
          mpesaCode: validCode
        };
      }
      return curr;
    });
    showToast(`Payment confirmed: ${validCode}`, 'success');
  };

  // Inventory Updates
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    showToast('Inventory level updated');
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, price: Math.max(1, newPrice) } : p))
    );
    showToast('Product price adjusted');
  };

  const addNewProduct = (newProdData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to inventory`);
  };

  const categories: Category[] = [
    'All',
    'Veg',
    'Fruits',
    'Aromatics'
  ];

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        searchQuery,
        setSearchQuery,
        selectedNeighborhood,
        setSelectedNeighborhood,
        savedAddresses,
        setSavedAddresses,
        selectedAddressId,
        setSelectedAddressId,
        activeSavedAddress,
        selectAddress,
        addSavedAddress,
        updateSavedAddress,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        deliveryFee,
        freeDeliveryRemaining,
        cartTotal,
        cartCount,
        orders,
        createOrder,
        updateOrderStatus,
        confirmOrderPayment,
        updateProductStock,
        updateProductPrice,
        addNewProduct,
        viewMode,
        setViewMode,
        activeMobileTab,
        setActiveMobileTab,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isNeighborhoodModalOpen,
        setIsNeighborhoodModalOpen,
        isUtilitiesModalOpen,
        setIsUtilitiesModalOpen,
        isProfileOpen,
        setIsProfileOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        activeTrackOrder,
        setActiveTrackOrder,
        toast,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
