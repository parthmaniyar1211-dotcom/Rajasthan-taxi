import React from 'react';
import { ArrowRight, ShieldCheck, Compass } from 'lucide-react';

interface SplashScreenProps {
  onContinue: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between items-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Unboxed Metadata */}
      <div className="z-10 pt-4 flex items-center gap-2 text-xs text-amber-300/80 font-medium">
        <span>Rajasthan Commercial Cab Network</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>Padharo Mhare Desh</span>
      </div>

      {/* Center Hero Identity */}
      <div className="z-10 text-center max-w-sm flex flex-col items-center">
        {/* Royal Crest Emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center shadow-xl p-1">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center p-2">
              <span className="font-serif text-2xl font-black tracking-tight text-amber-300">
                RR
              </span>
              <span className="text-[8px] font-bold text-amber-400 tracking-widest uppercase">
                RAJASTHAN
              </span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 rounded-full p-1.5 shadow-md">
            <Compass className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Rajasthan <span className="text-amber-400">Rides</span>
        </h1>

        {/* Tagline */}
        <p className="mt-2 text-base font-serif italic text-amber-200/90 font-medium">
          &ldquo;More Than Rides, Beautiful Journeys&rdquo;
        </p>

        {/* Description */}
        <p className="mt-3 text-xs text-slate-400 leading-relaxed max-w-xs">
          Outstation taxis, Bhilwara highway corridors, curated heritage tour packages, and private chauffeur-driven road trips.
        </p>

        {/* Highlights - Zero Pill unboxed typography */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Verified Chauffeurs</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Zero Surge Guarantee</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>AC Commercial Fleet</span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="z-10 w-full max-w-xs space-y-3">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
        >
          <span>Begin Your Journey</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>

        <p className="text-[10px] text-center text-slate-500">
          Govt. Registered Tourist Cab Operator · Headquartered in Bhilwara
        </p>
      </div>
    </div>
  );
};
