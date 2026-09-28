import React from 'react';
import { Compass, Camera, Utensils, Sun, MapPin, Sparkles } from 'lucide-react';

export const RajasthanGuide: React.FC = () => {
  const highlights = [
    {
      city: 'Jaipur — The Pink City',
      tag: 'Heritage & Shopping',
      desc: 'Famous for Amer Fort hilltop palace, Hawa Mahal honeycombed windows, City Palace museum, and Johari Bazaar gemstone shopping.',
      tips: 'Catch the light and sound show at Amer Fort in the evening; try Pyaaz Kachori at Rawat Mishtan Bhandar.',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
    },
    {
      city: 'Udaipur — The City of Lakes',
      tag: 'Romance & Palaces',
      desc: 'Nestled around Lake Pichola, featuring grand marble palaces, Jagdish Temple, Sajjangarh Monsoon Palace, and peaceful boat cruises.',
      tips: 'Take a boat ride during golden hour sunset from Dudh Talai; enjoy rooftop Mewari dinner overlooking illuminated Lake Palace.',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
    },
    {
      city: 'Jodhpur — The Sun & Blue City',
      tag: 'Forts & Culture',
      desc: 'Dominated by the massive Mehrangarh Fort towering above thousands of sky-blue Brahmin houses and Jaswant Thada marble memorial.',
      tips: 'Explore the narrow blue alleyways of Navchokiya; relish authentic Mirchi Vada and Shahi Samosa near the Clock Tower.',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
    },
    {
      city: 'Jaisalmer — The Golden Oasis',
      tag: 'Desert & Sand Dunes',
      desc: 'The only living fort in India carved from yellow sandstone, ancient Jain temples, and rolling Sam Sand Dunes with camel treks.',
      tips: 'Spend a night under the stars in a desert Swiss tent; visit the mysterious abandoned ghost village of Kuldhara on the way.',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section id="guide" className="py-16 bg-white border-t border-amber-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>Chauffeur Insider Advice</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Rajasthan Traveler Sightseeing Guide
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Our drivers are born and raised in Rajasthan. Here are top recommendations to make the most of your road trip.
          </p>
        </div>

        {/* 4 Major Hubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-2xl overflow-hidden border border-amber-200/60 shadow-xs flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.city}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded shadow">
                  {item.tag}
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">{item.city}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-100">
                  <div className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Chauffeur Tip:
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {item.tips}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Travel Tips Row */}
        <div className="mt-10 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white text-amber-700 shadow-xs shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950">Best Time to Visit</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                October to March offers pleasant daytime temperatures (20°C - 28°C) ideal for fort exploration, desert safaris, and highway road trips.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white text-amber-700 shadow-xs shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950">Monument Photography</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Early morning 08:30 AM to 10:30 AM offers the best soft light and minimal crowds at Amer Fort, Mehrangarh, and City Palaces.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white text-amber-700 shadow-xs shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950">Highway Food Stops</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ask your driver to stop at trusted vegetarian highway dhabas serving fresh Dal Baati Churma, Ker Sangri, and hot clay-pot chai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
