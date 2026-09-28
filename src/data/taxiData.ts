import { Vehicle, PopularRoute, TourPackage, CustomerReview } from '../types/taxi';

export const RAJASTHAN_CITIES = [
  'Jaipur',
  'Udaipur',
  'Jodhpur',
  'Jaisalmer',
  'Pushkar',
  'Ajmer',
  'Bikaner',
  'Mount Abu',
  'Ranthambore (Sawai Madhopur)',
  'Chittorgarh',
  'Kumbhalgarh',
  'Mandawa (Shekhawati)',
  'Alwar (Sariska)',
  'Bharatpur',
  'Delhi NCR',
  'Agra',
  'Ahmedabad'
];

export const AIRPORTS_AND_STATIONS = [
  { name: 'Jaipur International Airport (JAI)', city: 'Jaipur' },
  { name: 'Jaipur Junction Railway Station', city: 'Jaipur' },
  { name: 'Udaipur Maharana Pratap Airport (UDR)', city: 'Udaipur' },
  { name: 'Udaipur City Railway Station', city: 'Udaipur' },
  { name: 'Jodhpur Civil Airport (JDH)', city: 'Jodhpur' },
  { name: 'Jodhpur Junction Railway Station', city: 'Jodhpur' },
  { name: 'Jaisalmer Airport (JSA)', city: 'Jaisalmer' },
  { name: 'Delhi IGI Airport (DEL)', city: 'Delhi NCR' },
];

