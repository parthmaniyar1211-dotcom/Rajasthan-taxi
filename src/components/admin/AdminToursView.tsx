import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { TourPackage } from '../../types/rrTypes';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { Compass, Plus, Users, Sparkles, CheckCircle2, ChevronRight, X, Eye } from 'lucide-react';

export const AdminToursView: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const tours = dataStore.getTours();
  const customEnquiries = dataStore.getCustomEnquiries();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tours &amp; Holiday Packages Management"
        subtitle="Manage multi-day Rajasthan circuits, itineraries, tariffs, and incoming custom tour enquiries"
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
      />

      {/* Custom Enquiries Pending Review Strip */}
      {customEnquiries.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Incoming Custom Tour Requests ({customEnquiries.length})
            </span>
            <span className="text-[11px] text-amber-800">Direct from Travelers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {customEnquiries.map((enq) => (
              <div key={enq.id} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-slate-900 text-xs">{enq.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    enq.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {enq.status}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{enq.customerName} ({enq.customerPhone})</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {enq.startingCity} ➔ {enq.destinations.join(' • ')} ({enq.durationDays} Days, {enq.travelersCount} pax)
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2 italic">
                  &ldquo;{enq.requirementsNotes}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tour Packages Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tours.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img src={pkg.featuredImage} alt={pkg.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                  {pkg.durationDays}D / {pkg.durationNights}N
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-serif font-bold text-base text-slate-900">{pkg.title}</h4>
                <p className="text-xs text-amber-800 font-medium">{pkg.tagline}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {pkg.destinations.map((d, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Starting Sedan</span>
                <div className="text-base font-extrabold text-amber-800">
                  ₹{pkg.startingPrice.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/tours/${pkg.id}`)}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                >
                  <Eye className="w-3 h-3" />
                  <span>Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTour(pkg)}
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 underline"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Itinerary Modal */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">{selectedTour.title}</h3>
                <p className="text-xs text-slate-500">{selectedTour.durationDays} Days / {selectedTour.durationNights} Nights</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTour(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {selectedTour.itinerary.map((item) => (
                <div key={item.day} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-900">Day {item.day}: {item.title}</div>
                  <div className="text-slate-600">{item.description}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedTour(null);
                  navigate(`/admin/tours/${selectedTour.id}`);
                }}
                className="text-xs font-bold text-amber-800 hover:underline"
              >
                Open Full Tour Details Page ➔
              </button>
              <button
                type="button"
                onClick={() => setSelectedTour(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
