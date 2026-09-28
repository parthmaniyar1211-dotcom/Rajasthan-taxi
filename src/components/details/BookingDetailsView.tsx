import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { Booking, BookingStatus } from '../../types/rrTypes';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Phone,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Receipt,
  AlertCircle,
  Users,
  Compass
} from 'lucide-react';

interface BookingDetailsViewProps {
  bookingId: string;
}

export const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({ bookingId }) => {
  const { navigate } = useNavigation();
  const currentUser = dataStore.getCurrentUser();
  const [booking, setBooking] = useState<Booking | undefined>(() => dataStore.getBookingById(bookingId));
  const [copied, setCopied] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);

  if (!booking) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Booking Details"
          subtitle="Record Not Found"
          backLabel={currentUser.role === 'CUSTOMER' ? 'Back to My Bookings' : 'Back to Bookings'}
          backFallback={{
            path: currentUser.role === 'CUSTOMER' ? '/my-bookings' : '/admin/bookings',
            label: currentUser.role === 'CUSTOMER' ? 'Back to My Bookings' : 'Back to Bookings'
          }}
        />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Booking #{bookingId} does not exist</h3>
          <p className="text-xs text-slate-500">
            This reservation may have been removed or the ID was typed incorrectly.
          </p>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: BookingStatus) => {
    dataStore.updateBooking(booking.id, { bookingStatus: newStatus });
    setBooking(dataStore.getBookingById(booking.id));
    setShowStatusSelect(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Rajasthan Rides Booking #${booking.id} - ${booking.pickupCity} to ${booking.dropCity} on ${booking.travelDate}. Total: ₹${booking.totalAmount}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCustomer = currentUser.role === 'CUSTOMER';
  const backLabel = isCustomer
    ? 'Back to My Bookings'
    : currentUser.role === 'VENDOR'
    ? 'Back to Vendor Bookings'
    : 'Back to Bookings';

  const backFallbackPath = isCustomer ? '/my-bookings' : '/admin/bookings';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`Booking #${booking.id}`}
        subtitle={`${booking.serviceType === 'TAXI' ? 'Outstation Taxi' : 'Rajasthan Tour Package'} · ${booking.pickupCity} ➔ ${booking.dropCity}`}
        backLabel={backLabel}
        backFallback={{ path: backFallbackPath, label: backLabel }}
        badge={
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'COMPLETED'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : booking.bookingStatus === 'ASSIGNED' || booking.bookingStatus === 'ON_TRIP'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {booking.bookingStatus}
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Details' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Trip Itinerary & Driver/Vehicle */}
        <div className="lg:col-span-2 space-y-6">
          {/* Journey Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Trip Itinerary &amp; Route
              </span>
              <span className="text-xs font-mono font-bold text-amber-800">
                {booking.tripType.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Pickup Location</div>
                  <div className="font-bold text-slate-900 text-sm">{booking.pickupCity}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{booking.pickupAddress}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Destination Drop</div>
                  <div className="font-bold text-slate-900 text-sm">{booking.dropCity}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{booking.dropAddress}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Travel Date</span>
                <span className="font-bold text-slate-900 font-mono mt-0.5 block">{booking.travelDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Pickup Time</span>
                <span className="font-bold text-slate-900 font-mono mt-0.5 block">{booking.travelTime}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Passengers</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{booking.passengers} Guests</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {booking.distanceKm ? `${booking.distanceKm} km est.` : 'Fixed Route'}
                </span>
              </div>
            </div>

            {booking.specialInstructions && (
              <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-950">
                <span className="font-bold">Guest Notes:</span> {booking.specialInstructions}
              </div>
            )}
          </div>

          {/* Assigned Fleet & Chauffeur Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Assigned Vehicle &amp; Chauffeur
              </span>
              {!isCustomer && (
                <button
                  type="button"
                  onClick={() => setShowStatusSelect(!showStatusSelect)}
                  className="text-xs font-bold text-amber-800 hover:underline"
                >
                  Update Trip Status
                </button>
              )}
            </div>

            {showStatusSelect && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Change Status:</span>
                <select
                  value={booking.bookingStatus}
                  onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
                  className="text-xs p-1.5 bg-white border border-slate-300 rounded-lg outline-none font-semibold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="ON_TRIP">ON_TRIP</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Car className="w-4 h-4 text-amber-700" />
                  <span>{booking.vehicleModel || 'Executive Luxury Cab'}</span>
                </div>
                <div className="text-xs text-slate-600">
                  Reg #: <span className="font-mono font-bold text-slate-900">{booking.vehicleNumber || 'RJ-06-TA-1024'}</span>
                </div>
                <div className="text-[11px] text-slate-500">Commercial All-India Tourist Permit · AC Verified</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <User className="w-4 h-4 text-amber-700" />
                  <span>{booking.driverName || 'Designated Royal Chauffeur'}</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${booking.driverPhone}`} className="hover:underline font-mono">
                    {booking.driverPhone || '+91 98290 14820'}
                  </a>
                </div>
                <div className="text-[11px] text-slate-500">Verified Police Clear · Uniformed Chauffeur</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Passenger Details & Fare Summary */}
        <div className="space-y-6">
          {/* Passenger Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-2">
              Primary Passenger
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-slate-900 text-sm">{booking.customerName}</div>
              <div className="text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a href={`tel:${booking.customerPhone}`} className="hover:underline font-mono">
                  {booking.customerPhone}
                </a>
              </div>
              <div className="text-slate-500">{booking.customerEmail}</div>
            </div>
          </div>

          {/* Fare & Accounting Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Financial Breakdown
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  booking.paymentStatus === 'PAID'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {booking.paymentStatus}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Cab Tariff</span>
                <span className="font-mono">₹{booking.baseFare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Driver Day Allowance</span>
                <span className="font-mono">₹{booking.driverAllowance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Toll &amp; State Permits Est.</span>
                <span className="font-mono">₹{booking.tollAndParkingEstimated.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span className="font-mono">₹{booking.taxGst.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Invoice Amount</span>
                <span className="font-mono text-base text-amber-900">
                  ₹{booking.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                <span>Advance Paid</span>
                <span className="font-mono">₹{booking.paidAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-rose-700 font-bold">
                <span>Balance Due at Trip</span>
                <span className="font-mono">₹{booking.balanceAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Receipt className="w-4 h-4 text-slate-600" />
                <span>Download Tax Invoice / GST Bill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
