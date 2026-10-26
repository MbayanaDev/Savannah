import React, { useState } from 'react';
import { 
  Sun, 
  Truck, 
  Award, 
  HeartHandshake, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Users,
  Leaf,
  Recycle,
  Droplets,
  BatteryCharging,
  QrCode,
  ThumbsUp,
  Target,
  Compass,
  TrendingUp
} from 'lucide-react';
import { PageLayout } from './PageLayout';
import { useStore } from '../../context/StoreContext';
import { CertificationsThreadCarousel } from './arcana/CertificationsThreadCarousel';
import { InitiativeLiveFeed } from './arcana/InitiativeLiveFeed';

export const ArcanaPage: React.FC = () => {
  const { setViewMode } = useStore();
  const [activeTab, setActiveTab] = useState<'traceability' | 'farmers' | 'green'>('traceability');

  return (
    <PageLayout
      title="Savannah Arcana"
      subtitle='Help us give you honest food. "Savannah Arcana" is our initiative to co-create with our farmers and customers more sustainable and traceable value chains.'
      currentPage="Savannah Arcana"
    >
      <div className="space-y-10 animate-in fade-in duration-200">
        {/* Section 1: MISSION and VISION Statements (as text without containers) */}
        <section id="arcana-mission-vision" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Statement */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#173b28] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Target className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-800 font-extrabold block">
                    FOUNDATIONAL MANDATE
                  </span>
                  <h4 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight leading-tight">
                    Our Mission
                  </h4>
                </div>
              </div>

              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                To radically dignify Kenya&apos;s smallholder farmers with equitable 24-hour settlements, eliminate agricultural chemical toxins through bio-ecological soil stewardship, and power Africa&apos;s cleanest farm-to-table cold chain using 100% renewable solar energy.
              </p>
            </div>

            {/* Vision Statement (Left-aligned text to the right of leading icon) */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs shrink-0">
                  <Compass className="w-5 h-5 text-stone-950" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-extrabold block">
                    LONG-TERM ASPIRATION
                  </span>
                  <h4 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight leading-tight">
                    Our Vision
                  </h4>
                </div>
              </div>

              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                A sovereign, regenerative Kenya where every meal honors the earth and uplifts the grower—creating an unbroken circle of consumer trust, biological abundance, youth empowerment, and zero-emission delivery from highland soil to city tables.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: THE INITIATIVES */}
        <section id="arcana-initiatives" className="space-y-6 pt-2">
          {/* Thread Carousel with logo image and organisation name */}
          <CertificationsThreadCarousel />

          {/* Section: 3 CTAs in a small column to the left + 2 by n metric containers to its right */}
          {(() => {
            interface InitiativeMetricItem {
              category: string;
              categoryLines?: string[];
              value: string;
              unit?: string;
              label: string;
              detail: string;
              icon: React.ComponentType<{ className?: string }>;
            }

            interface InitiativeConfigItem {
              id: 'traceability' | 'farmers' | 'green';
              label: string;
              icon: React.ComponentType<{ className?: string }>;
              badge: string;
              metrics: InitiativeMetricItem[];
            }

            const INITIATIVE_CONFIGS: InitiativeConfigItem[] = [
              { 
                id: 'traceability', 
                label: 'Traceability', 
                icon: QrCode, 
                badge: '100% Origin',
                metrics: [
                  { 
                    category: 'Batches with QR', 
                    categoryLines: ['Batches', 'with QR'],
                    value: '100', 
                    unit: '%', 
                    label: 'Batch Passports', 
                    detail: 'Instant farm-to-table origin proof', 
                    icon: QrCode 
                  },
                  { 
                    category: 'Farms Arcana Certified', 
                    categoryLines: ['Farms Arcana', 'Certified'],
                    value: '1,480+', 
                    label: 'Arcana Certified Farms', 
                    detail: '1,480+ partner smallholders audited & certified', 
                    icon: Award 
                  },
                  { category: 'Residue', value: '0.00', unit: 'ppm', label: 'Synthetic Sprays', detail: 'Zero chemical pesticides or toxins', icon: ShieldCheck }
                ]
              },
              { 
                id: 'farmers', 
                label: 'Farmer Welfare', 
                icon: HeartHandshake, 
                badge: '+88 NPS',
                metrics: [
                  { 
                    category: 'Farmers Supported', 
                    categoryLines: ['Farmers', 'Supported'],
                    value: '1,480+', 
                    label: 'Farmers Supported', 
                    detail: 'Kiambu, Kinangop & Naivasha', 
                    icon: Users 
                  },
                  { 
                    category: 'NPS Value', 
                    categoryLines: ['NPS', 'Value'],
                    value: '+88', 
                    label: 'Farmer Satisfaction', 
                    detail: 'Audited smallholder loyalty', 
                    icon: ThumbsUp 
                  },
                  { category: 'Payout', value: '24-Hr', label: 'Instant M-Pesa', detail: 'Direct digital scale settlement', icon: CheckCircle2 }
                ]
              },
              { 
                id: 'green', 
                label: 'Green Deliveries', 
                icon: Truck, 
                badge: 'Zero Carbon',
                metrics: [
                  { 
                    category: 'Last Mile Delivery', 
                    categoryLines: ['Last Mile', 'Delivery'],
                    value: '100', 
                    unit: '%', 
                    label: 'Last Mile Delivery', 
                    detail: 'Electric & solar cargo fleet', 
                    icon: Truck 
                  },
                  { 
                    category: 'CO₂ Offset', 
                    categoryLines: ['CO₂', 'Offset'],
                    value: '88', 
                    unit: '%', 
                    label: '% CO₂ Offset from Solar', 
                    detail: '182,000 kWh solar cold-chain', 
                    icon: Sun 
                  },
                  { category: 'Storage', value: '240', unit: 'kWh', label: 'LiFePO4 Battery Bank', detail: 'Continuous off-grid cold storage', icon: BatteryCharging }
                ]
              }
            ];

            const currentInitiative = INITIATIVE_CONFIGS.find(c => c.id === activeTab) || INITIATIVE_CONFIGS[0];

            return (
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start">
                {/* Column to the left with minimalist, compact initiative CTAs with inline metrics */}
                <div className="w-full md:w-[390px] lg:w-[420px] shrink-0 flex flex-col space-y-1.5">
                  <div className="text-[10.5px] font-mono uppercase tracking-widest text-emerald-800 font-bold px-1 mb-0.5 flex items-center justify-between">
                    <span>Initiatives</span>
                    <span className="text-[9.5px] text-stone-400 font-normal">Select focus</span>
                  </div>

                  <div className="flex flex-col gap-2 sm:gap-2.5" role="tablist" aria-label="Initiative Navigation">
                    {INITIATIVE_CONFIGS.map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full px-3 py-2.5 sm:py-3 rounded-xl transition-all cursor-pointer border text-left flex items-center justify-between gap-2.5 ${
                            isActive 
                              ? 'bg-[#173b28] text-white border-[#173b28] shadow-sm ring-1 ring-emerald-500/40' 
                              : 'bg-white text-stone-700 border-stone-200/90 hover:border-emerald-300 hover:bg-stone-50/70 shadow-2xs'
                          }`}
                        >
                          {/* Left: Icon + Button Text in the row */}
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-emerald-800'}`} />
                            <span className={`text-xs sm:text-[13px] font-display font-bold leading-tight truncate ${isActive ? 'text-white' : 'text-stone-900'}`}>
                              {tab.label}
                            </span>
                          </div>

                          {/* Right: Metrics as text divided by a divider instead of pills */}
                          <div className="flex items-center gap-2 shrink-0">
                            {tab.metrics.slice(0, 2).map((metric, idx) => (
                              <React.Fragment key={idx}>
                                {idx > 0 && (
                                  <span 
                                    className={`h-3 w-px ${isActive ? 'bg-emerald-400/40' : 'bg-stone-300'}`} 
                                    aria-hidden="true" 
                                  />
                                )}
                                <div className="flex items-center gap-1 text-xs">
                                  <span className={`font-black font-display tracking-tight leading-none whitespace-nowrap ${
                                    isActive ? 'text-amber-300' : 'text-[#173b28]'
                                  }`}>
                                    {metric.value}{metric.unit || ''}
                                  </span>
                                  {metric.categoryLines ? (
                                    <span className={`flex flex-col text-[8px] font-mono uppercase font-semibold leading-[1.0] tracking-tight text-left ${
                                      isActive ? 'text-emerald-200/80' : 'text-stone-500'
                                    }`}>
                                      {metric.categoryLines.map((line, lIdx) => (
                                        <span key={lIdx} className="whitespace-nowrap">{line}</span>
                                      ))}
                                    </span>
                                  ) : (
                                    <span className={`text-[9px] font-mono uppercase font-semibold whitespace-nowrap ${
                                      isActive ? 'text-emerald-200/80' : 'text-stone-500'
                                    }`}>
                                      {metric.category}
                                    </span>
                                  )}
                                </div>
                              </React.Fragment>
                            ))}
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-0.5 shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* To its right: Autoscroll container with integrated details */}
                <div className="flex-1 min-w-0 w-full">
                  <InitiativeLiveFeed 
                    activeTab={activeTab} 
                    initiativeLabel={currentInitiative.label}
                  />
                </div>
              </div>
            );
          })()}

        </section>

      </div>
    </PageLayout>
  );
};
