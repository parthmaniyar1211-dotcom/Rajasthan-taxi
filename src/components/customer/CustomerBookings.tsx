import React, { useState } from 'react';
import { Booking } from '../../types/rrTypes';
import { dataStore } from '../../services/dataStore';
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
  AlertCircle,
  CreditCard,
  Download,
  X,
  ArrowRight
} from 'lucide-react';

interface CustomerBookingsProps {
  onBack: () => void;
  onSelectBooking?: (booking: Booking) => void;
}

export const CustomerBookings: React.FC<CustomerBookingsProps> = ({ onBack, onSelectBooking }) => {
  const { navigate } = useNavigation();
  const [tab, setTab] = useState<'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const currentUser = dataStore.getCurrentUser();
  const allUserBookings = dataStore.getBookings().filter(
    (b) => b.customerPhone === currentUser.phone || b.customerEmail === currentUser.email
  );

  const filtered = allUserBookings.filter((b) => {
    if (tab === 'ACTIVE') return b.bookingStatus === 'ON_TRIP' || b.bookingStatus === 'ASSIGNED';
    if (tab === 'UPCOMING') return b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING';
    if (tab === 'COMPLETED') return b.bookingStatus === 'COMPLETED';
    if (tab === 'CANCELLED') return b.bookingStatus === 'CANCELLED';
    return true;
  });

  const handleOpenDetails = (b: Booking) => {
    if (onSelectBooking) {
      onSelectBooking(b);
    } else {
      navigate(`/bookings/${b.id}`);
    }
  };

  const handleWhatsAppShare = (b: Booking) => {
    const text = encodeURIComponent(
      `*Rajasthan Rides Booking Confirmation*\n` +
      `Booking Ref: ${b.id}\n` +
      `Trip: ${b.pickupCity} ➔ ${b.dropCity} (${b.serviceType})\n` +
      `Date: ${b.travelDate} at ${b.travelTime}\n` +
      `Vehicle: ${b.vehicleModel || 'Commercial AC Cab'}\n` +
      `Driver: ${b.driverName || 'Mukesh Sharma (Assigned)'}\n` +
      `Total Fare: ₹${b.totalAmount.toLocaleString('en-IN')}\n` +
      `Payment Status: ${b.paymentStatus}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Page Header */}
      <PageHeader
        title="My Bookings &amp; Invoices"
        subtitle="View live status, trip assignment, driver contact details, and tax invoices."
        backLabel="Back to Home"
        backFallback={{ path: '/', label: 'Back to Home' }}
        onBack={onBack}
      />

      {/* Tabs (Segmented Control - Zero Pill) */}
      <div className="flex p-1 bg-slate-100 rounded-xl max-w-md">
        {(['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === t
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-10 sm:p-14 text-center bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Car className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-slate-800">No {tab.toLowerCase()} bookings found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Ready to plan a highway ride or a royal tour? Book directly from the home screen!
          </p>
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition"
          >
            Book A Ride Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-amber-400/80 shadow-2xs hover:shadow-sm transition space-y-4"
            >
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-900 text-amber-300 px-2 py-0.5 rounded">
                    {b.id}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {b.serviceType === 'TOUR' ? 'Royal Tour Package' : `${b.tripType.replace('_', ' ')} Taxi`}
                  </span>
                </div>

                {/* Unboxed Status Indicators */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        b.bookingStatus === 'COMPLETED'
                          ? 'bg-emerald-500'
                          : b.bookingStatus === 'CANCELLED'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    {b.bookingStatus}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span
                    className={`font-mono font-semibold ${
                      b.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-800'
                    }`}
                  >
                    {b.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Route & Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{b.pickupCity}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-xs">{b.pickupAddress}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{b.dropCity}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-xs">{b.dropAddress}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{b.travelDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{b.travelTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Car className="w-4 h-4 text-amber-700" />
                      <span>{b.vehicleModel || 'Assigned AC Fleet'}</span>
                    </div>
                    <div className="font-mono font-bold text-sm text-slate-900">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">
                    Chauffeur:{' '}
                    <strong className="text-slate-900">
                      {b.driverName || 'Will be assigned 2 hrs prior'}
                    </strong>
                  </span>
                  {b.driverPhone && (
                    <a
                      href={`tel:${b.driverPhone}`}
                      className="text-amber-800 hover:underline flex items-center gap-1 font-mono font-bold ml-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{b.driverPhone}</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppShare(b)}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    title="Share trip via WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(b)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Quick Bill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDetails(b)}
                    className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-lg font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>View Trip Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Invoice Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black font-serif text-lg">
                  RR
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Rajasthan Rides Tax Invoice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Invoice #{selectedBooking.id} · GSTIN: 08AAACR1234F1Z9
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill To & Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Billed To Guest</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedBooking.customerName}</div>
                <div className="text-slate-600 mt-0.5">Mobile: {selectedBooking.customerPhone}</div>
                <div className="text-slate-600">Email: {selectedBooking.customerEmail}</div>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Journey Coordinates</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {selectedBooking.pickupCity} ➔ {selectedBooking.dropCity}
                </div>
                <div className="text-slate-600 mt-0.5">Departure: {selectedBooking.travelDate} at {selectedBooking.travelTime}</div>
                <div className="text-slate-600">Cab: {selectedBooking.vehicleModel || 'AC Commercial Cab'}</div>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3">Base Highway Kilometer Rate &amp; Vehicle Lease</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{selectedBooking.baseFare.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3">Chauffeur Lodging, Food &amp; Night Allowance</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{selectedBooking.driverAllowance.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3">State Border Tax, NHAI Tolls &amp; Parking (Prepaid)</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{selectedBooking.tollAndParkingEstimated.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3">Goods &amp; Services Tax (CGST 2.5% + SGST 2.5%)</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{selectedBooking.taxGst.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="p-3">Total Grand Invoice Value</td>
                    <td className="p-3 text-right font-mono text-sm tabular-nums text-amber-900">
                      ₹{selectedBooking.totalAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="text-emerald-700 font-semibold">
                    <td className="p-3">Advance Token Collected</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{selectedBooking.paidAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="text-rose-700 font-bold">
                    <td className="p-3">Net Balance Receivable at Chauffeur Pickup</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{selectedBooking.balanceAmount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedBooking(null);
                  navigate(`/bookings/${selectedBooking.id}`);
                }}
                className="text-xs font-bold text-amber-800 hover:underline"
              >
                Open Full Trip Details Page ➔
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-slate-950 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
