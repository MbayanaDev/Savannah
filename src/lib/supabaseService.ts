import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Category, CategoryInfo, SubcategoryItem, ProductVariantItem, VariantSpecification } from '../types';
import { CategoryRow, SubcategoryRow, ProductRow, ProductVariantRow } from '../types/database';
import { CATEGORIES_CONFIG } from '../data/products';

export interface RemoteCatalogResult {
  products: Product[];
  categories: CategoryInfo[];
  subcategories: SubcategoryItem[];
  fromDatabase: boolean;
}

/**
 * Fetch categories specifically from Supabase public.categories table
 * with fallback to fn_get_categories RPC if direct SELECT is restricted by RLS.
 */
export async function fetchRemoteCategories(): Promise<CategoryInfo[] | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    let rows: CategoryRow[] = [];

    // 1. Try direct SELECT on public.categories
    const { data: rawCats, error: catError } = await supabase
      .from('categories')
      .select('*')
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!catError && rawCats && rawCats.length > 0) {
      rows = rawCats as unknown as CategoryRow[];
    }

    if (rows.length === 0) {
      return null;
    }

    // Sort rows by sort_order
    rows.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    // Deduplicate 'All' if it is already in the database
    const hasAllInDb = rows.some(c => c.name.toLowerCase() === 'all' || c.slug.toLowerCase() === 'all');
    const categories: CategoryInfo[] = [
      ...(hasAllInDb
        ? []
        : [
            {
              id: 'All' as Category,
              label: 'All',
              image: '/icons/categories/all.png',
              tagline: 'Full Farm Harvest',
              slug: 'all'
            }
          ]),
      ...rows.map(c => {
        const isAll = c.name.toLowerCase() === 'all' || c.slug.toLowerCase() === 'all';
        return {
          id: c.name as Category,
          label: c.name,
          image: isAll ? '/icons/categories/all.png' : (c.image_url || '/icons/categories/all.png'),
          tagline: c.description || `${c.name} fresh from farm`,
          slug: c.slug
        };
      })
    ];

    return categories;
  } catch (err) {
    console.warn('[Supabase] Failed to fetch categories:', err);
    return null;
  }
}

/**
 * Fetch subcategories specifically from Supabase public.subcategories table
 * with relational category mapping and automatic fallback by category ID and slug.
 */
export async function fetchRemoteSubcategories(): Promise<SubcategoryItem[] | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    // 1. Fetch live active subcategories
    const { data: rawSubcats, error: subcatError } = await supabase
      .from('subcategories')
      .select('*')
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (subcatError) {
      console.warn('[Supabase] Failed to load subcategories:', subcatError.message);
      return null;
    }

    const rows = (rawSubcats || []) as unknown as SubcategoryRow[];
    if (rows.length === 0) {
      return null;
    }

    // 2. Fetch categories for name mapping
    const { data: rawCats } = await supabase
      .from('categories')
      .select('id, name, slug')
      .is('deleted_at', null);

    const catIdToName = new Map<string, string>();
    if (rawCats) {
      rawCats.forEach((c: any) => {
        catIdToName.set(c.id, c.name);
      });
    }

    // Helper to resolve parent Category
    const resolveCategory = (row: SubcategoryRow): Category => {
      if (row.category_id && catIdToName.has(row.category_id)) {
        return catIdToName.get(row.category_id) as Category;
      }
      const slug = (row.slug || '').toLowerCase();
      if (['cooking-staples', 'salads-crunchy-greens', 'staple-greens', 'pods-legumes'].includes(slug)) {
        return 'Veg';
      }
      if (['tropical-staples', 'citrus-juicing', 'orchard-berries'].includes(slug)) {
        return 'Fruits';
      }
      if (['fresh-aromatics', 'fresh-herbs'].includes(slug)) {
        return 'Aromatics';
      }
      // Check known user category IDs:
      // 'd54bb4bf-9351-4b65-be84-8fe4c6c5e007' -> Veg
      // 'a2c5bba0-1bdb-44d9-8fbf-c7c08ab450e7' -> Aromatics
      if (row.category_id === 'd54bb4bf-9351-4b65-be84-8fe4c6c5e007') return 'Veg';
      if (row.category_id === 'a2c5bba0-1bdb-44d9-8fbf-c7c08ab450e7') return 'Aromatics';
      return 'Veg';
    };

    const subcategories: SubcategoryItem[] = rows.map(s => ({
      id: s.name,
      name: s.name,
      category: resolveCategory(s),
      categoryId: s.category_id,
      subcategoryId: s.id,
      slug: s.slug,
      description: s.description || undefined,
      image: s.image_url || '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg'
    }));

    return subcategories;
  } catch (err) {
    console.warn('[Supabase] Error fetching subcategories:', err);
    return null;
  }
}


