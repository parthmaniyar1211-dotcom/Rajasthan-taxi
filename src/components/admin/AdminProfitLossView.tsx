import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { PieChart, Filter, Printer, TrendingUp, TrendingDown } from 'lucide-react';

export const AdminProfitLossView: React.FC = () => {
  const [serviceTypeFilter, setServiceTypeFilter] = useState('ALL');
  const pnl = dataStore.getProfitAndLoss({ serviceType: serviceTypeFilter });

  return (
    <div className="space-y-6">
      {/* Header with Back Navigation */}
      <PageHeader
        title="Statement of Profit &amp; Loss (P&amp;L)"
        subtitle={`Accounting Period: ${pnl.period} · Consolidated Rajasthan Rides Operations.`}
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="p-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl outline-none cursor-pointer"
            >
              <option value="ALL">All Business Lines</option>
              <option value="TAXI">Taxi &amp; Outstation Only</option>
              <option value="TOUR">Tour Packages Only</option>
            </select>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Statement</span>
            </button>
          </div>
        }
      />

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Operating Revenue</span>
          <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            ₹{pnl.revenues.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500">
            Taxi: ₹{pnl.revenues.taxiRevenue.toLocaleString('en-IN')} · Tours: ₹{pnl.revenues.tourRevenue.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Operating Expenses</span>
          <div className="text-2xl font-black text-rose-700 font-mono tabular-nums">
            ₹{pnl.expenses.totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500">
            Direct fleet costs &amp; administrative overheads
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Operating Profit</span>
          <div className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
            ₹{pnl.netProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-800 font-bold">
            {pnl.profitMarginPercent.toFixed(1)}% Net Operating Margin
          </div>
        </div>
      </div>

      {/* Structured P&L Table */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
          Income Statement Breakdown
        </h3>

        <div className="space-y-5 text-xs font-sans">
          {/* Revenue Section */}
          <div>
            <div className="font-bold uppercase text-slate-900 bg-slate-50 p-2.5 rounded-xl mb-2.5">
              1. Revenue from Operations
            </div>
            <div className="space-y-2 px-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Intercity Outstation Taxi Services</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  ₹{pnl.revenues.taxiRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rajasthan Heritage Tour Packages</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  ₹{pnl.revenues.tourRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>Total Operating Revenue:</span>
                <span className="font-mono text-emerald-800 tabular-nums text-sm">
                  ₹{pnl.revenues.totalRevenue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Direct Trip Expenses */}
          <div>
            <div className="font-bold uppercase text-slate-900 bg-slate-50 p-2.5 rounded-xl mb-2.5">
              2. Direct Trip Operating Costs (Cost of Goods Sold)
            </div>
            <div className="space-y-2 px-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Commercial Diesel &amp; Fuel Invoices</span>
                <span className="font-mono font-medium text-slate-800 tabular-nums">
                  ₹{pnl.directCosts.fuelExpenses.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Chauffeur Daily Allowances &amp; Night Batta</span>
                <span className="font-mono font-medium text-slate-800 tabular-nums">
                  ₹{pnl.directCosts.driverDailyAllowances.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Highway Tollways, FASTag &amp; Inter-State Permits</span>
                <span className="font-mono font-medium text-slate-800 tabular-nums">
                  ₹{pnl.directCosts.tollExpenses.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Hotel Bookings &amp; Sightseeing (Tour Packages)</span>
                <span className="font-mono font-medium text-slate-800 tabular-nums">
                  ₹{pnl.directCosts.vendorHotelCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
                <span>Total Direct Costs:</span>
                <span className="font-mono tabular-nums">
                  ₹{pnl.directCosts.totalDirectCosts.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Gross Profit */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 flex justify-between items-center font-bold text-slate-900">
            <span>GROSS OPERATING PROFIT (Revenue − Direct Costs):</span>
            <span className="font-mono text-base text-amber-950 tabular-nums">
              ₹{pnl.grossProfit.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Operating Overheads */}
          <div>
            <div className="font-bold uppercase text-slate-900 bg-slate-50 p-2.5 rounded-xl mb-2.5">
              3. Operating Overheads &amp; Administrative Expenses
            </div>
            <div className="space-y-2 px-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Fleet Regular Servicing, Engine Oil &amp; Tyres</span>
                <span className="font-mono tabular-nums">
                  ₹{pnl.operatingExpenses.vehicleMaintenance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Bhilwara Dispatch Office Staff Salaries</span>
                <span className="font-mono tabular-nums">
                  ₹{pnl.operatingExpenses.staffSalaries.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Office Rent, Electricity &amp; Central Helpline</span>
                <span className="font-mono tabular-nums">
                  ₹{pnl.operatingExpenses.officeRent.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Online Customer Marketing &amp; Travel Promotions</span>
                <span className="font-mono tabular-nums">
                  ₹{pnl.operatingExpenses.marketing.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
                <span>Total Operating Overheads:</span>
                <span className="font-mono tabular-nums">
                  ₹{pnl.operatingExpenses.totalOperatingExpenses.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Net Profit Final */}
          <div className="p-4 bg-slate-950 text-white rounded-xl flex justify-between items-center font-bold text-sm">
            <span>NET BUSINESS PROFIT BEFORE TAX:</span>
            <span className="font-mono text-lg text-emerald-400 tabular-nums">
              ₹{pnl.netProfit.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
