-- ============================================================================
-- DDL & SEED SCRIPT: Categories Table, RLS Policies, and Seed Function
-- Target Database: Supabase (Project: xkzktrrtjjenjnbnheba)
-- ============================================================================
-- This script contains:
--  1. Pre-requisite extensions and updated_at trigger function
--  2. The table DDL & index definitions for public.categories (with citext check constraints)
--  3. Row Level Security (RLS) configuration granting anonymous & authenticated SELECT
--  4. Idempotent DDL seed function public.fn_seed_categories() handling conflicts on both
--     slug and name gracefully without constraint violations
--  5. Helper function public.fn_get_categories() with SECURITY DEFINER
--  6. Execution call seeding all 4 categories (All, Veg, Fruits, Aromatics)
-- ============================================================================

-- 1. Ensure required PostgreSQL extensions exist
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Trigger function for automatic updated_at
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Table definition for public.categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name public.citext NOT NULL,
  slug public.citext NOT NULL,
  description text NULL,
  image_url text NULL,
  image_url_dark text NULL,
  icon_url text NULL,
  og_image_url text NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  search_keywords citext[] NOT NULL DEFAULT '{}'::citext[],
  meta_title character varying(70) NULL,
  meta_description character varying(160) NULL,
  content text NULL,
  canonical_url text NULL,
  robots text NOT NULL DEFAULT 'index,follow'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_name_not_blank CHECK (
    (length(TRIM(both from name)) > 0)
  ),
  CONSTRAINT categories_robots_check CHECK (
    (
      robots = ANY (
        ARRAY[
          'index,follow'::text,
          'noindex,follow'::text,
          'noindex,nofollow'::text
        ]
      )
    )
  ),
  CONSTRAINT categories_slug_format CHECK ((slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::citext))
);

-- 4. Unique indexes (live/non-deleted)
CREATE UNIQUE INDEX IF NOT EXISTS ux_categories_slug_live 
  ON public.categories USING btree (slug) 
  WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX IF NOT EXISTS ux_categories_name_live 
  ON public.categories USING btree (name) 
  WHERE (deleted_at IS NULL);

-- 5. Performance & Filter indexes
CREATE INDEX IF NOT EXISTS ix_categories_active_sort 
  ON public.categories USING btree (sort_order, name) 
  WHERE ((deleted_at IS NULL) AND (is_active = true));

CREATE INDEX IF NOT EXISTS ix_categories_featured 
  ON public.categories USING btree (sort_order, name) 
  WHERE ((deleted_at IS NULL) AND (is_active = true) AND (featured = true));

CREATE INDEX IF NOT EXISTS ix_categories_search_keywords 
  ON public.categories USING gin (search_keywords) 
  WHERE ((deleted_at IS NULL) AND (is_active = true));

-- 6. Updated_at Trigger
DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at 
  BEFORE UPDATE ON public.categories 
  FOR EACH ROW 
  EXECUTE FUNCTION public.fn_set_updated_at();

-- 7. Grant Permissions & Enable Row Level Security (RLS) with Public SELECT
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "categories_public_read" ON public.categories;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated, service_role;

-- 8. Conflict-Proof DDL Seed Function
-- Handles both slug and name conflicts to prevent duplicate key errors on ux_categories_name_live
CREATE OR REPLACE FUNCTION public.fn_seed_categories()
RETURNS SETOF public.categories
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cat_item RECORD;
BEGIN
  FOR cat_item IN 
    SELECT * FROM (VALUES
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
    ) AS t(id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url, sort_order, is_active, featured, search_keywords, meta_title, meta_description, content, canonical_url, robots)
  LOOP
    -- If a category with matching slug or name already exists in live records, update it!
    IF EXISTS (SELECT 1 FROM public.categories WHERE deleted_at IS NULL AND (slug = cat_item.slug OR name = cat_item.name)) THEN
      UPDATE public.categories SET
        name = cat_item.name,
        slug = cat_item.slug,
        description = cat_item.description,
        image_url = cat_item.image_url,
        image_url_dark = cat_item.image_url_dark,
        icon_url = cat_item.icon_url,
        og_image_url = cat_item.og_image_url,
        sort_order = cat_item.sort_order,
        is_active = cat_item.is_active,
        featured = cat_item.featured,
        search_keywords = cat_item.search_keywords,
        meta_title = cat_item.meta_title,
        meta_description = cat_item.meta_description,
        content = cat_item.content,
        canonical_url = cat_item.canonical_url,
        robots = cat_item.robots,
        updated_at = now()
      WHERE deleted_at IS NULL AND (slug = cat_item.slug OR name = cat_item.name);
    ELSE
      INSERT INTO public.categories (
        id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
        sort_order, is_active, featured, search_keywords, meta_title, meta_description,
        content, canonical_url, robots
      )
      VALUES (
        cat_item.id, cat_item.name, cat_item.slug, cat_item.description, cat_item.image_url,
        cat_item.image_url_dark, cat_item.icon_url, cat_item.og_image_url, cat_item.sort_order,
        cat_item.is_active, cat_item.featured, cat_item.search_keywords, cat_item.meta_title,
        cat_item.meta_description, cat_item.content, cat_item.canonical_url, cat_item.robots
      );
    END IF;
  END LOOP;

  RETURN QUERY SELECT * FROM public.categories WHERE deleted_at IS NULL ORDER BY sort_order ASC;
END;
$$;

-- 9. Helper Function to Read Categories (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.fn_get_categories()
RETURNS SETOF public.categories
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.categories WHERE deleted_at IS NULL AND is_active = true ORDER BY sort_order ASC;
$$;

GRANT EXECUTE ON FUNCTION public.fn_seed_categories() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.fn_get_categories() TO anon, authenticated, service_role;

-- 10. Execute the function now
SELECT id, name, slug, sort_order, is_active FROM public.fn_seed_categories();