/**
 * High-definition farm produce fallback images when image_url is null in Supabase.
 */
export function getProduceImageFallback(name: string, sku?: string | null): string {
  const text = `${name} ${sku || ''}`.toLowerCase();
  if (text.includes('banana') || text.includes('candish') || text.includes('ban-')) {
    return 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('avocado') || text.includes('fuerte') || text.includes('hass') || text.includes('avo-')) {
    return 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80';
  }
  if (
    text.includes('dhania') ||
    text.includes('coriander') ||
    text.includes('herbs') ||
    text.includes('rosemary') ||
    text.includes('thyme') ||
    text.includes('mint') ||
    text.includes('parsley')
  ) {
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('potato') || text.includes('irish')) {
    return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('carrot')) {
    return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('onion')) {
    return 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('tomato')) {
    return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('cucumber')) {
    return 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('lettuce') || text.includes('crunchy') || text.includes('salad')) {
    return 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('spinach') || text.includes('kale') || text.includes('sukuma')) {
    return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('egg')) {
    return 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('milk') || text.includes('dairy')) {
    return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('sourdough') || text.includes('bread')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('passion')) {
    return 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('mango')) {
    return 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('honey')) {
    return 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80';
  }
  return '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg';
}

/**
 * Cleanly format packaging unit from variant name and weight in grams
 */
