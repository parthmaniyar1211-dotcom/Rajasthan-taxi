import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { LedgerEntry } from '../../types/rrTypes';
import { PageHeader } from '../common/PageHeader';
import {
  FileSpreadsheet,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  FileText,
  CheckCircle2
} from 'lucide-react';

export const AdminAccountsLedgerView: React.FC = () => {
  const [accountFilter, setAccountFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);

  const ledger = dataStore.getGeneralLedger();

  const filtered = ledger.filter(item => {
    const matchesAccount = accountFilter === 'ALL' || item.account === accountFilter;
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceReferenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.partyName && item.partyName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesAccount && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header with Back Navigation */}
      <PageHeader
        title="Double-Entry Accounts &amp; General Ledger"
        subtitle="Real-time auditable financial transaction stream powering Balance Sheet & Profit & Loss"
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
        actions={
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export Ledger</span>
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
            placeholder="Search description, source ref (#RR-1001, #TXN-2001) or party..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl outline-none"
          />
        </div>

        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="p-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-700"
        >
          <option value="ALL">All Ledger Accounts</option>
          <option value="BANK">Bank Account</option>
          <option value="CASH">Cash in Hand</option>
          <option value="ACCOUNTS_RECEIVABLE">Accounts Receivable (Customers)</option>
          <option value="ACCOUNTS_PAYABLE">Accounts Payable (Drivers/Vendors)</option>
          <option value="REVENUE">Revenue</option>
          <option value="EXPENSE">Expense</option>
          <option value="EQUITY">Owner Equity</option>
        </select>
      </div>

      {/* Traceability Callout */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
        <div>
          <span className="font-bold">100% Financial Traceability:</span> Every entry links to its source booking ticket, expense voucher, or bank settlement. Click any entry to inspect its provenance.
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Account</th>
                <th className="p-3.5">Source Ref</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Party / Category</th>
                <th className="p-3.5 text-right">Debit (Dr)</th>
                <th className="p-3.5 text-right">Credit (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {filtered.map((entry) => (
                <tr
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="hover:bg-slate-50 transition cursor-pointer"
                >
                  <td className="p-3.5 font-sans font-medium text-slate-900">{entry.date}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-sans">
                      {entry.account.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-amber-800 underline decoration-dotted">
                    {entry.sourceReferenceId}
                  </td>
                  <td className="p-3.5 font-sans text-slate-800 max-w-xs truncate">
                    {entry.description}
                  </td>
                  <td className="p-3.5 font-sans text-slate-500">
                    {entry.partyName || '-'}
                  </td>
                  <td className="p-3.5 text-right font-bold text-emerald-700">
                    {entry.type === 'DEBIT' ? `₹${entry.amount.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="p-3.5 text-right font-bold text-rose-700">
                    {entry.type === 'CREDIT' ? `₹${entry.amount.toLocaleString('en-IN')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provenance Inspection Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Transaction Traceability Provenance
                </h3>
                <p className="text-xs text-slate-500">Entry ID: {selectedEntry.id}</p>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Source Reference</div>
                <div className="text-base font-bold text-amber-800 font-mono">{selectedEntry.sourceReferenceId}</div>
                <div className="text-slate-600">Type: {selectedEntry.sourceType}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Accounting Entry</div>
                <div className="text-slate-800 font-bold">
                  {selectedEntry.type === 'DEBIT' ? 'DEBIT (Dr)' : 'CREDIT (Cr)'} ₹{selectedEntry.amount.toLocaleString('en-IN')}
                </div>
                <div className="text-slate-600">Target Account: {selectedEntry.account}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Business Context</div>
                <div className="text-slate-800">{selectedEntry.description}</div>
                <div className="text-slate-500">Date recorded: {selectedEntry.date}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-5 py-2 bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
