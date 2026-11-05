import type { Product } from '../types';

export const isSameCartItem = (a: Product, b: Product): boolean => {
  const sameProduct = a.id === b.id;

  const variantA = a.variantId ?? a.id;
  const variantB = b.variantId ?? b.id;
  const sameVariant = variantA === variantB;

  const allocationA = a.selectedSpecification;
  const allocationB = b.selectedSpecification;

  const allocationIdA = allocationA?.id ?? null;
  const allocationIdB = allocationB?.id ?? null;

  // Prefer stable allocation IDs whenever both are available.
  if (allocationIdA && allocationIdB) {
    return sameProduct && sameVariant && allocationIdA === allocationIdB;
  }

  // Fallback for older products/specifications without allocation IDs.
  const fallbackA = allocationA
    ? [
        allocationA.product_specification,
        allocationA.note ?? '',
        allocationA.price_adjustment ?? 0,
      ].join('::')
    : null;

  const fallbackB = allocationB
    ? [
        allocationB.product_specification,
        allocationB.note ?? '',
        allocationB.price_adjustment ?? 0,
      ].join('::')
    : null;

  return (
    sameProduct &&
    sameVariant &&
    fallbackA === fallbackB
  );
};