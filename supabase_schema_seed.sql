-- ============================================================================
-- SAVANNAH FRESH NAIROBI - SUPABASE SEED SCRIPT
-- Project URL: https://xkzktrrtjjenjnbnheba.supabase.co
--
-- This script seeds your public.categories, public.subcategories,
-- public.products, public.product_variants, and public.sku_units tables.
-- Run this in the Supabase SQL Editor.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Ensure sku_units table exists (referenced by product_variants)
CREATE TABLE IF NOT EXISTS public.sku_units (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name public.citext NOT NULL,
  abbreviation public.citext NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sku_units_pkey PRIMARY KEY (id)
);

-- Seed SKU units
INSERT INTO public.sku_units (id, name, abbreviation)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Kilogram', 'kg'),
  ('22222222-2222-2222-2222-222222222222', 'Punnet', 'punnet'),
  ('33333333-3333-3333-3333-333333333333', 'Loaf', 'loaf'),
  ('44444444-4444-4444-4444-444444444444', 'Bottle', 'bottle'),
  ('55555555-5555-5555-5555-555555555555', 'Bunch', 'bunch')
ON CONFLICT (id) DO NOTHING;

-- Seed Categories via DDL Function
CREATE OR REPLACE FUNCTION public.fn_seed_categories()
RETURNS SETOF public.categories
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.categories (
    id,
    name,
    slug,
    description,
    image_url,
    image_url_dark,
    icon_url,
    og_image_url,
    sort_order,
    is_active,
    featured,
    search_keywords,
    meta_title,
    meta_description,
    content,
    canonical_url,
    robots
  )
  VALUES
    (
      'c0000000-0000-0000-0000-000000000000'::uuid,
      'All'::citext,
      'all'::citext,
      'Full Farm Harvest - Highland greens, tree-ripened fruits, fresh herbs & artisanal staples',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layout-grid.svg',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=630&q=85',
      0,
      true,
      true,
      ARRAY['all', 'farm-fresh', 'harvest', 'organic', 'produce', 'vegetables', 'fruits', 'herbs', 'nairobi']::citext[],
      'Full Farm Harvest | Fresh Kenyan Produce | Arcana Harvest',
      'Explore our full farm harvest: crisp highland vegetables, creamy avocados, tree fruits, fresh aromatics, and pasture staples delivered across Nairobi.',
      '## Full Farm Harvest' || E'\n\n' || 'Directly harvested from smallholder agroecological farms across Kenya. Explore our entire catalog of pesticide-tested highland greens, sun-ripened orchard fruits, and fresh culinary herbs.',
      'https://arcanaharvest.co.ke/categories/all',
      'index,follow'
    ),
    (
      'c1111111-0000-0000-0000-000000000001'::uuid,
      'Veg'::citext,
      'veg'::citext,
      'Highland Greens & Vegetables',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/leaf.svg',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&h=630&q=85',
      1,
      true,
      true,
      ARRAY['veg', 'vegetables', 'greens', 'sukuma', 'spinach', 'kale', 'organic', 'highland', 'kiambu', 'limuru']::citext[],
      'Fresh Highland Vegetables & Greens | Arcana Harvest',
      'Order crisp, pesticide-free highland vegetables harvested at dawn in Limuru and delivered fresh to Nairobi households.',
      '## Highland Greens & Vegetables' || E'\n\n' || 'Directly harvested from cool highland farms in Limuru and Kiambu at dawn. 100% residue-tested, grown in living volcanic soil without synthetic sprays.',
      'https://arcanaharvest.co.ke/categories/veg',
      'index,follow'
    ),
    (
      'c2222222-0000-0000-0000-000000000002'::uuid,
      'Fruits'::citext,
      'fruits'::citext,
      'Sun-Ripened Highland Fruits',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/apple.svg',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&h=630&q=85',
      2,
      true,
      true,
      ARRAY['fruits', 'avocado', 'hass', 'passion-fruit', 'mango', 'organic', 'tree-ripened', 'muranga', 'embu']::citext[],
      'Sun-Ripened Highland Fruits | Arcana Harvest',
      'Premium creamy Hass avocados, purple passion fruits, and sweet mangoes hand-picked across Kenyan smallholders.',
      '## Sun-Ripened Highland Fruits' || E'\n\n' || 'Organically nurtured in Murang''a and Embu. Tree-ripened to peak brix sweetness, rich in essential vitamins, healthy lipids, and clean antioxidants.',
      'https://arcanaharvest.co.ke/categories/fruits',
      'index,follow'
    ),
    (
      'c3333333-0000-0000-0000-000000000003'::uuid,
      'Aromatics'::citext,
      'aromatics'::citext,
      'Fresh Herbs, Garlic, Ginger & Chilies',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/flame.svg',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&h=630&q=85',
      3,
      true,
      true,
      ARRAY['aromatics', 'herbs', 'dhania', 'coriander', 'garlic', 'ginger', 'chilies', 'rosemary', 'thyme', 'spices']::citext[],
      'Fresh Herbs, Garlic & Aromatics | Arcana Harvest',
      'Fragrant culinary herbs, purple garlic bulbs, highland ginger root, and fiery bird''s eye chilies fresh from farm.',
      '## Fresh Kitchen Aromatics' || E'\n\n' || 'Pungent heirloom garlic, spicy highland ginger, freshly cut dhania, and garden thyme. Grown without synthetic enhancers for deep flavor and medicinal potency.',
      'https://arcanaharvest.co.ke/categories/aromatics',
      'index,follow'
    )
  ON CONFLICT (slug) WHERE (deleted_at IS NULL)
  DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    image_url_dark = EXCLUDED.image_url_dark,
    icon_url = EXCLUDED.icon_url,
    og_image_url = EXCLUDED.og_image_url,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    featured = EXCLUDED.featured,
    search_keywords = EXCLUDED.search_keywords,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    content = EXCLUDED.content,
    canonical_url = EXCLUDED.canonical_url,
    robots = EXCLUDED.robots,
    updated_at = now()
  RETURNING *;
