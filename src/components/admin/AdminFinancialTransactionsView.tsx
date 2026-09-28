import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { PaymentTransaction, BusinessExpense, ExpenseCategory, PaymentMethod } from '../../types/rrTypes';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { CreditCard, Receipt, Plus, Search, Filter, X, Eye } from 'lucide-react';

export const AdminFinancialTransactionsView: React.FC<{ type: 'PAYMENTS' | 'EXPENSES' }> = ({ type }) => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // New Expense Form State
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('FUEL');
  const [expAmount, setExpAmount] = useState(1500);
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expMethod, setExpMethod] = useState<PaymentMethod>('UPI');
  const [expNotes, setExpNotes] = useState('');

  const payments = dataStore.getPayments();
  const expenses = dataStore.getExpenses();

  if (type === 'PAYMENTS') {
    const filteredPayments = payments.filter(p =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fromParty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.toParty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <PageHeader
          title="Payment Transactions &amp; Receipts"
          subtitle="All customer trip receipts, driver advances, and vendor fleet settlements"
          backLabel="Back to Dashboard"
          backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
        />

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by transaction ID, payer, payee, or reference number..."
            className="w-full max-w-sm px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Txn ID</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Payer (From)</th>
                  <th className="p-3.5">Payee (To)</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Method &amp; Ref</th>
                  <th className="p-3.5">Booking Link</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-3.5">{p.paymentDate}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.type === 'CUSTOMER_PAYMENT' || p.type === 'ADVANCE'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-purple-50 text-purple-800'
                      }`}>
                        {p.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">{p.fromParty}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{p.toParty}</td>
                    <td className="p-3.5 font-bold font-mono text-amber-800">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{p.method}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.referenceNumber}</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">{p.bookingId || 'General'}</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/payments/${p.id}`)}
                        className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // EXPENSES
  const filteredExpenses = expenses.filter(e =>
    e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.recordExpense({
      title: expTitle,
      category: expCategory,
      amount: Number(expAmount),
      expenseDate: expDate,
      paidVia: expMethod,
      notes: expNotes,
      recordedBy: dataStore.getCurrentUser().name
    });
    setIsAddExpenseOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Operating Expense Tracker"
        subtitle="Fuel bills, FASTag tolls, driver food allowance, maintenance and office overheads"
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
        actions={
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Expense</span>
          </button>
        }
      />

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search expenses by category or title..."
          className="w-full max-w-sm px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Expense ID</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Paid Via</th>
                <th className="p-3.5">Recorded By</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredExpenses.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{e.id}</td>
                  <td className="p-3.5">{e.expenseDate}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {e.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900">{e.title}</td>
                  <td className="p-3.5 font-bold font-mono text-rose-700">
                    ₹{e.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5">{e.paidVia}</td>
                  <td className="p-3.5 text-slate-500">{e.recordedBy}</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/expenses/${e.id}`)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Voucher</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">Record Business Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expense Title / Description *</label>
                <input
                  type="text"
                  required
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="e.g. Diesel fuel bill for Bhilwara-Ahmedabad trip"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="FUEL">FUEL</option>
                    <option value="TOLL">TOLL / FASTAG</option>
                    <option value="DRIVER_ALLOWANCE">DRIVER ALLOWANCE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="PERMIT_TAX">PERMIT / TAX</option>
                    <option value="OFFICE_RENT">OFFICE RENT</option>
                    <option value="SALARY">STAFF SALARY</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="MISC">MISC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={expMethod}
                    onChange={(e) => setExpMethod(e.target.value as PaymentMethod)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CASH">CASH</option>
                    <option value="BANK_TRANSFER">BANK TRANSFER</option>
                    <option value="CARD">CARD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Reference / Notes</label>
                <input
                  type="text"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  placeholder="e.g. Pump Receipt #49102"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Business Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
