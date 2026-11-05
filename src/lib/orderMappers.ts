import type { Database } from '../types/database.generated';
import type {
  CartItem,
  NairobiNeighborhood,
  Order,
  OrderStatus,
  Product,
  VariantSpecification,
} from '../types';
import { DEFAULT_NEIGHBORHOOD, NAIROBI_NEIGHBORHOODS } from '../data/neighborhoods';

type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];

type JsonObject = Record<string, unknown>;

const asObject = (value: unknown): JsonObject => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonObject;
  }

  return {};
};

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const mapOrderStatus = (status: string): OrderStatus => {
  switch (status) {
    case 'pending_payment':
      return 'pending_payment';
    case 'new':
    case 'confirmed':
      return 'new';
    case 'packing':
      return 'packing';
    case 'out_for_delivery':
      return 'out_for_delivery';
    case 'delivered':
      return 'delivered';
    default:
      // Unknown backend states must not be presented as fulfilled.
      return 'pending_payment';
  }
};

const mapNeighborhood = (shipping: JsonObject): NairobiNeighborhood => {
  const neighborhoodId = asString(shipping.neighborhood_id);

  const configuredNeighborhood = NAIROBI_NEIGHBORHOODS.find(
    (neighborhood) => neighborhood.id === neighborhoodId
  );

  if (configuredNeighborhood) {
    return configuredNeighborhood;
  }

  const fallback = DEFAULT_NEIGHBORHOOD;

  return {
    ...fallback,
    id: neighborhoodId || fallback.id,
    name: asString(shipping.neighborhood_name, fallback.name),
  };
};

const mapSpecification = (
  value: unknown
): VariantSpecification | undefined => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  const specification = value as JsonObject;

  const productSpecification = asString(
    specification.product_specification
  );

  if (!productSpecification) {
    return undefined;
  }

  return {
    id: asString(specification.id) || undefined,
    product_specification: productSpecification,
    count: asNumber(specification.count),
    in_stock: specification.in_stock === true,
    price_adjustment: asNumber(specification.price_adjustment),
    is_default: specification.is_default === true,
    note: asString(specification.note) || undefined,
    description: asString(specification.description) || undefined,
  };
};

const mapOrderItem = (
  item: OrderItemRow,
  catalog: Product[]
): CartItem => {
  const matchingProduct = catalog.find(
    (product) =>
      product.variantId === item.product_variant_id ||
      product.variants?.some(
        (variant) => variant.id === item.product_variant_id
      )
  );

  const specification = mapSpecification(item.specification_snapshot);

  const unitPriceKes = item.unit_price_minor / 100;

  const product: Product = matchingProduct
    ? {
        ...matchingProduct,
        price: unitPriceKes,
        variantId: item.product_variant_id ?? matchingProduct.variantId,
        sku: item.sku_snapshot ?? matchingProduct.sku,
        selectedSpecification: specification,
      }
    : {
        id: item.product_variant_id ?? item.id,
        variantId: item.product_variant_id ?? undefined,
        name: item.product_name_snapshot,
        category: 'All',
        sku: item.sku_snapshot ?? undefined,
        origin: '',
        price: unitPriceKes,
        unit: 'item',
        stock: 0,
        lowStockThreshold: 0,
        image: '',
        harvestTime: '',
        organicCertified: false,
        description: '',
        storageTip: '',
        nutrition: [],
        selectedSpecification: specification,
      };

  return {
    product,
    quantity: item.quantity,
  };
};

export const mapDatabaseOrder = (
  order: OrderRow,
  items: OrderItemRow[],
  catalog: Product[]
): Order => {
  const shipping = asObject(order.shipping_address_snapshot);

  const deliveryAddress = asString(shipping.address);
  const deliverySlot = asString(
    shipping.delivery_slot,
    asString(shipping.delivery_method, 'Scheduled delivery')
  );

  return {
    id: order.id,
    orderNumber: order.order_number ?? undefined,

    customerName: order.customer_name_snapshot ?? '',
    customerPhone: order.customer_phone_snapshot ?? '',
    customerEmail: order.customer_email_snapshot ?? '',

    neighborhood: mapNeighborhood(shipping),
    deliveryAddress,
    deliverySlot,
    dropoffNote: order.customer_note ?? undefined,

    items: items.map((item) => mapOrderItem(item, catalog)),

    subtotal: order.subtotal_minor / 100,
    deliveryFee: order.delivery_fee_minor / 100,
    discount: order.discount_minor / 100,
    total: (order.total_minor ?? 0) / 100,

    paymentMethod: 'none',
    paymentStatus: 'not_started',

    status: mapOrderStatus(order.status),
    createdAt: order.created_at,
  };
};