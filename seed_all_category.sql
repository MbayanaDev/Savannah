-- ============================================================================
-- DDL & INSERT STATEMENT: 'All' Category (Full Farm Harvest)
-- Target Table: public.categories
-- ============================================================================
-- Validates against all constraints:
--   1. categories_slug_format: slug matches '^[a-z0-9]+(?:-[a-z0-9]+)*$' ('all')
--   2. categories_name_not_blank: length(TRIM(name)) > 0 ('All')
--   3. categories_robots_check: robots IN ('index,follow','noindex,follow','noindex,nofollow')
--   4. meta_title: character varying(70) (length: 58 <= 70)
--   5. meta_description: character varying(160) (length: 148 <= 160)
--   6. search_keywords: citext[]
--   7. Partial unique index on slug and name WHERE (deleted_at IS NULL)
-- ============================================================================

-- Option A: Standalone INSERT / UPSERT statement for 'All' category
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
VALUES (
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
