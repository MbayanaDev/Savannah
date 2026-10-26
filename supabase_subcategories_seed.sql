-- ============================================================================
-- SUB-CATEGORIES INSERT STATEMENTS (PostgreSQL / Supabase)
-- ============================================================================
-- Run this directly in the Supabase SQL Editor.
-- The category_id uses (SELECT id FROM public.categories WHERE slug = '...' LIMIT 1)
-- to dynamically link to your live categories in Supabase without foreign key errors.
-- ============================================================================

-- 1. Cooking Staples (Category: Veg)
INSERT INTO public.subcategories (
  id, category_id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
  sort_order, is_active, search_keywords, meta_title, meta_description, content, canonical_url,
  robots, created_at, updated_at, deleted_at
) VALUES (
  'b14e6a82-7d23-4c91-9e8a-51f7d2b86101',
  (SELECT id FROM public.categories WHERE slug = 'veg' AND deleted_at IS NULL LIMIT 1),
  'Cooking Staples',
  'cooking-staples',
  'Highland potatoes, onions, carrots, stone-ground sourdough, whole pasture milk, and free-range farm eggs',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  null, null, null,
  1,
  true,
  ARRAY['staples','potatoes','carrots','onions','eggs','milk','sourdough','cooking','pantry']::citext[],
  'Cooking Staples & Farm Pantry | Arcana Harvest',
  'Farm-fresh cooking essentials: Irish potatoes, pasture milk, stone-ground sourdough, and free-range eggs.',
  null, null,
  'index,follow',
  '2026-10-24 13:15:12.80356+00',
  '2026-10-24 13:15:12.80356+00',
  null
);

-- 2. Salads & Crunchy Greens (Category: Veg)
INSERT INTO public.subcategories (
  id, category_id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
  sort_order, is_active, search_keywords, meta_title, meta_description, content, canonical_url,
  robots, created_at, updated_at, deleted_at
) VALUES (
  'e52f7c19-8a34-4d92-bf1c-62a8e3c97202',
  (SELECT id FROM public.categories WHERE slug = 'veg' AND deleted_at IS NULL LIMIT 1),
  'Salads & Crunchy Greens',
  'salads-crunchy-greens',
  'Crisp sweet heirloom cherry tomatoes, crunchy lettuce, English cucumbers, and fresh salad greens',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  null, null, null,
  2,
  true,
  ARRAY['salads','tomatoes','cherry tomatoes','lettuce','crunchy greens','cucumbers','salad greens']::citext[],
  'Salads & Crunchy Greens | Arcana Harvest',
  'Crisp heirloom cherry tomatoes, cucumbers, and freshly picked crunchy salad greens.',
  null, null,
  'index,follow',
  '2026-10-24 13:15:12.80356+00',
  '2026-10-24 13:15:12.80356+00',
  null
);

-- 3. Staple Greens (Category: Veg)
INSERT INTO public.subcategories (
  id, category_id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
  sort_order, is_active, search_keywords, meta_title, meta_description, content, canonical_url,
  robots, created_at, updated_at, deleted_at
) VALUES (
  'd83a9e41-2b56-4c78-a0e4-73b9f4d18303',
  (SELECT id FROM public.categories WHERE slug = 'veg' AND deleted_at IS NULL LIMIT 1),
  'Staple Greens',
  'staple-greens',
  'Limuru baby spinach leaves, crisp curly sukuma wiki (African kale), managu, and traditional indigenous greens',
  'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
  null, null, null,
  3,
  true,
  ARRAY['spinach','kale','sukuma wiki','staple greens','limuru','managu','traditional greens']::citext[],
  'Fresh Staple Greens & Sukuma Wiki | Arcana Harvest',
  'Tender baby spinach and crisp highland sukuma wiki harvested daily at dawn in Limuru.',
  null, null,
  'index,follow',
  '2026-10-24 13:15:12.80356+00',
  '2026-10-24 13:15:12.80356+00',
  null
);

-- 4. Pods & Legumes (Category: Veg)
INSERT INTO public.subcategories (
  id, category_id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
  sort_order, is_active, search_keywords, meta_title, meta_description, content, canonical_url,
  robots, created_at, updated_at, deleted_at
) VALUES (
  'c94b0f52-3c67-4d89-b1f5-84ca05e29404',
  (SELECT id FROM public.categories WHERE slug = 'veg' AND deleted_at IS NULL LIMIT 1),
  'Pods & Legumes',
  'pods-legumes',
  'Naivasha extra-fine crisp French beans, crunchy sugar snaps, sweet snow peas, and garden legumes',
  'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
  null, null, null,
  4,
  true,
  ARRAY['french beans','sugar snaps','peas','pods','legumes','naivasha','snow peas']::citext[],
  'Fresh French Beans & Pod Legumes | Arcana Harvest',
  'Crisp Rift Valley French beans and sweet crunchy sugar snaps delivered straight to your door.',
  null, null,
  'index,follow',
  '2026-10-24 13:15:12.80356+00',
  '2026-10-24 13:15:12.80356+00',
  null
);

