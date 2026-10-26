export interface CategoryRow {
  id: string; // uuid
  name: string; // citext
  slug: string; // citext
  description: string | null;
  image_url: string | null;
  image_url_dark: string | null;
  icon_url: string | null;
  og_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  featured: boolean;
  search_keywords: string[];
  meta_title: string | null;
  meta_description: string | null;
  content: string | null;
  canonical_url: string | null;
  robots: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SubcategoryRow {
  id: string; // uuid
  category_id: string; // uuid
  name: string; // citext
  slug: string; // citext
  description: string | null;
  image_url: string | null;
  image_url_dark: string | null;
  icon_url: string | null;
  og_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  search_keywords: string[];
  meta_title: string | null;
  meta_description: string | null;
  content: string | null;
  canonical_url: string | null;
  robots: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductRow {
  id: string; // uuid
  subcategory_id: string; // uuid
  name: string; // citext
  slug: string; // citext
  brand: string | null; // citext
  description: string | null;
  image_url: string | null;
  image_url_dark: string | null;
  og_image_url: string | null;
  status: 'draft' | 'active' | 'archived';
  sort_order: number;
  search_keywords: string[];
  meta_title: string | null;
  meta_description: string | null;
  content: string | null;
  canonical_url: string | null;
  robots: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  product_code: string | null;
  packaging?: string | null;
  packaging_unit?: string | null;
  est_weight_grams?: number | null;
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

export interface ProductVariantRow {
  id: string; // uuid
  product_id: string; // uuid
  sku: string; // citext
  name: string; // citext
  sku_unit_id: string | null; // uuid
  unit_quantity: number | string | null;
  price: number | string;
  compare_at_price: number | string | null;
  cost_price: number | string | null;
  stock_quantity: number;
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
  image_url: string | null;
  barcode: string | null;
  weight_grams?: number | null;
  est_weight_grams?: number | null;
  packaging?: string | null;
  packaging_unit?: string | null;
  approx_count?: number | string | null;
  specifications?: VariantSpecification[] | string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SkuUnitRow {
  id: string; // uuid
  name: string;
  abbreviation: string;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow> & Pick<CategoryRow, 'name' | 'slug'>;
        Update: Partial<CategoryRow>;
      };
      subcategories: {
        Row: SubcategoryRow;
        Insert: Partial<SubcategoryRow> & Pick<SubcategoryRow, 'category_id' | 'name' | 'slug'>;
        Update: Partial<SubcategoryRow>;
      };
      products: {
        Row: ProductRow;
        Insert: Partial<ProductRow> & Pick<ProductRow, 'subcategory_id' | 'name' | 'slug'>;
        Update: Partial<ProductRow>;
      };
      product_variants: {
        Row: ProductVariantRow;
        Insert: Partial<ProductVariantRow> & Pick<ProductVariantRow, 'product_id' | 'sku' | 'name' | 'price'>;
        Update: Partial<ProductVariantRow>;
      };
      sku_units: {
        Row: SkuUnitRow;
        Insert: Partial<SkuUnitRow> & Pick<SkuUnitRow, 'name' | 'abbreviation'>;
        Update: Partial<SkuUnitRow>;
      };
    };
  };
}
