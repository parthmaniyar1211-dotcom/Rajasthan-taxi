import React, { useState } from 'react';
import { X, CheckCircle, Car, Shield, Phone, MapPin, Send } from 'lucide-react';

interface DriverPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverPartnerModal: React.FC<DriverPartnerModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [carModel, setCarModel] = useState('Toyota Innova Crysta');
  const [carYear, setCarYear] = useState('2023');
  const [commercialPermit, setCommercialPermit] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Attach Your Taxi / Chauffeur Onboarding</h3>
              <p className="text-xs text-amber-200">Join Rajasthan&apos;s Highest Rated Tourist Cab Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Application Received, Partner!</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Ram Ram sa! Our fleet onboarding manager will call <strong>{phone}</strong> within 4 business hours to inspect the vehicle and verify commercial documents.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
              Perks: Weekly direct bank payout, zero commission for first 15 days, and guaranteed outstation return loads!
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-700 shrink-0" />
              <span>We require yellow-plate commercial tourist taxis with active fitness and insurance.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Owner / Driver Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Surendra Singh"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Primary Operating City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                >
                  <option value="Jaipur">Jaipur</option>
                  <option value="Udaipur">Udaipur</option>
                  <option value="Jodhpur">Jodhpur</option>
                  <option value="Jaisalmer">Jaisalmer</option>
                  <option value="Bikaner">Bikaner</option>
                  <option value="Ajmer / Pushkar">Ajmer / Pushkar</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Vehicle Model *</label>
                <select
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                >
                  <option value="Toyota Innova Crysta">Toyota Innova Crysta</option>
                  <option value="Maruti Suzuki Ertiga">Maruti Suzuki Ertiga</option>
                  <option value="Maruti Dzire">Maruti Dzire</option>
                  <option value="Toyota Etios">Toyota Etios</option>
                  <option value="Honda City">Honda City</option>
                  <option value="Toyota Fortuner">Toyota Fortuner</option>
                  <option value="Force Tempo Traveller">Force Tempo Traveller (12-26 Seats)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Manufacturing Year</label>
                <input
                  type="text"
                  value={carYear}
                  onChange={(e) => setCarYear(e.target.value)}
                  placeholder="e.g. 2022 / 2023 / 2024"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={commercialPermit}
                    onChange={(e) => setCommercialPermit(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Has All-India / All-Rajasthan Tourist Permit</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Partner Application</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
