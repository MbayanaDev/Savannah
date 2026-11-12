
import type { CartItem, Product } from '../types';

export interface UserCartRow {
  user_id: string;
  variant_id: string;
  specification_allocation_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID_PATTERN.test(value);

export const cartItemKey = (product: Product): string => {
  const variantId = product.variantId ?? product.id;
  const allocationId = product.selectedSpecification?.id;

  return `${variantId}::${allocationId ?? ''}`;
};

export const cartToDatabaseRows = (
  userId: string,
  cart: CartItem[]
): UserCartRow[] => {
  const now = new Date().toISOString();

  return cart.map(({ product, quantity }) => {
    const variantId = product.variantId ?? product.id;
    const allocationId = product.selectedSpecification?.id;

    if (!isUuid(variantId) || !isUuid(allocationId)) {
      throw new Error(
        `Cannot save "${product.name}" to your account cart because its variant or specification ID is missing. Please reselect it.`
      );
    }

    return {
      user_id: userId,
      variant_id: variantId,
      specification_allocation_id: allocationId,
      quantity: Math.min(1000, Math.max(1, Math.floor(quantity))),
      updated_at: now,
    };
  });
};

export const restoreCartFromDatabase = (
  rows: UserCartRow[],
  products: Product[]
): CartItem[] => {
  const restored: CartItem[] = [];

  for (const row of rows) {
    const product = products.find(
      item => (item.variantId ?? item.id) === row.variant_id
    );

    if (!product) {
      console.warn(
        '[Cart] Product variant not found in catalogue:',
        row.variant_id
      );
      continue;
    }

    const specification = product.specifications?.find(
      item => item.id === row.specification_allocation_id
    );

    if (!specification) {
      console.warn(
        '[Cart] Specification allocation not found:',
        row.specification_allocation_id
      );
      continue;
    }

    const basePrice = product.price;

    restored.push({
      product: {
        ...product,
        selectedSpecification: specification,
        price: Math.max(
          0,
          basePrice + Number(specification.price_adjustment ?? 0)
        ),
        stock: specification.in_stock ? specification.count : 0,
      },
      quantity: row.quantity,
    });
  }

  return restored;
};

export const mergeCartItems = (
  accountCart: CartItem[],
  guestCart: CartItem[]
): CartItem[] => {
  const merged = [...accountCart];

  for (const guestItem of guestCart) {
    const key = cartItemKey(guestItem.product);
    const existing = merged.find(
      item => cartItemKey(item.product) === key
    );

    if (existing) {
      existing.quantity = Math.min(
        1000,
        existing.quantity + guestItem.quantity
      );
    } else {
      merged.push(guestItem);
    }
  }

  return merged;
};