END;
$$;

-- Seed the categories
SELECT * FROM public.fn_seed_categories();


-- Seed Subcategories
INSERT INTO public.subcategories (id, category_id, name, slug, description, sort_order, is_active)
VALUES
  ('s1111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000001', 'Cooking Staples', 'cooking-staples', 'Highland potatoes, onions, carrots and staples', 1, true),
  ('s1111111-0000-0000-0000-000000000002', 'c1111111-0000-0000-0000-000000000001', 'Salads & Crunchy Greens', 'salads-crunchy-greens', 'Crisp lettuce, spinach, cucumber and celery', 2, true),
  ('s1111111-0000-0000-0000-000000000003', 'c1111111-0000-0000-0000-000000000001', 'Staple Greens', 'staple-greens', 'Sukuma wiki, managu, spinach and terere', 3, true),
  ('s2222222-0000-0000-0000-000000000001', 'c2222222-0000-0000-0000-000000000002', 'Tree Fruits', 'tree-fruits', 'Muranga Hass avocados, tree tomatoes and mangoes', 1, true),
  ('s2222222-0000-0000-0000-000000000002', 'c2222222-0000-0000-0000-000000000002', 'Berries & Passions', 'berries-passions', 'Sweet purple passion fruits and strawberries', 2, true),
  ('s3333333-0000-0000-0000-000000000001', 'c3333333-0000-0000-0000-000000000003', 'Fresh Herbs', 'fresh-herbs', 'Fresh highland coriander, rosemary, mint and thyme', 1, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO public.products (id, subcategory_id, name, slug, brand, description, image_url, status, sort_order, search_keywords, product_code)
VALUES
  ('p1111111-0000-0000-0000-000000000001', 's2222222-0000-0000-0000-000000000001', 'Murang''a Creamy Hass Avocados', 'muranga-creamy-hass-avocados', 'Murang''a Organic Growers', 'Tree-ripened, buttery Hass avocados grown in rich red volcanic soil. Certified export-grade creamy texture.', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80', 'active', 1, ARRAY['avocado', 'hass', 'muranga', 'organic']::citext[], 'AVO'),
  ('p1111111-0000-0000-0000-000000000002', 's1111111-0000-0000-0000-000000000003', 'Limuru Highland Spinach & Sukuma Wiki', 'limuru-highland-spinach-sukuma-wiki', 'Limuru Highland Farm', 'Crisp, mist-dewed curly sukuma kale and tender highland spinach harvested at 5:30 AM in Kiambu.', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', 'active', 2, ARRAY['spinach', 'sukuma', 'kale', 'limuru']::citext[], 'SPN'),
  ('p1111111-0000-0000-0000-000000000003', 's2222222-0000-0000-0000-000000000002', 'Embu Sweet Purple Passion Fruits', 'embu-sweet-purple-passion-fruits', 'Embu Highlands Cooperative', 'Aromatic, intensely sweet Kenyan purple passion fruits with high juice content and floral scent.', 'https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&w=800&q=80', 'active', 3, ARRAY['passion', 'fruit', 'embu', 'juice']::citext[], 'PAS'),
  ('p1111111-0000-0000-0000-000000000004', 's3333333-0000-0000-0000-000000000001', 'Highland Dhania (Fresh Coriander)', 'highland-dhania-fresh-coriander', 'Naivasha Greenhouses', 'Fragrant, lush green dhania bunches harvested fresh with roots attached for prolonged crispness.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80', 'active', 4, ARRAY['dhania', 'coriander', 'herbs', 'aromatics']::citext[], 'DHN'),
  ('p1111111-0000-0000-0000-000000000005', 's1111111-0000-0000-0000-000000000001', 'Kinangop Red Irish Potatoes', 'kinangop-red-irish-potatoes', 'Kinangop Plateau Farms', 'Firm, earthy Dutch Robinson red potatoes grown at 2,600m altitude. Perfect for roasting, mashing and chips.', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80', 'active', 5, ARRAY['potatoes', 'kinangop', 'staples']::citext[], 'POT')
ON CONFLICT (id) DO NOTHING;

-- Seed Product Variants
INSERT INTO public.product_variants (id, product_id, sku, name, sku_unit_id, unit_quantity, price, compare_at_price, cost_price, stock_quantity, is_active, is_default, sort_order)
VALUES
  ('v1111111-0000-0000-0000-000000000001', 'p1111111-0000-0000-0000-000000000001', 'SKU-AVO-4PC', '4-piece pack (~800g)', '22222222-2222-2222-2222-222222222222', 4.0, 280.00, 320.00, 180.00, 45, true, true, 1),
  ('v1111111-0000-0000-0000-000000000002', 'p1111111-0000-0000-0000-000000000002', 'SKU-SPN-KG', 'per kg bunch', '11111111-1111-1111-1111-111111111111', 1.0, 180.00, 200.00, 100.00, 60, true, true, 1),
  ('v1111111-0000-0000-0000-000000000003', 'p1111111-0000-0000-0000-000000000003', 'SKU-PAS-500G', '500g net bag (~8 pcs)', '22222222-2222-2222-2222-222222222222', 0.5, 240.00, 270.00, 150.00, 35, true, true, 1),
  ('v1111111-0000-0000-0000-000000000004', 'p1111111-0000-0000-0000-000000000004', 'SKU-DHN-BCH', 'Crisp 250g bunch', '55555555-5555-5555-5555-555555555555', 0.25, 120.00, 150.00, 60.00, 50, true, true, 1),
  ('v1111111-0000-0000-0000-000000000005', 'p1111111-0000-0000-0000-000000000005', 'SKU-POT-5KG', '5kg bag', '11111111-1111-1111-1111-111111111111', 5.0, 480.00, 550.00, 320.00, 30, true, true, 1)
ON CONFLICT (id) DO NOTHING;

-- Verification query
SELECT 
  p.name AS product_name,
  c.name AS category_name,
  s.name AS subcategory_name,
  pv.name AS variant_name,
  pv.price AS price_kes,
  pv.stock_quantity
FROM public.products p
JOIN public.subcategories s ON s.id = p.subcategory_id
JOIN public.categories c ON c.id = s.category_id
JOIN public.product_variants pv ON pv.product_id = p.id
WHERE p.status = 'active';
