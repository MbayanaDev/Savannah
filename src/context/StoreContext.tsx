import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  Product,
  NairobiNeighborhood,
  DeliveryZone,
  CartItem,
  Order,
  Category,
  CategoryInfo,
  SubcategoryItem,
  OrderStatus,
  SavedAddress,
  UserProfile,
  ViewMode,
} from '../types';
import { INITIAL_PRODUCTS, CATEGORIES_CONFIG, SUBCATEGORIES_CONFIG } from '../data/products';
import { NAIROBI_NEIGHBORHOODS, DEFAULT_NEIGHBORHOOD } from '../data/neighborhoods';
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
import {
  cartToDatabaseRows,
  restoreCartFromDatabase,
  mergeCartItems,
} from '../lib/cartPersistence';

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

  deliveryZones: DeliveryZone[];
  isLoadingDeliveryZones: boolean;
  isLoadingAddresses: boolean;

  isCartReady: boolean;

  savedAddresses: SavedAddress[];
  selectedAddressId: string;
  activeSavedAddress: SavedAddress | undefined;

  selectAddress: (id: string) => void;

  addSavedAddress: (
    addr: Omit<SavedAddress, 'id' | 'isDefault'> & { isDefault?: boolean }
  ) => Promise<SavedAddress>;

  updateSavedAddress: (addr: SavedAddress) => Promise<void>;
  deleteSavedAddress: (id: string) => Promise<void>;
  setDefaultSavedAddress: (id: string) => Promise<void>;
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

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isCartReady, setIsCartReady] = useState(false);

  // Delivery zones are managed centrally in Supabase.
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [isLoadingDeliveryZones, setIsLoadingDeliveryZones] = useState(true);

  // Saved addresses belong to the authenticated customer.
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const mapCustomerAddress = (
    row: {
      id: string;
      label: string;
      street_road: string;
      delivery_zone_id: string;
      building_house_number: string | null;
      landmark: string | null;
      delivery_instructions: string | null;
      is_default: boolean;
    },
    zones: DeliveryZone[]
  ): SavedAddress => {
    const zone = zones.find(z => z.zone_id === row.delivery_zone_id);

    return {
      id: row.id,
      label: row.label,
      tag: row.label,
      street: row.street_road,
      region: zone?.name ?? row.delivery_zone_id,
      deliveryZoneId: row.delivery_zone_id,
      apartment: row.building_house_number ?? '',
      reference: row.landmark ?? '',
      instructions: row.delivery_instructions ?? '',
      isDefault: row.is_default,
      iconName: 'pin',
    };
  };

  // Load active delivery zones.
  useEffect(() => {
    let cancelled = false;

    const loadDeliveryZones = async () => {
      if (!supabase || !isSupabaseConfigured) {
        setDeliveryZones([]);
        setIsLoadingDeliveryZones(false);
        return;
      }

      setIsLoadingDeliveryZones(true);

      const { data, error } = await supabase
        .from('delivery_zones')
        .select(
          'zone_id, name, delivery_fee_minor, free_threshold_minor, express_available, is_active'
        )
        .eq('is_active', true)
        .order('name');

      if (cancelled) return;

      if (error) {
        console.error('[Supabase] Could not load delivery zones:', error);
        setDeliveryZones([]);
      } else {
        setDeliveryZones((data ?? []) as DeliveryZone[]);
      }

      setIsLoadingDeliveryZones(false);
    };

    void loadDeliveryZones();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load the address book whenever the authenticated user changes.
  useEffect(() => {
    let cancelled = false;

    const loadAddresses = async () => {
      if (!currentUser?.id || !supabase || !isSupabaseConfigured) {
        setSavedAddresses([]);
        setSelectedAddressId('');
        setIsLoadingAddresses(false);
        return;
      }

      setIsLoadingAddresses(true);

      const { data, error } = await supabase
        .from('customer_addresses')
        .select(`
          id,
          label,
          street_road,
          delivery_zone_id,
          building_house_number,
          landmark,
          delivery_instructions,
          is_default
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('[Supabase] Could not load saved addresses:', error);
        setSavedAddresses([]);
        setSelectedAddressId('');
      } else {
        const addresses = (data ?? []).map(row =>
          mapCustomerAddress(row, deliveryZones)
        );

        setSavedAddresses(addresses);

        const defaultAddress = addresses.find(address => address.isDefault);
        setSelectedAddressId(defaultAddress?.id ?? addresses[0]?.id ?? '');
      }

      setIsLoadingAddresses(false);
    };

    void loadAddresses();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, deliveryZones]);

  const activeSavedAddress = savedAddresses.find(
    address => address.id === selectedAddressId
  );

  const selectAddress = (id: string) => {
    const address = savedAddresses.find(item => item.id === id);

    if (!address) return;

    setSelectedAddressId(id);
    showToast(`Delivery location set to ${address.label}`, 'success');
  };

  const addSavedAddress: StoreContextType['addSavedAddress'] = async input => {
    if (!supabase || !currentUser?.id) {
      throw new Error('Please sign in before saving an address.');
    }

    const { data, error } = await supabase
      .from('customer_addresses')
      .insert({
        user_id: currentUser.id,
        label: input.label.trim(),
        street_road: input.street.trim(),
        delivery_zone_id: input.deliveryZoneId,
        building_house_number: input.apartment.trim() || null,
        landmark: input.reference.trim() || null,
        delivery_instructions: input.instructions.trim() || null,
        is_default: input.isDefault ?? savedAddresses.length === 0,
      })
      .select(`
        id,
        label,
        street_road,
        delivery_zone_id,
        building_house_number,
        landmark,
        delivery_instructions,
        is_default
      `)
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? 'Could not save address.');
    }

    const newAddress = mapCustomerAddress(data, deliveryZones);

    setSavedAddresses(previous => [
      ...previous.filter(address => address.id !== newAddress.id),
      newAddress,
    ]);

    if (newAddress.isDefault || !selectedAddressId) {
      setSelectedAddressId(newAddress.id);
    }

    showToast(`Saved "${newAddress.label}" address`, 'success');

    return newAddress;
  };

  const updateSavedAddress: StoreContextType['updateSavedAddress'] = async address => {
    if (!supabase || !currentUser?.id) {
      throw new Error('Please sign in before updating an address.');
    }

    const { data, error } = await supabase
      .from('customer_addresses')
      .update({
        label: address.label.trim(),
        street_road: address.street.trim(),
        delivery_zone_id: address.deliveryZoneId,
        building_house_number: address.apartment.trim() || null,
        landmark: address.reference.trim() || null,
        delivery_instructions: address.instructions.trim() || null,
        is_default: address.isDefault,
      })
      .eq('id', address.id)
      .eq('user_id', currentUser.id)
      .select(`
        id,
        label,
        street_road,
        delivery_zone_id,
        building_house_number,
        landmark,
        delivery_instructions,
        is_default
      `)
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? 'Could not update address.');
    }

    const updatedAddress = mapCustomerAddress(data, deliveryZones);

    setSavedAddresses(previous =>
      previous.map(item =>
        item.id === updatedAddress.id
          ? updatedAddress
          : updatedAddress.isDefault
            ? { ...item, isDefault: false }
            : item
      )
    );

    showToast(`Updated "${updatedAddress.label}" address`, 'success');
  };

  const deleteSavedAddress: StoreContextType['deleteSavedAddress'] = async id => {
    if (!supabase || !currentUser?.id) {
      throw new Error('Please sign in before deleting an address.');
    }

    const { error } = await supabase
      .from('customer_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', currentUser.id);

    if (error) {
      throw new Error(error.message);
    }

    // Reload because the database may have promoted another address
    // to default after deletion.
    const { data, error: reloadError } = await supabase
      .from('customer_addresses')
      .select(`
        id,
        label,
        street_road,
        delivery_zone_id,
        building_house_number,
        landmark,
        delivery_instructions,
        is_default
      `)
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: true });

    if (reloadError) {
      throw new Error(reloadError.message);
    }

    const addresses = (data ?? []).map(row =>
      mapCustomerAddress(row, deliveryZones)
    );

    setSavedAddresses(addresses);

    if (!addresses.some(address => address.id === selectedAddressId)) {
      const defaultAddress = addresses.find(address => address.isDefault);
      setSelectedAddressId(defaultAddress?.id ?? addresses[0]?.id ?? '');
    }

    showToast('Address deleted', 'success');
  };

  const setDefaultSavedAddress: StoreContextType['setDefaultSavedAddress'] =
    async id => {
      const address = savedAddresses.find(item => item.id === id);

      if (!address) {
        throw new Error('Address not found.');
      }

      await updateSavedAddress({
        ...address,
        isDefault: true,
      });

      setSelectedAddressId(id);
    };

  // Cart
  const cartSyncQueue = useRef<Promise<void>>(Promise.resolve());

  // Cart starts empty until the guest or account cart has been loaded.
  const [cart, setCart] = useState<CartItem[]>([]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('savannah_orders_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(
            (o: any) => o.id !== 'SF-89209' && o.id !== 'SF-89208'
          );
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


  // Sync Supabase Auth session if configured
  useEffect(() => {
    const client = supabase;

    if (!isSupabaseConfigured || !client) {
      setCurrentUser(null);
      setIsAuthReady(true);
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
      provider: 'google',
    });

    let active = true;

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setCurrentUser(
        session?.user ? toUserProfile(session.user) : null
      );
      setIsAuthReady(true);
    });

    client.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!active) return;

        if (error) {
          console.warn('[Auth] Could not restore session:', error.message);
          setCurrentUser(null);
        } else {
          setCurrentUser(
            session?.user ? toUserProfile(session.user) : null
          );
        }

        setIsAuthReady(true);
      })
      .catch((error) => {
        if (!active) return;

        console.warn('[Auth] Session initialization failed:', error);
        setCurrentUser(null);
        setIsAuthReady(true);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    let cancelled = false;

    const loadCart = async () => {
      setIsCartReady(false);

      // Guest cart: this browser only.
      if (!currentUser?.id) {
        try {
          const saved = localStorage.getItem('savannah_guest_cart');
          const guestCart: CartItem[] = saved ? JSON.parse(saved) : [];

          if (!cancelled) {
            setCart(Array.isArray(guestCart) ? guestCart : []);
            setIsCartReady(true);
          }
        } catch (error) {
          console.error('[Cart] Could not restore guest cart:', error);

          if (!cancelled) {
            setCart([]);
            setIsCartReady(true);
          }
        }

        return;
      }

      if (!supabase || !isSupabaseConfigured) {
        if (!cancelled) setIsCartReady(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_cart_items')
          .select(
            'user_id, variant_id, specification_allocation_id, quantity'
          )
          .eq('user_id', currentUser.id);

        if (error) throw error;

        const accountCart = restoreCartFromDatabase(
          data ?? [],
          products
        );

        const guestCart: CartItem[] = JSON.parse(
          localStorage.getItem('savannah_guest_cart') || '[]'
        );

        const mergedCart = mergeCartItems(accountCart, guestCart);

        // Save the merged cart before removing the guest copy.
        const rows = cartToDatabaseRows(currentUser.id, mergedCart);

        if (rows.length > 0) {
          const { error: saveError } = await supabase
            .from('user_cart_items')
            .upsert(rows, {
              onConflict:
                'user_id,variant_id,specification_allocation_id',
            });

          if (saveError) throw saveError;
        }

        if (cancelled) return;

        localStorage.removeItem('savannah_guest_cart');
        setCart(mergedCart);
        setIsCartReady(true);
      } catch (error) {
        console.error('[Cart] Could not restore account cart:', error);
        if (!cancelled) {
          showToast(
            'Could not load your saved cart. Please refresh and try again.',
            'warning'
          );
        }
      }
    };

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, [isAuthReady, currentUser?.id, isSupabaseLive, products]);

  useEffect(() => {
    // Only synchronize after authentication and cart hydration are complete.
    if (
      !isAuthReady ||
      !isCartReady ||
      !currentUser?.id ||
      !supabase ||
      !isSupabaseConfigured
    ) {
      return;
    }

    const userId = currentUser.id;
    const cartSnapshot = cart;

    cartSyncQueue.current = cartSyncQueue.current
      .catch(() => {
        // Keep the queue usable after a previous failed synchronization.
      })
      .then(async () => {
        if (!supabase) return;

        // Read existing rows so we can remove items no longer in the cart.
        const { data: existingRows, error: readError } = await supabase
          .from('user_cart_items')
          .select(
            'variant_id, specification_allocation_id'
          )
          .eq('user_id', userId);

        if (readError) throw readError;

        // Convert the current cart to database rows.
        const rows = cartToDatabaseRows(userId, cartSnapshot);

        // Save current items first.
        if (rows.length > 0) {
          const { error: upsertError } = await supabase
            .from('user_cart_items')
            .upsert(rows, {
              onConflict:
                'user_id,variant_id,specification_allocation_id',
            });

          if (upsertError) throw upsertError;
        }

        // Identify database rows that are no longer in the cart.
        const currentKeys = new Set(
          rows.map(
            row =>
              `${row.variant_id}::${row.specification_allocation_id}`
          )
        );

        const staleRows = (existingRows ?? []).filter(
          row =>
            !currentKeys.has(
              `${row.variant_id}::${row.specification_allocation_id}`
            )
        );

        // Delete only stale rows belonging to this user.
        for (const row of staleRows) {
          const { error: deleteError } = await supabase
            .from('user_cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('variant_id', row.variant_id)
            .eq(
              'specification_allocation_id',
              row.specification_allocation_id
            );

          if (deleteError) throw deleteError;
        }
      })
      .catch(error => {
        console.error('[Cart] Account synchronization failed:', error);

        showToast(
          'Your cart could not be synced. Please check your connection.',
          'warning'
        );
      });
  }, [
    cart,
    currentUser?.id,
    isAuthReady,
    isCartReady,
  ]);

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
    if (!isAuthReady || currentUser || !isCartReady) return;

    try {
      localStorage.setItem(
        'savannah_guest_cart',
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error('[Cart] Could not save guest cart:', error);
    }
  }, [cart, currentUser, isAuthReady, isCartReady]);

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
    if (quantity <= 0) return;

    quantity = Math.min(1000, Math.floor(quantity));

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

    quantity = Math.min(1000, Math.floor(quantity));

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

    if (
      isLoadingAddresses ||
      !selectedAddressId ||
      !activeSavedAddress ||
      activeSavedAddress.id !== selectedAddressId
    ) {
      throw new Error(
        'Please select a saved delivery address before placing your order.'
      );
    }

    const { data: createdOrderId, error: orderError } = await supabase.rpc(
      'create_order',
      {
        p_items: rpcItems,
        p_shipping_address: {
          address_id: selectedAddressId,
          delivery_method: orderData.deliveryMethod,
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
    clearCart();

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
        deliveryZones,
        isLoadingDeliveryZones,
        isLoadingAddresses,
        savedAddresses,
        selectedAddressId,
        activeSavedAddress,
        selectAddress,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultSavedAddress,
        cart,
        isCartReady,
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
