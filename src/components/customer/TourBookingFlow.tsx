import React, { useState, useEffect } from 'react';
import { TourPackage, Booking } from '../../types/rrTypes';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import {
  RajasthanFortIllustration,
  UdaipurLakesIllustration,
  DesertSafariIllustration
} from '../common/TravelIllustrations';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Car,
  User,
  Phone
} from 'lucide-react';

interface TourBookingFlowProps {
  packageData: TourPackage;
  onBack: () => void;
  onBookingConfirmed: (booking: Booking) => void;
}

export const TourBookingFlow: React.FC<TourBookingFlowProps> = ({
  packageData,
  onBack,
  onBookingConfirmed
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Tour Setup, 2: Guest Details, 3: Review & Confirm

  const currentUser = dataStore.getCurrentUser();
  const [selectedVehicleType, setSelectedVehicleType] = useState<'SEDAN' | 'SUV' | 'PREMIUM' | 'TRAVELLER'>('SUV');
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(4);
  const [pickupCity, setPickupCity] = useState(packageData.destinations[0] || 'Bhilwara');
  const [pickupAddress, setPickupAddress] = useState('Subhash Nagar, Bhilwara');
  const [custName, setCustName] = useState(currentUser.name);
  const [custPhone, setCustPhone] = useState(currentUser.phone);
  const [custEmail, setCustEmail] = useState(currentUser.email);
  const [specialNotes, setSpecialNotes] = useState('');

  // Browser back button sync
  const goToStep = (nextStep: 1 | 2 | 3) => {
    setStep(nextStep);
    if (typeof window !== 'undefined') {
      window.history.pushState(
        { path: `/tour-booking/${packageData.id}`, step: nextStep },
        `Tour Booking - Step ${nextStep}`,
        `#/tour-booking/${packageData.id}?step=${nextStep}`
      );
    }
  };

  const handleStepBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
      if (typeof window !== 'undefined' && window.history.state?.step) {
        window.history.back();
      }
    } else {
      onBack();
    }
  };

  useEffect(() => {
    const handlePop = (e: PopStateEvent) => {
      if (e.state?.step && e.state.step >= 1 && e.state.step <= 3) {
        setStep(e.state.step);
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Price calculations
  const multiplier =
    selectedVehicleType === 'SEDAN' ? 1 : selectedVehicleType === 'SUV' ? 1.35 : selectedVehicleType === 'PREMIUM' ? 2.1 : 1.75;
  const packageBase = Math.round(packageData.startingPrice * multiplier);
  const driverAllowance = packageData.durationDays * 400;
  const tollAndPermits = packageData.durationDays * 500;
  const taxGst = Math.round(packageBase * 0.05);
  const totalAmount = packageBase + driverAllowance + tollAndPermits + taxGst;
  const advanceAmount = Math.round(totalAmount * 0.25);
  const balanceAmount = totalAmount - advanceAmount;

  const handleConfirm = () => {
    const booking = dataStore.createBooking({
      customerId: currentUser.id,
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: custEmail,
      serviceType: 'TOUR',
      tripType: 'CUSTOM_TOUR',
      pickupCity,
      pickupAddress,
      dropCity: packageData.destinations[packageData.destinations.length - 1],
      dropAddress: 'Tour Destination Hotel / Airport Drop',
      travelDate,
      travelTime: '08:00',
      passengers,
      luggageCount: passengers,
      tourPackageId: packageData.id,
      tourPackageTitle: packageData.title,
      specialInstructions: specialNotes,
      vehicleModel:
        selectedVehicleType === 'SEDAN'
          ? 'Maruti Suzuki Dzire AC'
          : selectedVehicleType === 'SUV'
          ? 'Toyota Innova Crysta AC'
          : selectedVehicleType === 'PREMIUM'
          ? 'Toyota Fortuner 4x4'
          : 'Force Urbania Luxury 12-Seater',
      driverName: 'Surendra Singh (Senior Tour Chauffeur)',
      baseFare: packageBase,
      driverAllowance,
      tollAndParkingEstimated: tollAndPermits,
      discount: 0,
      taxGst,
      totalAmount,
      paidAmount: advanceAmount,
      balanceAmount,
      paymentStatus: 'PARTIALLY_PAID',
      bookingStatus: 'CONFIRMED'
    });

    onBookingConfirmed(booking);
  };

  const stepLabels = ['01. Itinerary & Vehicle', '02. Traveler Details', '03. Review & Payment'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <PageHeader
        title={packageData.title}
        subtitle={`${packageData.durationDays} Days / ${packageData.durationNights} Nights · Step ${step} of 3: ${stepLabels[step - 1]}`}
        backLabel={step > 1 ? `Back to Step ${step - 1}` : 'Back to Tour Packages'}
        backFallback={{ path: '/', label: 'Back to Tour Packages' }}
        onBack={handleStepBack}
        actions={
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            {stepLabels.map((lbl, idx) => {
              const sNum = (idx + 1) as 1 | 2 | 3;
              const isActive = step === sNum;
              const isPast = step > sNum;

              return (
                <React.Fragment key={sNum}>
                  {idx > 0 && <span className="text-slate-300">/</span>}
                  <button
                    type="button"
                    onClick={() => isPast && goToStep(sNum)}
                    className={`transition ${
                      isActive
                        ? 'text-amber-800 font-bold'
                        : isPast
                        ? 'text-slate-900 hover:text-amber-800 cursor-pointer'
                        : 'text-slate-400 cursor-default'
                    }`}
                  >
                    {lbl}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        }
      />

      {/* Package Header Card */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs">
        <div className="relative h-60 sm:h-72 overflow-hidden bg-slate-950">
          {packageData.id.includes('1') && <RajasthanFortIllustration className="w-full h-full object-cover" />}
          {packageData.id.includes('2') && <UdaipurLakesIllustration className="w-full h-full object-cover" />}
          {!packageData.id.includes('1') && !packageData.id.includes('2') && (
            <DesertSafariIllustration className="w-full h-full object-cover" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300 mb-1">
              <span>{packageData.durationDays} Days / {packageData.durationNights} Nights</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span>Dedicated Chauffeur &amp; Cab</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold">{packageData.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{packageData.tagline}</p>
          </div>
        </div>

        {/* STEP 1: ITINERARY & VEHICLE TYPE */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Select Chauffeur Vehicle Category</h3>
              <p className="text-xs text-slate-500">Pick the comfortable vehicle class for your family/group.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { type: 'SEDAN', label: 'Sedan (Dzire / Etios)', seats: '4 Seats', price: packageData.startingPrice },
                { type: 'SUV', label: 'Executive SUV (Innova Crysta)', seats: '6-7 Seats', price: Math.round(packageData.startingPrice * 1.35) },
                { type: 'PREMIUM', label: 'Premium Luxury (Fortuner)', seats: '6 Seats', price: Math.round(packageData.startingPrice * 2.1) },
                { type: 'TRAVELLER', label: 'Tempo Traveller / Van', seats: '12 Seats', price: Math.round(packageData.startingPrice * 1.75) }
              ].map((opt) => (
                <div
                  key={opt.type}
                  onClick={() => setSelectedVehicleType(opt.type as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    selectedVehicleType === opt.type
                      ? 'border-amber-500 bg-amber-50/20 shadow-xs ring-2 ring-amber-400/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{opt.seats}</div>
                  <div className="font-mono text-sm font-bold text-amber-800 mt-2">
                    ₹{opt.price.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Tour Start Date *</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium outline-none focus:border-amber-600"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Pickup City *</label>
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Inclusions preview */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
              <span className="font-bold text-slate-900">Included in this Tour Package:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                {packageData.inclusions.slice(0, 4).map((inc, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="min-h-[44px] px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
              >
                <span>Continue to Traveler Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GUEST DETAILS */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Lead Traveler Contact Information</h3>
              <p className="text-xs text-slate-500">Provide details for hotel dispatch and voucher delivery.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Primary Guest Name *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold outline-none focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-semibold outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono outline-none focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Total Travelers in Group</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-bold text-slate-700">Hotel Pickup Landmark in {pickupCity}</label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g. Hotel Clarks Amer / Airport Terminal 2"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-bold text-slate-700">Special Requests / Preferences</label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Senior citizens in family, prefer heritage stays..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleStepBack}
                className="min-h-[44px] px-4 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Vehicle</span>
              </button>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="min-h-[44px] px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
              >
                <span>Continue to Review &amp; Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & PAYMENT */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Review Package &amp; Confirm Booking</h3>
              <p className="text-xs text-slate-500">25% Advance token secures your private vehicle and dedicated chauffeur.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Package Base ({packageData.durationDays} Days):</span>
                <span className="font-mono">₹{packageBase.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Chauffeur Bata / Outstation Allowance:</span>
                <span className="font-mono">₹{driverAllowance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Interstate Permits &amp; Toll Estimates:</span>
                <span className="font-mono">₹{tollAndPermits.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%):</span>
                <span className="font-mono">₹{taxGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Tour Package Cost:</span>
                <span className="font-mono text-base text-amber-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold pt-1">
                <span>25% Advance Token Today:</span>
                <span className="font-mono">₹{advanceAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-rose-700 font-bold">
                <span>Balance Due at Start of Tour:</span>
                <span className="font-mono">₹{balanceAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleStepBack}
                className="min-h-[44px] px-4 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Traveler Details</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="min-h-[44px] px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirm &amp; Place Tour Reservation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
