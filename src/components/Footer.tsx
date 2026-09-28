import React from 'react';
import { Car, Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles, MessageCircle } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenDriverModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenDriverModal }) => {
  return (
    <footer className="bg-amber-950 text-amber-100 border-t border-amber-900/60 pt-16 pb-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  Rajasthan<span className="text-amber-400">Taxi</span>
                </span>
                <span className="text-[10px] ml-1.5 font-semibold bg-amber-800 text-amber-200 px-1.5 py-0.5 rounded">
                  ROYAL
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-200/80 leading-relaxed max-w-sm">
              Rajasthan&apos;s premier tourist taxi and heritage car rental network. Providing spotless, air-conditioned sedans, SUVs, and luxury tempo travellers with courteous, experienced local chauffeurs across Jaipur, Udaipur, Jodhpur, Jaisalmer, and all royal circuits.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 bg-amber-900/60 text-amber-300 px-2.5 py-1 rounded-full border border-amber-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Govt. Commercial Permit
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-900/60 text-amber-300 px-2.5 py-1 rounded-full border border-amber-700/50">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Padharo Mhare Desh
              </span>
            </div>
          </div>

          {/* Major Operating Hubs */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider">
              Rajasthan Hubs
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-200/80">
              <li><a href="#booking-engine" className="hover:text-white transition">Jaipur Taxi Service</a></li>
              <li><a href="#booking-engine" className="hover:text-white transition">Udaipur Lake City Cabs</a></li>
              <li><a href="#booking-engine" className="hover:text-white transition">Jodhpur Blue City Taxi</a></li>
              <li><a href="#booking-engine" className="hover:text-white transition">Jaisalmer Desert Safari Cabs</a></li>
              <li><a href="#booking-engine" className="hover:text-white transition">Pushkar &amp; Ajmer Transfers</a></li>
              <li><a href="#booking-engine" className="hover:text-white transition">Mount Abu Hill Station</a></li>
              <li><a href="#booking-engine" className="hover:text-white transition">Ranthambore Tiger Safari</a></li>
            </ul>
          </div>

          {/* Quick Links & Services */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider">
              Cab Services
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-200/80">
              <li><a href="#fleet" className="hover:text-white transition">Innova Crysta Rental</a></li>
              <li><a href="#fleet" className="hover:text-white transition">Swift Dzire &amp; Etios</a></li>
              <li><a href="#fleet" className="hover:text-white transition">Tempo Traveller 12-17 Seater</a></li>
              <li><a href="#packages" className="hover:text-white transition">Golden Triangle Tour</a></li>
              <li><a href="#packages" className="hover:text-white transition">Royal Heritage 7D/6N</a></li>
              <li>
                <button
                  onClick={onOpenDriverModal}
                  className="text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Attach Taxi / Driver Partner
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & 24x7 Helpline */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider">
              24x7 Help Desk
            </h4>
            <div className="space-y-2 text-xs text-amber-200/90">
              <a
                href="tel:+919829014820"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98290 14820</span>
              </a>

              <a
                href="https://api.whatsapp.com/send?phone=919829014820"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition text-emerald-300"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Instant Support</span>
              </a>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>bookings@rajasthantaxi.in</span>
              </div>

              <div className="flex items-start gap-2 pt-1 text-amber-300/80">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Station Road, Near Sindhi Camp, Jaipur, Rajasthan 302001</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition text-center"
              >
                Book Your Cab Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-300/70">
          <p>© {new Date().getFullYear()} Rajasthan Taxi &amp; Royal Tour Services. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#guide" className="hover:text-white">Travel Advice</a>
            <span className="text-amber-800">•</span>
            <a href="#reviews" className="hover:text-white">Customer Reviews</a>
            <span className="text-amber-800">•</span>
            <a href="#routes" className="hover:text-white">Intercity Tariffs</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
