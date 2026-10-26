import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Sun, 
  HeartHandshake, 
  Droplets, 
  Leaf, 
  ShoppingBag, 
  Check, 
  MapPin, 
  Clock, 
  ChevronRight, 
  QrCode,
  Award,
  Users,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Product } from '../../../types';

export interface HonestFoodBatch {
  batchId: string; // Must start with ARC
  produceName: string;
  category: 'Greens' | 'Roots' | 'Herbs' | 'Fruits' | 'Vines' | 'Tubers';
  attributeTag: 'Zero Residue' | 'Bio-Soil' | 'Clean Water' | 'Bee Sanctuary' | 'Solar Chilled' | 'Fair Payout';
  attribute: string; // Prominent honest food attribute
  attributeDetail: string;
  farmerName: string;
  farmerRole: string;
  farmerPhoto: string;
  farmLocation: string;
  elevation: string;
  harvestTimestamp: string;
  price: number;
  unit: string;
  image: string;
  productId: string;
  certifications: string[];
  coCreatorImpact: string;
  labTestSummary: string;
}

export const HONEST_FOOD_BATCHES: HonestFoodBatch[] = [
  {
    batchId: 'ARC-2026-KM4',
    produceName: 'Limuru Baby Spinach & Crisp Sukuma Wiki',
    category: 'Greens',
    attributeTag: 'Zero Residue',
    attribute: '0.00 ppm Synthetic Residue',
    attributeDetail: 'Push-pull bio-protection with companion African marigolds & desmodium. KEPHIS lab chromatography verified 0.00 ppm chemical sprays.',
    farmerName: 'Mama Beatrice Njeri',
    farmerRole: 'Lead Smallholder & Women Coop Founder',
    farmerPhoto: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a47?auto=format&fit=crop&w=300&q=80',
    farmLocation: 'Limuru Highland Valley, Kiambu',
    elevation: '2,240m altitude',
    harvestTimestamp: 'Today 05:14 AM dawn harvest',
    price: 180,
    unit: '500g crisp washed bunch',
    image: '/src/assets/images/product_spinach_kale_1792228088029.jpg',
    productId: 'prod-spinach-kale',
    certifications: ['Kenya-GAP Verified', 'KEPHIS Zero Chemical Certified', 'Bio-Soil Audited'],
    coCreatorImpact: 'Funds community neem press & organic biopesticide station for 48 women growers.',
    labTestSummary: 'Screened for 180 organophosphates & synthetic pyrethroids: 100% Non-detectable (ND).'
  },
  {
    batchId: 'ARC-2026-LM8',
    produceName: 'Kinangop Sweet Nantes Carrots & Beetroot',
    category: 'Roots',
    attributeTag: 'Bio-Soil',
    attribute: 'Zero Synthetic Nitrogen (Bio-Soil Bokashi)',
    attributeDetail: 'Grown exclusively in fermented bokashi compost & vermiculture worm tea. Fosters deep microbial root symbiosis without chemical fertilizers.',
    farmerName: 'Dennis Kiprono',
    farmerRole: 'Next-Gen Youth Agri-Preneur & Composting Lead',
    farmerPhoto: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=300&q=80',
    farmLocation: 'Kinangop Plateau Parcel #12, Nyandarua',
    elevation: '2,620m altitude',
    harvestTimestamp: 'Today 05:45 AM morning harvest',
    price: 190,
    unit: '1 kg crisp sweet roots',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-cooking-staples',
    certifications: ['Bio-Organic Soil Certified', 'GlobalG.A.P. Compliant', 'Zero Synthetic Fertilizer'],
    coCreatorImpact: 'Builds 2 new automated bokashi bio-reactors, replacing 4.2 tons of imported synthetic fertilizers.',
    labTestSummary: 'Nitrate accumulation: 68% below WHO safety ceiling; Brix sweetness rating: 11.4°.'
  },
  {
    batchId: 'ARC-2026-NG2',
    produceName: 'Naivasha Highland Mint & Culinary Herb Bundle',
    category: 'Herbs',
    attributeTag: 'Clean Water',
    attribute: 'Pure Mountain Spring Water Tested',
    attributeDetail: 'Irrigated solely by gravity-fed volcanic mountain springs. Regularly tested and certified zero industrial runoff, coliforms, or heavy metals.',
    farmerName: 'Lucy Wangari',
    farmerRole: 'Agro-Ecology Herb Specialist',
    farmerPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80',
    farmLocation: 'Naivasha Spring Basin, Rift Valley',
    elevation: '1,890m altitude',
    harvestTimestamp: 'Today 06:10 AM dawn harvest',
    price: 150,
    unit: '300g fragrant bundled harvest',
    image: '/src/assets/images/category_aromatics_1792245411534.jpg',
    productId: 'prod-highland-aromatics',
    certifications: ['Clean Spring Water Certified', 'Kenya-GAP Audited', 'Pesticide 0.00 ppm'],
    coCreatorImpact: 'Protects 14km of natural spring catchment riparian zone with indigenous bamboo replanting.',
    labTestSummary: 'Microbiological count < 10 CFU/ml; lead and arsenic: Below detectable limit (< 0.001 mg/L).'
  },
  {
    batchId: 'ARC-2026-MR3',
    produceName: 'Murang\'a Export-Grade Organic Hass Avocados',
    category: 'Fruits',
    attributeTag: 'Bee Sanctuary',
    attribute: 'Bee Sanctuary Restored (300+ Hives)',
    attributeDetail: 'Orchards bordered by 300+ native stingless bee colonies. Strictly zero neonicotinoid or flowering sprays, restoring wild pollination biodiversity.',
    farmerName: 'Mzee Peter Karanja',
    farmerRole: 'Elder Agroforestry Guardian',
    farmerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    farmLocation: 'Murang\'a Volcanic Ridge, Central Kenya',
    elevation: '1,750m altitude',
    harvestTimestamp: 'Yesterday afternoon hand-picked',
    price: 320,
    unit: '1 kg pack (~4 ripe avocados)',
    image: '/src/assets/images/product_hass_avocado_1792228088344.jpg',
    productId: 'prod-avocado-hass',
    certifications: ['Regenerative Organic Certified', 'Native Pollinator Safe', 'Kenya-GAP Standard'],
    coCreatorImpact: 'Subsidizes 20 modern Langstroth beehives for youth beekeepers in Murang\'a.',
    labTestSummary: 'Zero organochlorine or synthetic neonicotinoids detected. Oleic acid lipid ratio: 71.8%.'
  },
  {
    batchId: 'ARC-2026-SK1',
    produceName: 'Subukia Sun-Drenched Cluster Tomatoes',
    category: 'Vines',
    attributeTag: 'Solar Chilled',
    attribute: '100% Solar Hydro-Cooled (3.8°C Cold Chain)',
    attributeDetail: 'Pre-cooled within 40 minutes of harvest in our solar-powered micro-hub, locking in 98% of natural vitamin C and crisp cell wall firmness.',
    farmerName: 'Faith Cherono',
    farmerRole: 'Solar Drip Irrigation Pioneer',
    farmerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    farmLocation: 'Subukia Escarpment, Nakuru County',
    elevation: '2,100m altitude',
    harvestTimestamp: 'Today 06:30 AM morning pick',
    price: 220,
    unit: '1 kg vine-ripened crate',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-salads-crunchy',
    certifications: ['Solar Cold Chain Certified', '100% Zero-Spoilage Protocol', 'Traceable Batch QR'],
    coCreatorImpact: 'Powers community cold-storage lockers for 62 smallholders, preventing post-harvest distress sales.',
    labTestSummary: 'Lycopene concentration: 48 mg/kg; Firmness test: 4.8 kg/cm²; Zero post-harvest fungicide bath.'
  },
  {
    batchId: 'ARC-2026-NY5',
    produceName: 'Nyandarua Golden Butter Highland Potatoes',
    category: 'Tubers',
    attributeTag: 'Fair Payout',
    attribute: '24-Hr Direct M-Pesa Payout (79.2% Parity)',
    attributeDetail: 'Middlemen eliminated. Transparent digital weighing and immediate mobile money payout within 24 hours directly to the farm household.',
    farmerName: 'Joseph Mwangi',
    farmerRole: 'Smallholder Potato Association Chair',
    farmerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    farmLocation: 'Ol Kalou Highland Valley, Nyandarua',
    elevation: '2,480m altitude',
    harvestTimestamp: 'Today 06:00 AM cured harvest',
    price: 260,
    unit: '2 kg ventilated paper sack',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-cooking-staples',
    certifications: ['Audited Fair Trade Kenya', 'Smallholder Equity Verified', 'Kenya-GAP Certified'],
    coCreatorImpact: 'Guarantees direct school fee payments for smallholder children with guaranteed forward contracts.',
    labTestSummary: 'Starch solids: 21.2%; Soil pesticide residue: Below detectable limits.'
  }
];

