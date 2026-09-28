import React, { useState } from 'react';
import {
  BookingFormData,
  BookingReceipt,
  Vehicle
} from '../types/taxi';
import { VEHICLE_FLEET, getEstimatedDistance } from '../data/taxiData';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Printer,
  Share2,
  AlertCircle,
  Sparkles,
  CreditCard,
  MessageCircle,
  FileText
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<BookingFormData>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialData
}) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Form & Details, 2: Confirmed Receipt

  // Form State
  const [tripType, setTripType] = useState(initialData?.tripType || 'oneway');
  const [pickupCity, setPickupCity] = useState(initialData?.pickupCity || 'Jaipur');
  const [dropCity, setDropCity] = useState(initialData?.dropCity || 'Udaipur');
  const [pickupDate, setPickupDate] = useState(initialData?.pickupDate || new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState(initialData?.pickupTime || '09:00');
  const [returnDate, setReturnDate] = useState(initialData?.returnDate || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialData?.selectedVehicleId || 'sedan-prime');

  // Passenger state
  const [passengerName, setPassengerName] = useState(initialData?.passengerName || '');
  const [passengerPhone, setPassengerPhone] = useState(initialData?.passengerPhone || '');
  const [passengerEmail, setPassengerEmail] = useState(initialData?.passengerEmail || '');
  const [pickupAddress, setPickupAddress] = useState(initialData?.pickupAddress || '');
  const [specialRequests, setSpecialRequests] = useState(initialData?.specialRequests || '');
  const [paymentChoice, setPaymentChoice] = useState<'driver' | 'advance'>('driver');

  // Validation error state
  const [errorMsg, setErrorMsg] = useState('');

  // Generated receipt
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);

  if (!isOpen) return null;

  const vehicle: Vehicle = VEHICLE_FLEET.find((v) => v.id === selectedVehicleId) || VEHICLE_FLEET[0];
  const distanceKm = getEstimatedDistance(pickupCity, dropCity);

  // Calculate fare breakdown
  let estimatedKm = distanceKm;
  let baseFare = Math.round(distanceKm * (vehicle.ratePerKm * 1.15));
  let driverAllowance = 250;
  let estimatedTollTaxes = Math.round(distanceKm * 1.2);

  if (tripType === 'roundtrip') {
    estimatedKm = distanceKm * 2;
    baseFare = estimatedKm * vehicle.ratePerKm;
    driverAllowance = vehicle.driverAllowancePerDay * 2;
    estimatedTollTaxes = Math.round(distanceKm * 2 * 1.4);
  } else if (tripType === 'local') {
    estimatedKm = 80;
    baseFare = vehicle.local8hrRate;
    driverAllowance = 0;
    estimatedTollTaxes = 0;
  } else if (tripType === 'airport') {
    estimatedKm = 35;
    baseFare = vehicle.category === 'Sedan' ? 999 : 1499;
    driverAllowance = 0;
    estimatedTollTaxes = 100;
  }

  const totalEstimatedFare = baseFare + driverAllowance + estimatedTollTaxes;
  const advancePayable = paymentChoice === 'advance' ? 500 : 0;
  const balanceOnTrip = totalEstimatedFare - advancePayable;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim()) {
      setErrorMsg('Please enter primary passenger name.');
      return;
    }
    if (!passengerPhone.trim() || passengerPhone.length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number for chauffeur coordination.');
      return;
    }
    if (!pickupAddress.trim()) {
      setErrorMsg('Please enter pickup address, hotel name, or airport terminal.');
      return;
    }

    const randomIdNumber = Math.floor(10000 + Math.random() * 90000);
    const newReceipt: BookingReceipt = {
      bookingId: `RJ-CAB-${randomIdNumber}`,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Confirmed',
      tripType,
      pickupCity,
      dropCity: tripType === 'local' ? `${pickupCity} (Local)` : dropCity,
      pickupDateTime: `${pickupDate} at ${pickupTime}`,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      vehicle,
      passengerName,
      passengerPhone,
      passengerEmail: passengerEmail || 'guest@rajasthantaxi.in',
      pickupAddress,
      estimatedKm,
      baseFare,
      driverAllowance,
      estimatedTollTaxes,
      totalEstimatedFare,
      advancePayable,
      balanceOnTrip
    };

    setReceipt(newReceipt);
    setStep(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (!receipt) return;
    const text = encodeURIComponent(
      `*Rajasthan Taxi Booking Confirmation*\n` +
      `Booking ID: ${receipt.bookingId}\n` +
      `Passenger: ${receipt.passengerName}\n` +
      `Trip: ${receipt.pickupCity} ➔ ${receipt.dropCity} (${receipt.tripType})\n` +
      `Date & Time: ${receipt.pickupDateTime}\n` +
      `Vehicle: ${receipt.vehicle.name} (${receipt.vehicle.category})\n` +
      `Pickup: ${receipt.pickupAddress}\n` +
      `Total Fare: ₹${receipt.totalEstimatedFare.toLocaleString('en-IN')}\n` +
      `Status: Confirmed`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-6 shadow-2xl border border-amber-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">
                {step === 1 ? 'Complete Your Rajasthan Cab Reservation' : 'Ride Confirmed & Ticket Issued!'}
              </h3>
              <p className="text-xs text-amber-200">
                {step === 1 ? 'Transparent Fixed Pricing • Verified Rajasthani Chauffeurs' : `Booking Reference: ${receipt?.bookingId}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {step === 1 ? (
          <form onSubmit={handleConfirmBooking} className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Trip Summary Pill */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Route</span>
                <div className="font-bold text-slate-900">{pickupCity} ➔ {dropCity}</div>
                <div className="text-[11px] text-amber-800 capitalize">{tripType}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Pickup Date &amp; Time</span>
                <div className="font-bold text-slate-900">{pickupDate}</div>
                <div className="text-[11px] text-slate-600">{pickupTime}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Vehicle</span>
                <div className="font-bold text-slate-900">{vehicle.name}</div>
                <div className="text-[11px] text-slate-600">{vehicle.category}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Estimated Fare</span>
                <div className="text-base font-extrabold text-amber-700">₹{totalEstimatedFare.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-emerald-700">All-Inclusive</div>
              </div>
            </div>

            {/* Change Vehicle Option */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Vehicle Selection
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 font-medium"
              >
                {VEHICLE_FLEET.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.category} - {v.passengers} Seats) - ₹{v.ratePerKm}/km
                  </option>
                ))}
              </select>
            </div>

            {/* Passenger Information */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-600" />
                Passenger Contact Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Primary Passenger Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="e.g. Ramesh Singh / Sarah Connor"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="10-digit mobile number for driver SMS/call"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address (for instant receipt &amp; GST invoice)
                  </label>
                  <input
                    type="email"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Exact Pickup Address / Hotel / Airport Gate *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="e.g. Hotel ITC Rajputana, Station Road, Jaipur or Terminal 2 Arrivals"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. English-speaking chauffeur, infant seat, stop at Pushkar on way"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Payment Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                    paymentChoice === 'driver'
                      ? 'bg-amber-50/70 border-amber-600 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentChoice === 'driver'}
                    onChange={() => setPaymentChoice('driver')}
                    className="mt-1 text-amber-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Pay To Chauffeur Directly</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay ₹{totalEstimatedFare.toLocaleString('en-IN')} by Cash or UPI directly to driver at the end of the journey.
                    </p>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                    paymentChoice === 'advance'
                      ? 'bg-amber-50/70 border-amber-600 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentChoice === 'advance'}
                    onChange={() => setPaymentChoice('advance')}
                    className="mt-1 text-amber-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Pay ₹500 Token Advance</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Lock your vehicle &amp; chauffeur. Remaining ₹{balanceOnTrip.toLocaleString('en-IN')} payable during trip.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                Confirm &amp; Generate Ticket
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Confirmed Digital Ticket / Receipt */
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            <div className="text-center py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Booking Confirmed!</h4>
              <p className="text-xs text-slate-500">
                Your chauffeur and car details will be sent to <strong>{receipt?.passengerPhone}</strong> via SMS &amp; WhatsApp 2 hours before journey.
              </p>
            </div>

            {/* Digital Ticket Card */}
            <div id="print-ticket" className="p-4 sm:p-5 bg-stone-50 rounded-xl border border-amber-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dashed border-amber-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Booking Ref:</span>
                  <div className="text-sm font-bold text-amber-900 font-mono">{receipt?.bookingId}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Status:</span>
                  <div className="text-xs font-bold text-emerald-700">{receipt?.status}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px]">Passenger:</span>
                  <div className="font-semibold text-slate-900">{receipt?.passengerName}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Mobile:</span>
                  <div className="font-semibold text-slate-900">{receipt?.passengerPhone}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Trip:</span>
                  <div className="font-semibold text-slate-900">
                    {receipt?.pickupCity} ➔ {receipt?.dropCity}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Date &amp; Time:</span>
                  <div className="font-semibold text-slate-900">{receipt?.pickupDateTime}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 text-[10px]">Pickup Location:</span>
                  <div className="font-semibold text-slate-900">{receipt?.pickupAddress}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 text-[10px]">Vehicle Assigned:</span>
                  <div className="font-semibold text-slate-900">
                    {receipt?.vehicle.name} ({receipt?.vehicle.category}) • Chilled AC
                  </div>
                </div>
              </div>

              {/* Fare Breakdown */}
              <div className="pt-3 border-t border-dashed border-amber-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Distance Fare (~{receipt?.estimatedKm} km):</span>
                  <span>₹{receipt?.baseFare.toLocaleString('en-IN')}</span>
                </div>
                {receipt && receipt.driverAllowance > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Driver Allowance:</span>
                    <span>₹{receipt.driverAllowance.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {receipt && receipt.estimatedTollTaxes > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Toll Taxes &amp; State Permit:</span>
                    <span>₹{receipt.estimatedTollTaxes.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 text-sm">
                  <span>Total Estimated Payable:</span>
                  <span className="text-amber-800">₹{receipt?.totalEstimatedFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-700">
                  <span>Payment Mode:</span>
                  <span>{paymentChoice === 'advance' ? '₹500 Advance / Rest to Driver' : '100% Direct to Driver'}</span>
                </div>
              </div>
            </div>

            {/* Actions: Print & WhatsApp */}
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ticket</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
