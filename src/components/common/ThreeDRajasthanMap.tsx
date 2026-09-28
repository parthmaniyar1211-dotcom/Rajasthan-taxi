import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

interface MapCity {
  id: string;
  name: string;
  alias: string;
  xPercent: number; // coordinates on Rajasthan map
  yPercent: number;
  distanceFromBhilwara: string;
  driveTime: string;
  startingPrice: string;
  highlight: string;
  isHub?: boolean;
}

export const ThreeDRajasthanMap: React.FC<{
  onSelectRoute?: (pickup: string, drop: string) => void;
}> = ({ onSelectRoute }) => {
  const { navigate } = useNavigation();
  const [selectedCity, setSelectedCity] = useState<MapCity | null>(null);

  const CITIES: MapCity[] = [
    {
      id: 'bhilwara',
      name: 'Bhilwara',
      alias: 'Textile Capital & Rajasthan Rides HQ',
      xPercent: 52,
      yPercent: 56,
      distanceFromBhilwara: '0 km',
      driveTime: 'Central Hub',
      startingPrice: 'Local / Outstation',
      highlight: 'Main dispatch center with 24/7 dedicated fleet garage',
      isHub: true
    },
    {
      id: 'jaipur',
      name: 'Jaipur',
      alias: 'The Pink City',
      xPercent: 64,
      yPercent: 36,
      distanceFromBhilwara: '240 km',
      driveTime: '3.5 Hours',
      startingPrice: '₹3,499',
      highlight: 'Hawa Mahal, Amber Fort & City Palace day tours'
    },
    {
      id: 'udaipur',
      name: 'Udaipur',
      alias: 'City of Lakes',
      xPercent: 44,
      yPercent: 74,
      distanceFromBhilwara: '155 km',
      driveTime: '2.5 Hours',
      startingPrice: '₹2,599',
      highlight: 'Lake Pichola sunset boat ride & luxury palace transfers'
    },
    {
      id: 'jodhpur',
      name: 'Jodhpur',
      alias: 'The Sun City',
      xPercent: 36,
      yPercent: 46,
      distanceFromBhilwara: '260 km',
      driveTime: '4.5 Hours',
      startingPrice: '₹4,199',
      highlight: 'Mehrangarh Fort fortress & blue houses heritage walk'
    },
    {
      id: 'jaisalmer',
      name: 'Jaisalmer',
      alias: 'Golden Sand Dunes',
      xPercent: 16,
      yPercent: 38,
      distanceFromBhilwara: '540 km',
      driveTime: '8.5 Hours',
      startingPrice: '₹7,899',
      highlight: 'Sam sand dunes camel safari & desert tent camps'
    },
    {
      id: 'pushkar',
      name: 'Pushkar / Ajmer',
      alias: 'Holy Lake & Sufi Dargah',
      xPercent: 50,
      yPercent: 44,
      distanceFromBhilwara: '135 km',
      driveTime: '2.0 Hours',
      startingPrice: '₹2,199',
      highlight: 'Brahma Temple, sacred ghats & desert rose gardens'
    },
    {
      id: 'mountabu',
      name: 'Mount Abu',
      alias: 'Only Hill Station of Rajasthan',
      xPercent: 32,
      yPercent: 82,
      distanceFromBhilwara: '280 km',
      driveTime: '5.0 Hours',
      startingPrice: '₹4,699',
      highlight: 'Nakki Lake boating & Dilwara Marble Jain Temples'
    },
    {
      id: 'ahmedabad',
      name: 'Ahmedabad (Gujarat)',
      alias: 'Airport & Business Terminal',
      xPercent: 38,
      yPercent: 96,
      distanceFromBhilwara: '410 km',
      driveTime: '6.5 Hours',
      startingPrice: '₹5,999',
      highlight: 'Expressway corridor connecting southern Rajasthan to Gujarat'
    },
    {
      id: 'delhi',
      name: 'Delhi NCR',
      alias: 'Capital Expressway Corridor',
      xPercent: 78,
      yPercent: 14,
      distanceFromBhilwara: '515 km',
      driveTime: '7.5 Hours',
      startingPrice: '₹7,999',
      highlight: 'Doorstep airport drop & corporate capital connection'
    }
  ];

  const activeCity = selectedCity || CITIES[1]; // Jaipur default

  const handleBookSelected = (city: MapCity) => {
    if (onSelectRoute) {
      onSelectRoute('Bhilwara', city.name);
    } else {
      navigate('/taxi-booking', { state: { pickup: 'Bhilwara', drop: city.name, tripType: 'ONE_WAY' } });
    }
  };

  return (
    <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white relative overflow-hidden shadow-2xl">
      {/* Ambient Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Interactive Highway &amp; Circuit Visualizer</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Explore Rajasthan With Us
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Click on any historical landmark or highway waypoint on the map to inspect distances, estimated drive times, and instant door-to-door taxi tariffs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
        {/* Left Column (7 cols): Visual 3D Map Canvas */}
        <div className="lg:col-span-7 relative h-[380px] sm:h-[440px] rounded-2xl bg-gradient-to-br from-[#0c1424] via-[#101b33] to-[#0a101f] border border-slate-800 p-4 overflow-hidden shadow-inner">
          {/* Faint Desert Cartographic Grid Lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Stylized Silhouette of Rajasthan State Territory */}
          <svg viewBox="0 0 500 450" className="w-full h-full absolute inset-0 opacity-30 pointer-events-none">
            <path
              d="M160,40 Q250,20 340,60 T420,110 T460,220 T400,320 T260,390 T140,360 T70,250 T80,120 Z"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Radiating Highway Web connecting Bhilwara Hub (52%, 56%) to all points */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {CITIES.filter((c) => !c.isHub).map((c) => (
              <line
                key={c.id}
                x1="52%"
                y1="56%"
                x2={`${c.xPercent}%`}
                y2={`${c.yPercent}%`}
                stroke={activeCity.id === c.id ? '#fbbf24' : '#334155'}
                strokeWidth={activeCity.id === c.id ? 2 : 1}
                strokeDasharray={activeCity.id === c.id ? 'none' : '3 3'}
                className="transition-colors duration-300"
              />
            ))}
          </svg>

          {/* Interactive City Pins */}
          {CITIES.map((city) => {
            const isSelected = activeCity.id === city.id;

            return (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedCity(city)}
                style={{ left: `${city.xPercent}%`, top: `${city.yPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform duration-200 z-10 cursor-pointer ${
                  isSelected ? 'scale-110' : 'hover:scale-110'
                }`}
                title={`${city.name} - ${city.distanceFromBhilwara}`}
              >
                {/* Ping animation for active pin */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping" />
                )}

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition shadow-md border ${
                    city.isHub
                      ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/40'
                      : isSelected
                      ? 'bg-amber-400 text-slate-950 border-white'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${city.isHub ? 'text-slate-950' : isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="whitespace-nowrap">{city.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column (5 cols): Selected Waypoint Details Card */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Destination Route Profile
              </span>
              <h4 className="font-serif text-2xl font-bold text-white mt-0.5">{activeCity.name}</h4>
              <p className="text-xs text-amber-300 font-medium">{activeCity.alias}</p>
            </div>
            {activeCity.isHub && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                Central Hub
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeCity.highlight}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance from Bhilwara</span>
              <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">{activeCity.distanceFromBhilwara}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Drive Time</span>
              <div className="font-bold text-white text-sm mt-0.5">{activeCity.driveTime}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Sedan Starting Tariff</span>
              <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{activeCity.startingPrice}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Chauffeur Service</span>
              <div className="font-bold text-white text-sm mt-0.5">AC Guaranteed</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleBookSelected(activeCity)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Cab: Bhilwara ➔ {activeCity.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
