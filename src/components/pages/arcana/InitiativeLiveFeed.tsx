import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Users,
  Check,
  LucideIcon,
  ShoppingBag,
  Sprout,
  Building2,
  Award,
  Ticket,
  Clock,
  MapPin,
  Flame,
  CheckCircle,
  HelpCircle,
  Calendar,
  Truck
} from 'lucide-react';

export interface CropOfftake {
  crop: string;
  percent: number;
  fulfilled: number;
  target: number;
}

export interface FeedBatchItem {
  type: 'traceability' | 'farmers' | 'green';
  product: string;
  sourcingRegion: string;
  areasInRegion?: string;
  predominantCrops?: string;
  farmerCount?: string;
  lastEventDate?: string;
  landId: string;
  farmCode?: string;
  certifications?: string[];
  offtaking?: CropOfftake[];
  batchNumber: string;
  parity: string;
  image: string;
  attributes: string[];
  detail?: string;
  metric?: string;
  greenType?: 'Operations' | 'Logistics' | 'Environment';
}

export interface TelemetryMetricItem {
  category: string;
  value: string;
  unit?: string;
  label: string;
  detail: string;
  icon: LucideIcon;
}

interface InitiativeLiveFeedProps {
  activeTab: 'traceability' | 'farmers' | 'green';
  initiativeLabel: string;
}

export interface InitiativePoint {
  label: string;
  detail: string;
  icon: LucideIcon;
}

interface InitiativeDetailConfig {
  description: string;
  points: InitiativePoint[];
}

const INITIATIVE_DETAILS: Record<'traceability' | 'farmers' | 'green', InitiativeDetailConfig> = {
  traceability: {
    description: 'We are supporting farms to grow honest food by building capacity on Good Agricultural Practices and providing intentional market',
    points: [
      { label: 'Bio-chemicals', detail: 'Organic microbial & bio-pest protection', icon: Sprout },
      { label: 'Pre-harvest interval', detail: 'Strict waiting period before safe picking', icon: Clock },
      { label: 'Post-harvest handling', detail: 'Dawn hydro-cooling & certified sorting', icon: CheckCircle2 },
      { label: 'Arcana audits', detail: 'Comprehensive GAP compliance & residue testing', icon: ShieldCheck }
    ]
  },
  farmers: {
    description: 'Happy farmers are knowledgeable farmers who are paid promptly and assured of markets. We aggregate our farmer groups and link them with valuable partners.',
    points: [
      { label: '24 hour payment', detail: 'Instant digital scale-to-mobile settlement', icon: CheckCircle2 },
      { label: 'Net Promoter Score survey', detail: 'Audited smallholder satisfaction (+88 NPS)', icon: HeartHandshake },
      { label: 'Farmer training', detail: 'Agronomic capacity building & GAP practices', icon: Users },
      { label: 'Collective crop calendars', detail: 'Synchronized planting and staggered harvest planning', icon: Calendar }
    ]
  },
  green: {
    description: 'We purpose to have our fulfillment hub and last mile delivery powered by solar energy. Eliminating delivery tailpipe and urban air population.',
    points: [
      { label: 'Last mile green deliveries', detail: '100% electric cargo vans & bikes', icon: CheckCircle2 },
      { label: 'Tree planting CSR', detail: 'Indigenous highland tree nursery & border planting', icon: Sprout },
      { label: 'Solar powered fulfillment hub', detail: '120 kWp solar hub & LiFePO4 storage array', icon: Building2 },
      { label: '90%+ Logistics capacity utilisation', detail: 'Route optimization eliminating dead miles', icon: Truck }
    ]
  }
};

const ALL_BASKET_PREFERENCES = [
  'Indigenous greens (managu, terere, saget)',
  'Crisp salad greens (baby spinach, sweet kale, arugula)',
  'High-altitude roots (heirloom carrots, baby beetroot)',
  'Ripe Hass avocados & seasonal orchard fruits',
  'Fresh organic culinary herbs (coriander, mint, rosemary)',
  'Pastured farm-fresh organic eggs',
  'Cold-pressed virgin culinary oils & raw honey',
  'Solar-chilled dawn-harvest delivery',
  'QR code harvest passport on each crate'
];

