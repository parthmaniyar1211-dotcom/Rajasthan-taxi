import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { TourPackage } from '../../types/rrTypes';
import {
  RajasthanFortIllustration,
  UdaipurLakesIllustration,
  DesertSafariIllustration,
  LuxuryCarIllustration
} from '../common/TravelIllustrations';
import {
  Car,
  Compass,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Clock,
  ArrowLeftRight,
  Star,
  Luggage,
  Sparkles,
  CreditCard,
  ChevronRight
} from 'lucide-react';

interface CustomerHomeProps {
  onStartTaxiBooking: (params?: { pickup?: string; drop?: string; tripType?: 'ONE_WAY' | 'ROUND_TRIP' }) => void;
  onSelectTourPackage: (pkg: TourPackage) => void;
  onOpenMyBookings: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onStartTaxiBooking,
  onSelectTourPackage,
  onOpenMyBookings
}) => {
  // Service Tab: 'TAXI' | 'TOURS' | 'CUSTOM'
  const [activeService, setActiveService] = useState<'TAXI' | 'TOURS' | 'CUSTOM'>('TAXI');

  // Search Engine State
  const [pickupCity, setPickupCity] = useState('Bhilwara');
  const [dropCity, setDropCity] = useState('Ahmedabad');
  const [tripType, setTripType] = useState<'ONE_WAY' | 'ROUND_TRIP'>('ONE_WAY');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState(defaultDateStr);

  // Custom Enquiry Form State
  const [customStartCity, setCustomStartCity] = useState('Bhilwara');
  const [customDestinations, setCustomDestinations] = useState('Jaipur, Jodhpur, Udaipur');
  const [customDays, setCustomDays] = useState(5);
  const [customTravelers, setCustomTravelers] = useState(4);
  const [customBudget, setCustomBudget] = useState(25000);
  const [customNotes, setCustomNotes] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const tours = dataStore.getTours();
  const currentUser = dataStore.getCurrentUser();
  const vehicles = dataStore.getVehicles();

  const popularRoutes = [
    { from: 'Bhilwara', to: 'Ahmedabad', distance: '410 km', time: '6.5 hrs', fare: '5,999', subtitle: 'Airport & Business Corridor' },
    { from: 'Bhilwara', to: 'Delhi', distance: '515 km', time: '7.5 hrs', fare: '7,999', subtitle: 'Direct Capital Highway' },
    { from: 'Bhilwara', to: 'Jaipur', distance: '240 km', time: '3.5 hrs', fare: '3,499', subtitle: 'Pink City Superfast' },
    { from: 'Bhilwara', to: 'Udaipur', distance: '155 km', time: '2.5 hrs', fare: '2,599', subtitle: 'Lake City Express' },
    { from: 'Bhilwara', to: 'Jodhpur', distance: '260 km', time: '4.5 hrs', fare: '4,199', subtitle: 'Sun City Transit' },
    { from: 'Jaipur', to: 'Udaipur', distance: '395 km', time: '6.0 hrs', fare: '5,899', subtitle: 'Heritage Expressway' }
  ];

  const handleSwapCities = () => {
    const temp = pickupCity;
    setPickupCity(dropCity);
    setDropCity(temp);
  };

  const handleQuickRoute = (from: string, to: string) => {
    setPickupCity(from);
    setDropCity(to);
    onStartTaxiBooking({ pickup: from, drop: to, tripType: 'ONE_WAY' });
  };

  const handleCustomEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.createCustomEnquiry({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerEmail: currentUser.email,
      startingCity: customStartCity,
      destinations: customDestinations.split(',').map((s) => s.trim()),
      startDate: travelDate,
      durationDays: Number(customDays),
      travelersCount: Number(customTravelers),
      vehiclePreference: 'SUV',
      estimatedBudget: Number(customBudget),
      requirementsNotes: customNotes || 'Custom royal tour itinerary requested.'
    });
    setEnquirySuccess(true);
    setTimeout(() => setEnquirySuccess(false), 6000);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* ========================================================
          HERO & TRIP SEARCH CONSOLE
         ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800">
        {/* Ambient Royal Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
          {/* Unboxed Header Metadata */}
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300/90 mb-3">
            <span>Rajasthan Commercial Cab Network</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>Chauffeur-Driven Outstation</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>Zero Surge Guarantee</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-2xl font-serif leading-tight">
            Where would you like to travel?
          </h1>

          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Doorstep outstation taxis, intercity highway transfers, and bespoke Rajasthan holiday circuits starting from{' '}
            <strong className="text-white font-semibold">Bhilwara</strong>, Jaipur, Udaipur, and Delhi.
          </p>

          {/* Interactive Service Selector (Segmented Controls) */}
          <div className="mt-8 flex flex-wrap gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 max-w-xl">
            <button
              type="button"
              onClick={() => setActiveService('TAXI')}
              className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeService === 'TAXI'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Outstation Taxi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveService('TOURS')}
              className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeService === 'TOURS'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Tour Packages</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveService('CUSTOM')}
              className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeService === 'CUSTOM'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Custom Road Trip</span>
            </button>
          </div>

          {/* Dynamic Console Container */}
          <div className="mt-6 bg-white text-slate-900 rounded-2xl p-5 sm:p-7 shadow-2xl border border-slate-100">
            {activeService === 'TAXI' && (
              <div className="space-y-5">
                {/* Trip Type & Trust Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setTripType('ONE_WAY')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        tripType === 'ONE_WAY'
                          ? 'bg-slate-900 text-amber-400 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      One-Way Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('ROUND_TRIP')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        tripType === 'ROUND_TRIP'
                          ? 'bg-slate-900 text-amber-400 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Round Trip Journey
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Clean sanitized commercial cabs · All toll &amp; tax assistance</span>
                  </div>
                </div>

                {/* Form Fields: From, Swap, To, Date, Action */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  {/* From Field */}
                  <div className="md:col-span-4 bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 rounded-xl p-3 transition">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Pickup City
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                      <select
                        value={pickupCity}
                        onChange={(e) => setPickupCity(e.target.value)}
                        className="w-full bg-transparent font-bold text-sm text-slate-900 outline-none cursor-pointer"
                      >
                        <option value="Bhilwara">Bhilwara (Textile City Hub)</option>
                        <option value="Ahmedabad">Ahmedabad (Airport / City)</option>
                        <option value="Delhi">Delhi NCR / IGI Airport</option>
                        <option value="Jaipur">Jaipur (Pink City)</option>
                        <option value="Udaipur">Udaipur (City of Lakes)</option>
                        <option value="Jodhpur">Jodhpur (Sun City)</option>
                        <option value="Ajmer">Ajmer / Pushkar</option>
                        <option value="Chittorgarh">Chittorgarh</option>
                        <option value="Kota">Kota</option>
                      </select>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="hidden md:flex md:col-span-1 justify-center">
                    <button
                      type="button"
                      onClick={handleSwapCities}
                      aria-label="Swap pickup and drop cities"
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Destination Field */}
                  <div className="md:col-span-4 bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 rounded-xl p-3 transition">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Destination City
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <select
                        value={dropCity}
                        onChange={(e) => setDropCity(e.target.value)}
                        className="w-full bg-transparent font-bold text-sm text-slate-900 outline-none cursor-pointer"
                      >
                        <option value="Ahmedabad">Ahmedabad (Airport / City)</option>
                        <option value="Delhi">Delhi NCR / Airport</option>
                        <option value="Jaipur">Jaipur (Pink City)</option>
                        <option value="Udaipur">Udaipur (Lake City)</option>
                        <option value="Jodhpur">Jodhpur (Sun City)</option>
                        <option value="Bhilwara">Bhilwara</option>
                        <option value="Ajmer">Ajmer / Pushkar</option>
                        <option value="Mount Abu">Mount Abu</option>
                        <option value="Chittorgarh">Chittorgarh</option>
                      </select>
                    </div>
                  </div>

                  {/* Date Field */}
                  <div className="md:col-span-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-blue-600 rounded-xl p-3 transition">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Travel Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full bg-transparent font-bold text-sm text-slate-900 outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Popular Corridors: <button type="button" onClick={() => handleQuickRoute('Bhilwara', 'Ahmedabad')} className="font-semibold text-slate-900 underline hover:text-amber-600">Bhilwara–Ahmedabad</button> · <button type="button" onClick={() => handleQuickRoute('Bhilwara', 'Delhi')} className="font-semibold text-slate-900 underline hover:text-amber-600">Bhilwara–Delhi</button> · <button type="button" onClick={() => handleQuickRoute('Bhilwara', 'Jaipur')} className="font-semibold text-slate-900 underline hover:text-amber-600">Bhilwara–Jaipur</button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartTaxiBooking({ pickup: pickupCity, drop: dropCity, tripType })}
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-amber-200 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group shrink-0"
                  >
                    <span>View Available Cabs &amp; Fares</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {activeService === 'TOURS' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900">
                      Curated Rajasthan Heritage Holiday Circuits
                    </h3>
                    <p className="text-xs text-slate-500">
                      Private AC cab with chauffeur, vetted heritage stays, breakfast, and personalized sightseeing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveService('CUSTOM')}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    Need a custom plan? <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  {tours.slice(0, 3).map((pkg) => (
                    <div
                      key={pkg.id}
                      className="border border-slate-200 hover:border-amber-400 rounded-xl p-4 transition bg-slate-50/50 hover:bg-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                          <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                          <span className="font-semibold text-amber-700">{pkg.vehicleOptions[0]}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{pkg.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{pkg.tagline}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Starting from</span>
                          <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                            ₹{pkg.startingPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectTourPackage(pkg)}
                          className="px-3.5 py-1.5 bg-slate-900 text-amber-300 hover:bg-slate-800 rounded-lg text-xs font-bold transition"
                        >
                          View Itinerary
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeService === 'CUSTOM' && (
              <form onSubmit={handleCustomEnquirySubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Tailor Your Private Rajasthan Road Trip
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tell us your cities, days, and traveler count. Our travel architect will coordinate a custom cab &amp; itinerary within 2 hours.
                  </p>
                </div>

                {enquirySuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">Enquiry Registered Successfully!</div>
                      <div className="text-xs text-emerald-700">
                        Our trip planner will call {currentUser.phone} shortly with your bespoke quote.
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Starting City
                        </label>
                        <input
                          type="text"
                          value={customStartCity}
                          onChange={(e) => setCustomStartCity(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-blue-600"
                          placeholder="e.g. Bhilwara or Jaipur"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Cities to Visit
                        </label>
                        <input
                          type="text"
                          value={customDestinations}
                          onChange={(e) => setCustomDestinations(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-blue-600"
                          placeholder="e.g. Jodhpur, Jaisalmer, Udaipur"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Duration (Days)
                        </label>
                        <select
                          value={customDays}
                          onChange={(e) => setCustomDays(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-blue-600 cursor-pointer"
                        >
                          <option value={3}>3 Days (Weekend Getaway)</option>
                          <option value={5}>5 Days (Heritage Triangle)</option>
                          <option value={7}>7 Days (Royal Circuit)</option>
                          <option value={10}>10 Days (Grand Rajasthan)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Travelers Count
                        </label>
                        <select
                          value={customTravelers}
                          onChange={(e) => setCustomTravelers(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-blue-600 cursor-pointer"
                        >
                          <option value={2}>2 Adults (Couple / Sedan)</option>
                          <option value={4}>4 Adults (Family / Sedan / SUV)</option>
                          <option value={6}>6 Adults (Family / Innova Crysta)</option>
                          <option value={10}>10+ Adults (Group / Tempo Traveller)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-600" />
                        <span>Helpline: +91 98290 14820 (24x7 Rajasthan Trip Desk)</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Submit Custom Trip Request
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          POPULAR INTERCITY HIGHWAY CORRIDORS
         ======================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Frequent Routes &amp; Fixed Tariffs
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Popular Highway Corridors
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Fixed transparent one-way and return fares with doorstep pickup and verified chauffeurs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onStartTaxiBooking()}
            className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1 shrink-0"
          >
            <span>Explore All 24+ Routes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularRoutes.map((route, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-amber-400/80 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <span className="font-medium">{route.subtitle}</span>
                  <span className="font-mono tabular-nums">{route.time}</span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="font-bold text-slate-900 text-base">
                    {route.from}
                  </div>
                  <div className="flex-1 flex items-center justify-center px-2">
                    <div className="w-full border-t border-dashed border-slate-300 relative">
                      <Car className="w-3.5 h-3.5 text-amber-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-0.5" />
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    {route.to}
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  Distance: <span className="font-mono font-medium text-slate-700">{route.distance}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">One-Way Fare</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                    ₹{route.fare}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickRoute(route.from, route.to)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-amber-300 font-bold text-xs rounded-xl transition-all"
                >
                  Book Cab
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          CURATED RAJASTHAN TOUR PACKAGES
         ======================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Holiday Road Trips
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Curated Tour Itineraries
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Complete travel packages with dedicated cab, seasoned chauffeur, and vetted heritage hotels.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            <span>All packages include vehicle fuel, tolls, and driver allowance</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.map((pkg, idx) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Artistic Vector Header */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                {idx === 0 && <RajasthanFortIllustration className="w-full h-full object-cover" />}
                {idx === 1 && <UdaipurLakesIllustration className="w-full h-full object-cover" />}
                {idx >= 2 && <DesertSafariIllustration className="w-full h-full object-cover" />}

                {/* Duration Overlay */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-800">
                  {pkg.durationDays} Days · {pkg.durationNights} Nights
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-xs text-amber-300/90 font-medium">{pkg.destinations[0]} Departure</div>
                  <h3 className="font-serif font-bold text-base line-clamp-1">{pkg.title}</h3>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {pkg.tagline}
                  </p>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Car className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Dedicated AC {pkg.vehicleOptions[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="line-clamp-1">Covers: {pkg.itinerary.map(i => i.city).join(' ➔ ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Heritage hotel stay &amp; daily breakfast</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Package Price</span>
                    <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                      ₹{pkg.startingPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">all inclusive per couple</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTourPackage(pkg)}
                    className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          VERIFIED COMMERCIAL VEHICLE FLEET & TRANSPARENT TARIFFS
         ======================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Fleet Standards &amp; Tariffs
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Well-Maintained Chauffeur Fleet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              100% yellow-plate commercial cabs with all-India permits, clean interiors, and disciplined highway drivers.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            <span>Minimum 250 km / day outstation billing rule</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.slice(0, 4).map((veh) => (
            <div
              key={veh.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Vehicle Vector Art */}
                <div className="h-28 w-full bg-slate-50 rounded-xl p-2 flex items-center justify-center border border-slate-100">
                  <LuxuryCarIllustration
                    type={veh.type === 'SEDAN' ? 'SEDAN' : 'SUV'}
                    className="w-full h-full"
                  />
                </div>

                <div className="mt-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {veh.type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                      Commercial RC
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{veh.model}</h3>
                </div>

                {/* Capacity specs */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{veh.seating} Passengers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-slate-400" />
                    <span>{veh.luggageCapacity} Bags</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>AC with clean seat covers</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Per Km Rate</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                    ₹{veh.perKmRate}
                  </span>
                  <span className="text-[10px] text-slate-500"> / km</span>
                </div>

                <button
                  type="button"
                  onClick={() => onStartTaxiBooking({ pickup: 'Bhilwara', drop: 'Ahmedabad' })}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl transition"
                >
                  Book This
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          TRUST PILLARS & PROOF
         ======================================================== */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Why Travelers Choose Rajasthan Rides
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1.5 text-white">
            Punctual, Transparent, Royal Hospitality
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            We operate our own commercial fleet with verified full-time drivers—not unvetted aggregator rides.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Zero Surge Guarantee</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No peak hour multipliers, festival extortion, or surprise hidden charges. Fixed pre-agreed rates.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Polite Chauffeurs</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uniformed, non-smoking, police-verified drivers experienced in long highway driving and hill routes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Doorstep Punctuality</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chauffeur reaches 15 minutes before scheduled pickup time for seamless luggage loading.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">24x7 Trip Support</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct line to our Bhilwara Central Control Desk for route assistance, hotel coordination, and emergency help.
            </p>
          </div>
        </div>

        {/* Attributable Review Strip */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm font-serif">
              RK
            </div>
            <div>
              <div className="text-xs font-bold text-white">Rajesh Khandelwal</div>
              <div className="text-[11px] text-slate-400">Textile Business Executive · Frequent Bhilwara–Ahmedabad Traveler</div>
            </div>
          </div>

          <p className="text-xs italic text-slate-300 max-w-lg">
            “The Innova Crysta was spotless and arrived at 5:45 AM sharp in Bhilwara. Reached Ahmedabad Airport right on schedule. No toll disputes, pure professional service.”
          </p>
        </div>
      </section>
    </div>
  );
};
