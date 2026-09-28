import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { Vehicle } from '../../types/rrTypes';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import {
  Car,
  Search,
  Plus,
  ShieldCheck,
  Fuel,
  Wrench,
  AlertTriangle,
  X,
  Eye
} from 'lucide-react';

export const AdminVehiclesView: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New vehicle form state
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<Vehicle['type']>('SEDAN');
  const [seating, setSeating] = useState(4);
  const [luggageCapacity, setLuggageCapacity] = useState(2);
  const [perKmRate, setPerKmRate] = useState(12);
  const [dailyRate, setDailyRate] = useState(2200);
  const [ownerType, setOwnerType] = useState<Vehicle['ownerType']>('COMPANY_OWNED');

  const vehicles = dataStore.getVehicles();

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.createVehicle({
      vehicleNumber,
      model,
      type,
      seating: Number(seating),
      luggageCapacity: Number(luggageCapacity),
      isAc: true,
      perKmRate: Number(perKmRate),
      dailyRate: Number(dailyRate),
      status: 'AVAILABLE',
      ownerType,
      insuranceExpiry: '2027-10-15',
      fitnessExpiry: '2028-10-15',
      permitType: 'ALL_INDIA_TOURIST',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      currentOdometerKm: 12000
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Fleet Management"
        subtitle="Maintain company & vendor attached sedans, Innovas, and tempo travellers"
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vehicle number or model..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-amber-600"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-700"
        >
          <option value="ALL">All Categories</option>
          <option value="SEDAN">Sedans</option>
          <option value="SUV">SUVs</option>
          <option value="PREMIUM">Premium Luxury</option>
          <option value="TRAVELLER">Tempo Travellers</option>
        </select>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img src={v.imageUrl} alt={v.model} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                  {v.vehicleNumber}
                </div>
                <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  v.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : v.status === 'ON_TRIP'
                    ? 'bg-blue-100 text-blue-800'
                    : v.status === 'MAINTENANCE'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {v.status}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-bold text-base text-slate-900">{v.model}</h4>
                  <div className="text-xs text-slate-500">
                    {v.type} • {v.seating} Seats • {v.luggageCapacity} Luggage
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Rate / Km</span>
                    <div className="font-bold text-amber-800">₹{v.perKmRate}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Daily Tariff</span>
                    <div className="font-bold text-slate-900">₹{v.dailyRate}</div>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Ownership:</span>
                    <span className="font-medium text-slate-800">{v.ownerType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance Expiry:</span>
                    <span className="font-medium text-slate-800">{v.insuranceExpiry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Odometer:</span>
                    <span className="font-medium text-slate-800">{v.currentOdometerKm.toLocaleString()} km</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(`/admin/vehicles/${v.id}`)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
              >
                <Eye className="w-3 h-3" />
                <span>Details</span>
              </button>
              <button
                onClick={() => {
                  const nextStatus = v.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
                  dataStore.updateVehicle(v.id, { status: nextStatus });
                }}
                className="text-xs font-bold text-amber-800 hover:underline"
              >
                Toggle {v.status === 'AVAILABLE' ? 'Service/Maint' : 'Available'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">Add Vehicle to Fleet</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Registration Number *</label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. RJ-06-TA-9988"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Make &amp; Model *</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Maruti Suzuki Dzire"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="SEDAN">SEDAN</option>
                    <option value="SUV">SUV</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="TRAVELLER">TRAVELLER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Per Km Rate (₹)</label>
                  <input
                    type="number"
                    value={perKmRate}
                    onChange={(e) => setPerKmRate(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
