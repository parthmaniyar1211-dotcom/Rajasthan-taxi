import React, { useState } from 'react';
import { Users, Briefcase, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Fuel, Wind } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

interface FleetCard {
  id: string;
  name: string;
  category: 'SEDAN' | 'SUV' | 'PREMIUM' | 'TRAVELLER';
  tagline: string;
  seating: string;
  luggage: string;
  perKmRate: number;
  dailyRate: number;
  features: string[];
  imageUrl: string;
  idealFor: string;
}

export const ThreeDVehicleShowcase: React.FC<{
  onSelectVehicle?: (category: string) => void;
}> = ({ onSelectVehicle }) => {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'ALL' | 'SEDAN' | 'SUV' | 'PREMIUM' | 'TRAVELLER'>('ALL');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('crysta');

  const FLEET: FleetCard[] = [
    {
      id: 'crysta',
      name: 'Toyota Innova Crysta',
      category: 'SUV',
      tagline: 'The Gold Standard of Rajasthan Highway Roadtrips',
      seating: '6 + 1 Captain Seats',
      luggage: '4 Large Suitcases',
      perKmRate: 16,
      dailyRate: 3500,
      features: ['Dual AC Blowers', 'Reclining Armrest Seats', 'Spacious Legroom', 'Commercial Tourist Permit'],
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      idealFor: 'Family Vacations & Multi-Day Tour Circuits'
    },
    {
      id: 'dzire',
      name: 'Maruti Suzuki Dzire AC',
      category: 'SEDAN',
      tagline: 'Economical, Swift & Comfortable Intercity Transit',
      seating: '4 + 1 Passengers',
      luggage: '2 Medium Suitcases',
      perKmRate: 12,
      dailyRate: 2200,
      features: ['Chilled AC', 'Bluetooth Audio', 'High Fuel Efficiency', 'Smooth Highway Ride'],
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      idealFor: 'One-Way Transfers & Solo / Couple Travelers'
    },
    {
      id: 'fortuner',
      name: 'Toyota Fortuner 4x4 Luxury',
      category: 'PREMIUM',
      tagline: 'Commanding Presence & Desert Dune Capabilities',
      seating: '6 + 1 Passengers',
      luggage: '5 Large Bags',
      perKmRate: 28,
      dailyRate: 6500,
      features: ['Leather Upholstery', '4x4 Desert Terrain Mode', 'JBL Premium Sound', 'VIP Tint & Chauffeur'],
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      idealFor: 'Royal Destination Weddings & VIP Delegation'
    },
    {
      id: 'urbania',
      name: 'Force Urbania Luxury Van',
      category: 'TRAVELLER',
      tagline: 'First-Class Luxury for Large Families & Tour Groups',
      seating: '12-16 Pushback Seats',
      luggage: '12 Full-Size Bags',
      perKmRate: 24,
      dailyRate: 5500,
      features: ['Individual AC Vents', 'USB Phone Charging at Every Seat', 'Panoramic Windows', 'Huge Luggage Boot'],
      imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      idealFor: 'Group Tours, Pilgrimages & Extended Roadtrips'
    }
  ];

  const filteredFleet = activeTab === 'ALL' ? FLEET : FLEET.filter((v) => v.category === activeTab);

  const handleBook = (v: FleetCard) => {
    if (onSelectVehicle) {
      onSelectVehicle(v.category);
    } else {
      navigate('/taxi-booking');
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Company Owned &amp; Attached Fleet</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Our Commercial Chauffeur Fleet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Clean, sanitized, tourist-permit cabs driven exclusively by verified, experienced highway chauffeurs.
          </p>
        </div>

        {/* Category Filters (Segmented) */}
        <div className="flex p-1 bg-slate-100 rounded-2xl max-w-md text-xs font-bold">
          {(['ALL', 'SUV', 'SEDAN', 'PREMIUM', 'TRAVELLER'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === cat
                  ? 'bg-slate-950 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {cat === 'ALL' ? 'All Fleet' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Grid with 3D Elevation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFleet.map((v) => {
          const isSelected = selectedVehicleId === v.id;

          return (
            <div
              key={v.id}
              onClick={() => setSelectedVehicleId(v.id)}
              className={`group bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xl cursor-pointer ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-400/20 shadow-md translate-y--1'
                  : 'border-slate-200/90 hover:border-amber-300 hover:translate-y--1'
              }`}
            >
              <div>
                {/* Vehicle Image with Zoom on Hover */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={v.imageUrl}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 text-amber-300 backdrop-blur-md border border-amber-500/30">
                    {v.category}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] text-amber-300 uppercase tracking-wider block font-bold">
                      {v.idealFor}
                    </span>
                    <h3 className="font-serif font-bold text-lg">{v.name}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                    {v.tagline}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {v.seating}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      {v.luggage}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    {v.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-4 space-y-3">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Outstation Tariff</span>
                    <span className="font-mono text-lg font-bold text-amber-900">
                      ₹{v.perKmRate}<span className="text-xs font-sans text-slate-500 font-normal"> / km</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">8hr Local</span>
                    <span className="font-mono text-xs font-bold text-slate-700">₹{v.dailyRate}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBook(v)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-amber-200 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book {v.name.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
