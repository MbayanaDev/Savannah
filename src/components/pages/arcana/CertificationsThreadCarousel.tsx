import React, { useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  Pause,
  Play,
  ShieldCheck,
  Handshake,
  ExternalLink
} from 'lucide-react';

export interface PartnerItem {
  id: string;
  name: string;
  organisation: string;
  partnerRole: string;
  badge: string;
  scope: string;
  description: string;
  logoImage: string;
  tagColor: string;
  borderColor: string;
  year: string;
  metric: string;
  metricLabel: string;
}

export const ARCANA_PARTNERS: PartnerItem[] = [
  {
    id: 'hcd-kenya',
    name: 'Horticultural Crops Directorate (HCD)',
    organisation: 'HCD Kenya',
    partnerRole: 'National Regulatory & GAP Partner',
    badge: 'Government Regulator',
    scope: 'Food Safety, Field Hygiene & Smallholder Compliance',
    description: 'Mandatory field hygiene inspections, certified potable irrigation testing, and safe harvest handling across all 1,480+ partner smallholders in Kenya.',
    logoImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=240&h=240&q=80',
    tagColor: 'bg-emerald-50 text-emerald-800',
    borderColor: 'border-emerald-200',
    year: 'Audited 2026',
    metric: '100% Compliant',
    metricLabel: 'Smallholder Parcels'
  },
  {
    id: 'koan-organic',
    name: 'Kenya Organic Agriculture Network (KOAN)',
    organisation: 'KOAN Organics',
    partnerRole: 'Bio-Ecological & Soil Partner',
    badge: 'Ecological Certification',
    scope: '100% Non-GMO & Living Soil Microbiology',
    description: 'Partnership providing natural biological pest control with parasitic wasps, botanical neem sprays, compost teas, and vermiculture to regenerate depleted soils.',
    logoImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=240&h=240&q=80',
    tagColor: 'bg-emerald-50 text-emerald-800',
    borderColor: 'border-emerald-200',
    year: 'Certified 2026',
    metric: '+34%',
    metricLabel: 'Soil Microbial Humus'
  },
  {
    id: 'kephis-lab',
    name: 'Kenya Plant Health Inspectorate Service (KEPHIS)',
    organisation: 'KEPHIS Analytical Labs',
    partnerRole: 'Chemical Residue Screening Partner',
    badge: 'Analytical Lab Partner',
    scope: '0.00 ppm Synthetic Chemical Pesticides Tested',
    description: 'Gas chromatography screening confirms complete absence of organophosphates, synthetic fungicides, and toxic artificial ripening agents.',
    logoImage: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=240&h=240&q=80',
    tagColor: 'bg-teal-50 text-teal-800',
    borderColor: 'border-teal-200',
    year: 'Tested 2026',
    metric: '0.00 ppm',
    metricLabel: 'Chemical Residues'
  },
  {
    id: 'kenaff-equity',
    name: 'Kenya National Farmers’ Federation (KENAFF)',
    organisation: 'KENAFF Smallholder Union',
    partnerRole: 'Grower Welfare & Equity Partner',
    badge: 'Grower Advocacy',
    scope: '78.4% Direct Retail Shilling Farmgate Parity',
    description: 'Guaranteed minimum price floors and instant 24-hour M-Pesa mobile payouts protecting farmers from predatory middlemen and arbitrary weight deductions.',
    logoImage: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a47?auto=format&fit=crop&w=240&h=240&q=80',
    tagColor: 'bg-purple-50 text-purple-800',
    borderColor: 'border-purple-200',
    year: 'Audited 2026',
    metric: '78.4%',
    metricLabel: 'Retail Price to Farmer'
  },
  {
    id: 'icipe-pollinators',
    name: 'International Centre of Insect Physiology & Ecology (ICIPE)',
    organisation: 'ICIPE Research Institute',
    partnerRole: 'Pollinator & Biological Agronomy Partner',
    badge: 'Scientific Research Body',
    scope: 'Native Stingless Bee Sanctuaries & Push-Pull Cropping',
    description: 'Scientific co-development of push-pull companion cropping (marigolds & desmodium) and restoration of 300+ native stingless bee hives across farm borders.',
    logoImage: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=240&h=240&q=80',
    tagColor: 'bg-amber-50 text-amber-900',
    borderColor: 'border-amber-200',
    year: 'Collaborating 2026',
    metric: '300+ Hives',
    metricLabel: 'Wild Pollinator Sanctuaries'
  },
  {
    id: 'unep-emobility',
    name: 'UNEP Clean Mobility & Green Energy Alliance',
    organisation: 'UNEP & Clean Mobility',
    partnerRole: 'Clean Energy & Solar Fleet Partner',
    badge: 'Climate Innovation',
    scope: '120 kWp Solar Hub & Zero-Emission Delivery Fleet',
    description: 'Deploying solar-charged electric cargo bikes and vans across Nairobi residential corridors, avoiding diesel exhaust and urban noise pollution.',
    logoImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=240&h=240&q=80',
    tagColor: 'bg-teal-50 text-teal-800',
    borderColor: 'border-teal-200',
    year: 'Active 2026',
    metric: '0.00 g/km',
    metricLabel: 'Tailpipe Urban Emissions'
  },
  {
    id: 'women-coops',
    name: 'Limuru & Kinangop Women Smallholder Cooperatives',
    organisation: 'Highland Women Producer Coops',
    partnerRole: 'Direct Farmer Producer Partner',
    badge: 'Grassroots Smallholders',
    scope: 'Highland Farm Aggregation & Women Empowerment',
    description: 'Empowering 64% women smallholders who own and steward highland parcels, providing digital scale receipts and leadership in community composting.',
    logoImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=240&h=240&q=80',
    tagColor: 'bg-rose-50 text-rose-800',
    borderColor: 'border-rose-200',
    year: 'Co-Creating 2026',
    metric: '64%',
    metricLabel: 'Women Cooperative Leaders'
  },
  {
    id: 'globalgap-bureau',
    name: 'Bureau Veritas & FoodPLUS Cologne',
    organisation: 'Bureau Veritas Global',
    partnerRole: 'International Assurance Partner',
    badge: 'Global Certification',
    scope: 'GlobalG.A.P. IFA v6 Benchmarked Traceability',
    description: 'Unbroken QR batch passports linking each crate to its farm coordinates, grower identity, and solar cold chain timeline.',
    logoImage: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=240&h=240&q=80',
    tagColor: 'bg-blue-50 text-blue-800',
    borderColor: 'border-blue-200',
    year: 'Audited 2026',
    metric: '100% QR',
    metricLabel: 'Batch Traceability'
  }
];

