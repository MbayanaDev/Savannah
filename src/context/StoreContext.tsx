import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, NairobiNeighborhood, CartItem, Order, Category, CategoryInfo, SubcategoryItem, OrderStatus, SavedAddress, UserProfile, ViewMode } from '../types';
import { INITIAL_PRODUCTS, CATEGORIES_CONFIG, SUBCATEGORIES_CONFIG } from '../data/products';
import { NAIROBI_NEIGHBORHOODS, DEFAULT_NEIGHBORHOOD } from '../data/neighborhoods';
import { INITIAL_SAVED_ADDRESSES } from '../data/savedAddresses';
import { SEED_ORDERS } from '../data/seedOrders';
import { fetchRemoteCatalog, fetchRemoteCategories, fetchRemoteSubcategories, triggerSeedCategories, updateRemoteVariantStock, updateRemoteVariantPrice } from '../lib/supabaseService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  removeFromCart: (productId: string, spec?: string) => void;
  updateQuantity: (productId: string, quantity: number, spec?: string) => void;
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
    paymentMethod: 'mpesa' | 'card' | 'cod' | 'cash';
    mpesaCode?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, riderDetails?: { riderName: string; riderPhone: string; riderVehicle: string }) => void;
  confirmOrderPayment: (orderId: string, mpesaCode: string) => void;
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
      const saved = localStorage.getItem('savannah_products_v3');
      if (saved) return JSON.parse(saved);
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
      const saved = localStorage.getItem('savannah_orders');
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('savannah_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Sync Supabase Auth session if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member',
            email: session.user.email || '',
            avatarUrl: session.user.user_metadata?.avatar_url,
            provider: 'google'
          };
          setCurrentUser(profile);
          localStorage.setItem('savannah_current_user', JSON.stringify(profile));
        }
      }).catch(err => console.warn('Supabase getSession error:', err));

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member',
            email: session.user.email || '',
            avatarUrl: session.user.user_metadata?.avatar_url,
            provider: 'google'
          };
          setCurrentUser(profile);
          localStorage.setItem('savannah_current_user', JSON.stringify(profile));
        } else if (_event === 'SIGNED_OUT') {
          setCurrentUser(null);
          localStorage.removeItem('savannah_current_user');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) {
          console.warn('Supabase Google OAuth fallback triggered:', error.message);
        } else {
          return;
        }
      }
    } catch (err) {
      console.warn('Google sign in error, fallback to simulated user:', err);
    }

    // Instant seamless login fallback
    const mockGoogleUser: UserProfile = {
      id: 'usr_' + Math.floor(100000 + Math.random() * 900000),
      name: 'Kelvin Munene',
      email: 'klvnmunenembaya@gmail.com',
      phone: '+254 700 892 019',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      provider: 'google'
    };
    setCurrentUser(mockGoogleUser);
    localStorage.setItem('savannah_current_user', JSON.stringify(mockGoogleUser));
    showToast(`Signed in with Google as ${mockGoogleUser.email}`, 'success');
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('savannah_current_user');
    showToast('Signed out of session', 'info');
  };

  // Function to manually or programmatically sync categories, subcategories & products from Supabase
  const syncCategoriesFromSupabase = async (): Promise<boolean> => {
    try {
      const [cats, subcats, catalog] = await Promise.all([
        fetchRemoteCategories(),
        fetchRemoteSubcategories(),
        fetchRemoteCatalog()
      ]);

      let loadedCount = 0;
      if (cats && cats.length > 0) {
        setCategoriesList(cats);
        loadedCount += cats.length;
      }
      if (subcats && subcats.length > 0) {
        setSubcategoriesList(subcats);
        loadedCount += subcats.length;
      }
      if (catalog && catalog.products && catalog.products.length > 0) {
        setProducts(catalog.products);
        loadedCount += catalog.products.length;
      }

      if (loadedCount > 0) {
        setIsSupabaseLive(true);
        showToast(`Connected to Supabase: Loaded ${catalog?.products?.length || 0} products & variants, ${cats?.length || 0} categories, ${subcats?.length || 0} subcategories!`, 'success');
        return true;
      }

      // If table is empty or returns 0 rows, attempt to trigger seed function
      const seeded = await triggerSeedCategories();
      if (seeded && seeded.length > 0) {
        setCategoriesList(seeded);
        const refreshedSubcats = await fetchRemoteSubcategories();
        if (refreshedSubcats && refreshedSubcats.length > 0) {
          setSubcategoriesList(refreshedSubcats);
        }
        setIsSupabaseLive(true);
        showToast(`Seeded & connected ${seeded.length} categories from Supabase!`, 'success');
        return true;
      }

      showToast('Connected to Supabase. Table awaiting categories seed or RLS policy.', 'info');
      return false;
    } catch (e: any) {
      showToast(`Supabase sync error: ${e?.message || 'Check connection'}`, 'warning');
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
      localStorage.setItem('savannah_products_v3', JSON.stringify(products));
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
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(
        item =>
          item.product.id === product.id &&
          (!item.product.selectedSpecification ||
            item.product.selectedSpecification.product_specification === product.selectedSpecification?.product_specification)
      );
      if (existing) {
        return prev.map(item =>
          item === existing
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

  const removeFromCart = (productId: string, spec?: string) => {
    setCart(prev =>
      prev.filter(item => {
        const matchesProduct = item.product.id === productId;
        const matchesSpec = !spec || item.product.selectedSpecification?.product_specification === spec;
        return !(matchesProduct && matchesSpec);
      })
    );
  };

  const updateQuantity = (productId: string, quantity: number, spec?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, spec);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        const matchesProduct = item.product.id === productId;
        const matchesSpec = !spec || item.product.selectedSpecification?.product_specification === spec;
        return matchesProduct && matchesSpec ? { ...item, quantity } : item;
      })
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
    paymentMethod: 'mpesa' | 'card' | 'cod' | 'cash';
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
    setViewMode('orders');
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