export const SupportHonestFood: React.FC = () => {
  const { products, addToCart, setViewMode } = useStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [backedBatches, setBackedBatches] = useState<Record<string, boolean>>({});
  const [selectedBatchForModal, setSelectedBatchForModal] = useState<HonestFoodBatch | null>(null);

  const filterOptions = [
    { id: 'all', label: 'All ARC Batches' },
    { id: 'Zero Residue', label: '0.00 ppm Residue' },
    { id: 'Bio-Soil', label: 'Bio-Soil' },
    { id: 'Clean Water', label: 'Clean Water' },
    { id: 'Bee Sanctuary', label: 'Bee Sanctuary' },
    { id: 'Solar Chilled', label: 'Solar Chilled' },
    { id: 'Fair Payout', label: 'Fair Payout' }
  ];

  const filteredBatches = activeFilter === 'all' 
    ? HONEST_FOOD_BATCHES 
    : HONEST_FOOD_BATCHES.filter(b => b.attributeTag === activeFilter);

  const handleSupportBatch = (batch: HonestFoodBatch) => {
    // Look up product in catalog or craft matching product item
    const existingProduct = products.find(p => p.id === batch.productId);
    const productToAdd: Product = existingProduct || {
      id: batch.productId,
      name: batch.produceName,
      category: 'Veg',
      subcategory: 'Cooking Staples',
      origin: batch.farmLocation,
      price: batch.price,
      unit: batch.unit,
      stock: 30,
      lowStockThreshold: 5,
      image: batch.image,
      harvestTime: batch.harvestTimestamp,
      organicCertified: true,
      description: `${batch.produceName} (Batch ${batch.batchId}). Verified Attribute: ${batch.attribute}. Grown by ${batch.farmerName}.`,
      storageTip: 'Store in cool highland conditions or crisping compartment.',
      nutrition: ['Bio-Ecological Nutrient Density', 'Zero Chemical Residue'],
      popular: true
    };

    addToCart(productToAdd, 1);

    // Provide immediate visual confirmation
    setBackedBatches(prev => ({ ...prev, [batch.batchId]: true }));
    setTimeout(() => {
      setBackedBatches(prev => ({ ...prev, [batch.batchId]: false }));
    }, 2800);
  };

  return (
    <section id="support-honest-food" className="bg-[#173b28] text-white rounded-3xl p-5 sm:p-8 space-y-7 shadow-lg border border-emerald-800/80">
      {/* Header & Co-Creator Mandate */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-800/80 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-extrabold">
              Consumer Co-Creator Programme
            </span>
          </div>

          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Support honest food
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Every harvest batch below bears our sovereign batch prefix <strong className="font-mono text-amber-300 font-bold">ARC</strong> (Arcana Regenerative Circle). By backing these batches, you directly co-create Kenya&apos;s clean food value chain—ensuring chemical-free harvest, living smallholder wages, and solar cold distribution.
          </p>
        </div>

        {/* Quick Co-Creator Transparency Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 shrink-0">
          <div className="bg-emerald-900/80 border border-emerald-700/60 rounded-2xl p-2.5 sm:p-3 text-center">
            <div className="font-mono font-black text-amber-300 text-base sm:text-lg">ARC</div>
            <div className="text-[10px] text-emerald-200/90 font-medium uppercase tracking-wider">Batch Prefix</div>
          </div>
          <div className="bg-emerald-900/80 border border-emerald-700/60 rounded-2xl p-2.5 sm:p-3 text-center">
            <div className="font-mono font-black text-emerald-300 text-base sm:text-lg">100%</div>
            <div className="text-[10px] text-emerald-200/90 font-medium uppercase tracking-wider">Audited Attribute</div>
          </div>
        </div>
      </div>

      {/* Attribute Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-mono text-emerald-300/80 font-bold uppercase tracking-wider pr-1 shrink-0">
          Filter Attribute:
        </span>
        {filterOptions.map(option => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.id)}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              activeFilter === option.id
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/80 border border-emerald-800'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Grid of Foods under batch prefix ARC, each with its Attribute */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBatches.map(batch => {
          const isBacked = backedBatches[batch.batchId];

          return (
            <div 
              key={batch.batchId}
              className="bg-white text-stone-900 rounded-2xl overflow-hidden shadow-md border border-stone-200/90 flex flex-col justify-between hover:shadow-lg transition-all duration-200 group"
            >
              <div>
                {/* Batch Header Bar & Image */}
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img 
                    src={batch.image} 
                    alt={batch.produceName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/30" />

                  {/* Batch Prefix Badge (ARC) */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#173b28]/95 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-xl text-xs font-mono font-extrabold border border-amber-400/40 shadow-sm">
                    <QrCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{batch.batchId}</span>
                  </div>

                  {/* Farmer Thumbnail overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-full py-0.5 px-2 shadow-xs border border-stone-200">
                    <img 
                      src={batch.farmerPhoto} 
                      alt={batch.farmerName} 
                      className="w-4.5 h-4.5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-bold text-stone-800 truncate max-w-[100px]">
                      {batch.farmerName.split(' ')[0]}
                    </span>
                  </div>

                  {/* Produce Title Overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-300 font-bold">
                      {batch.category} · {batch.farmLocation.split(',')[0]}
                    </div>
                    <h4 className="font-display font-extrabold text-base leading-snug drop-shadow-xs line-clamp-1">
                      {batch.produceName}
                    </h4>
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="p-4 space-y-3.5">
                  {/* Origin & Smallholder Row */}
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{batch.farmLocation}</span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-stone-600 shrink-0">
                      {batch.elevation}
                    </span>
                  </div>

                  {/* PROMINENT HONEST FOOD ATTRIBUTE BOX */}
                  <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="text-[10px] font-mono uppercase font-black tracking-wider text-emerald-800">
                        Attribute Verified
                      </span>
                    </div>
                    <div className="font-display font-black text-xs sm:text-sm text-stone-950 leading-tight">
                      {batch.attribute}
                    </div>
                    <p className="text-[11px] text-stone-700 leading-relaxed">
                      {batch.attributeDetail}
                    </p>
                  </div>

                  {/* Co-Creator Impact */}
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/80 rounded-lg p-2 border border-emerald-100/90 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="leading-tight">
                      <strong className="font-semibold text-emerald-950">Impact: </strong>
                      {batch.coCreatorImpact}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price, Action & Details Footer */}
              <div className="p-4 pt-0 border-t border-stone-100 space-y-2.5">
                <div className="flex items-baseline justify-between pt-2.5">
                  <div>
                    <span className="font-display font-black text-lg text-stone-900">
                      KSh {batch.price}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium ml-1">
                      / {batch.unit}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBatchForModal(batch)}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
                  >
                    View passport
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleSupportBatch(batch)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isBacked
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#173b28] hover:bg-[#122e1f] text-white shadow-xs hover:shadow-md'
                  }`}
                >
                  {isBacked ? (
                    <>
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>Added to Your Honest Box!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>Support Batch ({batch.batchId})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Co-Creator Guarantee Footer Note */}
      <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">
              The Savannah Arcana Co-Creator Pledge
            </div>
            <div className="text-emerald-200/80 text-[11px] mt-0.5">
              100% of ARC batches are pre-financed at fair rates, packed in biodegradable banana-fiber, and delivered cold via electric fleet.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setViewMode('store')}
          className="px-4 py-2 rounded-xl bg-white text-[#173b28] font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
        >
          Browse Full Store
        </button>
      </div>

      {/* Interactive Batch Detail Modal */}
      {selectedBatchForModal && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedBatchForModal(null)}
        >
          <div 
            className="bg-white text-stone-900 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <span className="font-mono text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  BATCH {selectedBatchForModal.batchId}
                </span>
                <h4 className="font-display font-extrabold text-lg text-stone-900 mt-1">
                  {selectedBatchForModal.produceName}
                </h4>
                <div className="text-xs text-stone-500">
                  {selectedBatchForModal.farmLocation} · {selectedBatchForModal.elevation}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatchForModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <img 
                src={selectedBatchForModal.farmerPhoto} 
                alt={selectedBatchForModal.farmerName} 
                className="w-12 h-12 rounded-xl object-cover border border-emerald-600"
                referrerPolicy="no-referrer"
              />
              <div className="text-xs">
                <div className="font-bold text-stone-900">{selectedBatchForModal.farmerName}</div>
                <div className="text-stone-500">{selectedBatchForModal.farmerRole}</div>
                <div className="text-emerald-700 font-semibold text-[11px] mt-0.5">{selectedBatchForModal.harvestTimestamp}</div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified Attribute: {selectedBatchForModal.attribute}</span>
              </div>
              <p className="text-emerald-900/90 leading-relaxed text-[11px]">
                {selectedBatchForModal.attributeDetail}
              </p>
              <div className="pt-2 border-t border-emerald-200/70 text-[11px] text-stone-700">
                <strong className="text-emerald-950">Laboratory Analysis: </strong>
                {selectedBatchForModal.labTestSummary}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-stone-700 mb-1.5">Audited Certifications:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedBatchForModal.certifications.map((c, i) => (
                  <span key={i} className="text-[10px] font-semibold bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg border border-stone-200">
                    ✓ {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-200 gap-3">
              <div>
                <span className="font-display font-black text-xl text-stone-900">
                  KSh {selectedBatchForModal.price}
                </span>
                <span className="text-xs text-stone-500 ml-1">/ {selectedBatchForModal.unit}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleSupportBatch(selectedBatchForModal);
                  setSelectedBatchForModal(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#173b28] hover:bg-[#122e1f] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Support Batch ({selectedBatchForModal.batchId})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