export const InitiativeLiveFeed: React.FC<InitiativeLiveFeedProps> = ({ 
  activeTab, 
  initiativeLabel
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<FeedBatchItem | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinRole, setJoinRole] = useState<'consumer' | 'farmer' | 'partner'>('consumer');
  const [joinName, setJoinName] = useState('');
  const [joinContact, setJoinContact] = useState('');

  // Consumer-specific inputs
  const [consumerArea, setConsumerArea] = useState('Kilimani / Kileleshwa');
  const [consumerHousehold, setConsumerHousehold] = useState('Family (3-4 people)');
  const [consumerBasketItems, setConsumerBasketItems] = useState<string[]>([
    'Crisp salad greens (baby spinach, sweet kale, arugula)',
    'Ripe Hass avocados & seasonal orchard fruits'
  ]);
  const [consumerWishlist, setConsumerWishlist] = useState('');

  // Farmer-specific inputs
  const [farmerRegion, setFarmerRegion] = useState('Kiambu County');
  const [farmerAcreage, setFarmerAcreage] = useState('1 - 3 Acres');
  const [farmerCrops, setFarmerCrops] = useState('Sukuma wiki, Spinach & Culinary Herbs');
  const [farmerPractice, setFarmerPractice] = useState('Transitioning to Bio-Inputs');
  const [farmerNeed, setFarmerNeed] = useState('Guaranteed Fair Floor Price & 24hr M-Pesa Settlement');

  // Partner-specific inputs
  const [partnerOrg, setPartnerOrg] = useState('');
  const [partnerDomain, setPartnerDomain] = useState('Cold-Chain Logistics & Solar Storage');
  const [partnerProposal, setPartnerProposal] = useState('');

  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [assignedTicket] = useState(69);

  const toggleConsumerBasketItem = (item: string) => {
    setConsumerBasketItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  // Content for Traceability: ARC batches ready for traceability
  const traceabilityBatches: FeedBatchItem[] = [
    {
      type: 'traceability',
      product: 'Highland Sukuma Wiki & Baby Spinach',
      sourcingRegion: 'Limuru Highlands',
      landId: 'LM482A',
      farmCode: 'ARC-LM482A/0326',
      certifications: ['GlobalG.A.P. IFA v6', 'KOAN Organic', 'KEPHIS 0.00ppm'],
      offtaking: [
        { crop: 'Sukuma Wiki', percent: 92, fulfilled: 920, target: 1000 },
        { crop: 'Baby Spinach', percent: 86, fulfilled: 430, target: 500 }
      ],
      batchNumber: 'ARC-20261023-LM482A',
      parity: '79.2%',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80',
      attributes: ['0.00 ppm Residue', 'Solar Chilled 3.8°C'],
      detail: 'Push-pull bio-protection with companion African marigolds & desmodium. KEPHIS lab chromatography verified 0.00 ppm chemical sprays.'
    },
    {
      type: 'traceability',
      product: 'Kinangop Sweet Nantes Carrots',
      sourcingRegion: 'Kinangop Plateau',
      landId: 'KG912B',
      farmCode: 'ARC-KG912B/0418',
      certifications: ['Bio-Char Organic', 'Living Soil GAP', 'Non-GMO Verified'],
      offtaking: [
        { crop: 'Nantes Carrots', percent: 88, fulfilled: 880, target: 1000 },
        { crop: 'Baby Beetroots', percent: 95, fulfilled: 380, target: 400 }
      ],
      batchNumber: 'ARC-20261023-KG912B',
      parity: '81.4%',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80',
      attributes: ['Zero Synthetic Nitrogen', 'Bio-Char Enriched'],
      detail: 'Grown exclusively in fermented bokashi compost & vermiculture worm tea. Fosters deep microbial root symbiosis without chemical fertilizers.'
    },
    {
      type: 'traceability',
      product: 'Heirloom Sweet Mint & Culinary Herbs',
      sourcingRegion: 'Naivasha Spring Basin',
      landId: 'NV302C',
      farmCode: 'ARC-NV302C/0105',
      certifications: ['Volcanic Spring Tested', 'Heavy-Metal Free', 'HCD Approved'],
      offtaking: [
        { crop: 'Sweet Mint & Herbs', percent: 94, fulfilled: 470, target: 500 },
        { crop: 'Crisp Coriander', percent: 89, fulfilled: 356, target: 400 }
      ],
      batchNumber: 'ARC-20261023-NV302C',
      parity: '80.0%',
      image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=300&q=80',
      attributes: ['Spring Drip Fed', 'Banana-Fiber Packed'],
      detail: 'Irrigated solely by gravity-fed volcanic mountain springs. Regularly tested and certified zero industrial runoff, coliforms, or heavy metals.'
    },
    {
      type: 'traceability',
      product: 'Export-Grade Hass Avocados',
      sourcingRegion: 'Murang\'a Slopes',
      landId: 'MR708D',
      farmCode: 'ARC-MR708D/0722',
      certifications: ['Native Bee Sanctuary', 'GlobalG.A.P.', 'Zero Neonicotinoids'],
      offtaking: [
        { crop: 'Hass Avocados', percent: 96, fulfilled: 1920, target: 2000 }
      ],
      batchNumber: 'ARC-20261022-MR708D',
      parity: '82.5%',
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80',
      attributes: ['Bee Sanctuary Restored', '0.00 ppm Residue'],
      detail: 'Orchards bordered by 300+ native stingless bee colonies. Strictly zero neonicotinoid or flowering sprays, restoring wild pollination biodiversity.'
    },
    {
      type: 'traceability',
      product: 'Subukia Cluster Tomatoes',
      sourcingRegion: 'Subukia Escarpment',
      landId: 'SB503E',
      farmCode: 'ARC-SB503E/0514',
      certifications: ['Solar Hydro-Cooled', 'Push-Pull Bio-Shield', 'GAP Certified'],
      offtaking: [
        { crop: 'Cluster Tomatoes', percent: 90, fulfilled: 1350, target: 1500 }
      ],
      batchNumber: 'ARC-20261023-SB503E',
      parity: '78.9%',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80',
      attributes: ['Solar Hydro-Cooled', 'Push-Pull Bio-Shield'],
      detail: 'Solar hydro-cooled to 4°C within 35 minutes of dawn harvest. Sealed in returnable crates with zero chemical fumigation.'
    },
    {
      type: 'traceability',
      product: 'Nyandarua Golden Butter Potatoes',
      sourcingRegion: 'Ol Kalou Ridge',
      landId: 'OK815F',
      farmCode: 'ARC-OK815F/0830',
      certifications: ['Peat Loam Certified', 'Bluetooth Scale Verified', 'KOAN Partner'],
      offtaking: [
        { crop: 'Golden Butter Potatoes', percent: 91, fulfilled: 2275, target: 2500 }
      ],
      batchNumber: 'ARC-20261023-OK815F',
      parity: '83.1%',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80',
      attributes: ['Peat Loam Grown', 'Digital Scale Verified'],
      detail: 'High altitude volcanic soil tubers weighed via Bluetooth digital scales with direct scale-to-mobile settlement.'
    }
  ];

  // Content for Farmer Welfare: Farmer stats & live settlement records
  const farmerWelfareStats: FeedBatchItem[] = [
    {
      type: 'farmers',
      product: 'Kiambu Smallholders Group',
      sourcingRegion: 'Kiambu County',
      areasInRegion: 'Limuru, Githunguri, Lari & Tigoni',
      predominantCrops: 'Sukuma Wiki, Baby Spinach & Sweet Leeks',
      farmerCount: '420 Farmers',
      lastEventDate: 'Oct 26, 2026',
      landId: 'LM482A',
      batchNumber: 'FRM-2026-LM482A',
      parity: '79.2%',
      image: '',
      attributes: ['24-Hr M-Pesa Settlement', 'Bio-Input Capacity', 'GAP Certified'],
      detail: 'Lead Smallholder & Women Coop Founder · Direct scale-to-mobile settlement with zero broker deductions.'
    },
    {
      type: 'farmers',
      product: 'Kinangop Plateau Smallholders',
      sourcingRegion: 'Kinangop Plateau',
      areasInRegion: 'Engineer, North Kinangop & Magumu',
      predominantCrops: 'Nantes Carrots, Baby Beetroots & Cabbages',
      farmerCount: '310 Farmers',
      lastEventDate: 'Oct 25, 2026',
      landId: 'KG912B',
      batchNumber: 'FRM-2026-KG912B',
      parity: '81.4%',
      image: '',
      attributes: ['Living Soil Compost', 'No Middlemen', '81.4% Value Retained'],
      detail: 'Next-Gen Youth Agri-Preneur · Matched bio-soil input rebate and automated bokashi bio-reactor deployment.'
    },
    {
      type: 'farmers',
      product: 'Naivasha Basin Farmers Union',
      sourcingRegion: 'Naivasha Spring Basin',
      areasInRegion: 'South Lake, Moi Ndabi & Mai Mahiu',
      predominantCrops: 'Sweet Mint, Fresh Coriander & Culinary Herbs',
      farmerCount: '280 Farmers',
      lastEventDate: 'Oct 24, 2026',
      landId: 'NV302C',
      batchNumber: 'FRM-2026-NV302C',
      parity: '80.0%',
      image: '',
      attributes: ['Volcanic Spring Tested', 'Women Lead Coop', 'Digital Scale Verified'],
      detail: 'Women Agro-Ecology Coop · Riparian catchment guardian preserving 14km of natural mountain springs.'
    },
    {
      type: 'farmers',
      product: 'Murang\'a Orchard Growers',
      sourcingRegion: 'Murang\'a County',
      areasInRegion: 'Kangema, Mathioya & Kigumo',
      predominantCrops: 'Export Hass Avocados & Tree Tomatoes',
      farmerCount: '340 Farmers',
      lastEventDate: 'Oct 23, 2026',
      landId: 'MR708D',
      batchNumber: 'FRM-2026-MR708D',
      parity: '82.5%',
      image: '',
      attributes: ['Native Bee Sanctuary', 'Fair Floor Guaranteed', '82.5% Value Retained'],
      detail: 'Elder Agroforestry Guardian · 20 new native stingless beehives installed to restore highland wild pollinators.'
    },
    {
      type: 'farmers',
      product: 'Subukia Valley Farmers',
      sourcingRegion: 'Subukia Escarpment',
      areasInRegion: 'Subukia Valley, Kabazi & Bahati',
      predominantCrops: 'Cluster Tomatoes & Sweet Bell Peppers',
      farmerCount: '190 Farmers',
      lastEventDate: 'Oct 22, 2026',
      landId: 'SB503E',
      batchNumber: 'FRM-2026-SB503E',
      parity: '78.9%',
      image: '',
      attributes: ['Solar Hydro-Cooled', 'Push-Pull Bio-Shield', 'NPS +88 Audited'],
      detail: '60% water conservation yield · Push-pull organic bio-shield against stemborers and fall armyworm.'
    },
    {
      type: 'farmers',
      product: 'Nyandarua Potato Growers',
      sourcingRegion: 'Nyandarua Ridge',
      areasInRegion: 'Ol Kalou, Shamata & Wanjohi',
      predominantCrops: 'Golden Butter Potatoes & Highland Peas',
      farmerCount: '260 Farmers',
      lastEventDate: 'Oct 21, 2026',
      landId: 'OK815F',
      batchNumber: 'FRM-2026-OK815F',
      parity: '83.1%',
      image: '',
      attributes: ['Bluetooth Scale Weighed', 'Zero Rounding Losses', '83.1% Value Retained'],
      detail: 'Smallholder Association Chair · Instant digital receipting with zero arbitrary weight rounding.'
    }
  ];

  // Content for Green Deliveries: Key Sustainability Initiatives & Commitments
  const greenOperationsLogs: FeedBatchItem[] = [
    {
      type: 'green',
      product: 'Last Mile Green Deliveries',
      sourcingRegion: 'Nairobi Metropolitan & Residential Corridors',
      landId: 'INIT-GRN-01',
      batchNumber: 'INIT-GRN-01',
      metric: '100% Zero-Emission Fleet',
      greenType: 'Logistics',
      parity: '100%',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80',
      attributes: ['Electric Cargo Vans', 'Solar Swappable Batteries', 'Zero Tailpipe CO₂'],
      detail: 'Operating dedicated 100% electric cargo vans and e-bikes for whisper-quiet, zero-emission last mile deliveries across urban residential routes.'
    },
    {
      type: 'green',
      product: 'Solar Powered Fulfillment Hub',
      sourcingRegion: 'Central Aggregation & Cold-Chain Depot',
      landId: 'INIT-GRN-02',
      batchNumber: 'INIT-GRN-02',
      metric: '182,000 kWh/yr Clean Solar',
      greenType: 'Environment',
      parity: '100%',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80',
      attributes: ['120 kWp Solar Array', '240 kWh LiFePO4 Bank', '100% Off-Grid Chilling'],
      detail: 'Rooftop photovoltaic generation and LiFePO4 battery array powering uncompromised sub-4°C produce cooling without fossil-fuel backup generators.'
    },
    {
      type: 'green',
      product: '90%+ Logistics Capacity Utilisation',
      sourcingRegion: 'Smart Route Scheduling & Load Bundling',
      landId: 'INIT-GRN-03',
      batchNumber: 'INIT-GRN-03',
      metric: '90%+ Route Fill-Rate',
      greenType: 'Logistics',
      parity: '92%',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      attributes: ['Zero Empty Dead Miles', 'Automated Load Pooling', 'Traffic Congestion Relief'],
      detail: 'Intelligent route consolidation and high-density drop clustering to eliminate empty mileage, reduce congestion, and lower delivery energy intensity.'
    },
    {
      type: 'green',
      product: 'Tree Planting CSR & Carbon Sinks',
      sourcingRegion: 'Highland Agroforestry & Water Catchments',
      landId: 'INIT-GRN-04',
      batchNumber: 'INIT-GRN-04',
      metric: '12,500 Seedlings / Year',
      greenType: 'Environment',
      parity: '100%',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80',
      attributes: ['Indigenous Tree Nurseries', 'Windbreak Corridors', 'Riparian Protection'],
      detail: 'Collaborating with smallholder partner groups to plant indigenous trees, restore vulnerable riparian catchments, and develop durable carbon sinks.'
    },
    {
      type: 'green',
      product: 'Zero Single-Use Plastic Packaging',
      sourcingRegion: 'Closed-Loop Food Packaging & Crating',
      landId: 'INIT-GRN-05',
      batchNumber: 'INIT-GRN-05',
      metric: '100% Plastic-Free Outer',
      greenType: 'Operations',
      parity: '96%',
      image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=400&q=80',
      attributes: ['Sanitized Reusable Crates', 'Banana-Fiber Liners', 'Circular Distribution'],
      detail: 'Sanitized returnable produce crates and biodegradable unbleached banana-fiber liners that eliminate single-use polyethylene packaging.'
    },
    {
      type: 'green',
      product: 'Urban Air Pollution Abatement',
      sourcingRegion: 'Residential Neighborhood Air Quality',
      landId: 'INIT-GRN-06',
      batchNumber: 'INIT-GRN-06',
      metric: '0.0 ppm PM2.5 / Soot',
      greenType: 'Environment',
      parity: '100%',
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80',
      attributes: ['Zero Diesel Particulates', 'Quiet Electric Motors', 'Healthy Neighborhoods'],
      detail: 'Actively eliminating toxic diesel soot and acoustic disturbance along Nairobi residential streets through clean, solar-charged last mile mobility.'
    }
  ];

  const renderFeedCards = (items: FeedBatchItem[]) => (
    <>
      {items.concat(items).map((item, idx) => {
        // Collect all pills for continuous horizontal autoscroll
        const pillItems = [
          ...(item.type === 'green' ? [] : [
            {
              key: 'land',
              label: item.landId,
              style: 'bg-stone-100 text-stone-700 border-stone-200 font-mono font-bold'
            }
          ]),
          {
            key: 'parity',
            label: `${item.parity} ${item.type === 'green' ? 'Clean Energy' : 'Arcana Parity'}`,
            style: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-mono font-bold'
          },
          {
            key: 'cocreate',
            label: 'Co-Create',
            style: 'bg-amber-50 text-amber-900 border-amber-300 font-sans font-bold'
          },
          ...item.attributes.map((attr, aIdx) => ({
            key: `attr-${aIdx}`,
            label: attr,
            style: attr === 'top 10% earner'
              ? 'bg-amber-100 text-amber-950 border-amber-300 font-semibold font-mono'
              : attr === '2 certifications'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold font-mono'
              : attr === 'verified audits'
              ? 'bg-sky-50 text-sky-900 border-sky-200 font-semibold font-mono'
              : 'bg-stone-50 text-stone-600 border-stone-200/80 font-mono'
          }))
        ];

        if (item.type === 'traceability') {
          return (
            <div 
              key={`${item.batchNumber}-${idx}`}
              className="bg-white rounded-2xl p-2.5 sm:p-3.5 border border-stone-200/80 shadow-2xs hover:border-emerald-400 transition-colors flex flex-col gap-2.5 text-xs w-full min-w-0"
            >
              {/* Header spanning from the top of the image */}
              <div className="font-display font-extrabold text-stone-900 text-xs sm:text-[13.5px] leading-tight truncate w-full">
                Farm/Plot: {item.farmCode || `ARC-${item.landId}/0326`}
              </div>

              {/* Middle Section: Left image + Right details */}
              <div className="flex items-start gap-3 sm:gap-4 w-full">
                {/* Farm Image */}
                <img 
                  src={item.image} 
                  alt={item.product} 
                  className="w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-2xl object-cover shrink-0 border border-stone-200/90 shadow-2xs"
                  loading="lazy"
                />

                {/* Right column: Sourcing region above offtaking performance, followed by performance bars */}
                <div className="flex flex-col min-w-0 flex-1 justify-center space-y-1 overflow-hidden">
                  {/* Sourcing region above Offtaking Performance */}
                  <div className="text-[10.5px] sm:text-[11px] font-sans font-semibold text-stone-700 truncate leading-snug">
                    {item.sourcingRegion}
                  </div>

                  <div className="text-[9px] sm:text-[9.5px] font-mono uppercase tracking-wider text-stone-400 font-bold leading-none">
                    offtaking performance
                  </div>

                  <div className="space-y-1.5 pt-0.5">
                    {(item.offtaking || [
                      { crop: item.product, percent: 88, fulfilled: 880, target: 1000 }
                    ]).map((crop, cIdx) => (
                      <div key={cIdx} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] leading-tight">
                          <span className="flex items-center gap-1 font-medium text-stone-700 truncate">
                            <Sprout className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{crop.crop}</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-900 text-[9px] sm:text-[9.5px] tabular-nums shrink-0 ml-1.5">
                            {crop.percent}% ({crop.fulfilled}/{crop.target} kg)
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden border border-stone-200/60">
                          <div 
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${crop.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Pill tags starting from below the image and spanning the whole length, with view CTA */}
              <div className="w-full flex items-center justify-between gap-1.5 pt-1 border-t border-stone-100">
                {/* The pill tags starting from below the image and spanning the whole length */}
                <div className="flex flex-wrap items-center gap-1 min-w-0 flex-1">
                  {(item.certifications || item.attributes).map((cert, cIdx) => (
                    <span 
                      key={cIdx}
                      className="text-[7px] sm:text-[7.5px] font-mono font-semibold px-1.5 py-[1.5px] rounded-full border border-emerald-200/80 bg-emerald-50/90 text-emerald-900 whitespace-nowrap leading-none tracking-tight shadow-2xs"
                    >
                      {cert}
                    </span>
                  ))}
                </div>

                {/* Eventually: "view" CTA as it is presently */}
                <button
                  type="button"
                  onClick={() => {
                    setJoinRole('consumer');
                    setJoinSubmitted(false);
                    if (item.product) {
                      setConsumerBasketItems(prev => {
                        if (prev.includes(item.product)) return prev;
                        if (prev.length >= 4) {
                          return [...prev.slice(0, 3), item.product];
                        }
                        return [...prev, item.product];
                      });
                    }
                    setShowJoinModal(true);
                  }}
                  className="inline-flex items-center gap-0.5 text-[7.5px] sm:text-[8px] font-sans font-extrabold text-stone-900 hover:text-emerald-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/70 px-2 py-[2.5px] rounded-md transition-all leading-none cursor-pointer shrink-0 shadow-2xs group"
                >
                  <span>view</span>
                  <ChevronRight className="w-2.5 h-2.5 text-stone-900 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        }

        if (item.type === 'farmers') {
          return (
            <div 
              key={`${item.batchNumber}-${idx}`}
              className="bg-white rounded-2xl p-3 sm:p-3.5 border border-stone-200/80 shadow-2xs hover:border-emerald-400 transition-colors flex flex-col gap-1.5 text-xs w-full min-w-0"
            >
              {/* Header row: Region: {Sourcing Region} */}
              <div className="font-display font-extrabold text-stone-900 text-xs sm:text-[13.5px] leading-tight truncate w-full">
                Region: {item.sourcingRegion}
              </div>

              {/* Text of areas in the region as independent text */}
              {item.areasInRegion && (
                <div className="text-[10.5px] sm:text-[11px] font-sans text-stone-600 leading-snug">
                  <span className="font-bold text-stone-800">Areas: </span>
                  <span>{item.areasInRegion}</span>
                </div>
              )}

              {/* Predominant crops as independent text */}
              <div className="text-[10.5px] sm:text-[11px] font-sans text-stone-600 leading-snug">
                <span className="font-bold text-stone-800">Predominant crops: </span>
                <span>{item.predominantCrops || item.product}</span>
              </div>

              {/* Number of farmers as independent text */}
              <div className="text-[10.5px] sm:text-[11px] font-sans text-stone-600 leading-snug">
                <span className="font-bold text-stone-800">Number of farmers: </span>
                <span className="font-semibold text-emerald-900">{item.farmerCount || '420 Farmers'}</span>
              </div>

              {/* Tags right after the number of farmers */}
              <div className="flex flex-wrap items-center gap-1 min-w-0 pt-0.5">
                {item.attributes.map((attr, aIdx) => (
                  <span 
                    key={aIdx}
                    className="text-[7px] sm:text-[7.5px] font-mono font-semibold px-1.5 py-[1.5px] rounded-full border border-emerald-200/80 bg-emerald-50/90 text-emerald-900 whitespace-nowrap leading-none tracking-tight shadow-2xs"
                  >
                    {attr}
                  </span>
                ))}
              </div>

              {/* Bottom Row: Last event date on left + View CTA on right */}
              <div className="w-full flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                {item.lastEventDate ? (
                  <span className="text-[9.5px] sm:text-[10px] font-mono text-stone-400 font-medium">
                    Last event: {item.lastEventDate}
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={() => {
                    setJoinRole('farmer');
                    setJoinSubmitted(false);
                    setShowJoinModal(true);
                  }}
                  className="inline-flex items-center gap-0.5 text-[7.5px] sm:text-[8px] font-sans font-extrabold text-stone-900 hover:text-emerald-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/70 px-2 py-[2.5px] rounded-md transition-all leading-none cursor-pointer shrink-0 shadow-2xs group"
                >
                  <span>view</span>
                  <ChevronRight className="w-2.5 h-2.5 text-stone-900 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        }

        if (item.type === 'green') {
          return (
            <div 
              key={`${item.batchNumber}-${idx}`}
              className="bg-white rounded-2xl p-2.5 sm:p-3.5 border border-stone-200/80 shadow-2xs hover:border-emerald-400 transition-colors flex flex-col gap-2 sm:gap-2.5 text-xs w-full min-w-0"
            >
              {/* Header: Initiative Name */}
              <div className="font-display font-extrabold text-stone-900 text-xs sm:text-[13.5px] leading-tight truncate w-full">
                Initiative: {item.product}
              </div>

              {/* Middle Section: Left Image + Right Details */}
              <div className="flex items-start gap-3 sm:gap-4 w-full">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.product} 
                    className="w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-2xl object-cover shrink-0 border border-stone-200/90 shadow-2xs"
                    loading="lazy"
                  />
                )}

                <div className="flex flex-col min-w-0 flex-1 justify-center space-y-1 overflow-hidden">
                  {/* Scope / Coverage */}
                  <div className="text-[10.5px] sm:text-[11px] font-sans font-semibold text-stone-700 truncate leading-snug">
                    Scope: {item.sourcingRegion}
                  </div>

                  {/* Target Metric */}
                  {item.metric && (
                    <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-mono font-bold text-emerald-900 leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span className="text-stone-400 font-normal">Target:</span>
                      <span className="truncate">{item.metric}</span>
                    </div>
                  )}

                  {/* Initiative Description / Commitment */}
                  {item.detail && (
                    <p className="text-[10px] sm:text-[10.5px] font-sans text-stone-600 line-clamp-2 leading-relaxed">
                      {item.detail}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Section: View CTA */}
              <div className="w-full flex items-center justify-end pt-1 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setJoinRole('partner');
                    setPartnerProposal(`Interested in collaborating on ${item.product} (${item.metric || 'Green Initiative'})`);
                    setJoinSubmitted(false);
                    setShowJoinModal(true);
                  }}
                  className="inline-flex items-center gap-0.5 text-[7.5px] sm:text-[8px] font-sans font-extrabold text-stone-900 hover:text-emerald-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/70 px-2 py-[2.5px] rounded-md transition-all leading-none cursor-pointer shrink-0 shadow-2xs group"
                >
                  <span>view</span>
                  <ChevronRight className="w-2.5 h-2.5 text-stone-900 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        }

        return (
          <div 
            key={`${item.batchNumber}-${idx}`}
            className="bg-white rounded-2xl p-2.5 sm:p-3.5 border border-stone-200/80 shadow-2xs hover:border-emerald-400 transition-colors flex items-center gap-3 sm:gap-4 text-xs w-full min-w-0"
          >
            {/* Row starting with an image */}
            <img 
              src={item.image} 
              alt={item.product} 
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl object-cover shrink-0 border border-stone-200/90 shadow-2xs"
              loading="lazy"
            />

            <div className="flex flex-col min-w-0 flex-1 justify-center space-y-1.5 overflow-hidden py-0.5">
              {/* Product / Entity Header */}
              <div className="font-display font-extrabold text-stone-900 text-xs sm:text-[13.5px] leading-tight truncate">
                {item.product}
              </div>

              {/* Below it: For Green Delivery replace batches with metric */}
              {item.type === 'green' && item.metric ? (
                <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] leading-tight truncate">
                  <span className="font-mono font-bold text-[#173b28] tracking-tight shrink-0">
                    {item.metric}
                  </span>
                  <span className="text-stone-300 font-normal">·</span>
                  <span className="font-semibold text-emerald-900 truncate">
                    {item.sourcingRegion}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] leading-tight truncate">
                  <span className="font-mono font-bold text-[#173b28] tracking-tight shrink-0">
                    {item.batchNumber}
                  </span>
                  <span className="text-stone-300 font-normal">·</span>
                  <span className="font-semibold text-emerald-900 truncate">
                    {item.sourcingRegion}
                  </span>
                </div>
              )}

              {/* Horizontal Autoscrolling Pills Container */}
              <div className="w-full overflow-hidden relative py-0.5">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-2.5 bg-gradient-to-l from-white to-transparent z-10" />

                <div className="animate-scroll-pills flex items-center gap-1.5 whitespace-nowrap">
                  {pillItems.concat(pillItems).map((pill, pIdx) => (
                    <span 
                      key={`${pill.key}-${pIdx}`}
                      className={`text-[7.5px] sm:text-[8px] leading-none px-1.5 py-[2px] rounded-full border whitespace-nowrap shrink-0 ${pill.style}`}
                    >
                      {pill.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Row with view button */}
              <div className="flex items-center justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setJoinRole('consumer');
                    setJoinSubmitted(false);
                    setShowJoinModal(true);
                  }}
                  className="inline-flex items-center gap-0.5 text-[7.5px] sm:text-[8px] font-sans font-extrabold text-stone-900 hover:text-emerald-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/70 px-2 py-[2.5px] rounded-md transition-all leading-none cursor-pointer shrink-0 shadow-2xs group"
                >
                  <span>view</span>
                  <ChevronRight className="w-2.5 h-2.5 text-stone-900 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="w-full max-w-full bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* Stream Header */}
      <div className="p-2.5 sm:p-3 bg-stone-50/90 border-b border-stone-200/90 flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="text-xs sm:text-[13px] font-display font-extrabold text-stone-900 tracking-tight truncate">
            {initiativeLabel} {activeTab === 'green' ? 'Initiatives' : activeTab === 'farmers' ? 'Records' : 'Events'}
          </span>
        </div>

        {/* To the right: Leading dot + "updated xxx ago" + Chevron down */}
        <button
          type="button"
          onClick={() => setShowDetails(prev => !prev)}
          className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-lg hover:bg-stone-200/70 text-stone-600 hover:text-stone-900 transition-all cursor-pointer group shrink-0"
          title={showDetails ? "Collapse details" : "Expand details"}
          aria-expanded={showDetails}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-[10px] sm:text-[10.5px] font-mono text-stone-500 group-hover:text-stone-800 whitespace-nowrap">
            updated 2m ago
          </span>
          <ChevronDown 
            className={`w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform duration-200 shrink-0 ${
              showDetails ? 'rotate-180 text-emerald-800' : ''
            }`} 
          />
        </button>
      </div>

      {/* Accordion / Collapsible Container: Click chevron down to collapse or show */}
      {showDetails && (
        <div className="bg-emerald-50/40 border-b border-stone-200/90 p-3 sm:p-3.5 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Text description */}
          <p className="text-[10.5px] sm:text-[11px] text-stone-700 leading-snug font-sans">
            {INITIATIVE_DETAILS[activeTab].description}
          </p>

          {/* Interventions Section Header */}
          <div className="pt-1.5 border-t border-emerald-900/10 space-y-1.5">
            <div className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-wider text-emerald-900 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>interventions</span>
            </div>

            {/* 2-column grid showing the interventions with 2 properly aligned per row */}
            <div className="grid grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-1.5 py-0.5">
              {INITIATIVE_DETAILS[activeTab].points.map((p, idx) => {
                const IconComponent = p.icon;
                return (
                  <div 
                    key={idx} 
                    className="flex items-center gap-1.5 min-w-0"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-display font-bold text-stone-800 text-[9.5px] sm:text-[10.5px] leading-snug break-words">
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AUTOSCROLL CONTAINER BODY */}
      <div className="p-2 sm:p-3 bg-stone-50/40 relative overflow-hidden">
        {/* Top and Bottom Fade Gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-stone-50 via-stone-50/70 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-stone-50 via-stone-50/70 to-transparent z-10" />

        {/* Auto-scrolling Content Area */}
        <div className="h-[480px] sm:h-[540px] md:h-[600px] overflow-hidden relative">
          <div className="animate-scroll-up space-y-2.5 pt-1 pb-4">
            {/* TAB 1: TRACEABILITY ARC BATCHES */}
            {activeTab === 'traceability' && renderFeedCards(traceabilityBatches)}

            {/* TAB 2: FARMER WELFARE STATS */}
            {activeTab === 'farmers' && renderFeedCards(farmerWelfareStats)}

            {/* TAB 3: GREEN OPERATIONS STATS */}
            {activeTab === 'green' && renderFeedCards(greenOperationsLogs)}
          </div>
        </div>
      </div>

      {/* Footer autoscroll action row - compact in one row with text wrapping and leading icon */}
      <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-stone-50 border-t border-stone-200/90 flex items-center justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-semibold text-stone-800 leading-snug">
            Join Savanna Arcana and help us create more honest food
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowJoinModal(true);
            setJoinSubmitted(false);
          }}
          className="shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-[#173b28] hover:bg-[#122e1f] text-white text-[10.5px] sm:text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow flex items-center gap-1.5 group whitespace-nowrap"
        >
          <span>Join Waitlist</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] bg-amber-400 text-stone-900 font-bold leading-none">
            32 spots left
          </span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>

      {/* Cryptographic / Audit Detail Modal */}
      {selectedBatch && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedBatch(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 relative animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-stone-200/90 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">
                  {selectedBatch.type === 'farmers'
                    ? 'SMALLHOLDER SETTLEMENT & WELFARE RECORD'
                    : selectedBatch.type === 'green'
                    ? 'ZERO-EMISSION OPERATIONS TELEMETRY'
                    : 'CRYPTOGRAPHIC HARVEST PASSPORT'}
                </span>
                <h3 className="font-display font-extrabold text-stone-900 text-base sm:text-lg leading-tight mt-0.5">
                  {selectedBatch.product}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Batch & Region Card */}
            <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200/90">
              <img 
                src={selectedBatch.image} 
                alt={selectedBatch.product} 
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
              />
              <div className="min-w-0 text-xs space-y-0.5">
                <div className="font-mono font-bold text-[#173b28] text-xs flex items-center gap-1.5 flex-wrap">
                  <span>{selectedBatch.type === 'green' && selectedBatch.metric ? selectedBatch.metric : selectedBatch.batchNumber}</span>
                  {selectedBatch.type === 'green' && selectedBatch.greenType && (
                    <span className={`px-1.5 py-[1px] rounded text-[8px] font-mono uppercase font-bold tracking-wider border ${
                      selectedBatch.greenType === 'Environment'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : selectedBatch.greenType === 'Logistics'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}>
                      {selectedBatch.greenType}
                    </span>
                  )}
                </div>
                <div className="text-stone-600 font-medium text-[11px]">
                  {selectedBatch.sourcingRegion}
                </div>
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[8px] font-mono font-bold px-1.5 py-[2px] rounded-full border bg-stone-200/80 text-stone-800 whitespace-nowrap">
                    {selectedBatch.type === 'green' && selectedBatch.greenType ? `TYPE: ${selectedBatch.greenType}` : `ID: ${selectedBatch.landId}`}
                  </span>
                  <span className="text-[8px] font-mono font-bold px-1.5 py-[2px] rounded-full border bg-emerald-100 text-emerald-900 whitespace-nowrap">
                    {selectedBatch.parity} {selectedBatch.type === 'green' ? 'Clean Energy' : 'Arcana Parity'}
                  </span>
                  <span className="text-[8px] font-sans font-bold px-1.5 py-[2px] rounded-full border bg-amber-100 text-amber-950 whitespace-nowrap">
                    Co-Create
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Attributes */}
            <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200/80 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {selectedBatch.type === 'farmers'
                    ? 'Audited Smallholder Payout & Retention'
                    : selectedBatch.type === 'green'
                    ? 'Audited Renewable Micro-Hub Telemetry'
                    : 'Audited Quality & Residue Testing'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                {selectedBatch.attributes.map((attr, idx) => (
                  <div key={idx} className="bg-white/90 p-2 rounded-xl border border-emerald-200/60 font-mono text-emerald-900 font-semibold text-[10px]">
                    ✓ {attr}
                  </div>
                ))}
                <div className="bg-white/90 p-2 rounded-xl border border-emerald-200/60 font-mono text-emerald-900 font-semibold text-[10px]">
                  ✓ Co-Created with Arcana
                </div>
                <div className="bg-white/90 p-2 rounded-xl border border-emerald-200/60 font-mono text-emerald-900 font-semibold text-[10px]">
                  ✓ 100% Audited Verification
                </div>
              </div>
              {selectedBatch.detail && (
                <p className="text-stone-600 text-[11px] pt-1 leading-relaxed border-t border-emerald-200/60 font-sans">
                  {selectedBatch.detail}
                </p>
              )}
            </div>

            {/* Footer / Done CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200/90">
              <div className="text-[9.5px] text-stone-500 font-mono">
                SHA-256 Provenance Confirmed
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-2 rounded-xl bg-[#173b28] hover:bg-[#122e1f] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Savannah Arcana Waitlist Modal */}
      {showJoinModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowJoinModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 pb-2 sm:pb-2.5 bg-stone-50/80 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-stone-900 text-lg sm:text-xl leading-tight">
                    Join Savanna Waitlist
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-600 font-sans leading-relaxed">
                    We are onboarding our first 100 co-creators to build and test honest, fair, green and zero-chemical food solutions in Kenya.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar & Spots Left */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden flex-1">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 transition-all duration-500" 
                      style={{ width: '68%' }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#173b28] shrink-0">
                    68%
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
                    <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                    32 Spots Left
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto px-4 sm:px-5 pt-3 pb-4 sm:pb-5 space-y-3.5 text-xs">
              {joinSubmitted ? (
                /* Ticket Pass Confirmation View */
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  {/* Digital Pass Card */}
                  <div className="rounded-2xl border-2 border-dashed border-emerald-600/50 bg-[#173b28] text-white p-5 sm:p-6 shadow-xl relative overflow-hidden">
                    {/* Background watermark */}
                    <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                      <Award className="w-48 h-48 text-amber-300" />
                    </div>

                    <div className="relative z-10 space-y-4">
                      {/* Pass Header */}
                      <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-5 h-5 text-amber-400" />
                          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-200 font-bold">
                            SAVANNAH ARCANA FOUNDING CO-CREATOR PASS
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-amber-400 text-stone-900 px-2 py-0.5 rounded">
                          CONFIRMED
                        </span>
                      </div>

                      {/* Pass Main Info */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                        <div>
                          <div className="text-[9.5px] font-mono uppercase text-emerald-300">
                            Ticket Number
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-black text-amber-300">
                            #{String(assignedTicket).padStart(3, '0')} <span className="text-xs font-normal text-emerald-300">/ 100</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[9.5px] font-mono uppercase text-emerald-300">
                            Participant Role
                          </div>
                          <div className="font-bold text-white capitalize text-sm flex items-center gap-1.5 mt-0.5">
                            {joinRole === 'consumer' ? (
                              <><ShoppingBag className="w-3.5 h-3.5 text-amber-300" /> Consumer</>
                            ) : joinRole === 'farmer' ? (
                              <><Sprout className="w-3.5 h-3.5 text-amber-300" /> Farmer Partner</>
                            ) : (
                              <><Building2 className="w-3.5 h-3.5 text-amber-300" /> Ecosystem Partner</>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <div className="text-[9.5px] font-mono uppercase text-emerald-300">
                            Co-Creator Name
                          </div>
                          <div className="font-bold text-white text-sm truncate mt-0.5">
                            {joinName || 'Founding Partner'}
                          </div>
                        </div>
                      </div>

                      {/* Selected context badge */}
                      <div className="bg-emerald-900/60 rounded-xl p-2.5 border border-emerald-700/50 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-emerald-200">
                          {joinRole === 'consumer' 
                            ? `Delivery Area: ${consumerArea} · Basket: ${consumerHousehold}`
                            : joinRole === 'farmer'
                            ? `Farm: ${farmerRegion} · Scale: ${farmerAcreage}`
                            : `Organization: ${partnerOrg || 'Ecosystem Partner'} · Domain: ${partnerDomain}`
                          }
                        </span>
                        <span className="font-mono text-[9px] text-amber-300 font-semibold bg-emerald-950/70 px-2 py-0.5 rounded">
                          Priority Allocation Locked
                        </span>
                      </div>

                      {/* Founding Privileges Granted */}
                      <div className="space-y-1.5 pt-1 border-t border-emerald-700/50 text-[11px] text-emerald-100">
                        <div className="font-mono text-[9.5px] text-amber-300 uppercase tracking-wider font-bold">
                          Your First 100 Privileges:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10.5px]">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>First harvest batch priority guarantee</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Direct line to founders &amp; agronomy leads</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Invite to founding co-creation roundtable</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Cryptographic origin audit recognition</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps Notification */}
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-stone-700 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>What Happens Next?</span>
                    </div>
                    <p className="text-[11.5px] text-stone-600 leading-relaxed font-sans">
                      Hongera, <strong>{joinName}</strong>! We are currently vetting submissions in real time. Our community onboarding lead will message your contact (<strong>{joinContact}</strong>) within 24 hours with your early-access onboarding packet and orientation schedule.
                    </p>
                  </div>

                  {/* Footer CTAs */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setJoinSubmitted(false);
                      }}
                      className="text-[11px] text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer"
                    >
                      Submit another application
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowJoinModal(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#173b28] hover:bg-[#122e1f] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Waitlist Form */
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setJoinSubmitted(true);
                  }}
                  className="space-y-3.5"
                >
                  {/* Step 1: Role Selection in one row */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-semibold text-stone-800 block">
                      Choose a role
                    </label>

                    <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                      {/* Option A: Consumer */}
                      <button
                        type="button"
                        onClick={() => setJoinRole('consumer')}
                        className={`p-1.5 sm:px-2.5 sm:py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer relative ${
                          joinRole === 'consumer'
                            ? 'border-[#173b28] bg-emerald-50/90 shadow-xs ring-2 ring-[#173b28]/30'
                            : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50/70'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          joinRole === 'consumer' ? 'bg-[#173b28] text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          <ShoppingBag className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-display font-bold text-xs text-stone-900 leading-none truncate">
                          Consumer
                        </span>
                      </button>

                      {/* Option B: Farmer */}
                      <button
                        type="button"
                        onClick={() => setJoinRole('farmer')}
                        className={`p-1.5 sm:px-2.5 sm:py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer relative ${
                          joinRole === 'farmer'
                            ? 'border-[#173b28] bg-emerald-50/90 shadow-xs ring-2 ring-[#173b28]/30'
                            : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50/70'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          joinRole === 'farmer' ? 'bg-[#173b28] text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          <Sprout className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-display font-bold text-xs text-stone-900 leading-none truncate">
                          Farmer
                        </span>
                      </button>

                      {/* Option C: Partner */}
                      <button
                        type="button"
                        onClick={() => setJoinRole('partner')}
                        className={`p-1.5 sm:px-2.5 sm:py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer relative ${
                          joinRole === 'partner'
                            ? 'border-[#173b28] bg-emerald-50/90 shadow-xs ring-2 ring-[#173b28]/30'
                            : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50/70'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          joinRole === 'partner' ? 'bg-[#173b28] text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          <Building2 className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-display font-bold text-xs text-stone-900 leading-none truncate">
                          Partner
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Expanded Role-Specific Section */}
                  <div className="space-y-3 -mt-2">
                    {/* Minimalist role note without container */}
                    <div>
                      {joinRole === 'consumer' && (
                        <p className="text-[11.5px] text-stone-600 leading-relaxed font-sans">
                          Early access to honest foods and access to production and handling information.
                        </p>
                      )}
                      {joinRole === 'farmer' && (
                        <p className="text-[11.5px] text-stone-600 leading-relaxed font-sans">
                          Direct farm-gate price parity, automated weighments, and cold-hub storage access.
                        </p>
                      )}
                      {joinRole === 'partner' && (
                        <p className="text-[11.5px] text-stone-600 leading-relaxed font-sans">
                          Collaborative pilot deployments across cold chain, clean mobility, and bio-testing.
                        </p>
                      )}
                    </div>

                    {/* EXPANDED FIELDS: CONSUMER */}
                    {joinRole === 'consumer' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        {/* Nairobi delivery neighborhood & Household size in the same row */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1 truncate">
                              Nairobi delivery neighborhood
                            </label>
                            <select
                              value={consumerArea}
                              onChange={e => setConsumerArea(e.target.value)}
                              className="w-full px-2.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 truncate"
                            >
                              <option value="Kilimani / Kileleshwa">Kilimani / Kileleshwa</option>
                              <option value="Westlands / Spring Valley">Westlands / Spring Valley</option>
                              <option value="Karen / Langata">Karen / Langata</option>
                              <option value="Lavington / Riverside">Lavington / Riverside</option>
                              <option value="Runda / Gigiri / Whispers">Runda / Gigiri / Whispers</option>
                              <option value="Parklands / Highridge">Parklands / Highridge</option>
                              <option value="South B / South C">South B / South C</option>
                              <option value="Ngong Road / Riara">Ngong Road / Riara</option>
                              <option value="Other Nairobi Area">Other Nairobi Area</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1 truncate">
                              Household size / basket cadence
                            </label>
                            <select
                              value={consumerHousehold}
                              onChange={e => setConsumerHousehold(e.target.value)}
                              className="w-full px-2.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 truncate"
                            >
                              <option value="Solo / Couple (1-2 people)">Solo / Couple (1-2 people)</option>
                              <option value="Family (3-4 people)">Family (3-4 people)</option>
                              <option value="Large Household (5+ people)">Large Household (5+ people)</option>
                              <option value="Chef / Private Kitchen">Chef / Private Kitchen</option>
                            </select>
                          </div>
                        </div>

                        {/* Produce or features you want in your weekly basket (optional) with Dropdown & Pills */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10.5px] font-sans font-medium text-stone-700 block">
                              Produce or features you want in your weekly basket (optional)
                            </label>
                            {consumerBasketItems.length > 0 && (
                              <span className="text-[10px] font-mono text-stone-500 font-medium">
                                {consumerBasketItems.length}/4 max
                              </span>
                            )}
                          </div>

                          {/* Self-reducing dropdown */}
                          <div className="relative">
                            <select
                              value=""
                              disabled={consumerBasketItems.length >= 4}
                              onChange={(e) => {
                                const selected = e.target.value;
                                if (selected && consumerBasketItems.length < 4 && !consumerBasketItems.includes(selected)) {
                                  setConsumerBasketItems(prev => [...prev, selected]);
                                }
                                e.target.value = '';
                              }}
                              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 disabled:bg-stone-100 disabled:text-stone-400 cursor-pointer appearance-none pr-8 transition-colors"
                            >
                              <option value="" disabled>
                                {consumerBasketItems.length >= 4
                                  ? 'Maximum 4 selections reached'
                                  : 'Select produce or basket features (up to 4)...'}
                              </option>
                              {ALL_BASKET_PREFERENCES
                                .filter(item => !consumerBasketItems.includes(item))
                                .map((option) => (
                                  <option key={option} value={option}>
                                    + {option}
                                  </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          {/* Selected Pills */}
                          {consumerBasketItems.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {consumerBasketItems.map((item) => (
                                <span
                                  key={item}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200/90 shadow-2xs animate-in zoom-in-95 duration-150"
                                >
                                  <span>{item}</span>
                                  <button
                                    type="button"
                                    onClick={() => setConsumerBasketItems(prev => prev.filter(i => i !== item))}
                                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-emerald-200/80 text-emerald-700 hover:text-emerald-950 transition-colors cursor-pointer"
                                    title={`Remove ${item}`}
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Optional write-in for custom produce requests */}
                          <input
                            type="text"
                            placeholder="Or type specific custom items (e.g. heirloom carrots, baby spinach...)"
                            value={consumerWishlist}
                            onChange={e => setConsumerWishlist(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 placeholder:text-stone-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* EXPANDED FIELDS: FARMER */}
                    {joinRole === 'farmer' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1 truncate">
                              Farm location / county
                            </label>
                            <select
                              value={farmerRegion}
                              onChange={e => setFarmerRegion(e.target.value)}
                              className="w-full px-2.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 truncate"
                            >
                              <option value="Kiambu County (Limuru / Lari / Tigoni)">Kiambu (Limuru / Lari / Tigoni)</option>
                              <option value="Kinangop Plateau (Nyandarua)">Kinangop Plateau (Nyandarua)</option>
                              <option value="Naivasha Basin (Nakuru)">Naivasha Basin (Nakuru)</option>
                              <option value="Murang'a / Nyeri Highlands">Murang'a / Nyeri Highlands</option>
                              <option value="Meru / Mount Kenya Slopes">Meru / Mount Kenya Slopes</option>
                              <option value="Machakos / Eastern">Machakos / Eastern</option>
                              <option value="Other Kenyan County">Other Kenyan County</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1 truncate">
                              Cultivated farm scale
                            </label>
                            <select
                              value={farmerAcreage}
                              onChange={e => setFarmerAcreage(e.target.value)}
                              className="w-full px-2.5 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 truncate"
                            >
                              <option value="< 1 Acre (Intensive Kitchen Plot)">&lt; 1 Acre (Intensive Kitchen Plot)</option>
                              <option value="1 - 3 Acres (Smallholder Commercial)">1 - 3 Acres (Smallholder Commercial)</option>
                              <option value="3 - 5 Acres (Medium Farm)">3 - 5 Acres (Medium Farm)</option>
                              <option value="5+ Acres (Commercial Cooperative)">5+ Acres (Commercial Cooperative)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1">
                              Current farming practice
                            </label>
                            <select
                              value={farmerPractice}
                              onChange={e => setFarmerPractice(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                            >
                              <option value="Certified Organic / Bio-Inputs">Certified Organic / Bio-Inputs</option>
                              <option value="Transitioning to Bio-Inputs">Transitioning away from chemical sprays</option>
                              <option value="Conventional seeking fair guaranteed payout">Conventional seeking fair guaranteed payout</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1">
                              Primary crops grown
                            </label>
                            <input
                              type="text"
                              value={farmerCrops}
                              onChange={e => setFarmerCrops(e.target.value)}
                              placeholder="e.g. Sukuma wiki, spinach, carrots, herbs..."
                              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1">
                            Biggest challenge you want to solve with Savanna Arcana
                          </label>
                          <select
                            value={farmerNeed}
                            onChange={e => setFarmerNeed(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                          >
                            <option value="Guaranteed Fair Floor Price & 24hr M-Pesa Settlement">Guaranteed Fair Floor Price &amp; 24hr M-Pesa Settlement</option>
                            <option value="Solar Cold Room Access to reduce harvest spoilage">Solar Cold Room Access to reduce harvest spoilage</option>
                            <option value="Push-Pull Organic Bio-Pest control inputs & agronomy training">Push-Pull Bio-Pest inputs &amp; agronomy training</option>
                            <option value="Direct digital scale weighment without broker exploitation">Direct digital scale weighment without broker exploitation</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* EXPANDED FIELDS: PARTNER */}
                    {joinRole === 'partner' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1">
                              Organization / enterprise name *
                            </label>
                            <input
                              type="text"
                              required={joinRole === 'partner'}
                              placeholder="e.g. SolarChill Tech Ltd / Nairobi Green Logistics"
                              value={partnerOrg}
                              onChange={e => setPartnerOrg(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1">
                              Partnership collaboration domain
                            </label>
                            <select
                              value={partnerDomain}
                              onChange={e => setPartnerDomain(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                            >
                              <option value="Cold-Chain Logistics & Solar Storage">Cold-Chain Logistics &amp; Solar Storage</option>
                              <option value="Electric Delivery Fleet / Swappable EV">Electric Delivery Fleet / Swappable EV</option>
                              <option value="Organic Bio-Inputs & Microbial Soil Health">Organic Bio-Inputs &amp; Microbial Soil Health</option>
                              <option value="Lab Chromatography & Food Residue Testing">Lab Chromatography &amp; Food Residue Testing</option>
                              <option value="Culinary / Hospitality Commercial Buyer">Culinary / Hospitality Commercial Buyer</option>
                              <option value="Impact Capital & Carbon Offset Verification">Impact Capital &amp; Carbon Offset Verification</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10.5px] font-sans font-medium text-stone-700 block mb-1">
                            How would you like to collaborate with our founding 100 cohort?
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Describe your solution, pilot deployment, or off-take needs..."
                            value={partnerProposal}
                            onChange={e => setPartnerProposal(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Core Contact Information */}
                  <div className="space-y-3 pt-1 border-t border-stone-200/80">
                    <label className="text-[11px] font-sans font-semibold text-stone-800 block">
                      2. Your contact information
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-medium text-stone-700 block mb-1">
                          Full name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Wanjiku Mwangi"
                          value={joinName}
                          onChange={e => setJoinName(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-medium text-stone-700 block mb-1">
                          Phone / WhatsApp / M-Pesa or email *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. +254 712 345678 or wanjiku@example.com"
                          value={joinContact}
                          onChange={e => setJoinContact(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200/90">
                    <button
                      type="button"
                      onClick={() => setShowJoinModal(false)}
                      className="px-3.5 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#173b28] hover:bg-[#122e1f] text-white font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-2 group whitespace-nowrap"
                    >
                      <span>Claim Spot #069 / 100</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
