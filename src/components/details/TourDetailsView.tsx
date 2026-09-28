import React from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import {
  RajasthanFortIllustration,
  UdaipurLakesIllustration,
  DesertSafariIllustration
} from '../common/TravelIllustrations';
import { Compass, Calendar, MapPin, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface TourDetailsViewProps {
  tourId: string;
}

export const TourDetailsView: React.FC<TourDetailsViewProps> = ({ tourId }) => {
  const { navigate } = useNavigation();
  const currentUser = dataStore.getCurrentUser();
  const tour = dataStore.getTours().find((t) => t.id === tourId);

  const isCustomer = currentUser.role === 'CUSTOMER';
  const backLabel = isCustomer ? 'Back to Tour Packages' : 'Back to Tours';
  const backFallbackPath = isCustomer ? '/' : '/admin/tours';

  if (!tour) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Tour Package Details"
          subtitle="Tour Not Found"
          backLabel={backLabel}
          backFallback={{ path: backFallbackPath, label: backLabel }}
        />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Tour #{tourId} does not exist</h3>
          <p className="text-xs text-slate-500">Please return to the tour packages catalog.</p>
        </div>
      </div>
    );
  }

  const renderIllustration = () => {
    if (tour.id.includes('UDAIPUR') || tour.id === 'TOUR-03') return <UdaipurLakesIllustration />;
    if (tour.id.includes('DESERT') || tour.id === 'TOUR-02') return <DesertSafariIllustration />;
    return <RajasthanFortIllustration />;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={tour.title}
        subtitle={`${tour.durationDays} Days / ${tour.durationNights} Nights · Starting from ₹${tour.startingPrice.toLocaleString('en-IN')}`}
        backLabel={backLabel}
        backFallback={{ path: backFallbackPath, label: backLabel }}
        badge={
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
            {tour.destinations.join(' ➔ ')}
          </span>
        }
        actions={
          <button
            type="button"
            onClick={() => navigate(`/tour-booking/${tour.id}`)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <span>Book Tour Package</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        }
      />

      {/* Hero Illustration & Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="h-64 sm:h-80 w-full relative bg-slate-950">
          {renderIllustration()}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
            <div className="text-white space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                {tour.destinations.length} Royal Destinations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">{tour.title}</h2>
              <p className="text-xs text-slate-300 max-w-xl">{tour.tagline}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{tour.durationDays} Days / {tour.durationNights} Nights</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting Price</span>
              <span className="font-mono font-bold text-amber-800 mt-0.5 block">₹{tour.startingPrice.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Destinations</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{tour.destinations.length} Cities</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Cab Provided</span>
              <span className="font-bold text-slate-900 mt-0.5 block">Dedicated AC Chauffeur</span>
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-slate-900">Package Inclusions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {tour.inclusions.map((inc, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h3 className="font-serif font-bold text-base text-slate-900">Day-by-Day Journey Itinerary</h3>
            <div className="space-y-3">
              {tour.itinerary.map((item) => (
                <div key={item.day} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Day {item.day}: {item.title}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
