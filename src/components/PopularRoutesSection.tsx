import React from 'react';
import { POPULAR_ROUTES } from '../data/taxiData';
import { PopularRoute } from '../types/taxi';
import { MapPin, ArrowRight, Clock, ShieldCheck, Sparkles, Navigation } from 'lucide-react';

interface PopularRoutesSectionProps {
  onSelectRoute: (route: PopularRoute) => void;
}

export const PopularRoutesSection: React.FC<PopularRoutesSectionProps> = ({ onSelectRoute }) => {
  return (
    <section id="routes" className="py-16 bg-white border-t border-amber-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Navigation className="w-3.5 h-3.5 text-amber-700" />
            <span>Frequent Highway Connections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Popular Rajasthan Outstation Taxi Routes
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Fixed discounted fares on Rajasthan&apos;s most traveled tourist corridors. Enjoy smooth highway cruising with experienced local chauffeurs.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_ROUTES.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Route Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {route.popularFor}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {route.durationHours}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-base font-bold text-slate-900 mt-2">
                  <span>{route.from}</span>
                  <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{route.to}</span>
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Highway Distance: ~{route.distanceKm} km
                </div>

                {/* Highlights */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-600">Enroute Stops:</div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">
                    {route.highlights.join(' • ')}
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Sedan One-Way</div>
                  <div className="text-base font-extrabold text-amber-700">
                    ₹{route.sedanFare.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => onSelectRoute(route)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
                >
                  Book Cab
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
