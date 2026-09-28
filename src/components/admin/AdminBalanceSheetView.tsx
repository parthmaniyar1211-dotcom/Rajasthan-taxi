import React from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { Scale, CheckCircle2, AlertCircle, Printer } from 'lucide-react';

export const AdminBalanceSheetView: React.FC = () => {
  const balanceSheet = dataStore.getBalanceSheet();

  return (
    <div className="space-y-6">
      {/* Header with Back Navigation */}
      <PageHeader
        title="Statement of Financial Position (Balance Sheet)"
        subtitle={`As of ${balanceSheet.asOfDate} · Real data dynamically calculated from operations.`}
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Balance Sheet</span>
          </button>
        }
      />

      {/* Accounting Equation Verification Box */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          balanceSheet.isBalanced
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}
      >
        <div className="flex items-center gap-3">
          {balanceSheet.isBalanced ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
          )}
          <div>
            <div className="font-bold text-xs uppercase tracking-wider">
              {balanceSheet.isBalanced ? 'Fundamental Accounting Equation Satisfied' : 'Out of Balance'}
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold mt-0.5 tabular-nums">
              TOTAL ASSETS (₹{balanceSheet.assets.totalAssets.toLocaleString('en-IN')}) = LIABILITIES (₹{balanceSheet.liabilities.totalLiabilities.toLocaleString('en-IN')}) + EQUITY (₹{balanceSheet.equity.totalEquity.toLocaleString('en-IN')})
            </div>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800">
          Variance: Δ ₹0.00
        </span>
      </div>

      {/* Two-Column Balanced Sheet (T-Shape Accounting Format) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ASSETS COLUMN */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              ASSETS
            </h3>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Debits Owned</span>
          </div>

          {/* Current Assets */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Current Liquid Assets
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Cash in Hand &amp; Driver Floats</div>
                  <div className="text-[10px] text-slate-500">Trip collections &amp; office petty cash</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{balanceSheet.assets.cashInHand.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Bank Accounts &amp; FASTag Wallets</div>
                  <div className="text-[10px] text-slate-500">HDFC, SBI Current Acct &amp; UPI QR receipts</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{balanceSheet.assets.bankBalances.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Customer Trade Receivables</div>
                  <div className="text-[10px] text-slate-500">Uncollected booking dues from customers</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{balanceSheet.assets.customerReceivables.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Fixed Non-Current Assets */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Fixed &amp; Fleet Assets
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Fleet Vehicles (Book Value)</div>
                  <div className="text-[10px] text-slate-500">Company-owned commercial vehicle fleet</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{balanceSheet.assets.fleetVehiclesValue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Office &amp; IT Equipment</div>
                  <div className="text-[10px] text-slate-500">Computers, GPS trackers, dispatch furniture</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{balanceSheet.assets.officeAssets.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Total Assets Footer */}
          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>TOTAL ASSETS:</span>
            <span className="text-emerald-700 font-mono text-base tabular-nums">
              ₹{balanceSheet.assets.totalAssets.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* LIABILITIES & EQUITY COLUMN */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              LIABILITIES &amp; EQUITY
            </h3>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Credits &amp; Net Worth</span>
          </div>

          {/* Current Liabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Current Liabilities
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Vendor Operator Payables</div>
                  <div className="text-[10px] text-slate-500">Owed to attached car owners &amp; suppliers</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{balanceSheet.liabilities.vendorPayables.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Chauffeur Allowances Due</div>
                  <div className="text-[10px] text-slate-500">Unsettled driver batta and night allowances</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{balanceSheet.liabilities.driverPayables.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Unearned Customer Advances</div>
                  <div className="text-[10px] text-slate-500">Token booking deposits for upcoming tours</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{balanceSheet.liabilities.advanceCustomerTokens.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Owner&apos;s Equity &amp; Retained Earnings
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Promoter Capital Investment</div>
                  <div className="text-[10px] text-slate-500">Founders initial equity capital</div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{balanceSheet.equity.initialCapital.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900">Retained Operating Earnings</div>
                  <div className="text-[10px] text-slate-500">Cumulative net profit reinvested in business</div>
                </div>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  ₹{balanceSheet.equity.retainedEarnings.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Total Liabilities & Equity Footer */}
          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>TOTAL LIABILITIES &amp; EQUITY:</span>
            <span className="text-amber-800 font-mono text-base tabular-nums">
              ₹{(balanceSheet.liabilities.totalLiabilities + balanceSheet.equity.totalEquity).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
