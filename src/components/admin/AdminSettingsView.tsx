import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { Settings, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const [resetDone, setResetDone] = useState(false);
  const [companyName, setCompanyName] = useState('Rajasthan Rides');
  const [tagline, setTagline] = useState('More Than Rides, Beautiful Journeys');
  const [supportPhone, setSupportPhone] = useState('+91 98290 14820');
  const [baseCity, setBaseCity] = useState('Bhilwara, Rajasthan');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleFactoryReset = () => {
    if (window.confirm('Reset all demo data (bookings, expenses, payments, ledger) to factory seeds?')) {
      dataStore.resetToFactory();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 4000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Business Profile &amp; Settings"
        subtitle="Configure agency brand name, support hotline, GSTIN, and database maintenance"
        backLabel="Back to Dashboard"
        backFallback={{ path: '/admin', label: 'Back to Dashboard' }}
      />

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Business settings updated successfully.</span>
        </div>
      )}

      {resetDone && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Demo database restored to factory seed state with 35+ transactions!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Agency / Product Trade Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Brand Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Customer Support Helpline
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registered Head Office
            </label>
            <input
              type="text"
              value={baseCity}
              onChange={(e) => setBaseCity(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
          >
            Save Configuration
          </button>
        </div>
      </form>

      {/* Database Maintenance Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-600" />
          <span>Demo Data Management &amp; Factory Reset</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Restore all seed records (35+ realistic outstation bookings, 10+ drivers, 10+ vehicles, customer ledgers, double-entry general ledger, and balance sheet).
        </p>

        <button
          type="button"
          onClick={handleFactoryReset}
          className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Factory Demo Seed Records</span>
        </button>
      </div>
    </div>
  );
};
