export type Category = 'All' | 'Veg' | 'Fruits' | 'Aromatics';

export interface CategoryInfo {
  id: Category;
  label: string;
  image: string;
  tagline: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory?: string;
  origin: string; // e.g. "Limuru Highland Farm, Kiambu"
  price: number; // in KES
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
