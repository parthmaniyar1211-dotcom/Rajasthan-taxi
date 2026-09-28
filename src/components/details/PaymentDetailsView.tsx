import React from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { CreditCard, CheckCircle2, AlertCircle, Printer, ArrowRight, User } from 'lucide-react';

interface PaymentDetailsViewProps {
  paymentId: string;
}

export const PaymentDetailsView: React.FC<PaymentDetailsViewProps> = ({ paymentId }) => {
  const { navigate } = useNavigation();
  const payment = dataStore.getPayments().find((p) => p.id === paymentId);

  if (!payment) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Payment Details"
          subtitle="Transaction Not Found"
          backLabel="Back to Payments"
          backFallback={{ path: '/admin/payments', label: 'Back to Payments' }}
        />
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Payment #{paymentId} does not exist</h3>
          <p className="text-xs text-slate-500">Please return to the payments transactions ledger.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title={`Payment Receipt #${payment.id}`}
        subtitle={`Transaction Ref: ${payment.referenceNumber} · Date: ${payment.paymentDate}`}
        backLabel="Back to Payments"
        backFallback={{ path: '/admin/payments', label: 'Back to Payments' }}
        badge={
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              payment.status === 'SUCCESS'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {payment.status}
          </span>
        }
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        }
      />

      {/* Receipt Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
        <div className="text-center pb-6 border-b border-slate-200 space-y-1">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-serif font-black text-xl mx-auto mb-2">
            RR
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-900">Official Payment Receipt</h2>
          <p className="text-xs text-slate-500 font-mono">Rajasthan Rides Taxi &amp; Tours Pvt. Ltd.</p>
        </div>

        <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Amount Paid</span>
          <div className="font-serif font-bold text-3xl text-emerald-700">
            ₹{payment.amount.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-slate-500">Method: {payment.method}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Payer / Customer</span>
            <div className="font-bold text-slate-900 text-sm">{payment.fromParty}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Beneficiary / Merchant</span>
            <div className="font-bold text-slate-900 text-sm">{payment.toParty}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">UTR / Bank Reference #</span>
            <div className="font-mono font-bold text-slate-900 text-xs">{payment.referenceNumber}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Linked Booking</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-amber-800">{payment.bookingId || 'Direct Invoice'}</span>
              {payment.bookingId && (
                <button
                  type="button"
                  onClick={() => navigate(`/admin/bookings/${payment.bookingId}`)}
                  className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1"
                >
                  <span>View Trip</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {payment.notes && (
          <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-950">
            <span className="font-bold">Transaction Note:</span> {payment.notes}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Recorded By: {payment.recordedBy}</span>
          <span className="font-mono">Timestamp: {payment.paymentDate}</span>
        </div>
      </div>
    </div>
  );
};
