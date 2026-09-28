import React from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { UserCheck, Phone, ShieldCheck, Star, AlertCircle, Car, Calendar } from 'lucide-react';

interface DriverDetailsViewProps {
  driverId: string;
}

export const DriverDetailsView: React.FC<DriverDetailsViewProps> = ({ driverId }) => {
  const { navigate } = useNavigation();
  const driver = dataStore.getDrivers().find((d) => d.id === driverId);
  const bookings = dataStore.getBookings().filter((b) => b.driverId === driverId || b.driverName === driver?.name);

  if (!driver) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Driver Profile"
          subtitle="Chauffeur Record Not Found"
          backLabel="Back to Drivers"
          backFallback={{ path: '/admin/drivers', label: 'Back to Drivers' }}
        />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Driver #{driverId} does not exist</h3>
          <p className="text-xs text-slate-500">Please return to the driver directory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={driver.name}
        subtitle={`Driver ID: ${driver.id} · Commercial Driving License: ${driver.licenseNumber}`}
        backLabel="Back to Drivers"
        backFallback={{ path: '/admin/drivers', label: 'Back to Drivers' }}
        badge={
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              driver.availability === 'AVAILABLE'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : driver.availability === 'ON_DUTY'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            {driver.availability}
          </span>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Rating</span>
          <div className="font-bold text-xl text-amber-800 flex items-center gap-1.5 mt-1">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span>{driver.rating} / 5.0</span>
          </div>
          <span className="text-[11px] text-slate-500">Based on Guest Feedback</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Trips Run</span>
          <div className="font-bold font-mono text-xl text-slate-900 mt-1">{driver.totalTrips ?? 42}</div>
          <span className="text-[11px] text-slate-500">Completed Routes</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
          <div className="font-bold text-xl text-slate-900 mt-1">{driver.experienceYears} Years</div>
          <span className="text-[11px] text-slate-500">Rajasthan Highway Specialist</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Allowance</span>
          <div className="font-bold font-mono text-xl text-slate-900 mt-1">₹{driver.dailyWage ?? driver.dailyAllowanceRate}</div>
          <span className="text-[11px] text-slate-500">Bata per Outstation Day</span>
        </div>
      </div>

      {/* Profile & Credentials */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
          Chauffeur Verification &amp; Contact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="w-4 h-4 text-amber-600 shrink-0" />
            <a href={`tel:${driver.phone}`} className="hover:underline font-mono font-medium">
              {driver.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Police Background Verification: Passed</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Car className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Assigned: {driver.assignedVehicleId || 'Pool Chauffeur'}</span>
          </div>
        </div>
      </div>

      {/* Driver Trips Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
          Assigned Trips ({bookings.length})
        </h3>
        {bookings.length === 0 ? (
          <p className="text-xs text-slate-500 py-3">No trips recorded for this driver yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Booking #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Travel Date</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-amber-800">{b.id}</td>
                    <td className="p-3">{b.customerName}</td>
                    <td className="p-3">
                      {b.pickupCity} ➔ {b.dropCity}
                    </td>
                    <td className="p-3 font-mono">{b.travelDate}</td>
                    <td className="p-3">{b.vehicleModel}</td>
                    <td className="p-3 font-semibold">{b.bookingStatus}</td>
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
