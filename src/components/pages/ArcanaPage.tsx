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
  TrendingUp
} from 'lucide-react';
import { PageLayout } from './PageLayout';
import { useStore } from '../../context/StoreContext';
import { VisionMissionCarousel } from './arcana/VisionMissionCarousel';
import { CertificationsThreadCarousel } from './arcana/CertificationsThreadCarousel';
import { InitiativeLiveFeed } from './arcana/InitiativeLiveFeed';

export const ArcanaPage: React.FC = () => {
  const { setViewMode } = useStore();
  const [activeTab, setActiveTab] = useState<'traceability' | 'farmers' | 'green'>('traceability');

  return (
    <PageLayout currentPage="Savannah Arcana">
      <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-200 -mt-2 sm:-mt-3">
        {/* Section 1: Compact Vision & Mission Carousel in Italics (10000ms transition, hover/hold pause) */}
        <section id="arcana-mission-vision" className="pb-0">
          <VisionMissionCarousel />
        </section>

        {/* Section 2: Header Image & Savannah Arcana Header */}
        <section className="space-y-2.5 pt-0">
          <div>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-stone-900 tracking-tight">
              How we do it
            </h3>
          </div>

          <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-stone-200/80 bg-stone-100 mb-2">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
              alt="Savannah Arcana - Co-creating honest food and sustainable value chains"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="text-center space-y-1.5 pb-1">
            <h2 className="font-display font-black text-xl sm:text-3xl text-stone-900 tracking-tight">
              Savannah Arcana
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Co-creating honest food with our customers and farmers to build fairer, sustainable, and traceable value chains for all.
            </p>
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
              <div className="space-y-3">
                {/* Initiatives Section Header */}
                <div className="px-0.5">
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-stone-900 tracking-tight flex items-baseline gap-2">
                    <span>Initiatives</span>
                    <span className="text-[11px] sm:text-xs md:text-sm font-sans font-medium text-stone-500 tracking-normal">
                      (Demo)
                    </span>
                  </h3>
                </div>

                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start">
                  {/* Column to the left with minimalist, compact initiative CTAs with inline metrics */}
                  <div className="w-full md:w-[390px] lg:w-[420px] shrink-0 flex flex-col space-y-1.5">
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
            </div>
          );
          })()}

        </section>

      </div>
    </PageLayout>
  );
};
