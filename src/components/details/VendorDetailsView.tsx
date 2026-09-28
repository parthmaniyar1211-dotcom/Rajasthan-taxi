import React from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { Truck, Phone, Mail, MapPin, Building, AlertCircle, Car } from 'lucide-react';

interface VendorDetailsViewProps {
  vendorId: string;
}

export const VendorDetailsView: React.FC<VendorDetailsViewProps> = ({ vendorId }) => {
  const { navigate } = useNavigation();
  const vendor = dataStore.getVendors().find((v) => v.id === vendorId);
  const vehicles = dataStore.getVehicles().filter((v) => v.vendorId === vendorId || v.ownerType === 'VENDOR_ATTACHED');
  const expenses = dataStore.getExpenses().filter(
    (e) => e.vendorId === vendorId || (vendor && (e.title.toLowerCase().includes(vendor.name.toLowerCase()) || (e.payeeName && e.payeeName.includes(vendor.name))))
  );

  if (!vendor) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Vendor Partner Details"
          subtitle="Vendor Record Not Found"
          backLabel="Back to Vendors"
          backFallback={{ path: '/admin/vendors', label: 'Back to Vendors' }}
        />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Vendor #{vendorId} does not exist</h3>
          <p className="text-xs text-slate-500">Please return to the vendor management view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={vendor.name}
        subtitle={`Vendor Partner ID: ${vendor.id} · Base Location: ${vendor.city}`}
        backLabel="Back to Vendors"
        backFallback={{ path: '/admin/vendors', label: 'Back to Vendors' }}
        badge={
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {vendor.commissionRate ?? 15}% Commission Rate
          </span>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attached Fleet</span>
          <div className="font-bold font-mono text-xl text-slate-900 mt-1">{vendor.fleetSuppliedCount ?? vendor.fleetSize} Cabs</div>
          <span className="text-[11px] text-slate-500">Active Attached Vehicles</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Payouts Settled</span>
          <div className="font-bold font-mono text-xl text-emerald-700 mt-1">
            ₹{vendor.totalPaid.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">Bank Transfers Settled</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Due</span>
          <div className="font-bold font-mono text-xl text-rose-700 mt-1">
            ₹{(vendor.outstandingPayable ?? vendor.outstandingBalance).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">Pending Ledger Payable</span>
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
          Agency &amp; Contact Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Contact Person</span>
            <div className="font-bold text-slate-900 mt-0.5">{vendor.contactPerson}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Direct Phone</span>
            <div className="font-mono font-bold text-slate-900 mt-0.5">
              <a href={`tel:${vendor.phone}`} className="hover:underline">{vendor.phone}</a>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Email</span>
            <div className="text-slate-700 mt-0.5">{vendor.email}</div>
          </div>
        </div>
      </div>

      {/* Attached Fleet Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
          Attached Fleet Vehicles ({vehicles.length})
        </h3>
        {vehicles.length === 0 ? (
          <p className="text-xs text-slate-500 py-3">No attached vehicles currently listed for this vendor.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Registration #</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{v.model}</td>
                    <td className="p-3 font-mono font-bold text-amber-800">{v.vehicleNumber}</td>
                    <td className="p-3">{v.type}</td>
                    <td className="p-3 font-semibold">{v.status}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/vehicles/${v.id}`)}
                        className="px-2.5 py-1 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
                      >
                        View Vehicle
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
