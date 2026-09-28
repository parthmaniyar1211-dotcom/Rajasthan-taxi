import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { Driver } from '../../types/rrTypes';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import {
  UserCheck,
  Search,
  Phone,
  CreditCard,
  Award,
  Plus,
  X,
  FileText,
  Eye
} from 'lucide-react';

export const AdminDriversView: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriverLedger, setSelectedDriverLedger] = useState<Driver | null>(null);

  const drivers = dataStore.getDrivers();
  const bookings = dataStore.getBookings();
  const payments = dataStore.getPayments();

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone.includes(searchTerm) ||
    d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chauffeur &amp; Driver Management"
        subtitle="Maintain police-verified commercial chauffeurs, allowances, and trip settlement ledgers"
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
      />

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrivers.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-900 text-amber-300 font-bold flex items-center justify-center text-sm">
                    {d.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {d.phone}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  d.availability === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : d.availability === 'ON_DUTY'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {d.availability}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Experience</span>
                  <div className="font-bold text-slate-900">{d.experienceYears} Years</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Rating</span>
                  <div className="font-bold text-amber-800">⭐ {d.rating} / 5.0</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Daily Allowance</span>
                  <div className="font-bold text-slate-900">₹{d.dailyAllowanceRate}/day</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Company Dues</span>
                  <div className="font-bold text-rose-700">₹{d.outstandingBalance.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                <div>License: <strong className="text-slate-800">{d.licenseNumber}</strong></div>
                <div>Bank: <strong className="text-slate-800">{d.bankDetails.bankName} ({d.bankDetails.ifsc})</strong></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(`/admin/drivers/${d.id}`)}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-bold rounded-lg shadow-2xs transition inline-flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Details</span>
              </button>
              <button
                onClick={() => setSelectedDriverLedger(d)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition"
              >
                View Ledger
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Driver Ledger Modal */}
      {selectedDriverLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Chauffeur Ledger &amp; Earnings: {selectedDriverLedger.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Phone: {selectedDriverLedger.phone} • UPI: {selectedDriverLedger.bankDetails.upiId}
                </p>
              </div>
              <button onClick={() => setSelectedDriverLedger(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Total Earnings</div>
                <div className="font-bold text-base text-slate-900 font-mono">
                  ₹{selectedDriverLedger.totalEarnings.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Trip Advances</div>
                <div className="font-bold text-base text-slate-900 font-mono">
                  ₹{selectedDriverLedger.totalAdvances.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Total Paid</div>
                <div className="font-bold text-base text-emerald-900 font-mono">
                  ₹{selectedDriverLedger.totalPaid.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <div className="text-[10px] text-rose-800 font-bold uppercase">Due To Driver</div>
                <div className="font-bold text-base text-rose-900 font-mono">
                  ₹{selectedDriverLedger.outstandingBalance.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Trips Handled */}
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-600 mb-2">Trips Handled &amp; Allowances</h4>
              <div className="space-y-2">
                {bookings.filter(b => b.driverId === selectedDriverLedger.id).slice(0, 5).map(b => (
                  <div key={b.id} className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-slate-900">{b.id}</span> • {b.pickupCity} ➔ {b.dropCity} ({b.travelDate})
                    </div>
                    <div className="font-bold text-amber-800 font-mono">
                      Allowance: ₹{b.driverAllowance}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDriverLedger(null)}
                className="px-5 py-2 bg-slate-900 text-amber-300 text-xs font-bold rounded-xl"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
