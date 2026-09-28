import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { Booking, BookingStatus, PaymentStatus } from '../../types/rrTypes';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import {
  CalendarCheck,
  Search,
  Filter,
  Plus,
  Car,
  UserCheck,
  CheckCircle2,
  X,
  CreditCard,
  Receipt,
  Printer,
  ChevronDown,
  Eye
} from 'lucide-react';

export const AdminBookingsView: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);

  // Assignment Modal State
  const [assignVehicleId, setAssignVehicleId] = useState('');
  const [assignDriverId, setAssignDriverId] = useState('');

  // Payment Modal State
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER'>('UPI');
  const [paymentRef, setPaymentRef] = useState('');

  const bookings = dataStore.getBookings();
  const vehicles = dataStore.getVehicles();
  const drivers = dataStore.getDrivers();

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm) ||
      b.pickupCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.dropCity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    const matchesService = serviceFilter === 'ALL' || b.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const handleOpenAssign = (b: Booking) => {
    setSelectedBooking(b);
    setAssignVehicleId(b.vehicleId || vehicles[0]?.id || '');
    setAssignDriverId(b.driverId || drivers[0]?.id || '');
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = () => {
    if (!selectedBooking) return;
    const veh = vehicles.find((v) => v.id === assignVehicleId);
    const drv = drivers.find((d) => d.id === assignDriverId);

    dataStore.updateBooking(selectedBooking.id, {
      vehicleId: veh?.id,
      vehicleModel: veh?.model,
      vehicleNumber: veh?.vehicleNumber,
      driverId: drv?.id,
      driverName: drv?.name,
      driverPhone: drv?.phone,
      bookingStatus: 'ASSIGNED'
    });

    setIsAssignModalOpen(false);
  };

  const handleUpdateStatus = (id: string, status: BookingStatus) => {
    dataStore.updateBooking(id, { bookingStatus: status });
  };

  const handleOpenPayment = (b: Booking) => {
    setSelectedBooking(b);
    setPaymentAmount(b.balanceAmount > 0 ? b.balanceAmount : 1000);
    setPaymentRef(`UTR/${Date.now().toString().slice(-6)}`);
    setIsAddPaymentModalOpen(true);
  };

  const handleSavePayment = () => {
    if (!selectedBooking || paymentAmount <= 0) return;

    dataStore.recordPayment({
      bookingId: selectedBooking.id,
      type: 'CUSTOMER_PAYMENT',
      fromParty: selectedBooking.customerName,
      toParty: 'Rajasthan Rides Co.',
      amount: Number(paymentAmount),
      method: paymentMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      referenceNumber: paymentRef || `COLLECT/${Date.now().toString().slice(-4)}`,
      notes: `Direct payment collected for booking ${selectedBooking.id}`,
      recordedBy: dataStore.getCurrentUser().name
    });

    setIsAddPaymentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls with Back Navigation */}
      <PageHeader
        title="Bookings &amp; Trip Dispatch Management"
        subtitle={`Total ${bookings.length} reservations across outstation routes and tour packages.`}
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking #, customer, phone, or cities..."
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-amber-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-700 cursor-pointer"
        >
          <option value="ALL">All Trip Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-700 cursor-pointer"
        >
          <option value="ALL">All Services</option>
          <option value="TAXI">Taxi &amp; Outstation</option>
          <option value="TOUR">Tour Packages</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Booking ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Route</th>
                <th className="p-3.5">Travel Date</th>
                <th className="p-3.5">Fleet Assigned</th>
                <th className="p-3.5">Total / Due</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{b.customerName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{b.customerPhone}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[11px] font-semibold text-slate-700">
                      {b.serviceType === 'TOUR' ? 'Tour Package' : 'Outstation'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-900">
                      {b.pickupCity} ➔ {b.dropCity}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">{b.tripType.replace('_', ' ')}</div>
                  </td>
                  <td className="p-3.5 font-mono tabular-nums">
                    <div>{b.travelDate}</div>
                    <div className="text-[10px] text-slate-400">{b.travelTime}</div>
                  </td>
                  <td className="p-3.5">
                    {b.vehicleModel ? (
                      <div>
                        <div className="font-semibold text-slate-900">{b.vehicleModel}</div>
                        <div className="text-[10px] text-slate-500">{b.driverName || 'Assigning driver'}</div>
                      </div>
                    ) : (
                      <span className="text-amber-800 font-bold text-[11px]">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono tabular-nums">
                    <div className="font-bold text-slate-900">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </div>
                    {b.balanceAmount > 0 ? (
                      <div className="text-[10px] text-rose-600 font-semibold">
                        Due: ₹{b.balanceAmount.toLocaleString('en-IN')}
                      </div>
                    ) : (
                      <div className="text-[10px] text-emerald-600 font-semibold">Settled</div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={b.bookingStatus}
                      onChange={(e) => handleUpdateStatus(b.id, e.target.value as any)}
                      className="text-[11px] font-bold p-1 rounded-lg border border-slate-200 bg-white cursor-pointer"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="ON_TRIP">ON TRIP</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/bookings/${b.id}`)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                      title="View Complete Booking Details"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenAssign(b)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                      title="Assign Vehicle & Driver"
                    >
                      Assign
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenPayment(b)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition"
                      title="Collect Payment"
                    >
                      Collect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Driver & Vehicle Modal */}
      {isAssignModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Assign Fleet to Trip #{selectedBooking.id}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedBooking.pickupCity} ➔ {selectedBooking.dropCity} on {selectedBooking.travelDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Select Vehicle *
                </label>
                <select
                  value={assignVehicleId}
                  onChange={(e) => setAssignVehicleId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:border-amber-600"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.model} ({v.vehicleNumber}) - {v.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Select Chauffeur *
                </label>
                <select
                  value={assignDriverId}
                  onChange={(e) => setAssignDriverId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:border-amber-600"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone}) - {d.availability}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignment}
                className="px-5 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold transition"
              >
                Confirm Dispatch Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isAddPaymentModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Record Payment for #{selectedBooking.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Guest: {selectedBooking.customerName} · Due: ₹{selectedBooking.balanceAmount}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  min={1}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none"
                >
                  <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="CASH">Cash Collected by Driver</option>
                  <option value="BANK_TRANSFER">Direct Bank NEFT/RTGS</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  Transaction / Bank Ref Number
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. UTR-9828392189"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePayment}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
              >
                Record Payment &amp; Update Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
