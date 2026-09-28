import React from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { User, Phone, Mail, MapPin, Calendar, CreditCard, AlertCircle, ArrowUpRight } from 'lucide-react';

interface CustomerDetailsViewProps {
  customerId: string;
}

export const CustomerDetailsView: React.FC<CustomerDetailsViewProps> = ({ customerId }) => {
  const { navigate } = useNavigation();
  const customer = dataStore.getCustomers().find((c) => c.id === customerId);
  const bookings = dataStore.getBookings().filter((b) => b.customerId === customerId || b.customerPhone === customer?.phone);

  if (!customer) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Customer Profile"
          subtitle="Customer Record Not Found"
          backLabel="Back to Customers"
          backFallback={{ path: '/admin/customers', label: 'Back to Customers' }}
        />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Customer #{customerId} does not exist</h3>
          <p className="text-xs text-slate-500">Please return to the customer directory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={customer.name}
        subtitle={`Customer ID: ${customer.id} · Registered Base: ${customer.city}`}
        backLabel="Back to Customers"
        backFallback={{ path: '/admin/customers', label: 'Back to Customers' }}
        badge={
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            {customer.totalBookings} Total Bookings
          </span>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lifetime Billed</span>
          <div className="font-bold font-mono text-xl text-slate-900 mt-1">
            ₹{customer.totalBilled.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Paid Receipts</span>
          <div className="font-bold font-mono text-xl text-emerald-700 mt-1">
            ₹{customer.totalPaid.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Due</span>
          <div className="font-bold font-mono text-xl text-rose-700 mt-1">
            ₹{customer.outstandingBalance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Contact & Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
          Contact &amp; Account Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="w-4 h-4 text-amber-600 shrink-0" />
            <a href={`tel:${customer.phone}`} className="hover:underline font-mono font-medium">
              {customer.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Mail className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{customer.city}, Rajasthan</span>
          </div>
        </div>
      </div>

      {/* Booking History Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-serif font-bold text-base text-slate-900">
            Trip &amp; Reservation History ({bookings.length})
          </h3>
        </div>

        {bookings.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No reservations recorded yet for this customer.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Booking #</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Travel Date</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-amber-800">{b.id}</td>
                    <td className="p-3">
                      {b.pickupCity} ➔ {b.dropCity}
                    </td>
                    <td className="p-3 font-mono">{b.travelDate}</td>
                    <td className="p-3">{b.vehicleModel}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border">
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/bookings/${b.id}`)}
                        className="px-2.5 py-1 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
                      >
                        View Trip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
