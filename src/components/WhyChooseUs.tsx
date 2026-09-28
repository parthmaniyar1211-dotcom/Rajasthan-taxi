import React, { useState } from 'react';
import { CUSTOMER_REVIEWS, FAQS } from '../data/taxiData';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  HeartHandshake,
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-16">
      {/* Why Choose Rajasthan Taxi Section */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50/50 border-t border-amber-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Royal Hospitality Guarantee</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Why 25,000+ Travelers Choose Rajasthan Taxi
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              We bring the timeless royal warmth of Rajasthan to every highway kilometer with spotless cars and polite chauffeurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">Police-Verified Chauffeurs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every driver is background-verified, uniform-clad, non-smoking, and trained in courteous hospitality with local language skills.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">Zero Surge &amp; Fixed Fares</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                What you see is what you pay. No sudden price hikes during festivals, wedding season, or monsoons. Transparent GST invoices.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">100% On-Time Pickup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your driver arrives 15 minutes before scheduled departure time at your hotel, home, or airport terminal. Guaranteed cab replacement in rare delays.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">24x7 Rajasthan Trip Assist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live round-the-clock telephone and WhatsApp helpline to assist you with route changes, hotel coordination, and emergency roadside backup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews & Testimonials */}
      <section id="reviews" className="py-16 bg-white border-t border-amber-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>4.9 / 5 Star Traveler Rating</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Stories From Our Happy Travelers
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Read how couples, families, and international explorers experienced the magic of Rajasthan with our chauffeur service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMER_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-5 bg-stone-50 rounded-2xl border border-amber-200/60 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-100">
                  <div className="text-xs font-bold text-slate-900">{review.name}</div>
                  <div className="text-[11px] text-slate-500">{review.city}</div>
                  <div className="text-[10px] text-amber-800 font-medium mt-1 truncate">
                    {review.route}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-stone-50 border-t border-amber-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Everything you need to know about booking, outstation rules, and chauffeur allowances in Rajasthan.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-amber-200/80 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-800 hover:text-amber-800 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
