import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { FileText, Printer, Download, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ReportDetailsViewProps {
  reportId: string;
}

export const ReportDetailsView: React.FC<ReportDetailsViewProps> = ({ reportId }) => {
  const { navigate } = useNavigation();
  const [period, setPeriod] = useState<'MONTH' | 'QUARTER' | 'YEAR'>('MONTH');

  const pnl = dataStore.getProfitAndLoss();
  const bookings = dataStore.getBookings();

  const reportTitle =
    reportId === 'fleet-utilization'
      ? 'Fleet Vehicle Utilization & Revenue Matrix'
      : reportId === 'driver-settlement'
      ? 'Chauffeur Bata & Driver Payout Audit'
      : reportId === 'route-profitability'
      ? 'Intercity Outstation Route Profitability Report'
      : 'Comprehensive Business Performance Audit';

  const handleDownloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Period,TotalRevenue,FuelExpense,NetProfit\n' +
      `${pnl.period},${pnl.revenues.totalRevenue},${pnl.expenses.fuel},${pnl.netProfit}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportId}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={reportTitle}
        subtitle={`Report ID: ${reportId} · Accounting Period: ${pnl.period} · Standard Indian GAAP Format`}
        backLabel="Back to Reports"
        backFallback={{ path: '/admin/reports', label: 'Back to Reports' }}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Period Revenue</span>
          <div className="font-bold font-mono text-xl text-emerald-700 mt-1">
            ₹{pnl.revenues.totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Direct Operating Costs</span>
          <div className="font-bold font-mono text-xl text-rose-700 mt-1">
            ₹{pnl.expenses.totalExpenses.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Operating Profit</span>
          <div className="font-bold font-mono text-xl text-amber-800 mt-1">
            ₹{pnl.netProfit.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Margin</span>
          <div className="font-bold font-mono text-xl text-slate-900 mt-1">
            {pnl.netMarginPercentage ?? pnl.profitMarginPercent}%
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
          Route Performance &amp; Trip Volume
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Route Segment</th>
                <th className="p-3">Completed Trips</th>
                <th className="p-3">Gross Billed</th>
                <th className="p-3">Fuel &amp; Tolls Est.</th>
                <th className="p-3">Net Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              <tr className="hover:bg-slate-50 transition">
                <td className="p-3 font-sans font-bold text-slate-900">Bhilwara ➔ Ahmedabad (410 km)</td>
                <td className="p-3">18 Trips</td>
                <td className="p-3 text-slate-900 font-bold">₹1,14,000</td>
                <td className="p-3 text-rose-700">₹44,000</td>
                <td className="p-3 text-emerald-700 font-bold">₹70,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-3 font-sans font-bold text-slate-900">Bhilwara ➔ Delhi (515 km)</td>
                <td className="p-3">12 Trips</td>
                <td className="p-3 text-slate-900 font-bold">₹98,000</td>
                <td className="p-3 text-rose-700">₹39,000</td>
                <td className="p-3 text-emerald-700 font-bold">₹59,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-3 font-sans font-bold text-slate-900">Jaipur ➔ Udaipur ➔ Jodhpur Circuit</td>
                <td className="p-3">8 Tour Groups</td>
                <td className="p-3 text-slate-900 font-bold">₹2,80,000</td>
                <td className="p-3 text-rose-700">₹1,02,000</td>
                <td className="p-3 text-emerald-700 font-bold">₹1,78,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
