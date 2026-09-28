import React, { useState, useMemo, useEffect } from 'react';
import { dataStore } from '../../services/dataStore';
import { Vehicle, Booking } from '../../types/rrTypes';
import { LuxuryCarIllustration } from '../common/TravelIllustrations';
import { PageHeader } from '../common/PageHeader';
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Phone,
  User,
  Info
} from 'lucide-react';

interface TaxiBookingFlowProps {
  initialPickup?: string;
  initialDrop?: string;
  initialTripType?: 'ONE_WAY' | 'ROUND_TRIP';
  onBack: () => void;
  onBookingConfirmed: (booking: Booking) => void;
}

export const TaxiBookingFlow: React.FC<TaxiBookingFlowProps> = ({
  initialPickup = 'Bhilwara',
  initialDrop = 'Ahmedabad',
  initialTripType = 'ONE_WAY',
  onBack,
  onBookingConfirmed
}) => {
  // 4 clear steps: 1: Trip Details, 2: Vehicle Selection, 3: Customer Details, 4: Payment & Review
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Route & Dates State (Preserved across back/forth)
  const [tripType, setTripType] = useState<'ONE_WAY' | 'ROUND_TRIP'>(initialTripType);
  const [pickupCity, setPickupCity] = useState(initialPickup);
  const [pickupAddress, setPickupAddress] = useState('Subhash Nagar, Bhilwara');
  const [dropCity, setDropCity] = useState(initialDrop);
  const [dropAddress, setDropAddress] = useState('Ahmedabad Airport / City Center');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const returnDay = new Date();
  returnDay.setDate(returnDay.getDate() + 3);
  const defaultReturnStr = returnDay.toISOString().split('T')[0];

  const [travelDate, setTravelDate] = useState(defaultDateStr);
  const [travelTime, setTravelTime] = useState('06:30');
  const [returnDate, setReturnDate] = useState(defaultReturnStr);
  const [passengers, setPassengers] = useState(2);
  const [luggageCount, setLuggageCount] = useState(2);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Selected Vehicle State
  const vehicles = dataStore.getVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || 'VEH-01');

  // Customer Contact State
  const currentUser = dataStore.getCurrentUser();
  const [custName, setCustName] = useState(currentUser.name);
  const [custPhone, setCustPhone] = useState(currentUser.phone);
  const [custEmail, setCustEmail] = useState(currentUser.email);
  const [paymentChoice, setPaymentChoice] = useState<'FULL_DRIVER' | 'ADVANCE_TOKEN'>('ADVANCE_TOKEN');

  // Sync step changes with browser history so browser back / mobile back works seamlessly
  const goToStep = (nextStep: 1 | 2 | 3 | 4) => {
    setStep(nextStep);
    if (typeof window !== 'undefined') {
      window.history.pushState(
        { path: '/taxi-booking', step: nextStep },
        `Taxi Booking - Step ${nextStep}`,
        `#/taxi-booking?step=${nextStep}`
      );
    }
  };

  const handleStepBack = () => {
    if (step > 1) {
      const prevStep = (step - 1) as 1 | 2 | 3 | 4;
      setStep(prevStep);
      if (typeof window !== 'undefined' && window.history.state?.step) {
        window.history.back();
      }
    } else {
      onBack();
    }
  };

  // Listen to browser popstate for back button
  useEffect(() => {
    const handlePop = (e: PopStateEvent) => {
      if (e.state?.step && e.state.step >= 1 && e.state.step <= 4) {
        setStep(e.state.step);
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Distance estimation logic
  const estimatedKm = useMemo(() => {
    const routeKey = `${pickupCity}-${dropCity}`;
    const reverseKey = `${dropCity}-${pickupCity}`;
    const matrix: Record<string, number> = {
      'Bhilwara-Ahmedabad': 410,
      'Ahmedabad-Bhilwara': 410,
      'Bhilwara-Delhi': 515,
      'Delhi-Bhilwara': 515,
      'Bhilwara-Jaipur': 240,
      'Jaipur-Bhilwara': 240,
      'Bhilwara-Udaipur': 155,
      'Udaipur-Bhilwara': 155,
      'Bhilwara-Jodhpur': 260,
      'Jodhpur-Bhilwara': 260,
      'Jaipur-Udaipur': 395,
      'Udaipur-Jaipur': 395,
      'Jaipur-Jodhpur': 335,
      'Jodhpur-Jaipur': 335,
      'Jodhpur-Jaisalmer': 285,
      'Jaisalmer-Jodhpur': 285,
      'Delhi-Jaipur': 260,
      'Jaipur-Delhi': 260
    };

    const oneWayKm = matrix[routeKey] || matrix[reverseKey] || 300;
    return tripType === 'ROUND_TRIP' ? oneWayKm * 2 : oneWayKm;
  }, [pickupCity, dropCity, tripType]);

  const selectedVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  }, [vehicles, selectedVehicleId]);

  // Fare calculation
  const fareBreakdown = useMemo(() => {
    const rate = selectedVehicle?.perKmRate || 12;
    const baseFare = Math.round(estimatedKm * rate);
    const days = tripType === 'ROUND_TRIP' ? 2 : 1;
    const driverAllowance = days * 350;
    const tollAndParkingEstimated = Math.round(estimatedKm * 1.25);
    const taxGst = Math.round((baseFare + driverAllowance) * 0.05);
    const totalAmount = baseFare + driverAllowance + tollAndParkingEstimated + taxGst;
    const advanceAmount = paymentChoice === 'ADVANCE_TOKEN' ? Math.round(totalAmount * 0.25) : 0;
    const balanceAmount = totalAmount - advanceAmount;

    return {
      baseFare,
      driverAllowance,
      tollAndParkingEstimated,
      taxGst,
      totalAmount,
      advanceAmount,
      balanceAmount
    };
  }, [selectedVehicle, estimatedKm, tripType, paymentChoice]);

  const handleConfirmOrder = () => {
    const booking = dataStore.createBooking({
      customerId: currentUser.id,
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: custEmail,
      serviceType: 'TAXI',
      tripType: tripType,
      pickupCity,
      pickupAddress,
      dropCity,
      dropAddress,
      travelDate,
      travelTime,
      returnDate: tripType === 'ROUND_TRIP' ? returnDate : undefined,
      passengers,
      luggageCount,
      specialInstructions,
      vehicleId: selectedVehicle.id,
      vehicleModel: selectedVehicle.model,
      vehicleNumber: selectedVehicle.vehicleNumber,
      driverId: selectedVehicle.assignedDriverId || 'DRV-01',
      driverName: 'Mukesh Sharma (Assigned Chauffeur)',
      driverPhone: '9829111222',
      baseFare: fareBreakdown.baseFare,
      driverAllowance: fareBreakdown.driverAllowance,
      tollAndParkingEstimated: fareBreakdown.tollAndParkingEstimated,
      discount: 0,
      taxGst: fareBreakdown.taxGst,
      totalAmount: fareBreakdown.totalAmount,
      paidAmount: fareBreakdown.advanceAmount,
      balanceAmount: fareBreakdown.balanceAmount,
      paymentStatus: fareBreakdown.advanceAmount > 0 ? 'PARTIALLY_PAID' : 'PENDING',
      bookingStatus: 'CONFIRMED'
    });

    onBookingConfirmed(booking);
  };

  const stepLabels = [
    '01. Route & Schedule',
    '02. Vehicle Selection',
    '03. Customer Details',
    '04. Review & Payment'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header with Back Navigation */}
      <PageHeader
        title="Outstation Taxi Booking"
        subtitle={`${pickupCity} ➔ ${dropCity} · Step ${step} of 4: ${stepLabels[step - 1]}`}
        backLabel={step > 1 ? `Back to Step ${step - 1}` : 'Back to Home'}
        backFallback={{ path: '/', label: 'Back to Home' }}
        onBack={handleStepBack}
        actions={
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            {stepLabels.map((lbl, idx) => {
              const sNum = (idx + 1) as 1 | 2 | 3 | 4;
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

      {/* STEP 1: ROUTE & SCHEDULE */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Trip Details &amp; Highway Schedule
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select trip type, pickup &amp; drop coordinates, and travel departure time.
            </p>
          </div>

          {/* Segmented Trip Type */}
          <div className="flex p-1 bg-slate-100 rounded-xl max-w-md">
            <button
              type="button"
              onClick={() => setTripType('ONE_WAY')}
              className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all ${
                tripType === 'ONE_WAY'
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              One-Way Transfer
            </button>
            <button
              type="button"
              onClick={() => setTripType('ROUND_TRIP')}
              className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all ${
                tripType === 'ROUND_TRIP'
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Round-Trip Journey
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Pickup City *</label>
              <select
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-amber-600 cursor-pointer"
              >
                <option value="Bhilwara">Bhilwara (Textile Hub)</option>
                <option value="Jaipur">Jaipur (Pink City)</option>
                <option value="Udaipur">Udaipur (Lake City)</option>
                <option value="Jodhpur">Jodhpur (Sun City)</option>
                <option value="Ahmedabad">Ahmedabad (Airport / City)</option>
                <option value="Delhi">Delhi NCR / Airport</option>
                <option value="Ajmer">Ajmer / Pushkar</option>
                <option value="Chittorgarh">Chittorgarh</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Drop Destination *</label>
              <select
                value={dropCity}
                onChange={(e) => setDropCity(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-amber-600 cursor-pointer"
              >
                <option value="Ahmedabad">Ahmedabad (Airport / City)</option>
                <option value="Delhi">Delhi NCR / Airport</option>
                <option value="Jaipur">Jaipur (Pink City)</option>
                <option value="Udaipur">Udaipur (Lake City)</option>
                <option value="Jodhpur">Jodhpur (Sun City)</option>
                <option value="Bhilwara">Bhilwara (Textile Hub)</option>
                <option value="Jaisalmer">Jaisalmer (Golden City)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Detailed Pickup Landmark *</label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="e.g. Hotel / Home address"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Detailed Drop Landmark *</label>
              <input
                type="text"
                value={dropAddress}
                onChange={(e) => setDropAddress(e.target.value)}
                placeholder="e.g. Airport Terminal / Railway Station"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Departure Date *</label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-900 outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Pickup Time *</label>
              <input
                type="time"
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-900 outline-none focus:border-amber-600"
              />
            </div>

            {tripType === 'ROUND_TRIP' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Return Date *</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-900 outline-none focus:border-amber-600"
                />
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Estimated Distance: <span className="font-bold text-slate-900">{estimatedKm} km</span>
            </div>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="min-h-[44px] px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <span>Continue to Vehicle Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: VEHICLE SELECTION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Select Fleet Class for {pickupCity} ➔ {dropCity}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              All vehicles include commercial permits, verified highway chauffeurs, and air-conditioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              const vBase = Math.round(estimatedKm * v.perKmRate);

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-400/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="h-28 w-full bg-slate-900 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                      <LuxuryCarIllustration className="w-full h-full max-h-24" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-500">{v.type}</span>
                        <span className="font-mono text-xs font-bold text-amber-800">₹{v.perKmRate}/km</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{v.model}</h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {v.seating} Seats
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {v.luggageCapacity} Bags
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Est. Base Fare</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">₹{vBase.toLocaleString('en-IN')}</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-lg ${
                        isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Row with Back & Continue */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleStepBack}
              className="min-h-[44px] px-4 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Route</span>
            </button>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="min-h-[44px] px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <span>Continue to Customer Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOMER DETAILS */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Customer Details &amp; Guest Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Provide primary passenger contact for chauffeur dispatch coordination and SMS alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Passenger Name *</label>
              <input
                type="text"
                required
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Mobile Phone Number *</label>
              <input
                type="tel"
                required
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900 outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Number of Passengers</label>
              <input
                type="number"
                min={1}
                max={selectedVehicle.seating}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Luggage Bags</label>
              <input
                type="number"
                min={0}
                max={selectedVehicle.luggageCapacity}
                value={luggageCount}
                onChange={(e) => setLuggageCount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Special Pickup Instructions / Flight #</label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Flight AI-456 arriving 08:30 PM, child booster seat required..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:border-amber-600"
            />
          </div>

          {/* Action Row with Back & Continue */}
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
              onClick={() => goToStep(4)}
              className="min-h-[44px] px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <span>Continue to Payment &amp; Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & PAYMENT */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Trip Summary &amp; Payment Options
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review transparent fare breakdown and choose your payment method.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 text-xs">
              <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                Trip Specifications
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Route:</span>
                <span className="font-bold text-slate-900">{pickupCity} ➔ {dropCity}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Trip Type:</span>
                <span className="font-bold text-slate-900">{tripType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date &amp; Time:</span>
                <span className="font-bold text-slate-900">{travelDate} at {travelTime}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Selected Vehicle:</span>
                <span className="font-bold text-slate-900">{selectedVehicle.model} ({selectedVehicle.type})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Lead Passenger:</span>
                <span className="font-bold text-slate-900">{custName} ({custPhone})</span>
              </div>
            </div>

            {/* Right Column: Fare Calculation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5 text-xs">
              <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                Fare Breakdown (Transparent)
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Distance:</span>
                <span className="font-mono">{estimatedKm} km</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Base Km Fare:</span>
                <span className="font-mono">₹{fareBreakdown.baseFare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Driver Day Allowance:</span>
                <span className="font-mono">₹{fareBreakdown.driverAllowance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Toll / State Taxes (Est.):</span>
                <span className="font-mono">₹{fareBreakdown.tollAndParkingEstimated.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%):</span>
                <span className="font-mono">₹{fareBreakdown.taxGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono text-base text-amber-900">
                  ₹{fareBreakdown.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Choice */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Select Payment Plan
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentChoice('ADVANCE_TOKEN')}
                className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                  paymentChoice === 'ADVANCE_TOKEN'
                    ? 'border-amber-500 bg-amber-50/20 shadow-xs ring-2 ring-amber-400/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-xs">Pay 25% Advance Token</div>
                <div className="font-mono text-base font-bold text-amber-800 mt-1">
                  ₹{fareBreakdown.advanceAmount.toLocaleString('en-IN')} Now
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Remaining ₹{fareBreakdown.balanceAmount.toLocaleString('en-IN')} payable directly to driver upon pickup.
                </div>
              </div>

              <div
                onClick={() => setPaymentChoice('FULL_DRIVER')}
                className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                  paymentChoice === 'FULL_DRIVER'
                    ? 'border-amber-500 bg-amber-50/20 shadow-xs ring-2 ring-amber-400/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-xs">Pay Full to Driver on Trip</div>
                <div className="font-mono text-base font-bold text-slate-900 mt-1">
                  ₹0 Now (Cash / UPI on board)
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Pay full ₹{fareBreakdown.totalAmount.toLocaleString('en-IN')} directly to your chauffeur during the trip.
                </div>
              </div>
            </div>
          </div>

          {/* Action Row with Back & Confirm */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleStepBack}
              className="min-h-[44px] px-4 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Customer Details</span>
            </button>
            <button
              type="button"
              onClick={handleConfirmOrder}
              className="min-h-[44px] px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Confirm &amp; Place Taxi Reservation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