export function formatVariantUnit(
  name: string,
  estWeightGrams?: number | null,
  unitQuantity?: number | string | null
): string {
  const lower = name.toLowerCase();
  const weight = estWeightGrams ? Number(estWeightGrams) : null;
  if (weight && weight > 0) {
    if (lower.includes('bunch')) {
      return `${weight}g fresh bunch`;
    }
    if (lower.includes('pair')) {
      return `Pair (~${weight}g)`;
    }
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} kg pack`;
    }
    return `${weight}g portion`;
  }
  if (lower.includes('bunch')) return '1 fresh bunch';
  if (lower.includes('pair')) return '1 pair (2 pcs)';
  if (unitQuantity) {
    const qty = Number(unitQuantity);
    if (!isNaN(qty) && qty > 0) {
      return `${qty} unit`;
    }
  }
  return 'per pack';
}

/**
 * Resolve Category from name or SKU keyword matches
 */
export function resolveCategoryByNameOrSku(name: string, sku?: string | null): Category {
  const text = `${name} ${sku || ''}`.toLowerCase();
  if (
    text.includes('herb') ||
    text.includes('dhania') ||
    text.includes('coriander') ||
    text.includes('rosemary') ||
    text.includes('thyme') ||
    text.includes('mint') ||
    text.includes('parsley') ||
    text.includes('aromatic') ||
    text.includes('garlic') ||
    text.includes('ginger') ||
    text.includes('chili') ||
    text.includes('chillies')
  ) {
    return 'Aromatics';
  }
  if (
    text.includes('banana') ||
    text.includes('candish') ||
    text.includes('ban-') ||
    text.includes('avocado') ||
    text.includes('fuerte') ||
    text.includes('hass') ||
    text.includes('avo-') ||
    text.includes('fruit') ||
    text.includes('berry') ||
    text.includes('mango') ||
    text.includes('citrus') ||
    text.includes('orange') ||
    text.includes('lemon') ||
    text.includes('passion')
  ) {
    return 'Fruits';
  }
  return 'Veg';
}

/**
 * Resolve Subcategory from name or SKU keyword matches
 */
export function resolveSubcategoryByNameOrSku(name: string, sku?: string | null): string {
  const text = `${name} ${sku || ''}`.toLowerCase();
  if (
    text.includes('herb') ||
    text.includes('dhania') ||
    text.includes('coriander') ||
    text.includes('rosemary') ||
    text.includes('thyme') ||
    text.includes('mint') ||
    text.includes('parsley')
  ) {
    return 'Fresh Herbs';
  }
  if (
    text.includes('garlic') ||
    text.includes('ginger') ||
    text.includes('chili') ||
    text.includes('chillies')
  ) {
    return 'Fresh Aromatics';
  }
  if (
    text.includes('banana') ||
    text.includes('candish') ||
    text.includes('ban-') ||
    text.includes('avocado') ||
    text.includes('fuerte') ||
    text.includes('avo-') ||
    text.includes('mango') ||
    text.includes('papaya')
  ) {
    return 'Tropical Staples';
  }
  if (
    text.includes('citrus') ||
    text.includes('lemon') ||
    text.includes('orange') ||
    text.includes('lime') ||
    text.includes('passion')
  ) {
    return 'Citrus & Juicing';
  }
  if (text.includes('berry') || text.includes('apple') || text.includes('strawberry')) {
    return 'Orchard & Berries';
  }
  if (
    text.includes('potato') ||
    text.includes('onion') ||
    text.includes('carrot') ||
    text.includes('sourdough') ||
    text.includes('bread') ||
    text.includes('milk') ||
    text.includes('egg')
  ) {
    return 'Cooking Staples';
  }
  if (
    text.includes('tomato') ||
    text.includes('cucumber') ||
    text.includes('lettuce') ||
    text.includes('salad') ||
    text.includes('crunchy')
  ) {
    return 'Salads & Crunchy Greens';
  }
  if (
    text.includes('spinach') ||
    text.includes('kale') ||
    text.includes('sukuma') ||
    text.includes('greens') ||
    text.includes('managu')
  ) {
    return 'Staple Greens';
  }
  if (
    text.includes('bean') ||
    text.includes('pea') ||
    text.includes('snap') ||
    text.includes('legume')
  ) {
    return 'Pods & Legumes';
  }
  return 'Cooking Staples';
}

/**
 * Default specifications mapping per variant SKU matching public.product_variants.specifications
 */
export const DEFAULT_VARIANT_SPECIFICATIONS: Record<string, VariantSpecification[]> = {
  'BAN-CANDISH-RIPE-MD-BUN': [
    {
      product_specification: 'ripe',
      count: 20,
      in_stock: true,
      is_default: true,
      isDefault: true,
      note: 'Ready to eat',
      description: 'All ripe ready to eat',
      price_adjustment: 10,
      tag: 'Ready to Eat'
    },
    {
      product_specification: 'ripe',
      count: 10,
      in_stock: true,
      note: 'Arcana Farm Batch',
      description: 'Sourced from a partner farm',
      price_adjustment: 30,
      tag: 'Partner Farm'
    },
    {
      product_specification: 'staged_ripeness',
      count: 5,
      in_stock: true,
      note: 'Staged Ripe',
      description: 'Bananas of varied ripeness',
      price_adjustment: 0,
      tag: 'Staged Ripe'
    },
    {
      product_specification: 'mature_unripe',
      count: 5,
      in_stock: true,
      note: 'Arcana Fulfillment Batch',
      description: 'Adopt ugly honest food',
      price_adjustment: -10,
      tag: 'Fulfillment Batch'
    }
  ],
  'AVO-HASS-RIPE-MD-PAIR': [
    {
      product_specification: 'ripe',
      count: 25,
      in_stock: true,
      note: 'Ready to eat',
      description: 'Creamy and ready to slice today',
      price_adjustment: 0,
      tag: 'In Season'
    }
  ],
  'AVO-FUERTE-HRIPE-LG-PC': [
    {
      product_specification: 'half_ripe',
      count: 18,
      in_stock: true,
      note: 'Ripens in 2 days',
      description: 'Semi-firm, ripens nicely on the counter',
      price_adjustment: -5.0,
      tag: 'Highland Fresh'
    }
  ],
  'AVO-KIENYEJI-URIPE-XL-5': [
    {
      product_specification: 'mature_unripe',
      count: 30,
      in_stock: true,
      note: 'Ripen at home',
      description: 'Firm harvest, will mature over the week',
      price_adjustment: -10.0,
      tag: 'Farm Direct'
    }
  ],
  'BAN-CANDISH-RIPE-SM-3PC': [
    {
      product_specification: 'ripe',
      count: 50,
      in_stock: true,
      note: 'Ready to eat',
      description: 'Naturally sweetened and ready to enjoy',
      price_adjustment: 0,
      tag: 'Sweet Harvest'
    }
  ],
  'BAN-SWEET-RIPE-SM-BUN': [
    {
      product_specification: 'ripe',
      count: 20,
      in_stock: true,
      note: 'Ready to eat',
      description: 'Rich sweetness, perfect breakfast portion',
      price_adjustment: 0,
      tag: 'Bestseller'
    }
  ]
};

/**
 * Safely parse specifications jsonb array from product_variants
 */
export function parseVariantSpecifications(
  rawSpecs: any,
  sku?: string | null,
  fallbackStock = 24
): VariantSpecification[] {
  let specs: any[] = [];
  if (Array.isArray(rawSpecs)) {
    specs = rawSpecs;
  } else if (typeof rawSpecs === 'string') {
    try {
      const parsed = JSON.parse(rawSpecs);
      if (Array.isArray(parsed)) specs = parsed;
    } catch {
      // ignore
    }
  }

  if (specs.length === 0 && sku && DEFAULT_VARIANT_SPECIFICATIONS[sku]) {
    specs = DEFAULT_VARIANT_SPECIFICATIONS[sku];
  }

  if (specs.length === 0) {
    specs = [
      {
        product_specification: 'ripe',
        count: fallbackStock > 0 ? fallbackStock : 24,
        in_stock: fallbackStock > 0,
        note: 'Ready to eat',
        description: 'Ready to eat fresh produce',
        price_adjustment: 0,
        tag: 'Fresh Harvest'
      }
    ];
  }

  return specs.map((item: any) => ({
    id: typeof item.id === 'string' ? item.id : undefined,
    product_specification: item.product_specification || 'ripe',
    count: typeof item.count === 'number' ? item.count : fallbackStock,
    in_stock: item.in_stock !== undefined ? Boolean(item.in_stock) : true,
    is_default: item.is_default !== undefined ? Boolean(item.is_default) : Boolean(item.isDefault),
    isDefault: item.is_default !== undefined ? Boolean(item.is_default) : Boolean(item.isDefault),
    note: item.note || undefined,
    description: item.description || item.note || undefined,
    price_adjustment:
      typeof item.price_adjustment === 'number'
        ? item.price_adjustment
        : Number(item.price_adjustment) || 0,
    tag: item.tag || item.Tag || undefined
  }));
}

/**
 * Fetch categories, subcategories, products and product variants from Supabase
 * matching public.categories, public.subcategories, public.products, public.product_variants.
 * Accurately parses numeric price strings, compare_at_price, cost_price, and est_weight_grams.
 */
export async function fetchRemoteCatalog(): Promise<RemoteCatalogResult | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    // 1. Fetch live active categories
    const formattedCategories = await fetchRemoteCategories();

    // Raw categories for relational mapping
    const { data: rawCats } = await supabase
      .from('categories')
      .select('*')
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    const catRows = (rawCats || []) as unknown as CategoryRow[];

    // 2. Fetch live active subcategories
    const remoteSubcats = await fetchRemoteSubcategories();
    const { data: rawSubcats, error: subcatError } = await supabase
      .from('subcategories')
      .select('*')
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (subcatError) {
      console.warn('[Supabase] Failed to load subcategories:', subcatError.message);
    }

    const subcatRows = (rawSubcats || []) as unknown as SubcategoryRow[];

    // 3. Fetch active products
    const { data: rawProds, error: prodError } = await supabase
      .from('products')
      .select('*')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (prodError) {
      console.warn('[Supabase] Failed to load products:', prodError.message);
    }

    const productRows = (rawProds || []) as unknown as ProductRow[];

    // 4. Fetch active product variants
    const { data: rawVariants, error: varError } = await supabase
      .from('product_variants')
      .select('*')
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (varError) {
      console.warn('[Supabase] Failed to load product variants:', varError.message);
    }

    const variantRows = (rawVariants || []) as unknown as ProductVariantRow[];

    // Categories fallback to config if DB categories are not loaded
    const categories =
      formattedCategories && formattedCategories.length > 0
        ? formattedCategories
        : CATEGORIES_CONFIG;

    // Build category map: category_id -> CategoryRow
    const catMap = new Map<string, CategoryRow>();
    catRows.forEach(c => catMap.set(c.id, c));

    // Build subcategory map: subcategory_id -> SubcategoryRow
    const subcatMap = new Map<string, SubcategoryRow>();
    subcatRows.forEach(s => subcatMap.set(s.id, s));

    // Build products map: product_id -> ProductRow
    const prodMap = new Map<string, ProductRow>();
    productRows.forEach(p => prodMap.set(p.id, p));

    // Map SubcategoryItems
    const subcategories: SubcategoryItem[] =
      remoteSubcats && remoteSubcats.length > 0
        ? remoteSubcats
        : subcatRows.map(s => {
            const parentCat = catMap.get(s.category_id);
            return {
              id: s.name,
              name: s.name,
              category: (parentCat?.name || resolveCategoryByNameOrSku(s.name, s.slug)) as Category,
              categoryId: s.category_id,
              subcategoryId: s.id,
              image: s.image_url || getProduceImageFallback(s.name, s.slug),
              slug: s.slug,
              description: s.description || undefined
            };
          });

    const mappedProducts: Product[] = [];

    // The products displayed on the storefront are strictly sourced from public.product_variants
    for (const v of variantRows) {
      const parentProduct = v.product_id ? prodMap.get(v.product_id) : undefined;
      const sub = parentProduct ? subcatMap.get(parentProduct.subcategory_id) : undefined;
      const cat = sub ? catMap.get(sub.category_id) : undefined;

      const vWeight = v.est_weight_grams ?? v.weight_grams;
      const vPackagingUnit = (v as any).packaging_unit || (parentProduct as any)?.packaging_unit || 'g';
      const vPackaging = (v as any).packaging || (parentProduct as any)?.packaging || (
        v.name.toLowerCase().includes('bunch') ? 'bunch' :
        v.name.toLowerCase().includes('pair') ? 'pair' :
        v.name.toLowerCase().includes('punnet') ? 'punnet' :
        v.name.toLowerCase().includes('loaf') ? 'loaf' :
        v.name.toLowerCase().includes('bottle') ? 'bottle' :
        v.name.toLowerCase().includes('tray') ? 'tray' :
        v.name.toLowerCase().includes('bag') ? 'bag' : 'pack'
      );
      const vApproxCount = (v as any).approx_count ?? (parentProduct as any)?.approx_count ?? (
        v.name.toLowerCase().includes('pair') ? 2 :
        v.name.toLowerCase().includes('3pc') ? 3 :
        v.name.toLowerCase().includes('5') ? 5 : null
      );
      const vPrice =
        typeof v.price === 'string' ? parseFloat(v.price) : Number(v.price) || 0;

      const vStock = Math.max(0, Number(v.stock_quantity ?? 0));

      const vUnit = formatVariantUnit(v.name, vWeight, v.unit_quantity);
      const vImage =
        v.image_url ||
        parentProduct?.image_url ||
        getProduceImageFallback(v.name, v.sku);
      const vCategory = (cat?.name ||
        resolveCategoryByNameOrSku(v.name, v.sku)) as Category;
      const vSubcategory =
        sub?.name || resolveSubcategoryByNameOrSku(v.name, v.sku);

      const parsedSpecs = parseVariantSpecifications(v.specifications, v.sku, vStock);

      const defaultSpec =
        parsedSpecs.find(spec => spec.is_default ?? spec.isDefault) ??
        parsedSpecs[0];

      const variantItem: ProductVariantItem = {
        id: v.id,
        sku: v.sku,
        name: v.name,
        price: vPrice,
        compareAtPrice: v.compare_at_price
          ? typeof v.compare_at_price === 'string'
            ? parseFloat(v.compare_at_price)
            : Number(v.compare_at_price)
          : null,
        costPrice: v.cost_price
          ? typeof v.cost_price === 'string'
            ? parseFloat(v.cost_price)
            : Number(v.cost_price)
          : null,
        stockQuantity: defaultSpec && typeof defaultSpec.count === 'number' ? defaultSpec.count : vStock,
        isDefault: v.is_default,
        unitQuantity: v.unit_quantity ? Number(v.unit_quantity) : null,
        weightGrams: vWeight ?? null,
        estWeightGrams: vWeight ?? null,
        est_weight_grams: vWeight ?? null,
        packaging: vPackaging,
        packaging_unit: vPackagingUnit,
        packagingUnit: vPackagingUnit,
        approxCount: vApproxCount,
        approx_count: vApproxCount,
        skuUnitId: v.sku_unit_id,
        barcode: v.barcode,
        specifications: parsedSpecs
      };

      mappedProducts.push({
        id: v.id,
        name: v.name,
        category: vCategory,
        categoryId: sub?.category_id,
        subcategory: vSubcategory,
        subcategoryId: parentProduct?.subcategory_id,
        sku: v.sku,
        variantId: v.id,
        productCode: parentProduct?.product_code || v.sku,
        brand: parentProduct?.brand || 'Arcana Harvest',
        slug: parentProduct?.slug || v.sku.toLowerCase(),
        origin: parentProduct?.brand || 'Tigoni & Limuru Highland Farms',
        price: vPrice,
        compareAtPrice: variantItem.compareAtPrice,
        unit: vUnit,
        stock: defaultSpec && typeof defaultSpec.count === 'number' ? defaultSpec.count : vStock,
        lowStockThreshold: 5,
        image: vImage,
        harvestTime: 'Cut fresh at dawn today',
        organicCertified: true,
        description:
          parentProduct?.description ||
          `${v.name} - premium fresh produce grown in fertile volcanic soil. Harvested daily at dawn for peak flavor.`,
        storageTip: 'Store in a cool dry place or refrigerate for maximum crispness.',
        nutrition:
          parentProduct?.search_keywords && parentProduct.search_keywords.length > 0
            ? parentProduct.search_keywords
            : ['100% Organically Grown', 'Locally Harvested', 'Peak Farm Freshness'],
        popular: v.sort_order <= 2,
        estWeightGrams: vWeight ?? null,
        est_weight_grams: vWeight ?? null,
        packaging: vPackaging,
        packaging_unit: vPackagingUnit,
        packagingUnit: vPackagingUnit,
        approxCount: vApproxCount,
        approx_count: vApproxCount,
        specifications: parsedSpecs,
        selectedSpecification: defaultSpec,
        variants: [variantItem]
      });
    }

    return {
      products: mappedProducts,
      categories,
      subcategories,
      fromDatabase: true
    };
  } catch (err) {
    console.error('[Supabase] Error loading remote catalog:', err);
    return null;
  }
}

/**
 * Update stock in public.product_variants in Supabase
 */
export async function updateRemoteVariantStock(productId: string, newStock: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await (supabase as any)
      .from('product_variants')
      .update({ stock_quantity: newStock, updated_at: new Date().toISOString() })
      .eq('product_id', productId);
    if (error) {
      console.warn('[Supabase] Failed to update variant stock:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[Supabase] Stock update error:', e);
    return false;
  }
}

/**
 * Update price in public.product_variants in Supabase
 */
export async function updateRemoteVariantPrice(productId: string, newPrice: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await (supabase as any)
      .from('product_variants')
      .update({ price: newPrice, updated_at: new Date().toISOString() })
      .eq('product_id', productId);
    if (error) {
      console.warn('[Supabase] Failed to update variant price:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[Supabase] Price update error:', e);
    return false;
  }
}
