import React from 'react';
import { dataStore } from '../../services/dataStore';
import { useNavigation } from '../../context/NavigationContext';
import {
  CalendarCheck,
  TrendingUp,
  Receipt,
  Scale,
  Users,
  Car,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  Truck,
  UserCheck
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigate: (section: any) => void;
  onOpenProfile?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate, onOpenProfile }) => {
  const { navigate } = useNavigation();
  const currentUser = dataStore.getCurrentUser();
  const bookings = dataStore.getBookings();
  const vehicles = dataStore.getVehicles();
  const drivers = dataStore.getDrivers();
  const pnl = dataStore.getProfitAndLoss();
  const balanceSheet = dataStore.getBalanceSheet();
  const vendors = dataStore.getVendors();

  const isAdmin = currentUser.role === 'ADMIN';
  const isManager = currentUser.role === 'MANAGER';
  const isVendor = currentUser.role === 'VENDOR';

  // Vendor Specific Data
  const vendorInfo = vendors.find((v) => v.id === currentUser.vendorId) || vendors[0];
  const vendorVehicles = vehicles.filter((v) => v.vendorId === vendorInfo.id || v.ownerType === 'VENDOR_ATTACHED');
  const vendorBookings = bookings.filter((b) =>
    vendorVehicles.some((veh) => veh.id === b.vehicleId || veh.model === b.vehicleModel)
  );

  // Financial Metrics
  const totalRevenue = pnl.revenues.totalRevenue;
  const totalExpenses = pnl.expenses.totalExpenses;
  const netProfit = pnl.netProfit;
  const totalReceivables = balanceSheet.assets.customerReceivables;
  const totalPayables = balanceSheet.liabilities.totalLiabilities;

  // Recent 6 bookings
  const displayBookings = isVendor ? vendorBookings.slice(0, 6) : bookings.slice(0, 6);

  // Today metrics
  const todayStr = '2026-09-27';
  const todayBookings = bookings.filter((b) => b.travelDate === todayStr || b.createdAt.startsWith(todayStr));
  const todayRevenue = todayBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  // Fleet operational state
  const onTripVehicles = (isVendor ? vendorVehicles : vehicles).filter((v) => v.status === 'ON_TRIP').length;
  const availableVehicles = (isVendor ? vendorVehicles : vehicles).filter((v) => v.status === 'AVAILABLE').length;

  return (
    <div className="space-y-6">
      {/* Top Operations Banner */}
      <div className="bg-slate-950 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider">
            <span>Rajasthan Rides</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>
              {isAdmin && 'Executive Business Cockpit'}
              {isManager && 'Operations Dispatch Center'}
              {isVendor && `Vendor Partner Portal — ${currentUser.name}`}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold mt-1 text-white">
            {isAdmin && 'Rajasthan Rides ERP & Financial Hub'}
            {isManager && 'Daily Highway Operations & Fleet Dispatch'}
            {isVendor && 'My Fleet, Trips & Earnings Dashboard'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAdmin && 'Real-time highway taxi dispatch, fleet tracking, and dynamic financial ledgers.'}
            {isManager && 'Operational fleet allocations, chauffeur rosters, and tourist route coordination.'}
            {isVendor && 'Manage your attached vehicles, track active passenger trips, and view settlement receipts.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {isVendor ? 'Attached Cabs' : 'Today Trips'}
            </span>
            <div className="text-base font-bold text-white font-mono tabular-nums">
              {isVendor ? `${vendorVehicles.length} Vehicles` : `${todayBookings.length} Dispatched`}
            </div>
          </div>

          <div className="bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {isVendor ? 'Vendor Due Payout' : 'Today Billing'}
            </span>
            <div className="text-base font-bold text-amber-400 font-mono tabular-nums">
              {isVendor
                ? `₹${vendorInfo.outstandingBalance.toLocaleString('en-IN')}`
                : `₹${todayRevenue.toLocaleString('en-IN')}`}
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      {isVendor ? (
        // VENDOR METRICS GRID
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attached Vehicles</span>
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{vendorVehicles.length} Cabs</div>
            <div className="text-[11px] text-slate-500">{onTripVehicles} On Trip · {availableVehicles} Available</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Trips</span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{vendorInfo.totalTrips} Trips</div>
            <div className="text-[11px] text-slate-500">{vendorBookings.length} Total records assigned</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Billed</span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
              ₹{vendorInfo.totalBilled.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500">Settled: ₹{vendorInfo.totalPaid.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Settlement Due</span>
              <div className="p-2 bg-amber-50 text-amber-800 rounded-xl">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-800 font-mono tabular-nums">
              ₹{vendorInfo.outstandingBalance.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold">Payment in process</div>
          </div>
        </div>
      ) : isManager ? (
        // MANAGER METRICS GRID
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{bookings.length}</div>
            <div className="text-[11px] text-slate-500">{todayBookings.length} Today</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Fleet</span>
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{vehicles.length} Cabs</div>
            <div className="text-[11px] text-slate-500">{onTripVehicles} On Road · {availableVehicles} Ready</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chauffeurs</span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{drivers.length} Staff</div>
            <div className="text-[11px] text-slate-500">Commercial yellow badge verified</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Vendors</span>
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{vendors.length} Vendors</div>
            <div className="text-[11px] text-slate-500">Attached fleet network</div>
          </div>
        </div>
      ) : (
        // ADMIN FULL 6 FINANCIAL KPI CARDS
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{bookings.length}</div>
            <div className="text-[11px] text-slate-500">
              {bookings.filter((b) => b.bookingStatus === 'COMPLETED').length} trips completed
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Revenue</span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500">
              Taxi: ₹{pnl.revenues.taxiRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</span>
              <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500">
              Fuel, drivers &amp; servicing
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Profit</span>
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-800 font-mono tabular-nums">
              ₹{netProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold font-mono">
              {pnl.profitMarginPercent.toFixed(1)}% operating margin
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receivables</span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-900 font-mono tabular-nums">
              ₹{totalReceivables.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500">
              Pending trip collections
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fleet Status</span>
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {vehicles.length} Cabs
            </div>
            <div className="text-[11px] text-slate-500">
              {onTripVehicles} On Road · {availableVehicles} Ready
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          Quick Actions:
        </span>
        <button
          type="button"
          onClick={() => onNavigate('BOOKINGS')}
          className="px-3.5 py-1.5 bg-slate-950 text-amber-300 hover:bg-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>{isVendor ? 'My Assigned Bookings' : 'Dispatch / Book Trip'}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('VEHICLES')}
          className="px-3.5 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Car className="w-3.5 h-3.5" />
          <span>{isVendor ? 'My Attached Vehicles' : 'Fleet Records'}</span>
        </button>

        {!isVendor && (
          <button
            type="button"
            onClick={() => onNavigate('PAYMENTS')}
            className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        )}

        {isAdmin && (
          <>
            <button
              type="button"
              onClick={() => onNavigate('EXPENSES')}
              className="px-3.5 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('PROFIT_LOSS')}
              className="px-3.5 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Profit &amp; Loss</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('BALANCE_SHEET')}
              className="px-3.5 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Balance Sheet</span>
            </button>
          </>
        )}

        {onOpenProfile && (
          <button
            type="button"
            onClick={onOpenProfile}
            className="px-3.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>My Profile</span>
          </button>
        )}
      </div>

      {/* Main Grid: Bookings Table + Context Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Dispatch Bookings (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                {isVendor ? 'My Assigned Vehicle Trips' : 'Recent Highway Bookings & Dispatch Status'}
              </h3>
              <p className="text-xs text-slate-500">Live operational feed of passenger trips</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('BOOKINGS')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-3">Ref #</th>
                  <th className="p-3">Guest &amp; Route</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Vehicle / Driver</th>
                  <th className="p-3 text-right">Fare (₹)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayBookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => navigate(`/admin/bookings/${b.id}`)}
                    className="hover:bg-amber-50/50 cursor-pointer transition"
                    title="Click to view full booking details"
                  >
                    <td className="p-3 font-mono font-bold text-slate-900 group-hover:text-amber-800">{b.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{b.customerName}</div>
                      <div className="text-[11px] text-slate-500">{b.pickupCity} ➔ {b.dropCity}</div>
                    </td>
                    <td className="p-3 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                      {b.travelDate}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-900">{b.vehicleModel || 'AC Cab'}</div>
                      <div className="text-[11px] text-slate-500">{b.driverName || 'Assigning'}</div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-slate-700">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.bookingStatus === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : b.bookingStatus === 'ON_TRIP'
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span>{b.bookingStatus}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel: Role Info or P&L */}
        {isAdmin ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Operating P&amp;L Summary
                </h3>
                <p className="text-xs text-slate-500">Direct Cost vs Gross Margin</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('PROFIT_LOSS')}
                className="text-xs font-bold text-amber-800 hover:text-amber-900"
              >
                Full P&amp;L
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span>Gross Taxi Fares:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{pnl.revenues.taxiRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Tour Packages Revenue:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{pnl.revenues.tourPackageRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-bold text-slate-900">
                <span>Total Revenue:</span>
                <span className="font-mono text-emerald-700 tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Direct Trip Costs (Diesel/Tolls):</span>
                  <span className="font-mono tabular-nums">₹{pnl.directCosts.fuelExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chauffeur Trip Batta:</span>
                  <span className="font-mono tabular-nums">₹{pnl.directCosts.driverDailyAllowances.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Gross Profit Margin:</span>
                  <span className="font-mono tabular-nums">₹{pnl.grossProfit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-900 block">Net Operating Profit</span>
                  <span className="text-base font-extrabold text-amber-950 font-mono tabular-nums">
                    ₹{netProfit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-800 font-mono tabular-nums">
                    {pnl.profitMarginPercent.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">margin</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-base text-slate-900">
                {isVendor ? 'Vendor Partner Account' : 'Operations Scope'}
              </h3>
              <p className="text-xs text-slate-500">
                {isVendor ? 'Payout reconciliation & fleet info' : 'Operational team permissions'}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Authenticated User</span>
                <div className="font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-slate-500">{currentUser.email}</div>
                <div className="text-slate-500 font-mono">{currentUser.phone}</div>
              </div>

              {isVendor && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-900 uppercase">Payment Summary</span>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Billed:</span>
                    <span className="font-mono font-bold text-slate-900">₹{vendorInfo.totalBilled.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Disbursed to Bank:</span>
                    <span className="font-mono font-bold text-emerald-700">₹{vendorInfo.totalPaid.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200 pt-1 font-bold">
                    <span className="text-slate-900">Pending Settlement:</span>
                    <span className="font-mono text-amber-900">₹{vendorInfo.outstandingBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={onOpenProfile}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>View &amp; Edit Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
