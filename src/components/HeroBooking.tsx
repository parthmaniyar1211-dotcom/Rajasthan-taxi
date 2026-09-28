import React, { useState, useMemo } from 'react';
import {
  TripType,
  Vehicle,
  BookingFormData
} from '../types/taxi';
import {
  RAJASTHAN_CITIES,
  AIRPORTS_AND_STATIONS,
  VEHICLE_FLEET,
  getEstimatedDistance
} from '../data/taxiData';
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  ArrowRightLeft,
  ShieldCheck,
  Award,
  Sparkles,
  Users,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Plane
} from 'lucide-react';

interface HeroBookingProps {
  onStartBooking: (formData: BookingFormData) => void;
  presetRoute?: { from: string; to: string } | null;
}

export const HeroBooking: React.FC<HeroBookingProps> = ({
  onStartBooking,
  presetRoute
}) => {
  const [tripType, setTripType] = useState<TripType>('oneway');
  const [pickupCity, setPickupCity] = useState(presetRoute?.from || 'Jaipur');
  const [dropCity, setDropCity] = useState(presetRoute?.to || 'Udaipur');
  
  // Date and Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const returnDay = new Date();
  returnDay.setDate(returnDay.getDate() + 3);
  const defaultReturnDateStr = returnDay.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(defaultDateStr);
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState(defaultReturnDateStr);
  const [localPackage, setLocalPackage] = useState<'4hr40km' | '8hr80km' | '12hr120km'>('8hr80km');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('sedan-prime');

  // Handle route swaps
  const handleSwapCities = () => {
    const temp = pickupCity;
    setPickupCity(dropCity);
    setDropCity(temp);
  };

  const selectedVehicle = useMemo(() => {
    return VEHICLE_FLEET.find((v) => v.id === selectedVehicleId) || VEHICLE_FLEET[0];
  }, [selectedVehicleId]);

  // Compute live estimated fare
  const fareDetails = useMemo(() => {
    const distanceOneWay = getEstimatedDistance(pickupCity, dropCity);

    if (tripType === 'local') {
      let pkgRate = selectedVehicle.local8hrRate;
      let label = '8 Hours / 80 Km Package';
      if (localPackage === '4hr40km') {
        pkgRate = selectedVehicle.local4hrRate;
        label = '4 Hours / 40 Km Package';
      } else if (localPackage === '12hr120km') {
        pkgRate = selectedVehicle.local12hrRate;
        label = '12 Hours / 120 Km Package';
      }
      return {
        distanceKm: localPackage === '4hr40km' ? 40 : localPackage === '8hr80km' ? 80 : 120,
        estimatedDuration: localPackage === '4hr40km' ? '4 Hours' : localPackage === '8hr80km' ? '8 Hours' : '12 Hours',
        baseFare: pkgRate,
        driverAllowance: 0,
        tollEstimate: 0,
        total: pkgRate,
        label
      };
    }

    if (tripType === 'airport') {
      const airportBase = selectedVehicle.category === 'Sedan' ? 999 : selectedVehicle.category === 'SUV' ? 1499 : 2499;
      return {
        distanceKm: 35,
        estimatedDuration: '1 Hour',
        baseFare: airportBase,
        driverAllowance: 0,
        tollEstimate: 100,
        total: airportBase + 100,
        label: 'Fixed Airport Transfer'
      };
    }

    if (tripType === 'roundtrip') {
      // Days calculation
      const pDate = new Date(pickupDate);
      const rDate = new Date(returnDate);
      const diffTime = Math.max(1, Math.ceil((rDate.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      const days = diffTime > 0 ? diffTime : 2;

      const totalKmEstimated = Math.max(distanceOneWay * 2, days * selectedVehicle.minKmPerDay);
      const kmFare = totalKmEstimated * selectedVehicle.ratePerKm;
      const driverAllowance = days * selectedVehicle.driverAllowancePerDay;
      const tollEstimate = Math.round(distanceOneWay * 2 * 1.4);
      const total = kmFare + driverAllowance + tollEstimate;

      return {
        distanceKm: totalKmEstimated,
        estimatedDuration: `${days} Days Tour`,
        baseFare: kmFare,
        driverAllowance,
        tollEstimate,
        total,
        label: `${days} Days Round Trip (${totalKmEstimated} km min. covered)`
      };
    }

    // Default: One-way
    const totalKm = distanceOneWay;
    // Discounted flat one-way formula commonly used by Rajasthan tourist cab networks
    const kmFare = Math.round(totalKm * (selectedVehicle.ratePerKm * 1.15));
    const driverAllowance = 250;
    const tollEstimate = Math.round(totalKm * 1.2);
    const total = kmFare + driverAllowance + tollEstimate;

    return {
      distanceKm: totalKm,
      estimatedDuration: `${(totalKm / 55).toFixed(1)} hrs approx.`,
      baseFare: kmFare,
      driverAllowance,
      tollEstimate,
      total,
      label: `One-way ${pickupCity} to ${dropCity} (${totalKm} km)`
    };
  }, [tripType, pickupCity, dropCity, pickupDate, returnDate, localPackage, selectedVehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartBooking({
      tripType,
      pickupCity,
      dropCity: tripType === 'local' ? pickupCity : dropCity,
      pickupDate,
      pickupTime,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      localPackage: tripType === 'local' ? localPackage : undefined,
      selectedVehicleId,
      passengerName: '',
      passengerPhone: '',
      passengerEmail: '',
      pickupAddress: ''
    });
  };

  return (
    <div id="booking-engine" className="relative pt-6 pb-16 overflow-hidden bg-gradient-to-b from-amber-50/70 via-stone-50 to-white">
      {/* Subtle royal pattern decor background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#92400e_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Rajasthan&apos;s Most Trusted Royal Cab &amp; Car Rental Service</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore Royal Rajasthan With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800">
              Premier Chauffeur-Driven Cabs
            </span>
          </h1>

          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            From the Pink Palaces of Jaipur to the Golden Dunes of Jaisalmer and Romantic Lakes of Udaipur.
            Enjoy spotless cars, punctual verified chauffeurs, and zero hidden charges.
          </p>

          <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-amber-200/80 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Police Verified Drivers
            </span>
            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-amber-200/80 shadow-2xs">
              <Award className="w-4 h-4 text-amber-600" /> No Surge Pricing
            </span>
            <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-amber-200/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Cancellation
            </span>
          </div>
        </div>

        {/* Booking Engine Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-amber-900/5 border border-amber-200/80 overflow-hidden">
          {/* Trip Type Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-amber-50/70 border-b border-amber-200/80 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => setTripType('oneway')}
              className={`py-3.5 px-4 text-center transition-all flex items-center justify-center gap-2 border-r border-amber-200/50 ${
                tripType === 'oneway'
                  ? 'bg-white text-amber-800 border-b-2 border-b-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-amber-800 hover:bg-amber-100/40'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>One-Way Outstation</span>
            </button>

            <button
              type="button"
              onClick={() => setTripType('roundtrip')}
              className={`py-3.5 px-4 text-center transition-all flex items-center justify-center gap-2 border-r border-amber-200/50 ${
                tripType === 'roundtrip'
                  ? 'bg-white text-amber-800 border-b-2 border-b-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-amber-800 hover:bg-amber-100/40'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Round Trip / Tour</span>
            </button>

            <button
              type="button"
              onClick={() => setTripType('local')}
              className={`py-3.5 px-4 text-center transition-all flex items-center justify-center gap-2 border-r border-amber-200/50 ${
                tripType === 'local'
                  ? 'bg-white text-amber-800 border-b-2 border-b-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-amber-800 hover:bg-amber-100/40'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Local Hourly Rental</span>
            </button>

            <button
              type="button"
              onClick={() => setTripType('airport')}
              className={`py-3.5 px-4 text-center transition-all flex items-center justify-center gap-2 ${
                tripType === 'airport'
                  ? 'bg-white text-amber-800 border-b-2 border-b-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-amber-800 hover:bg-amber-100/40'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Airport / Railway</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
            {/* Input Row: Cities & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Pickup Location */}
              <div className={tripType === 'local' ? 'md:col-span-6' : 'md:col-span-3'}>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Pickup City / Station
                </label>
                <div className="relative">
                  <select
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 hover:border-amber-500 focus:border-amber-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-amber-200 outline-none transition"
                  >
                    {tripType === 'airport' ? (
                      AIRPORTS_AND_STATIONS.map((st) => (
                        <option key={st.name} value={st.name}>
                          {st.name}
                        </option>
                      ))
                    ) : (
                      RAJASTHAN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Swap Button (only for oneway/roundtrip) */}
              {tripType !== 'local' && (
                <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 shadow-xs hover:rotate-180 transition-all duration-300"
                    title="Swap Cities"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Destination / Package */}
              {tripType === 'local' ? (
                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Sightseeing Package
                  </label>
                  <select
                    value={localPackage}
                    onChange={(e) => setLocalPackage(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 hover:border-amber-500 focus:border-amber-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-amber-200 outline-none transition"
                  >
                    <option value="4hr40km">Half Day: 4 Hours / 40 Km (Short City Sightseeing)</option>
                    <option value="8hr80km">Full Day: 8 Hours / 80 Km (Recommended Forts &amp; Markets)</option>
                    <option value="12hr120km">Grand Day: 12 Hours / 120 Km (Extensive Sightseeing + Dinner)</option>
                  </select>
                </div>
              ) : tripType === 'airport' ? (
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    Drop Location
                  </label>
                  <input
                    type="text"
                    value={dropCity}
                    onChange={(e) => setDropCity(e.target.value)}
                    placeholder="Hotel / Area in City (e.g. Civil Lines, C-Scheme)"
                    className="w-full bg-slate-50 border border-slate-300 hover:border-amber-500 focus:border-amber-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-amber-200 outline-none transition"
                  />
                </div>
              ) : (
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    Destination City
                  </label>
                  <select
                    value={dropCity}
                    onChange={(e) => setDropCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 hover:border-amber-500 focus:border-amber-600 rounded-lg px-3 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-amber-200 outline-none transition"
                  >
                    {RAJASTHAN_CITIES.filter((c) => c !== pickupCity).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date & Time */}
              <div className={tripType === 'roundtrip' ? 'md:col-span-3' : 'md:col-span-3'}>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Pickup Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:ring-2 focus:ring-amber-200 outline-none transition"
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:ring-2 focus:ring-amber-200 outline-none transition"
                  />
                </div>
              </div>

              {/* Return Date if Round Trip */}
              {tripType === 'roundtrip' && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:ring-2 focus:ring-amber-200 outline-none transition"
                  />
                </div>
              )}
            </div>

            {/* Vehicle Fleet Selector Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-amber-600" />
                  Select Vehicle Category
                </span>
                <span className="text-xs text-amber-700 font-medium">
                  All cabs include AC, commercial permits &amp; luggage carrier
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {VEHICLE_FLEET.map((vehicle) => {
                  const isSelected = vehicle.id === selectedVehicleId;
                  return (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => setSelectedVehicleId(vehicle.id)}
                      className={`relative text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-50/90 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      {vehicle.popular && (
                        <span className="absolute -top-2 right-2 text-[9px] bg-amber-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                          Popular
                        </span>
                      )}

                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          {vehicle.name}
                        </div>
                        <div className="text-[11px] text-amber-800 font-medium mt-0.5">
                          {vehicle.category}
                        </div>
                      </div>

                      <div className="mt-2 text-slate-500 flex items-center gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-0.5">
                          <Users className="w-3 h-3 text-slate-400" />
                          {vehicle.passengers}
                        </span>
                        <span className="inline-flex items-center gap-0.5">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          {vehicle.luggage}
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <span className="text-[10px] text-slate-500">Rate:</span>
                        <span className="text-xs font-bold text-amber-700">
                          ₹{vehicle.ratePerKm}/km
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instant Fare Summary & Booking CTA Bar */}
            <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-1 w-full md:w-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-amber-300 bg-amber-800/60 px-2 py-0.5 rounded">
                    {fareDetails.label}
                  </span>
                  <span className="text-xs text-amber-200">
                    Est. Distance: ~{fareDetails.distanceKm} km ({fareDetails.estimatedDuration})
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    ₹{fareDetails.total.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-amber-300">
                    Estimated All-Inclusive Total
                  </span>
                </div>

                <p className="text-[11px] text-amber-200/80">
                  Includes: Chilled AC, Fuel, Chauffeur Allowance &amp; Sanitized Car. Toll/Tax estimated.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                >
                  <span>Book This Ride</span>
                  <ChevronRight className="w-4 h-4 text-slate-900" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