export const VEHICLE_FLEET: Vehicle[] = [
  {
    id: 'sedan-prime',
    name: 'Swift Dzire / Etios',
    category: 'Sedan',
    models: 'Maruti Suzuki Dzire or Toyota Etios',
    passengers: 4,
    luggage: 2,
    ratePerKm: 11,
    minKmPerDay: 250,
    driverAllowancePerDay: 350,
    local4hrRate: 1200,
    local8hrRate: 2000,
    local12hrRate: 2800,
    features: ['Chilled AC', 'Clean Seat Covers', 'Luggage Carrier', 'Mobile Charging', 'Music System', 'Mineral Water'],
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    popular: true
  },
  {
    id: 'sedan-exec',
    name: 'Honda City / Ciaz',
    category: 'Executive',
    models: 'Honda City or Maruti Ciaz',
    passengers: 4,
    luggage: 3,
    ratePerKm: 14,
    minKmPerDay: 250,
    driverAllowancePerDay: 400,
    local4hrRate: 1600,
    local8hrRate: 2600,
    local12hrRate: 3600,
    features: ['Extra Legroom', 'Rear AC Vents', 'Smooth Suspension', 'Complimentary Bottled Water', 'Toll FASTag'],
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'suv-ertiga',
    name: 'Maruti Ertiga Hybrid',
    category: 'SUV',
    models: 'Maruti Suzuki Ertiga Smart Hybrid',
    passengers: 6,
    luggage: 3,
    ratePerKm: 15,
    minKmPerDay: 250,
    driverAllowancePerDay: 400,
    local4hrRate: 1700,
    local8hrRate: 2800,
    local12hrRate: 3900,
    features: ['Roof Mounted AC', 'Ample Boot Space', 'Comfortable 6-Seater', 'Great for Families', 'FASTag Enabled'],
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'suv-innova',
    name: 'Innova Crysta Royal',
    category: 'SUV',
    models: 'Toyota Innova Crysta (Captain Seats)',
    passengers: 7,
    luggage: 4,
    ratePerKm: 19,
    minKmPerDay: 250,
    driverAllowancePerDay: 500,
    local4hrRate: 2200,
    local8hrRate: 3500,
    local12hrRate: 4800,
    features: ['Plush Recliner Captain Seats', 'Individual Climate AC', 'Smooth Highway Ride', 'Spacious Luggage Bay', 'Professional Chauffeur in Uniform'],
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    popular: true
  },
  {
    id: 'vip-fortuner',
    name: 'Toyota Fortuner 4x4 VIP',
    category: 'Luxury',
    models: 'Toyota Fortuner 4x4 Luxury Edition',
    passengers: 6,
    luggage: 4,
    ratePerKm: 38,
    minKmPerDay: 250,
    driverAllowancePerDay: 800,
    local4hrRate: 5000,
    local8hrRate: 8500,
    local12hrRate: 12000,
    features: ['VIP Royal Presence', 'Leather Upholstery', 'Desert Dune Capability', 'High Security', 'English Chauffeur'],
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tempo-12',
    name: 'Force Urbania / Tempo Traveller',
    category: 'Tempo',
    models: 'Force Tempo Traveller (12 to 17 Luxury Reclining Seats)',
    passengers: 12,
    luggage: 10,
    ratePerKm: 26,
    minKmPerDay: 300,
    driverAllowancePerDay: 600,
    local4hrRate: 3500,
    local8hrRate: 5500,
    local12hrRate: 7500,
    features: ['Push-back Luxury Seats', 'Surround Sound & LED TV', 'Huge Rear Luggage Trunk', 'Individual AC Vents', 'Ideal for Extended Family Tours'],
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
  }
];

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'jai-udr',
    from: 'Jaipur',
    to: 'Udaipur',
    distanceKm: 395,
    durationHours: '6.5 hrs',
    sedanFare: 4899,
    suvFare: 6999,
    popularFor: 'Palaces & Lake City',
    highlights: ['Kishangarh Marble Dump view', 'Ajmer bypass', 'Nathdwara Shrinathji enroute', 'Chittorgarh Fort detour available']
  },
  {
    id: 'jai-jdh',
    from: 'Jaipur',
    to: 'Jodhpur',
    distanceKm: 335,
    durationHours: '5.5 hrs',
    sedanFare: 4299,
    suvFare: 5999,
    popularFor: 'Blue City & Mehrangarh',
    highlights: ['Smooth NH48 & NH25 Expressways', 'Ajmer & Pushkar stopover option', 'Authentic highway dhabas']
  },
  {
    id: 'jdh-jsm',
    from: 'Jodhpur',
    to: 'Jaisalmer',
    distanceKm: 285,
    durationHours: '4.5 hrs',
    sedanFare: 3699,
    suvFare: 5299,
    popularFor: 'Golden City & Thar Desert',
    highlights: ['Pokhran Heritage Fort', 'Scenic Desert Highway with windmills', 'Direct transfer to Sam Sand Dunes camp']
  },
  {
    id: 'jai-del',
    from: 'Jaipur',
    to: 'Delhi NCR',
    distanceKm: 260,
    durationHours: '3.5 hrs',
    sedanFare: 3299,
    suvFare: 4799,
    popularFor: 'Capital Express Transit',
    highlights: ['New Delhi-Mumbai Expressway', 'Door-to-door IGI Airport transfer', 'Zero waiting charges at terminals']
  },
  {
    id: 'udr-abu',
    from: 'Udaipur',
    to: 'Mount Abu',
    distanceKm: 165,
    durationHours: '3.5 hrs',
    sedanFare: 2699,
    suvFare: 3899,
    popularFor: 'Hill Station & Dilwara Temples',
    highlights: ['Picturesque Aravalli mountain ghats', 'Nakki Lake drop', 'Sunset Point visit']
  },
  {
    id: 'jai-rth',
    from: 'Jaipur',
    to: 'Ranthambore (Sawai Madhopur)',
    distanceKm: 160,
    durationHours: '3 hrs',
    sedanFare: 2499,
    suvFare: 3599,
    popularFor: 'Tiger Safari Expedition',
    highlights: ['Safari gate timely drop', 'Lush countryside view', 'Pickup right from Jaipur hotels/airport']
  },
  {
    id: 'jai-psk',
    from: 'Jaipur',
    to: 'Pushkar',
    distanceKm: 145,
    durationHours: '2.5 hrs',
    sedanFare: 2299,
    suvFare: 3299,
    popularFor: 'Holy Lake & Brahma Temple',
    highlights: ['Ajmer Sharif Dargah visit en route', 'Pushkar Camel Ghats', 'Same-day return option available']
  },
  {
    id: 'udr-jdh',
    from: 'Udaipur',
    to: 'Jodhpur',
    distanceKm: 260,
    durationHours: '5 hrs',
    sedanFare: 3599,
    suvFare: 4999,
    popularFor: 'Ranakpur Jain Temple Trail',
    highlights: ['World-famous 1444 carved marble pillars at Ranakpur', 'Kumbhalgarh Fort diversion', 'Scenic Aravali pass']
  }
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-royal-rajasthan',
    title: 'Royal Rajasthan Grand Odyssey',
    tagline: 'Jaipur • Jodhpur • Udaipur Heritage Circuit',
    duration: '7 Days / 6 Nights',
    cities: ['Jaipur', 'Pushkar', 'Jodhpur', 'Udaipur'],
    startingFareSedan: 22500,
    startingFareSuv: 31000,
    badge: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    inclusions: [
      'Dedicated Chauffeur & AC Vehicle for entire 7 days',
      'All toll taxes, state tourist permits & parking charges',
      'Driver lodging, food & night allowance',
      'Doorstep pickup from Jaipur and drop at Udaipur (or vice-versa)',
      'Complimentary bottled water each day'
    ],
    exclusions: ['Hotel stays (can be added on request)', 'Monument entry fees & camera tickets', 'Personal meals and shopping'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Pink City Jaipur',
        description: 'Chauffeur pickup from airport/railway station. Check into hotel, explore colorful Johari Bazaar and Birla Temple.',
        activities: ['City Palace preview', 'Hawa Mahal exterior photoshoot', 'Chokhi Dhani ethnic village dinner'],
        stayCity: 'Jaipur'
      },
      {
        day: 2,
        title: 'Jaipur Forts & Palaces',
        description: 'Full day sightseeing covering the grand Amer Fort on the hillside with panoramic views.',
        activities: ['Amer Fort & Sheesh Mahal', 'Jaigarh Fort (World’s largest cannon)', 'Nahargarh Fort sunset overlooking Pink City', 'Jal Mahal lake view'],
        stayCity: 'Jaipur'
      },
      {
        day: 3,
        title: 'Jaipur to Jodhpur via Holy Pushkar',
        description: 'Drive across the heart of Rajasthan with a spiritual stop in Pushkar.',
        activities: ['Visit World’s only Lord Brahma Temple', 'Sacred Pushkar Holy Sarovar Ghats', 'Drive to Blue City Jodhpur'],
        stayCity: 'Jodhpur'
      },
      {
        day: 4,
        title: 'Jodhpur Blue City Exploration',
        description: 'Discover the mighty Mehrangarh Fort towering 400 feet above the indigo-blue homes.',
        activities: ['Mehrangarh Fort museum & ramparts', 'Jaswant Thada white marble cenotaph', 'Umaid Bhawan Palace & clock tower market'],
        stayCity: 'Jodhpur'
      },
      {
        day: 5,
        title: 'Jodhpur to Udaipur via Ranakpur',
        description: 'Scenic journey through the lush Aravalli hills stopping at the architectural wonder of Ranakpur.',
        activities: ['Ranakpur 15th-century marble temple', 'Lunch at forest retreat', 'Evening arrival at City of Lakes Udaipur'],
        stayCity: 'Udaipur'
      },
      {
        day: 6,
        title: 'Udaipur Lake Romance & Grand Palaces',
        description: 'Soak in the Venice of the East with majestic palace complexes and tranquil lake cruises.',
        activities: ['City Palace complex & Crystal Gallery', 'Jagdish Temple', 'Boat ride around Lake Pichola & Jag Mandir', 'Saheliyon ki Bari gardens'],
        stayCity: 'Udaipur'
      },
      {
        day: 7,
        title: 'Monsoon Palace & Departure',
        description: 'Visit Sajjangarh Monsoon Palace with panoramic vistas, shopping for Mewari handicrafts, and drop to Udaipur Airport.',
        activities: ['Sajjangarh Palace', 'Fateh Sagar Lake promenade', 'Transfer to UDR airport or railway station'],
        stayCity: 'Udaipur'
      }
    ]
  },
  {
    id: 'pkg-thar-desert',
    title: 'Thar Desert Safari & Golden Jaisalmer',
    tagline: 'Jodhpur • Jaisalmer Sam Sand Dunes Camp',
    duration: '4 Days / 3 Nights',
    cities: ['Jodhpur', 'Pokhran', 'Jaisalmer', 'Sam Dunes'],
    startingFareSedan: 14500,
    startingFareSuv: 19800,
    badge: 'Desert Special',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    inclusions: [
      'Private AC Cab for 4 full days with seasoned desert chauffeur',
      'All interstate/district permits, tolls, and parking',
      'Driver allowances included',
      'Drop directly at your luxury Swiss Tent in Sam Dunes',
      'Sunset dune transfer & sunrise assistance'
    ],
    exclusions: ['Camel safari / Jeep dune bashing tickets', 'Monument tickets', 'Personal expenses'],
    itinerary: [
      {
        day: 1,
        title: 'Jodhpur Arrival & Sightseeing',
        description: 'Chauffeur pickup in Jodhpur, explore Mehrangarh Fort and Jaswant Thada.',
        activities: ['Mehrangarh Fort', 'Clock Tower Spice Market', 'Traditional Rajasthani dinner'],
        stayCity: 'Jodhpur'
      },
      {
        day: 2,
        title: 'Scenic Desert Drive to Jaisalmer',
        description: 'Drive through Thar desert passing windmills and ancient oasis towns.',
        activities: ['Pokhran Fort stop', 'Jaisalmer War Museum', 'Evening view of the Golden Living Fort'],
        stayCity: 'Jaisalmer'
      },
      {
        day: 3,
        title: 'Golden Fort & Sam Sand Dunes Sunset',
        description: 'Explore the living Sonar Qila, Patwon ki Haveli, and head to desert dunes.',
        activities: ['Jaisalmer Fort & Jain temples', 'Patwon ki Haveli intricate jharokhas', 'Camel safari on Sam Dunes', 'Folk dance & bonfire night'],
        stayCity: 'Sam Sand Dunes'
      },
      {
        day: 4,
        title: 'Kuldhara Ghost Village & Departure',
        description: 'Visit the haunting 13th-century abandoned village of Kuldhara and return transfer.',
        activities: ['Kuldhara ruins', 'Gadisar Lake', 'Drop to Jaisalmer or Jodhpur airport/station'],
        stayCity: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-golden-triangle',
    title: 'Golden Triangle & Ranthambore Tiger Trail',
    tagline: 'Delhi • Agra (Taj Mahal) • Jaipur • Ranthambore',
    duration: '5 Days / 4 Nights',
    cities: ['Delhi', 'Agra', 'Ranthambore', 'Jaipur'],
    startingFareSedan: 17800,
    startingFareSuv: 24500,
    badge: 'Wildlife & Wonder',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    inclusions: [
      'Dedicated AC Sedan / SUV for 5 days',
      'Yamuna & Mumbai Expressways tolls included',
      'Pickup in Delhi and drop in Jaipur or Delhi',
      'Driver night allowances included'
    ],
    exclusions: ['Tiger safari canter/gypsy booking', 'Taj Mahal monument entry', 'Hotel accommodation'],
    itinerary: [
      {
        day: 1,
        title: 'Delhi to Agra — Wonder of the World',
        description: 'Morning pickup from Delhi, smooth drive via Yamuna Expressway to Agra. Visit the world-renowned Taj Mahal and Agra Fort.',
        activities: ['Taj Mahal sunset view', 'Agra Fort', 'Mehtab Bagh garden'],
        stayCity: 'Agra'
      },
      {
        day: 2,
        title: 'Fatehpur Sikri to Ranthambore National Park',
        description: 'Stop at Emperor Akbar’s ghost city Fatehpur Sikri, then drive towards the tiger sanctuary.',
        activities: ['Buland Darwaza', 'Fatehpur Sikri palaces', 'Evening arrival at jungle resort in Sawai Madhopur'],
        stayCity: 'Ranthambore'
      },
      {
        day: 3,
        title: 'Morning Jungle Safari & Drive to Jaipur',
        description: 'Thrilling open-top morning safari in search of the Royal Bengal Tiger, then drive to Jaipur.',
        activities: ['Ranthambore Tiger Safari', 'Ranthambore Fort ruins', 'Highway drive to Jaipur'],
        stayCity: 'Jaipur'
      },
      {
        day: 4,
        title: 'Pink City Heritage Sightseeing',
        description: 'Full day of royal architecture in Jaipur.',
        activities: ['Amer Fort & elephant pathway', 'Hawa Mahal', 'Jantar Mantar observatory', 'City Palace'],
        stayCity: 'Jaipur'
      },
      {
        day: 5,
        title: 'Jaipur Highlights & Return Transfer',
        description: 'Souvenir shopping, Nahargarh views, and comfortable drop back to Delhi or Jaipur Airport.',
        activities: ['Nahargarh stepwells', 'Handicraft markets', 'Drop off at your preferred location'],
        stayCity: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-lake-city-hills',
    title: 'Romantic Lakes & Aravalli Hills',
    tagline: 'Udaipur • Kumbhalgarh Great Wall • Mount Abu',
    duration: '4 Days / 3 Nights',
    cities: ['Udaipur', 'Kumbhalgarh', 'Mount Abu'],
    startingFareSedan: 12900,
    startingFareSuv: 17500,
    badge: 'Honeymoon & Leisure',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    inclusions: ['4 Days dedicated cab with experienced hill driver', 'All hill permit fees, tolls & parking', 'Lake Pichola transfer'],
    exclusions: ['Boating tickets', 'Temple photography passes'],
    itinerary: [
      {
        day: 1,
        title: 'Udaipur Sightseeing & Sunset Boat',
        description: 'City Palace, Jagdish temple and sunset boat ride on Lake Pichola.',
        activities: ['City Palace', 'Lake Pichola boat cruise', 'Bagore ki Haveli cultural show'],
        stayCity: 'Udaipur'
      },
      {
        day: 2,
        title: 'Kumbhalgarh Fort — The Great Wall of India',
        description: 'Drive through mountain pass to the second-longest continuous wall in the world.',
        activities: ['Kumbhalgarh ramparts', 'Badal Mahal', 'Evening light & sound show'],
        stayCity: 'Kumbhalgarh'
      },
      {
        day: 3,
        title: 'Ascend to Mount Abu Hill Station',
        description: 'Drive up the winding ghats to Rajasthan’s only hill resort.',
        activities: ['Dilwara Marble Temples', 'Nakki Lake pedal boating', 'Honeymoon Point sunset'],
        stayCity: 'Mount Abu'
      },
      {
        day: 4,
        title: 'Guru Shikhar & Departure',
        description: 'Highest peak of the Aravalli range, followed by return drop to Udaipur airport/station.',
        activities: ['Guru Shikhar peak', 'Peace Park', 'Drop at Udaipur'],
        stayCity: 'Departure'
      }
    ]
  }
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Vikram & Ananya Sharma',
    city: 'Mumbai, India',
    rating: 5,
    route: 'Jaipur - Jodhpur - Jaisalmer Tour (Innova Crysta)',
    comment: 'Our chauffeur Mukesh ji was an absolute gem! Very knowledgeable about Rajasthan history, drove smoothly on the desert highways, and recommended the best authentic dhabas. Pristine clean car every morning.',
    date: 'February 2026'
  },
  {
    id: 'rev-2',
    name: 'David & Sarah Jenkins',
    city: 'London, UK',
    rating: 5,
    route: 'Delhi to Jaipur & Udaipur Transfer (Honda City)',
    comment: 'Booked online with initial hesitation, but the experience exceeded all expectations. Punctual, English-speaking driver, fixed transparent pricing with no hidden charges. Felt very safe travelling across Rajasthan.',
    date: 'January 2026'
  },
  {
    id: 'rev-3',
    name: 'Rajesh Kulkarni & Family',
    city: 'Pune, India',
    rating: 5,
    route: 'Jaipur Local 12hr Sightseeing (Swift Dzire)',
    comment: 'Covered Amer Fort, Jaigarh, Nahargarh sunset, and Johari bazaar without any rush. Driver waited patiently and knew all the shortcut parking spots near the forts. Excellent service!',
    date: 'March 2026'
  },
  {
    id: 'rev-4',
    name: 'Meera Singhania',
    city: 'Bengaluru, India',
    rating: 5,
    route: 'Udaipur to Mount Abu Round Trip (Ertiga)',
    comment: 'Superb hill driving skills on the Mount Abu ghats. Chilled AC, sanitized vehicle, and our driver was extremely courteous with my elderly parents. Highly recommended for family trips!',
    date: 'March 2026'
  }
];

export const FAQS = [
  {
    q: 'How is the outstation taxi fare calculated?',
    a: 'For outstation round trips, fares are calculated based on the minimum 250 km per day rule multiplied by the vehicle’s per-km rate, plus daily driver allowance. For one-way trips, we offer flat all-inclusive discounted one-way fares with no return charge penalty.'
  },
  {
    q: 'Are toll taxes, state tourist tax, and parking included in the fare?',
    a: 'In our packaged one-way trips and holiday tour packages, tolls and state permits are fully transparent and itemized before booking. For regular per-km bookings, tolls and parking are paid at actuals with receipts provided by your chauffeur.'
  },
  {
    q: 'Can I customize my tour itinerary or add detours?',
    a: 'Absolutely! Our drivers are flexible. If you want to visit Ranakpur Jain Temple while driving between Jodhpur and Udaipur, or stop at Ajmer Sharif between Jaipur and Jodhpur, simply inform us or your driver.'
  },
  {
    q: 'What is your cancellation and advance policy?',
    a: 'You can book your cab with a nominal advance (15-20%) or pay directly to the driver upon boarding. Free cancellation up to 6 hours prior to your scheduled pickup time.'
  },
  {
    q: 'Are your drivers police-verified and experienced?',
    a: 'Yes, 100% of our Rajasthani chauffeurs possess valid commercial badges, undergo strict background checks, and have a minimum of 5+ years of highway driving experience across Rajasthan.'
  }
];

// Calculate estimated distance between popular cities
export function getEstimatedDistance(from: string, to: string): number {
  if (from === to) return 80;
  
  const distances: Record<string, Record<string, number>> = {
    'Jaipur': {
      'Udaipur': 395,
      'Jodhpur': 335,
      'Jaisalmer': 560,
      'Pushkar': 145,
      'Ajmer': 135,
      'Bikaner': 330,
      'Mount Abu': 490,
      'Ranthambore (Sawai Madhopur)': 160,
      'Chittorgarh': 310,
      'Kumbhalgarh': 345,
      'Delhi NCR': 260,
      'Agra': 240,
      'Ahmedabad': 660
    },
    'Udaipur': {
      'Jaipur': 395,
      'Jodhpur': 260,
      'Jaisalmer': 490,
      'Pushkar': 280,
      'Mount Abu': 165,
      'Chittorgarh': 115,
      'Kumbhalgarh': 85,
      'Ahmedabad': 260,
      'Delhi NCR': 660,
      'Agra': 630
    },
    'Jodhpur': {
      'Jaipur': 335,
      'Udaipur': 260,
      'Jaisalmer': 285,
      'Bikaner': 250,
      'Pushkar': 190,
      'Mount Abu': 270,
      'Delhi NCR': 590
    },
    'Jaisalmer': {
      'Jodhpur': 285,
      'Jaipur': 560,
      'Bikaner': 330,
      'Udaipur': 490,
      'Delhi NCR': 780
    },
    'Delhi NCR': {
      'Jaipur': 260,
      'Agra': 210,
      'Udaipur': 660,
      'Jodhpur': 590,
      'Ranthambore (Sawai Madhopur)': 380
    }
  };

  if (distances[from]?.[to]) return distances[from][to];
  if (distances[to]?.[from]) return distances[to][from];

  return 250; // fallback standard estimate
}
