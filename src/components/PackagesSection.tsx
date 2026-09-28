import React, { useState } from 'react';
import { TOUR_PACKAGES } from '../data/taxiData';
import { TourPackage } from '../types/taxi';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

interface PackagesSectionProps {
  onBookPackage: (pkg: TourPackage) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onBookPackage }) => {
  const [selectedItineraryPkg, setSelectedItineraryPkg] = useState<TourPackage | null>(null);

  return (
    <section id="packages" className="py-16 bg-stone-50 border-t border-amber-100">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Unforgettable Royal Itineraries</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Curated Rajasthan Cab Tour Packages
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Handcrafted sightseeing packages with private dedicated car and experienced local chauffeur. Includes all interstate permits, highway tolls, and driver lodging.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOUR_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-amber-200/70 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {pkg.badge && (
                    <div className="absolute top-3 left-3 bg-amber-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow">
                      {pkg.badge}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 font-semibold text-xs px-2.5 py-1 rounded-lg">
                    {pkg.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-amber-800 font-medium mt-1">
                    {pkg.tagline}
                  </p>

                  {/* Route City Pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {pkg.cities.map((city, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full"
                      >
                        {city}
                      </span>
                    ))}
                  </div>

                  {/* Included preview */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Dedicated Chauffeur &amp; AC Vehicle</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>All Tolls, Parking &amp; Taxes Included</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Sightseeing as per day-by-day plan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="p-4 sm:p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Starting from</span>
                    <div className="text-lg font-extrabold text-amber-700">
                      ₹{pkg.startingFareSedan.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItineraryPkg(pkg)}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline decoration-amber-400"
                  >
                    View Itinerary
                  </button>
                </div>

                <button
                  onClick={() => onBookPackage(pkg)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <span>Book Tour Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Itinerary Modal */}
        {selectedItineraryPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden">
              {/* Modal Header */}
              <div className="p-5 bg-gradient-to-r from-amber-900 to-amber-950 text-white flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-amber-800 text-amber-200 px-2 py-0.5 rounded">
                      {selectedItineraryPkg.duration}
                    </span>
                    <span className="text-xs text-amber-300">
                      {selectedItineraryPkg.tagline}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold mt-1 text-white">
                    {selectedItineraryPkg.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItineraryPkg(null)}
                  className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Day-by-Day Itinerary */}
              <div className="p-5 overflow-y-auto space-y-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Day-by-Day Journey Breakdown:
                </div>

                <div className="space-y-4 border-l-2 border-amber-300 ml-3 pl-4">
                  {selectedItineraryPkg.itinerary.map((item) => (
                    <div key={item.day} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-600 border-2 border-white" />
                      <div className="text-xs font-bold text-amber-900">
                        Day {item.day}: {item.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-medium">
                        Night stay: {item.stayCity}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {item.activities.map((act, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded"
                          >
                            • {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inclusions & Exclusions */}
                <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                    <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Inclusions:
                    </div>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {selectedItineraryPkg.inclusions.map((inc, i) => (
                        <li key={i}>✓ {inc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                    <div className="font-bold text-rose-900 mb-1 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Exclusions:
                    </div>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {selectedItineraryPkg.exclusions.map((exc, i) => (
                        <li key={i}>✕ {exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500">Starting Sedan Fare:</span>
                  <div className="text-lg font-bold text-amber-800">
                    ₹{selectedItineraryPkg.startingFareSedan.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-500">/ SUV: ₹{selectedItineraryPkg.startingFareSuv.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedItineraryPkg(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const pkg = selectedItineraryPkg;
                      setSelectedItineraryPkg(null);
                      onBookPackage(pkg);
                    }}
                    className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Book This Tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
