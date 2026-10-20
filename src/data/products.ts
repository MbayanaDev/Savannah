import { Product, Category, CategoryInfo } from '../types';

export const CATEGORIES_CONFIG: CategoryInfo[] = [
  {
    id: 'All',
    label: 'All',
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
    tagline: 'Full Farm Harvest'
  },
  {
    id: 'Veg',
    label: 'Veg',
    image: '/src/assets/images/product_spinach_kale_1792228088029.jpg',
    tagline: 'Highland Greens & Vegetables'
  },
  {
    id: 'Fruits',
    label: 'Fruits',
    image: '/src/assets/images/product_hass_avocado_1792228088344.jpg',
    tagline: 'Sun-Ripened Highland Fruits'
  },
  {
    id: 'Aromatics',
    label: 'Aromatics',
    image: '/src/assets/images/category_aromatics_1792245411534.jpg',
    tagline: 'Fresh Herbs, Garlic, Ginger & Chilies'
  }
];

export const CATEGORIES: Category[] = ['All', 'Veg', 'Fruits', 'Aromatics'];

export interface SubcategoryItem {
  id: string;
  name: string;
  category: Category;
  image: string;
}

export const SUBCATEGORIES_CONFIG: SubcategoryItem[] = [
  // Veg
  {
    id: 'Cooking Staples',
    name: 'Cooking Staples',
    category: 'Veg',
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg'
  },
  {
    id: 'Salads & Crunchy Greens',
    name: 'Salads & Crunchy Greens',
    category: 'Veg',
    image: '/src/assets/images/product_spinach_kale_1792228088029.jpg'
  },
  {
    id: 'Staple Greens',
    name: 'Staple Greens',
    category: 'Veg',
    image: '/src/assets/images/product_spinach_kale_1792228088029.jpg'
  },
  {
    id: 'Pods & Legumes',
    name: 'Pods & Legumes',
    category: 'Veg',
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg'
  },

  // Fruits
  {
    id: 'Tropical Staples',
    name: 'Tropical Staples',
    category: 'Fruits',
    image: '/src/assets/images/product_hass_avocado_1792228088344.jpg'
  },
  {
    id: 'Citrus & Juicing',
    name: 'Citrus & Juicing',
    category: 'Fruits',
    image: '/src/assets/images/product_passion_fruit_1792228088974.jpg'
  },
  {
    id: 'Orchard & Berries',
    name: 'Orchard & Berries',
    category: 'Fruits',
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg'
  },

  // Aromatics
  {
    id: 'Fresh Aromatics',
    name: 'Fresh Aromatics',
    category: 'Aromatics',
    image: '/src/assets/images/category_aromatics_1792245411534.jpg'
  },
  {
    id: 'Fresh Herbs',
    name: 'Fresh Herbs',
    category: 'Aromatics',
    image: '/src/assets/images/category_aromatics_1792245411534.jpg'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-avocado-hass',
    name: 'Murang\'a Organic Hass Avocados',
    category: 'Fruits',
    subcategory: 'Tropical Staples',
    origin: 'Murang\'a Smallholder Organic Co-op',
    price: 320,
    unit: '1 kg pack (~4 ripe avocados)',
    stock: 48,
    lowStockThreshold: 10,
    image: '/src/assets/images/product_hass_avocado_1792228088344.jpg',
    harvestTime: 'Yesterday, Hand-picked at peak ripeness',
    organicCertified: true,
    description: 'Creamy, rich Hass avocados cultivated in the fertile volcanic red soils of Murang\'a. Perfect for morning avocado toast, guacamole, or vibrant fresh salads.',
    storageTip: 'Store at room temperature until slight give to gentle pressure, then refrigerate for up to 5 days.',
    nutrition: ['Rich in Oleic Fatty Acids', 'High Potassium', 'Vitamin E & Folate'],
    popular: true
  },
  {
    id: 'prod-spinach-kale',
    name: 'Limuru Baby Spinach & Curly Sukuma Wiki',
    category: 'Veg',
    subcategory: 'Staple Greens',
    origin: 'Limuru Highland Organic Farm (2,200m alt)',
    price: 180,
    unit: '500g crisp washed bunch',
    stock: 65,
    lowStockThreshold: 15,
    image: '/src/assets/images/product_spinach_kale_1792228088029.jpg',
    harvestTime: 'Today 5:30 AM morning mist harvest',
    organicCertified: true,
    description: 'Tender baby spinach leaves and crisp curly African kale (sukuma wiki), grown naturally without synthetic pesticides in cool Limuru highland climate.',
    storageTip: 'Keep in the breathable crisping bag provided in your refrigerator crisper drawer.',
    nutrition: ['Iron & Folate Rich', 'Vitamins A, C, & K', 'Dietary Fibre'],
    popular: true
  },
  {
    id: 'prod-highland-aromatics',
    name: 'Tigoni Fresh Garden Dhania & Herb Bundle',
    category: 'Aromatics',
    subcategory: 'Fresh Herbs',
    origin: 'Tigoni Herb Gardens, Kiambu',
    price: 150,
    unit: '300g fragrant bundled harvest',
    stock: 35,
    lowStockThreshold: 10,
    image: '/src/assets/images/category_aromatics_1792245411534.jpg',
    harvestTime: 'Picked fresh today at dawn',
    organicCertified: true,
    description: 'Vibrant, intensely fragrant Kenyan coriander (dhania), sweet garden mint, and wild parsley freshly tied with natural twine. The soul of Kenyan curries, kachumbari, and soups.',
    storageTip: 'Trim stems and place in a glass of water on counter, or wrap in damp tea towel in crisper drawer.',
    nutrition: ['Essential Terpenes & Oils', 'Vitamin K & C', 'Natural Digestive Stimulant'],
    popular: true
  },
  {
    id: 'prod-garlic-ginger',
    name: 'Voi Purple Garlic Bulbs & Highland Ginger Root',
    category: 'Aromatics',
    subcategory: 'Fresh Aromatics',
    origin: 'Taita Hills & Limuru Valley Growers',
    price: 240,
    unit: '450g paired basket (3 bulbs + ginger root)',
    stock: 40,
    lowStockThreshold: 12,
    image: '/src/assets/images/category_aromatics_1792245411534.jpg',
    harvestTime: 'Naturally air-cured 48h ago',
    organicCertified: true,
    description: 'Pungent purple-streaked heritage garlic with juicy, sticky cloves paired with fibrous, spicy Highland ginger root. Unrivalled aroma when pounded with mortar and pestle.',
    storageTip: 'Store in a dark, airy basket at room temperature. Never keep in plastic bags.',
    nutrition: ['Allicin & Gingerols', 'Immunity Powerhouse', 'Anti-Inflammatory'],
    popular: true
  },
  {
    id: 'prod-birds-eye-chili',
    name: 'Lamu Organic Fiery Red Bird\'s Eye Chilies',
    category: 'Aromatics',
    subcategory: 'Fresh Aromatics',
    origin: 'Coastal Eco Permaculture Groves',
    price: 120,
    unit: '150g punnet (~35 fresh chilies)',
    stock: 25,
    lowStockThreshold: 8,
    image: '/src/assets/images/category_aromatics_1792245411534.jpg',
    harvestTime: 'Sun-warmed harvest yesterday',
    organicCertified: true,
    description: 'Vibrant scarlet bird\'s eye chilies packed with intense clean heat and fruity undertones. Essential for authentic pilau, homemade pili pili sauce, and fiery marinades.',
    storageTip: 'Can be frozen whole or infused into extra virgin olive oil.',
    nutrition: ['High Capsaicin', 'Metabolism Booster', 'Vitamin C Powerhouse'],
    popular: false
  },
  {
    id: 'prod-passion-fruits',
    name: 'Embu Purple Sun-Ripened Passion Fruits',
    category: 'Fruits',
    subcategory: 'Citrus & Juicing',
    origin: 'Embu Eastern Highland Orchards',
    price: 260,
    unit: '1 kg netting (~12-14 fruits)',
    stock: 35,
    lowStockThreshold: 12,
    image: '/src/assets/images/product_passion_fruit_1792228088974.jpg',
    harvestTime: 'Tree-ripened, harvested 24h ago',
    organicCertified: true,
    description: 'Intensely fragrant purple passion fruits bursting with tart-sweet tropical golden pulp and crunchy edible seeds. Perfect for fresh morning juice, yoghurt bowls, or desserts.',
    storageTip: 'Wrinkled skin means maximum sweetness! Can be frozen as pulp.',
    nutrition: ['Vitamin C Powerhouse', 'Antioxidant Polyphenols', 'Digestive Enzymes'],
    popular: true
  },
  {
    id: 'prod-cherry-tomatoes',
    name: 'Kinangop Sweet Heirloom Cherry Tomatoes',
    category: 'Veg',
    subcategory: 'Salads & Crunchy Greens',
    origin: 'Kinangop Plateau Valley Farm',
    price: 240,
    unit: '400g vine punnet',
    stock: 42,
    lowStockThreshold: 10,
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
    harvestTime: 'Harvested on vine yesterday afternoon',
    organicCertified: true,
    description: 'Sweet, bite-sized jewel tomatoes on the vine. Bursting with sweet sun-ripened flavor, balanced acidity, and high lycopene content.',
    storageTip: 'Keep on the kitchen counter away from direct sunlight for optimal aroma and sweetness.',
    nutrition: ['Lycopene', 'Vitamin C', 'Potassium'],
    popular: true
  },
  {
    id: 'prod-mango-apple',
    name: 'Machakos Golden Apple Mangoes',
    category: 'Fruits',
    subcategory: 'Orchard & Berries',
    origin: 'Yatta Valley Sunny Groves, Machakos',
    price: 290,
    unit: '1 kg pack (~3 large mangoes)',
    stock: 50,
    lowStockThreshold: 15,
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
    harvestTime: 'Picked ripe 36h ago',
    organicCertified: true,
    description: 'Silky smooth fiberless flesh with luscious sweetness and vibrant peach aroma. The quintessential Kenyan sweet apple mango.',
    storageTip: 'Allow to fully perfume your kitchen at room temperature before slicing or chilling.',
    nutrition: ['High Beta-Carotene', 'Vitamin C & A', 'Natural Digestive Enzymes'],
    popular: true
  },
  {
    id: 'prod-french-beans',
    name: 'Naivasha Crisp French Beans & Sugar Snaps',
    category: 'Veg',
    subcategory: 'Pods & Legumes',
    origin: 'Rift Valley Eco Growers, Naivasha',
    price: 220,
    unit: '500g trimmed & snapped',
    stock: 38,
    lowStockThreshold: 12,
    image: '/src/assets/images/product_spinach_kale_1792228088029.jpg',
    harvestTime: 'Picked fresh yesterday morning',
    organicCertified: true,
    description: 'Extra-fine tender green beans and sweet crunchy sugar snaps. Snappy texture with sweet natural crunch, delicious steamed, stir-fried, or tossed with garlic butter.',
    storageTip: 'Refrigerate in a perforated produce bag for up to 7 days.',
    nutrition: ['Dietary Fiber', 'Vitamin C & K', 'Low Glycemic Index'],
    popular: false
  },
  {
    id: 'prod-rosemary-thyme',
    name: 'Limuru Fresh Garden Rosemary & Wild Thyme',
    category: 'Aromatics',
    subcategory: 'Fresh Herbs',
    origin: 'Limuru Organic Farm, Kiambu',
    price: 140,
    unit: '150g fresh cut bundle',
    stock: 30,
    lowStockThreshold: 8,
    image: '/src/assets/images/category_aromatics_1792245411534.jpg',
    harvestTime: 'Clipped at 6:00 AM Today',
    organicCertified: true,
    description: 'Resinous piney rosemary needles and delicate wild thyme sprigs grown at high altitudes. Essential for roasting root vegetables, meats, focaccia bread, and infusing tea.',
    storageTip: 'Wrap in a dry paper towel and seal in an airtight container in the fridge.',
    nutrition: ['Rosmarinic Acid', 'Antioxidants', 'Natural Memory Aid'],
    popular: false
  },
  {
    id: 'prod-artisan-sourdough',
    name: 'Stone-Ground Country Sourdough Loaf',
    category: 'Veg',
    subcategory: 'Cooking Staples',
    origin: 'Artisanal Hearth Bakehouse, Tigoni',
    price: 450,
    unit: '750g whole hearth loaf',
    stock: 22,
    lowStockThreshold: 8,
    image: '/src/assets/images/product_sourdough_loaf_1792228088760.jpg',
    harvestTime: 'Baked Fresh at 4:00 AM Today',
    organicCertified: true,
    description: '36-hour slow fermented country sourdough with wild natural starter, stone-milled wheat flour, water, and sea salt. Crisp crackling blistered crust with deep open crumb.',
    storageTip: 'Store cut-side down on a wooden cutting board or bread linen bag. Do not refrigerate.',
    nutrition: ['Natural Probiotic Ferment', 'Easily Digestible', 'Zero Preservatives'],
    popular: true
  },
  {
    id: 'prod-pasture-milk',
    name: 'Naivasha Pasture Grass-Fed Whole Raw Milk',
    category: 'Veg',
    subcategory: 'Cooking Staples',
    origin: 'Morendat Farm, Naivasha Grasslands',
    price: 210,
    unit: '1 Litre recyclable glass bottle',
    stock: 28,
    lowStockThreshold: 10,
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
    harvestTime: 'Chilled & bottled today 6:00 AM',
    organicCertified: true,
    description: 'Golden, unhomogenized whole milk from pasture-raised Jersey & Guernsey dairy cows grazing on lush Naivasha grasslands. Thick creamline on top.',
    storageTip: 'Keep chilled below 4°C. Shake before pouring to blend the rich natural cream layer.',
    nutrition: ['A2 Beta-Casein', 'Naturally High Calcium', 'Omega-3 Fatty Acids'],
    popular: true
  },
  {
    id: 'prod-farm-eggs',
    name: 'Limuru Free-Range Golden Yolk Pasture Eggs',
    category: 'Veg',
    subcategory: 'Cooking Staples',
    origin: 'Tigoni Pasture Farms, Kiambu',
    price: 490,
    unit: 'Tray of 15 farm eggs',
    stock: 19,
    lowStockThreshold: 10,
    image: '/src/assets/images/hero_fresh_produce_basket_1792228072880.jpg',
    harvestTime: 'Gathered by hand daily at dawn',
    organicCertified: true,
    description: 'Deep amber-orange yolks from heritage hens that roam freely on open clover pastures eating fresh bugs, greens, and non-GMO grains.',
    storageTip: 'Refrigerate pointy end down to keep yolk centered in freshness.',
    nutrition: ['Choline for Brain Health', 'Lutein & Zeaxanthin', 'Complete High Protein'],
    popular: true
  }
];
