import React, { useState } from 'react';
import { Phone, Shield, Car, Calendar, Menu, X, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenDriverModal: () => void;
  onOpenRepoNotice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenDriverModal,
  onOpenRepoNotice
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Banner Notice for Git Status & Quick Support */}
      <div className="bg-amber-950 text-amber-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-amber-900/60">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-amber-600/30 text-amber-300 font-medium px-2 py-0.5 rounded-full border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Padharo Mhare Desh
            </span>
            <span className="hidden md:inline text-amber-200/90">
              Govt. Approved Rajasthan Tourist Cabs • Fixed Transparent Fares • 24x7 Chauffeur Service
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenRepoNotice}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-white transition-colors underline decoration-dotted"
              title="Click for GitHub repository import details"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">GitHub Sync:</span> Repo Details
            </button>
            <span className="hidden sm:inline text-amber-700">|</span>
            <a
              href="tel:+919829014820"
              className="flex items-center gap-1 text-amber-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+91 98290 14820</span>
            </a>
            <span className="text-amber-700">|</span>
            <button
              onClick={onOpenDriverModal}
              className="text-amber-300 hover:text-amber-100 font-medium transition-colors"
            >
              Attach Taxi
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-bold tracking-tight text-amber-950">
                  Rajasthan<span className="text-amber-600">Taxi</span>
                </span>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                  ROYAL
                </span>
              </div>
              <p className="text-[11px] text-amber-900/70 font-medium leading-none">
                Chauffeur-Driven Heritage &amp; Outstation Cabs
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#booking-engine" className="hover:text-amber-700 transition-colors">
              Book Cab
            </a>
            <a href="#fleet" className="hover:text-amber-700 transition-colors">
              Fleet &amp; Rates
            </a>
            <a href="#packages" className="hover:text-amber-700 transition-colors">
              Tour Packages
            </a>
            <a href="#routes" className="hover:text-amber-700 transition-colors">
              Popular Routes
            </a>
            <a href="#reviews" className="hover:text-amber-700 transition-colors">
              Customer Reviews
            </a>
            <a href="#guide" className="hover:text-amber-700 transition-colors">
              Travel Guide
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://api.whatsapp.com/send?phone=919829014820&text=Namaste!%20I%20would%20like%20to%20inquire%20about%20a%20Rajasthan%20taxi%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-lg shadow-sm shadow-amber-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4 text-amber-200" />
              <span>Book Online</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-amber-50 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-100 bg-amber-50/95 px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-800">
              <a
                href="#booking-engine"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-amber-100"
              >
                Instant Fare Calculator &amp; Booking
              </a>
              <a
                href="#fleet"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-amber-100"
              >
                Our Taxi Fleet (Sedan, SUV, Tempo)
              </a>
              <a
                href="#packages"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-amber-100"
              >
                Rajasthan Tour Packages
              </a>
              <a
                href="#routes"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-amber-100"
              >
                Popular Intercity Routes &amp; Fares
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-amber-100"
              >
                Guest Reviews &amp; Ratings
              </a>
              <a
                href="#guide"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-amber-100"
              >
                Rajasthan Travel &amp; Sightseeing Guide
              </a>
            </div>

            <div className="pt-3 border-t border-amber-200/60 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-2.5 px-4 text-center rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow"
              >
                Book Your Cab Now
              </button>
              <div className="flex gap-2">
                <a
                  href="tel:+919829014820"
                  className="flex-1 py-2 text-center rounded-lg bg-white border border-amber-300 text-amber-900 font-medium text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  Call Support
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDriverModal();
                  }}
                  className="flex-1 py-2 text-center rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-medium text-xs"
                >
                  Attach Taxi
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
