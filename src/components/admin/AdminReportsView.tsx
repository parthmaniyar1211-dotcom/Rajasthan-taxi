import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { FileText, Download, Printer, Filter, ArrowRight } from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const { navigate } = useNavigation();
  const [reportType, setReportType] = useState<
    'BOOKING' | 'REVENUE' | 'EXPENSE' | 'VEHICLE' | 'DRIVER' | 'CUSTOMER_LEDGER' | 'VENDOR_LEDGER'
  >('BOOKING');

  const bookings = dataStore.getBookings();
  const expenses = dataStore.getExpenses();
  const vehicles = dataStore.getVehicles();
  const drivers = dataStore.getDrivers();
  const customers = dataStore.getCustomers();
  const vendors = dataStore.getVendors();

  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'BOOKING') {
      csvContent += 'Booking ID,Customer,Service,Pickup,Drop,Date,Amount,Paid,Balance,Status\n';
      bookings.forEach(b => {
        csvContent += `"${b.id}","${b.customerName}","${b.serviceType}","${b.pickupCity}","${b.dropCity}","${b.travelDate}",${b.totalAmount},${b.paidAmount},${b.balanceAmount},"${b.bookingStatus}"\n`;
      });
    } else if (reportType === 'EXPENSE') {
      csvContent += 'Expense ID,Date,Category,Title,Amount,Paid Via\n';
      expenses.forEach(e => {
        csvContent += `"${e.id}","${e.expenseDate}","${e.category}","${e.title}",${e.amount},"${e.paidVia}"\n`;
      });
    } else if (reportType === 'VEHICLE') {
      csvContent += 'Vehicle Number,Model,Type,Seating,Rate Per Km,Daily Rate,Status,Total Trips\n';
      vehicles.forEach(v => {
        csvContent += `"${v.vehicleNumber}","${v.model}","${v.type}",${v.seating},${v.perKmRate},${v.dailyRate},"${v.status}",${v.totalTripsCount}\n`;
      });
    } else if (reportType === 'DRIVER') {
      csvContent += 'Driver Name,Phone,License,Rating,Total Earnings,Advances,Paid,Outstanding\n';
      drivers.forEach(d => {
        csvContent += `"${d.name}","${d.phone}","${d.licenseNumber}",${d.rating},${d.totalEarnings},${d.totalAdvances},${d.totalPaid},${d.outstandingBalance}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rajasthan_rides_${reportType.toLowerCase()}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Intelligence &amp; Operational Reports"
        subtitle="Export comprehensive CSV & audit reports for chartered accountant & tax returns"
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* Featured Deep-Dive Audit Reports Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
          Deep-Dive Analytical Audit Reports
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => navigate('/admin/reports/fleet-utilization')}
            className="p-4 bg-white rounded-xl border border-amber-200/70 hover:border-amber-400 cursor-pointer shadow-2xs hover:shadow-xs transition space-y-1"
          >
            <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
              <span>Fleet Vehicle Utilization Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <p className="text-[11px] text-slate-500">Odometer km run, dead mileage, fuel & revenue contribution</p>
          </div>

          <div
            onClick={() => navigate('/admin/reports/driver-settlement')}
            className="p-4 bg-white rounded-xl border border-amber-200/70 hover:border-amber-400 cursor-pointer shadow-2xs hover:shadow-xs transition space-y-1"
          >
            <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
              <span>Chauffeur Bata &amp; Settlement</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <p className="text-[11px] text-slate-500">Allowances, trip bonuses, advances and pending company payouts</p>
          </div>

          <div
            onClick={() => navigate('/admin/reports/route-profitability')}
            className="p-4 bg-white rounded-xl border border-amber-200/70 hover:border-amber-400 cursor-pointer shadow-2xs hover:shadow-xs transition space-y-1"
          >
            <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
              <span>Route Profitability Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
            </div>
            <p className="text-[11px] text-slate-500">Bhilwara-Ahmedabad vs Delhi vs Jaipur tour profitability</p>
          </div>
        </div>
      </div>

      {/* Report Type Selector Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'BOOKING', label: 'Booking Report' },
          { id: 'REVENUE', label: 'Revenue Report' },
          { id: 'EXPENSE', label: 'Expense Report' },
          { id: 'VEHICLE', label: 'Vehicle Fleet Report' },
          { id: 'DRIVER', label: 'Driver Ledger Report' },
          { id: 'CUSTOMER_LEDGER', label: 'Customer Dues Report' },
          { id: 'VENDOR_LEDGER', label: 'Vendor Payables Report' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setReportType(t.id as any)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              reportType === t.id
                ? 'bg-slate-950 text-amber-300 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Report Content Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {reportType === 'BOOKING' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Booking #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Trip</th>
                  <th className="p-3">Travel Date</th>
                  <th className="p-3">Total Fare</th>
                  <th className="p-3">Advance</th>
                  <th className="p-3">Balance</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-amber-800">{b.id}</td>
                    <td className="p-3 font-medium">{b.customerName}</td>
                    <td className="p-3">{b.pickupCity} ➔ {b.dropCity}</td>
                    <td className="p-3 font-mono">{b.travelDate}</td>
                    <td className="p-3 font-bold font-mono">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-emerald-700 font-mono">₹{b.paidAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-rose-700 font-mono font-semibold">₹{b.balanceAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'EXPENSE' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Paid Via</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono text-slate-900">{e.id}</td>
                    <td className="p-3">{e.expenseDate}</td>
                    <td className="p-3 font-semibold">{e.category}</td>
                    <td className="p-3">{e.title}</td>
                    <td className="p-3 font-bold font-mono text-rose-700">₹{e.amount.toLocaleString('en-IN')}</td>
                    <td className="p-3">{e.paidVia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'VEHICLE' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Vehicle Number</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Per Km Rate</th>
                  <th className="p-3">Daily Tariff</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Trips Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-amber-800">{v.vehicleNumber}</td>
                    <td className="p-3 font-medium">{v.model}</td>
                    <td className="p-3">{v.type}</td>
                    <td className="p-3 font-mono">₹{v.perKmRate}</td>
                    <td className="p-3 font-mono">₹{v.dailyRate}</td>
                    <td className="p-3">{v.status}</td>
                    <td className="p-3 font-bold">{v.totalTripsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'DRIVER' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Driver Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">License #</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Total Earned</th>
                  <th className="p-3">Company Dues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{d.name}</td>
                    <td className="p-3 font-mono">{d.phone}</td>
                    <td className="p-3 font-mono text-slate-600">{d.licenseNumber}</td>
                    <td className="p-3 font-bold text-amber-800">⭐ {d.rating}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">₹{d.totalEarnings.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono font-bold text-rose-700">₹{d.outstandingBalance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'CUSTOMER_LEDGER' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Total Trips</th>
                  <th className="p-3">Total Billed</th>
                  <th className="p-3">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{c.name}</td>
                    <td className="p-3">{c.city}</td>
                    <td className="p-3 font-mono">{c.phone}</td>
                    <td className="p-3 font-bold">{c.totalBookings}</td>
                    <td className="p-3 font-mono">₹{c.totalBilled.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono font-bold text-rose-700">₹{c.outstandingBalance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'VENDOR_LEDGER' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Vendor Agency</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Fleet Size</th>
                  <th className="p-3">Total Billed</th>
                  <th className="p-3">Due To Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{v.name}</td>
                    <td className="p-3">{v.city}</td>
                    <td className="p-3">{v.contactPerson}</td>
                    <td className="p-3 font-bold">{v.fleetSize}</td>
                    <td className="p-3 font-mono">₹{v.totalBilled.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono font-bold text-rose-700">₹{v.outstandingBalance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