export const CertificationsThreadCarousel: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerItem | null>(null);

  const handleSelectPartner = (partner: PartnerItem) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  // Duplicate items array to create seamless infinite marquee loop
  const loopItems = [...ARCANA_PARTNERS, ...ARCANA_PARTNERS];

  return (
    <div className="space-y-2.5">
      {/* Header Bar */}
      <div className="flex items-center gap-2.5 px-0.5">
        <h3 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-stone-900 tracking-tight">
          Our Co-creating Partners
        </h3>
      </div>

      {/* CONTINUOUS RIGHT-TO-LEFT LOOP MARQUEE CONTAINER (full bleed, no left/right gutter) */}
      <div className="-mx-4 sm:-mx-6 overflow-hidden py-1">
        {/* Continuous Flowing Track */}
        <div 
          className="animate-partner-loop gap-3.5 sm:gap-4 flex items-start"
          style={{ animationPlayState: isPaused ? 'paused' : undefined }}
        >
          {loopItems.map((partner, idx) => (
            <button
              key={`${partner.id}-${idx}`}
              type="button"
              onClick={() => handleSelectPartner(partner)}
              className="w-24 sm:w-28 shrink-0 flex flex-col items-center text-center cursor-pointer group"
              title={`Click to view ${partner.name} collaboration details`}
            >
              {/* Circular Image Child */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-stone-100 border border-stone-200/90 shadow-2xs mb-1.5 shrink-0">
                <img
                  src={partner.logoImage}
                  alt={partner.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Text Below: Organisation Name and short detail with wrapping and reduced font */}
              <div className="w-full px-0.5">
                <div className="text-[11px] sm:text-xs font-display font-bold text-stone-900 leading-tight group-hover:text-emerald-900 transition-colors break-words">
                  {partner.organisation}
                </div>
                <div className="text-[10px] text-stone-500 leading-snug mt-0.5 break-words">
                  {partner.partnerRole}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Partner Detail Modal on Click */}
      {showModal && selectedPartner && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPartner.logoImage}
                  alt={selectedPartner.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    {selectedPartner.badge}
                  </span>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 leading-snug mt-1">
                    {selectedPartner.name}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-800 mt-0.5 flex items-center gap-1">
                    <Handshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedPartner.partnerRole}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scope & Description */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] text-stone-500 font-mono uppercase font-bold">Collaborative Metric</div>
                  <div className="text-base font-bold text-emerald-800 mt-0.5">{selectedPartner.metric}</div>
                  <div className="text-[11px] text-stone-600">{selectedPartner.metricLabel}</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] text-stone-500 font-mono uppercase font-bold">Verification Status</div>
                  <div className="text-base font-bold text-stone-900 mt-0.5">{selectedPartner.year}</div>
                  <div className="text-[11px] text-stone-600">Active Partnership</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Partnership Scope</span>
                </div>
                <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200 leading-relaxed font-mono">
                  {selectedPartner.scope}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-stone-900">How We Work Together</div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedPartner.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/90 flex items-center justify-between text-xs text-emerald-900">
                <span className="font-semibold">Co-Creating Sovereign Kenyan Agriculture</span>
                <span className="text-[10px] font-mono bg-white text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                  Verified Alliance
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
