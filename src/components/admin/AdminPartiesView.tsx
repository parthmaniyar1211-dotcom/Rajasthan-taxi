import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { Customer, Vendor } from '../../types/rrTypes';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { Users, Truck, Search, Phone, Mail, Building, Eye } from 'lucide-react';

export const AdminPartiesView: React.FC<{ type: 'CUSTOMERS' | 'VENDORS' }> = ({ type }) => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  const customers = dataStore.getCustomers();
  const vendors = dataStore.getVendors();

  if (type === 'CUSTOMERS') {
    const filtered = customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <PageHeader
          title="Customer Directory &amp; Ledger Summary"
          subtitle="Track customer booking history, lifetime billing, collections, and outstanding receivables"
          backLabel="Back to Dashboard"
          backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
        />

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name, phone or city..."
            className="w-full max-w-sm px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Total Trips</th>
                  <th className="p-3.5">Total Billed</th>
                  <th className="p-3.5">Total Paid</th>
                  <th className="p-3.5">Outstanding Balance</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.id}</div>
                    </td>
                    <td className="p-3.5">{c.city}</td>
                    <td className="p-3.5">
                      <div>{c.phone}</div>
                      <div className="text-[10px] text-slate-400">{c.email}</div>
                    </td>
                    <td className="p-3.5 font-bold">{c.totalBookings}</td>
                    <td className="p-3.5 font-mono">₹{c.totalBilled.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 font-mono text-emerald-700 font-semibold">₹{c.totalPaid.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 font-mono font-bold text-rose-700">
                      ₹{c.outstandingBalance.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/customers/${c.id}`)}
                        className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // VENDORS
  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor &amp; Fleet Partners Management"
        subtitle="Affiliated taxi tour agencies in Bhilwara, Jaipur and Udaipur providing attached cabs"
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
      />

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search vendors..."
          className="w-full max-w-sm px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredVendors.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold bg-slate-900 text-amber-300 px-2 py-0.5 rounded font-mono">
                {v.id}
              </span>
              <h4 className="font-bold text-base text-slate-900 mt-2">{v.name}</h4>
              <p className="text-xs text-slate-500">{v.contactPerson} • {v.city}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Fleet Size</span>
                <div className="font-bold text-slate-900">{v.fleetSize} Attached Cabs</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Trips Given</span>
                <div className="font-bold text-slate-900">{v.totalTrips} Trips</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Billed</span>
                <div className="font-bold text-slate-900 font-mono">₹{v.totalBilled.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Due To Vendor</span>
                <div className="font-bold text-rose-700 font-mono">₹{v.outstandingBalance.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                GSTIN: <strong className="text-slate-700">{v.gstNumber || 'Unregistered'}</strong>
              </span>
              <button
                type="button"
                onClick={() => navigate(`/admin/vendors/${v.id}`)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
              >
                <Eye className="w-3 h-3" />
                <span>Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