-- 5. Tropical Staples (Category: Fruits)
INSERT INTO public.subcategories (
  id, category_id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
  sort_order, is_active, search_keywords, meta_title, meta_description, content, canonical_url,
  robots, created_at, updated_at, deleted_at
) VALUES (
  'f05c1a63-4d78-4e9a-c2a6-95db16f3a505',
  (SELECT id FROM public.categories WHERE slug = 'fruits' AND deleted_at IS NULL LIMIT 1),
  'Tropical Staples',
  'tropical-staples',
  'Murang''a creamy organic Hass avocados, sweet Cavendish bananas, and tropical staples',
  'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
  null, null, null,
  1,
  true,
  ARRAY['avocado','hass avocado','tropical staples','bananas','muranga','fruits']::citext[],
  'Creamy Hass Avocados & Tropical Staples | Arcana Harvest',
  'Export-grade creamy Murang''a Hass avocados and fresh tropical staples grown in volcanic soils.',
  null, null,
  'index,follow',
  '2026-10-24 13:15:12.80356+00',
  '2026-10-24 13:15:12.80356+00',
  null
);

-- 6. Citrus & Juicing (Category: Fruits)
INSERT INTO public.subcategories (
  id, category_id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
  sort_order, is_active, search_keywords, meta_title, meta_description, content, canonical_url,
  robots, created_at, updated_at, deleted_at
) VALUES (
  'a16d2b74-5e89-4fa1-d3b7-06ec27a4b606',
  (SELECT id FROM public.categories WHERE slug = 'fruits' AND deleted_at IS NULL LIMIT 1),
  'Citrus & Juicing',
  'citrus-juicing',
  'Embu purple sweet passion fruits, ripe tree tomatoes (tamarillo), coastal lemons, limes, and oranges',
  'https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&w=800&q=80',
  null, null, null,
  2,
  true,
  ARRAY['passion fruit','citrus','juicing','lemons','limes','tamarillo','oranges','embu']::citext[],
  'Citrus & Juicing Fruits | Arcana Harvest',
  'Sun-ripened Embu purple passion fruits and fragrant citrus for daily fresh juices.',
  null, null,
  'index,follow',
  '2026-10-24 13:15:12.80356+00',
  '2026-10-24 13:15:12.80356+00',
  null
);

-- 7. Orchard & Berries (Category: Fruits)
INSERT INTO public.subcategories (
  id, category_id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
  sort_order, is_active, search_keywords, meta_title, meta_description, content, canonical_url,
  robots, created_at, updated_at, deleted_at
) VALUES (
  'b27e3c85-6f9a-4ab2-e4c8-17fd38b5c707',
  (SELECT id FROM public.categories WHERE slug = 'fruits' AND deleted_at IS NULL LIMIT 1),
  'Orchard & Berries',
  'orchard-berries',
  'Machakos golden apple mangoes, sweet highland strawberries, tree melons, and orchard harvests',
  'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
  null, null, null,
  3,
  true,
  ARRAY['mangoes','apple mango','berries','strawberries','orchard fruits','machakos']::citext[],
  'Orchard Fruits & Berries | Arcana Harvest',
  'Luscious golden Machakos apple mangoes and sweet hand-picked orchard berries.',
  null, null,
  'index,follow',
  '2026-10-24 13:15:12.80356+00',
  '2026-10-24 13:15:12.80356+00',
  null
);

-- 8. Fresh Aromatics (Category: Aromatics)
INSERT INTO public.subcategories (
  id, category_id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
  sort_order, is_active, search_keywords, meta_title, meta_description, content, canonical_url,
  robots, created_at, updated_at, deleted_at
) VALUES (
  'c38f4d96-7a0b-4bc3-f5d9-28ae49c6d808',
  COALESCE((SELECT id FROM public.categories WHERE slug = 'aromatics' AND deleted_at IS NULL LIMIT 1), 'a2c5bba0-1bdb-44d9-8fbf-c7c08ab450e7'::uuid),
  'Fresh Aromatics',
  'fresh-aromatics',
  'Voi purple garlic bulbs, highland juicy ginger root, and fiery Lamu bird''s eye chilies',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  null, null, null,
  1,
  true,
  ARRAY['garlic','ginger','chilies','birds eye','aromatics','spices','fresh garlic']::citext[],
  'Fresh Aromatics, Garlic & Ginger | Arcana Harvest',
  'Pungent heirloom garlic bulbs, spicy highland ginger, and fiery bird''s eye chilies.',
  null, null,
  'index,follow',
  '2026-10-24 13:15:12.80356+00',
  '2026-10-24 13:15:12.80356+00',
  null
);

-- 9. Fresh Herbs (Category: Aromatics - matching your provided example)
INSERT INTO public.subcategories (
  id, category_id, name, slug, description, image_url, image_url_dark, icon_url, og_image_url,
  sort_order, is_active, search_keywords, meta_title, meta_description, content, canonical_url,
  robots, created_at, updated_at, deleted_at
) VALUES (
  '330d618a-4d0e-46aa-874a-e291d9884786',
  COALESCE((SELECT id FROM public.categories WHERE slug = 'aromatics' AND deleted_at IS NULL LIMIT 1), 'a2c5bba0-1bdb-44d9-8fbf-c7c08ab450e7'::uuid),
  'Fresh Herbs',
  'fresh-herbs',
  'Tigoni fresh garden dhania (coriander), highland rosemary sprigs, wild thyme, garden mint, and parsley',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  null, null, null,
  2,
  true,
  ARRAY['herbs','dhania','coriander','rosemary','thyme','mint','parsley','culinary herbs'],
  'Fresh Culinary Herbs & Dhania | Arcana Harvest',
  'Aromatic Kenyan dhania (coriander), fresh rosemary, and garden herbs cut fresh at dawn.',
  null, null,
  'index,follow',
  '2026-10-24 13:15:12.80356+00',
  '2026-10-24 13:15:12.80356+00',
  null
);
