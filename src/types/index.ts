export type Category = 'All' | 'Veg' | 'Fruits' | 'Aromatics' | string;

export type ViewMode = 'store' | 'admin' | 'about' | 'faqs' | 'purpose' | 'privacy' | 'terms' | 'refunds' | 'blog' | 'arcana' | 'orders';

export interface CategoryInfo {
  id: Category;
  label: string;
  image: string;
  tagline: string;
  slug?: string;
}

export interface SubcategoryItem {
  id: string;
  name: string;
  category: Category;
  categoryId?: string;
  image: string;
  slug?: string;
  subcategoryId?: string;
  description?: string;
}

export interface VariantSpecification {
  product_specification: string;
  count: number;
  in_stock: boolean;
  note?: string;
  description?: string;
  price_adjustment?: number;
  tag?: string;
  is_default?: boolean;
  isDefault?: boolean;
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  stockQuantity: number;
  isDefault: boolean;
  unitQuantity?: number | null;
  weightGrams?: number | null;
  estWeightGrams?: number | null;
  est_weight_grams?: number | null;
  packaging?: string | null;
  packaging_unit?: string | null;
  packagingUnit?: string | null;
  approxCount?: number | string | null;
  approx_count?: number | string | null;
  skuUnitId?: string | null;
  barcode?: string | null;
  specifications?: VariantSpecification[];
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory?: string;
  subcategoryId?: string;
  categoryId?: string;
  productCode?: string | null;
  sku?: string;
  variantId?: string;
  brand?: string | null;
  slug?: string;
  origin: string; // e.g. "Limuru Highland Farm, Kiambu"
  price: number; // in KES
  compareAtPrice?: number | null;
  unit: string; // e.g. "per kg", "500g punnet", "750g loaf", "1L bottle"
  stock: number;
  lowStockThreshold: number;
  image: string;
  harvestTime: string; // e.g. "Today 5:30 AM"
  organicCertified: boolean;
  description: string;
  storageTip: string;
  nutrition: string[];
  popular?: boolean;
  estWeightGrams?: number | null;
  est_weight_grams?: number | null;
  packaging?: string | null;
  packaging_unit?: string | null;
  packagingUnit?: string | null;
  approxCount?: number | string | null;
  approx_count?: number | string | null;
  specifications?: VariantSpecification[];
  selectedSpecification?: VariantSpecification;
  variants?: ProductVariantItem[];
}

export interface NairobiNeighborhood {
  id: string;
  name: string;
  zone: 'West' | 'Central' | 'North' | 'South' | 'Karen & Suburbs';
  deliveryFee: number; // in KES
  freeThreshold: number; // in KES
  minMins: number;
  maxMins: number;
  expressAvailable: boolean;
  popularEstate: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  tag: string;
  iconName?: 'home' | 'work' | 'friend' | 'family' | 'pin';
  street: string;
  region: string;
  apartment: string;
  reference: string;
  instructions: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'new' | 'packing' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  neighborhood: NairobiNeighborhood;
  deliveryAddress: string;
  deliverySlot: string;
  dropoffNote?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'mpesa' | 'card' | 'cod' | 'cash';
  mpesaCode?: string;
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  createdAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
}

export interface OrderAnalytics {
  totalRevenue: number;
  ordersCount: number;
  averageOrderValue: number;
  activeCartsCount: number;
  neighborhoodBreakdown: { name: string; count: number; revenue: number }[];
  categoryRevenue: { category: string; revenue: number }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  provider: 'google' | 'guest';
}
