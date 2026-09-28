import React from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { Receipt, AlertCircle, Printer, Car, User } from 'lucide-react';

interface ExpenseDetailsViewProps {
  expenseId: string;
}

export const ExpenseDetailsView: React.FC<ExpenseDetailsViewProps> = ({ expenseId }) => {
  const { navigate } = useNavigation();
  const expense = dataStore.getExpenses().find((e) => e.id === expenseId);

  if (!expense) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Expense Voucher"
          subtitle="Record Not Found"
          backLabel="Back to Expenses"
          backFallback={{ path: '/admin/expenses', label: 'Back to Expenses' }}
        />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Expense #{expenseId} does not exist</h3>
          <p className="text-xs text-slate-500">Please return to the expenses ledger.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title={`Expense Voucher #${expense.id}`}
        subtitle={`Category: ${expense.category} · Recorded on ${expense.expenseDate || expense.date || 'Today'}`}
        backLabel="Back to Expenses"
        backFallback={{ path: '/admin/expenses', label: 'Back to Expenses' }}
        badge={
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border">
            {expense.category}
          </span>
        }
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Voucher</span>
          </button>
        }
      />

      {/* Voucher Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
        <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expense Amount</span>
          <div className="font-serif font-bold text-3xl text-rose-700">
            ₹{expense.amount.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-slate-500">Mode: {expense.paidVia || expense.paymentMode || 'UPI'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Payee / Purpose</span>
            <div className="font-bold text-slate-900 text-sm">{expense.payeeName || expense.title}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Category</span>
            <div className="font-bold text-slate-900 text-sm">{expense.category}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Associated Vehicle</span>
            <div className="font-bold text-slate-900 text-xs">
              {expense.vehicleId ? (
                <button
                  type="button"
                  onClick={() => navigate(`/admin/vehicles/${expense.vehicleId}`)}
                  className="text-amber-800 hover:underline font-mono"
                >
                  {expense.vehicleId}
                </button>
              ) : (
                'General Operational Expense'
              )}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Bill / Receipt #</span>
            <div className="font-mono font-bold text-slate-900 text-xs">
              {expense.billNumber || expense.billReceiptUrl || 'VOUCH-' + expense.id}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
          <span className="font-bold text-slate-900">Notes / Remarks:</span>
          <p>{expense.notes || expense.description || expense.title}</p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Recorded By: {expense.recordedBy}</span>
          <span className="font-mono">Date: {expense.expenseDate || expense.date}</span>
        </div>
      </div>
    </div>
  );
};
