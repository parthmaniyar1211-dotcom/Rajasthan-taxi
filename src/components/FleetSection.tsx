import React, { useState } from 'react';
import { VEHICLE_FLEET } from '../data/taxiData';
import { Vehicle } from '../types/taxi';
import { Users, Briefcase, Check, ShieldCheck, Sparkles, Fuel, Wind, Music } from 'lucide-react';

interface FleetSectionProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ onSelectVehicle }) => {
  const [filter, setFilter] = useState<'All' | 'Sedan' | 'SUV' | 'Luxury' | 'Tempo'>('All');

  const filteredFleet = VEHICLE_FLEET.filter((v) => {
    if (filter === 'All') return true;
    if (filter === 'Sedan') return v.category === 'Sedan' || v.category === 'Executive';
    if (filter === 'SUV') return v.category === 'SUV';
    if (filter === 'Luxury') return v.category === 'Luxury';
    if (filter === 'Tempo') return v.category === 'Tempo';
    return true;
  });

  return (
    <section id="fleet" className="py-16 bg-white border-t border-amber-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Well-Maintained Royal Fleet</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Our Rajasthan Taxi Fleet &amp; Transparent Rates
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Choose from economical sedans, spacious Innova Crysta family SUVs, to 17-seater luxury tempo travellers for your Royal Rajasthan expedition.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {(['All', 'Sedan', 'SUV', 'Luxury', 'Tempo'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === category
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-800'
                }`}
              >
                {category === 'All' ? 'All Vehicles' : `${category}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFleet.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-300 transition-all flex flex-col justify-between group"
            >
              {/* Image & Category Badge */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-bold text-amber-900 shadow-xs border border-amber-200">
                  {v.category}
                </div>
                {v.popular && (
                  <div className="absolute top-3 right-3 bg-amber-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-xs">
                    Guest Favorite
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-300" /> {v.passengers} Seats
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-300" /> {v.luggage} Bags
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{v.name}</h3>
                      <p className="text-xs text-slate-500">{v.models}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-amber-700">₹{v.ratePerKm}</div>
                      <div className="text-[10px] text-slate-400 font-medium">per km</div>
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-700 mb-2">Features &amp; Comfort:</div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
                      {v.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Local Rental Quick Tariffs */}
                  <div className="mt-4 p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/50 text-[11px] text-amber-950">
                    <div className="font-semibold text-amber-900 mb-1">Local City Sightseeing Rates:</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/80 p-1 rounded border border-amber-200/40">
                        <div className="text-slate-500 text-[10px]">4h / 40km</div>
                        <div className="font-bold text-slate-800">₹{v.local4hrRate}</div>
                      </div>
                      <div className="bg-white/80 p-1 rounded border border-amber-200/40">
                        <div className="text-slate-500 text-[10px]">8h / 80km</div>
                        <div className="font-bold text-slate-800">₹{v.local8hrRate}</div>
                      </div>
                      <div className="bg-white/80 p-1 rounded border border-amber-200/40">
                        <div className="text-slate-500 text-[10px]">12h / 120km</div>
                        <div className="font-bold text-slate-800">₹{v.local12hrRate}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    <span>Allowance: ₹{v.driverAllowancePerDay}/day</span>
                  </div>
                  <button
                    onClick={() => onSelectVehicle(v)}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                  >
                    Select &amp; Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
