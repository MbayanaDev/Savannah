import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, NairobiNeighborhood, CartItem, Order, Category, CategoryInfo, SubcategoryItem, OrderStatus, SavedAddress, UserProfile, ViewMode } from '../types';
import { INITIAL_PRODUCTS, CATEGORIES_CONFIG, SUBCATEGORIES_CONFIG } from '../data/products';
import { NAIROBI_NEIGHBORHOODS, DEFAULT_NEIGHBORHOOD } from '../data/neighborhoods';
import { INITIAL_SAVED_ADDRESSES } from '../data/savedAddresses';
import { SEED_ORDERS } from '../data/seedOrders';
import {
  fetchRemoteCatalog,
  fetchRemoteCategories,
  fetchRemoteSubcategories,
  updateRemoteVariantStock,
  updateRemoteVariantPrice
} from '../lib/supabaseService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { isSameCartItem } from '../lib/cartIdentity';
import { mapDatabaseOrder } from '../lib/orderMappers';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  currentUser: UserProfile | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  categoriesList: CategoryInfo[];
  subcategoriesList: SubcategoryItem[];
  isSupabaseLive: boolean;
  syncCategoriesFromSupabase: () => Promise<boolean>;
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

  removeFromCart: (product: Product) => void;
  updateQuantity: (product: Product, quantity: number) => void;

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
    deliveryAddress: string;
    deliverySlot: string;
    deliveryMethod: 'express' | 'scheduled';
    dropoffNote?: string;
  }) => Promise<Order>;

  initiateKcbPayment: (
    orderId: string,
    phoneNumber: string,
    idempotencyKey: string
  ) => Promise<{
    paymentId?: string;
    status: string;
    message?: string;
    error?: string;
    providerCode?: string;
  }>;

  updateOrderStatus: (orderId: string, status: OrderStatus, riderDetails?: { riderName: string; riderPhone: string; riderVehicle: string }) => void;
  deleteOrder: (orderId: string) => void;

  updateProductStock: (productId: string, newStock: number) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  addNewProduct: (product: Omit<Product, 'id'>) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
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
      const saved = localStorage.getItem('savannah_products_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep product 0 image in sync with latest assets
          if (parsed[0]?.id === INITIAL_PRODUCTS[0].id) {
            parsed[0].image = INITIAL_PRODUCTS[0].image;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Selected Nairobi neighborhood
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NairobiNeighborhood>(() => {
    try {
      const saved = localStorage.getItem('savannah_neighborhood');
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
      const saved = localStorage.getItem('savannah_saved_addresses');
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
      const saved = localStorage.getItem('savannah_selected_address_id');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'home';
  });

  useEffect(() => {
    try {
      localStorage.setItem('savannah_saved_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.error(e);
    }
  }, [savedAddresses]);

  useEffect(() => {
    try {
      localStorage.setItem('savannah_selected_address_id', selectedAddressId);
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
      const saved = localStorage.getItem('savannah_cart');
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
      const saved = localStorage.getItem('savannah_orders_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((o: any) => o.id !== 'SF-89209' && o.id !== 'SF-89208');
          localStorage.setItem('savannah_orders_v4', JSON.stringify(filtered));
          return filtered;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return SEED_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('savannah_orders_v4', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Filters & Navigation
  const [selectedCategory, setSelectedCategoryState] = useState<Category>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const setSelectedCategory = (cat: Category) => {
    setSelectedCategoryState(cat);
    setSelectedSubcategory(null);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewModeState] = useState<ViewMode>('store');
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
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
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [categoriesList, setCategoriesList] = useState<CategoryInfo[]>(CATEGORIES_CONFIG);
  const [subcategoriesList, setSubcategoriesList] = useState<SubcategoryItem[]>(SUBCATEGORIES_CONFIG);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Sync Supabase Auth session if configured
  useEffect(() => {
    const client = supabase;

    if (!isSupabaseConfigured || !client) {
      setCurrentUser(null);
      return;
    }

    const toUserProfile = (user: User): UserProfile => ({
      id: user.id,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'Member',
      email: user.email || '',
      avatarUrl: user.user_metadata?.avatar_url,
      provider: 'google'
    });

    let active = true;

    client.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!active) return;

        if (error) {
          console.warn('Supabase session error:', error.message);
          setCurrentUser(null);
          return;
        }

        setCurrentUser(
          session?.user ? toUserProfile(session.user) : null
        );
      }).catch((error) => {
        if (!active) return;
        console.warn('Supabase session error:', error);
        setCurrentUser(null);
      });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setCurrentUser(
        session?.user ? toUserProfile(session.user) : null
      );
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    if (!isSupabaseConfigured || !supabase) {
      showToast(
        'Authentication is not configured. Please try again later.',
        'warning'
      );
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Google OAuth error:', error.message);
        showToast('Could not start Google sign-in. Please try again.', 'warning');
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      showToast('Google sign-in failed. Please try again.', 'warning');
    }
  };

  const signOut = async () => {
    if (!supabase || !isSupabaseConfigured) {
      setCurrentUser(null);
      showToast('Authentication is not configured.', 'warning');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase sign-out error:', error.message);
        showToast('Could not sign out. Please try again.', 'warning');
        return;
      }

      setCurrentUser(null);
      showToast('Signed out successfully.', 'info');
    } catch (error) {
      console.error('Sign-out failed:', error);
      showToast('Could not sign out. Please try again.', 'warning');
    }
  };


  const syncCategoriesFromSupabase = async (): Promise<boolean> => {
    try {
      const [cats, subcats, catalog] = await Promise.all([
        fetchRemoteCategories(),
        fetchRemoteSubcategories(),
        fetchRemoteCatalog()
      ]);

      let loadedCount = 0;

      if (cats?.length) {
        setCategoriesList(cats);
        loadedCount += cats.length;
      }

      if (subcats?.length) {
        setSubcategoriesList(subcats);
        loadedCount += subcats.length;
      }

      if (catalog?.products?.length) {
        setProducts(catalog.products);
        loadedCount += catalog.products.length;
      }

      if (loadedCount > 0) {
        setIsSupabaseLive(true);
        showToast(
          `Connected to Supabase: ${catalog?.products?.length ?? 0} products, ${cats?.length ?? 0} categories and ${subcats?.length ?? 0} subcategories loaded.`,
          'success'
        );
        return true;
      }

      showToast(
        'Connected to Supabase, but no remote catalog data was returned. Using local fallback data.',
        'info'
      );
      return false;
    } catch (error) {
      console.error('[Supabase] Catalog sync failed:', error);
      showToast('Supabase sync failed. Check the connection and database permissions.', 'warning');
      return false;
    }
  };

  // Load live categories, subcategories and catalog from Supabase if configured
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch categories directly from Supabase public.categories
    fetchRemoteCategories()
      .then(cats => {
        if (!isMounted || !cats || cats.length === 0) return;
        setCategoriesList(cats);
        setIsSupabaseLive(true);
        console.log(`[Supabase] Successfully loaded ${cats.length} categories from remote database.`);
      })
      .catch(err => {
        console.warn('[Supabase] Category fetch error:', err);
      });

    // 2. Fetch subcategories directly from Supabase public.subcategories
    fetchRemoteSubcategories()
      .then(subcats => {
        if (!isMounted || !subcats || subcats.length === 0) return;
        setSubcategoriesList(subcats);
        setIsSupabaseLive(true);
        console.log(`[Supabase] Successfully loaded ${subcats.length} subcategories from remote database.`);
      })
      .catch(err => {
        console.warn('[Supabase] Subcategory fetch error:', err);
      });

    // 3. Fetch full catalog (products, variants, subcategories)
    fetchRemoteCatalog()
      .then(result => {
        if (!isMounted || !result) return;
        if (result.categories && result.categories.length > 0) {
          setCategoriesList(result.categories);
        }
        if (result.subcategories && result.subcategories.length > 0) {
          setSubcategoriesList(result.subcategories);
        }
        if (result.products && result.products.length > 0) {
          setProducts(result.products);
        }
        setIsSupabaseLive(true);
      })
      .catch(err => {
        console.warn('[Supabase] Remote catalog fetch failed, using local catalog:', err);
      });

    // 4. Setup Supabase Realtime subscriptions on public.categories, public.subcategories, public.products, and public.product_variants
    let catChannel: any = null;
    let subcatChannel: any = null;
    let prodChannel: any = null;
    let varChannel: any = null;
    if (isSupabaseConfigured && supabase) {
      try {
        catChannel = supabase
          .channel('public:categories')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'categories' },
            () => {
              fetchRemoteCategories().then(updatedCats => {
                if (updatedCats && updatedCats.length > 0) {
                  setCategoriesList(updatedCats);
                  showToast('Categories updated live from Supabase', 'info');
                }
              });
            }
          )
          .subscribe();

        subcatChannel = supabase
          .channel('public:subcategories')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'subcategories' },
            () => {
              fetchRemoteSubcategories().then(updatedSubcats => {
                if (updatedSubcats && updatedSubcats.length > 0) {
                  setSubcategoriesList(updatedSubcats);
                  showToast('Subcategories updated live from Supabase', 'info');
                }
              });
            }
          )
          .subscribe();

        varChannel = supabase
          .channel('public:product_variants')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'product_variants' },
            () => {
              fetchRemoteCatalog().then(catalog => {
                if (catalog && catalog.products && catalog.products.length > 0) {
                  setProducts(catalog.products);
                  showToast('Products updated live from Supabase variants', 'info');
                }
              });
            }
          )
          .subscribe();

        prodChannel = supabase
          .channel('public:products')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            () => {
              fetchRemoteCatalog().then(catalog => {
                if (catalog && catalog.products && catalog.products.length > 0) {
                  setProducts(catalog.products);
                }
              });
            }
          )
          .subscribe();
      } catch (e) {
        console.warn('[Supabase] Realtime subscription error:', e);
      }
    }

    return () => {
      isMounted = false;
      if (supabase) {
        if (catChannel) supabase.removeChannel(catChannel);
        if (subcatChannel) supabase.removeChannel(subcatChannel);
        if (varChannel) supabase.removeChannel(varChannel);
        if (prodChannel) supabase.removeChannel(prodChannel);
      }
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savannah_products_v4', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('savannah_neighborhood', JSON.stringify(selectedNeighborhood));
    } catch (e) {
      console.error(e);
    }
  }, [selectedNeighborhood]);

  useEffect(() => {
    try {
      localStorage.setItem('savannah_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('savannah_orders', JSON.stringify(orders));
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

  const getCartIdentity = (product: Product) => ({
    productId: product.id,
    variantId: product.variantId ?? product.id,
    allocationId:
      product.selectedSpecification?.id ??
      (product.selectedSpecification
        ? `${product.selectedSpecification.product_specification}::${product.selectedSpecification.note ?? ''}`
        : null)
  });

  const isSameCartItem = (a: Product, b: Product): boolean => {
    const first = getCartIdentity(a);
    const second = getCartIdentity(b);

    return (
      first.productId === second.productId &&
      first.variantId === second.variantId &&
      first.allocationId === second.allocationId
    );
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (quantity <= 0) return;

    setCart(prev => {
      const existing = prev.find(item =>
        isSameCartItem(item.product, product)
      );

      if (existing) {
        return prev.map(item =>
          isSameCartItem(item.product, product)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { product, quantity }];
    });

    const specLabel = product.selectedSpecification
      ? ` (${product.selectedSpecification.product_specification.replace(/_/g, ' ')})`
      : '';

    showToast(`Added ${product.name}${specLabel} to basket`);
  };

  const removeFromCart = (product: Product) => {
    setCart(prev =>
      prev.filter(item => !isSameCartItem(item.product, product))
    );
  };

  const updateQuantity = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        isSameCartItem(item.product, product)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };


  // Create an order through the database.
  // Payment initiation is a separate operation and is not performed here.
  const createOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliverySlot: string;
    deliveryMethod: 'express' | 'scheduled';
    dropoffNote?: string;
  }): Promise<Order> => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('The database connection is not available.');
    }

    if (!currentUser?.id) {
      throw new Error('Please sign in before placing an order.');
    }

    if (cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      throw new Error('Your session has expired. Please sign in again.');
    }

    const userId = authData.user.id;

    // The create_order RPC reads the customer's name and phone from profiles.
    // Omit mpesa_phone so an existing M-Pesa-specific number is preserved.
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          display_name: orderData.customerName.trim(),
          phone: orderData.customerPhone.trim(),
        },
        { onConflict: 'id' }
      );

    if (profileError) {
      throw new Error(`Could not save your contact details: ${profileError.message}`);
    }

    const rpcItems = cart.map(({ product, quantity }) => {
      const variantId = product.variantId ?? product.id;
      const allocationId = product.selectedSpecification?.id;

      if (!allocationId) {
        throw new Error(
          `Please reselect the specification for "${product.name}" before checkout.`
        );
      }

      return {
        variant_id: variantId,
        specification_allocation_id: allocationId,
        quantity,
      };
    });

    const { data: createdOrderId, error: orderError } = await supabase.rpc(
      'create_order',
      {
        p_items: rpcItems,
        p_shipping_address: {
          neighborhood_id: selectedNeighborhood.id,
          delivery_method: orderData.deliveryMethod,
          address: orderData.deliveryAddress.trim(),
          delivery_slot: orderData.deliverySlot,
        },
        p_customer_note: orderData.dropoffNote?.trim() || undefined,
      }
    );

    if (orderError) {
      throw new Error(`Could not create your order: ${orderError.message}`);
    }

    if (!createdOrderId) {
      throw new Error('The database did not return an order ID.');
    }

    // The order now exists. Read its authoritative totals and item snapshots.
    const { data: orderRow, error: readOrderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', createdOrderId)
      .single();

    if (readOrderError || !orderRow) {
      // Do not leave the cart ready for accidental duplicate submission:
      // the RPC has already created the order.
      clearCart();
      setIsCheckoutOpen(false);
      setViewMode('orders');

      throw new Error(
        `Your order was created (${createdOrderId}), but its details could not be loaded. Check Orders before trying again.`
      );
    }

    const { data: itemRows, error: readItemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', createdOrderId);

    if (readItemsError || !itemRows) {
      clearCart();
      setIsCheckoutOpen(false);
      setViewMode('orders');

      throw new Error(
        `Your order was created (${createdOrderId}), but its items could not be loaded. Check Orders before trying again.`
      );
    }

    const newOrder = mapDatabaseOrder(orderRow, itemRows, products);

    setOrders(prev =>
      [newOrder,
        ...prev.filter(order => order.id !== newOrder.id)
      ]);
    setActiveTrackOrder(newOrder);

    return newOrder;
  };

  const initiateKcbPayment: StoreContextType['initiateKcbPayment'] =
    async (orderId, phoneNumber, idempotencyKey) => {
      if (!supabase || !isSupabaseConfigured) {
        throw new Error('The database connection is not available.');
      }

      const { data, error } = await supabase.functions.invoke<{
        paymentId?: string;
        status: string;
        message?: string;
        error?: string;
        providerCode?: string;
      }>('kcb-stk-push', {
        body: {
          orderId,
          phoneNumber,
          idempotencyKey,
        },
      });

      if (error) {
        // An HTTP response may contain an explicit provider rejection.
        const response = (error as { context?: Response }).context;

        if (response instanceof Response) {
          const payload = await response.json().catch(() => null);

          if (
            payload?.status === 'failed' ||
            payload?.status === 'unknown'
          ) {
            return payload;
          }
        }

        // A network/relay error does not prove that KCB rejected the request.
        return {
          status: 'unknown',
          error: 'Payment confirmation is uncertain. Do not retry automatically.',
        };
      }

      if (!data || typeof data.status !== 'string') {
        return {
          status: 'unknown',
          error: 'No reliable payment status was returned.',
        };
      }

      return data;
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

  // Delete / Remove order
  const deleteOrder = (orderId: string) => {
    setOrders(prev => {
      const updated = prev.filter(order => order.id !== orderId);
      try {
        localStorage.setItem('savannah_orders_v4', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setActiveTrackOrder(curr => (curr && curr.id === orderId ? null : curr));
    showToast(`Order #${orderId} removed`, 'info');
  };


  // Inventory Updates
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    if (isSupabaseLive) {
      updateRemoteVariantStock(productId, newStock);
    }
    showToast('Inventory level updated');
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, price: Math.max(1, newPrice) } : p))
    );
    if (isSupabaseLive) {
      updateRemoteVariantPrice(productId, newPrice);
    }
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
    ...Array.from(new Set(categoriesList.map(c => c.id).filter(id => id !== 'All')))
  ];

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        categoriesList,
        subcategoriesList,
        isSupabaseLive,
        syncCategoriesFromSupabase,
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
        initiateKcbPayment,
        updateOrderStatus,
        deleteOrder,
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
        currentUser,
        signInWithGoogle,
        signOut,
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
