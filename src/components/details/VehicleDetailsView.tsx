import React from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { Car, ShieldCheck, Fuel, Wrench, AlertCircle, Calendar, Users, Briefcase } from 'lucide-react';

interface VehicleDetailsViewProps {
  vehicleId: string;
}

export const VehicleDetailsView: React.FC<VehicleDetailsViewProps> = ({ vehicleId }) => {
  const { navigate } = useNavigation();
  const vehicle = dataStore.getVehicles().find((v) => v.id === vehicleId);
  const bookings = dataStore.getBookings().filter((b) => b.vehicleId === vehicleId || b.vehicleNumber === vehicle?.vehicleNumber);

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Vehicle Details"
          subtitle="Fleet Record Not Found"
          backLabel="Back to Vehicles"
          backFallback={{ path: '/admin/vehicles', label: 'Back to Vehicles' }}
        />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Vehicle #{vehicleId} does not exist</h3>
          <p className="text-xs text-slate-500">Please return to the fleet management view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={`${vehicle.model} (${vehicle.vehicleNumber})`}
        subtitle={`${vehicle.type} · ${vehicle.ownerType.replace('_', ' ')} · ${vehicle.permitType.replace(/_/g, ' ')}`}
        backLabel="Back to Vehicles"
        backFallback={{ path: '/admin/vehicles', label: 'Back to Vehicles' }}
        badge={
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              vehicle.status === 'AVAILABLE'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : vehicle.status === 'ON_TRIP'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {vehicle.status}
          </span>
        }
        actions={
          <button
            type="button"
            onClick={() => {
              const nextStatus = vehicle.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
              dataStore.updateVehicle(vehicle.id, { status: nextStatus });
            }}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold shadow-2xs transition"
          >
            Toggle Status ({vehicle.status === 'AVAILABLE' ? 'Service/Maint' : 'Set Available'})
          </button>
        }
      />

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rate per Km</span>
          <div className="font-bold font-mono text-xl text-amber-800 mt-1">₹{vehicle.perKmRate}</div>
          <span className="text-[11px] text-slate-500">Outstation Base</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Tariff</span>
          <div className="font-bold font-mono text-xl text-slate-900 mt-1">₹{vehicle.dailyRate}</div>
          <span className="text-[11px] text-slate-500">8 Hr / 80 Km Package</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Trips Run</span>
          <div className="font-bold font-mono text-xl text-slate-900 mt-1">{vehicle.totalTripsCount}</div>
          <span className="text-[11px] text-slate-500">Completed Journeys</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Odometer</span>
          <div className="font-bold font-mono text-xl text-slate-900 mt-1">
            {vehicle.currentOdometerKm.toLocaleString()} km
          </div>
          <span className="text-[11px] text-slate-500">Logged Distance</span>
        </div>
      </div>

      {/* Compliance & Document Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
          Statutory Compliance &amp; Permits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Insurance Valid Till</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">{vehicle.insuranceExpiry}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Fitness Certificate</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">{vehicle.fitnessExpiry}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Seating &amp; Luggage</span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {vehicle.seating} Seats · {vehicle.luggageCapacity} Bags
            </span>
          </div>
        </div>
      </div>

      {/* Trips Run Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
          Associated Trips &amp; Assignments ({bookings.length})
        </h3>
        {bookings.length === 0 ? (
          <p className="text-xs text-slate-500 py-3">No trips recorded for this vehicle yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Booking #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Travel Date</th>
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
