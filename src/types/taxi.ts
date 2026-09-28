export type TripType = 'oneway' | 'roundtrip' | 'local' | 'airport';

export interface Vehicle {
  id: string;
  name: string;
  category: 'Sedan' | 'Executive' | 'SUV' | 'Luxury' | 'Tempo';
  models: string;
  passengers: number;
  luggage: number;
  ratePerKm: number;
  minKmPerDay: number;
  driverAllowancePerDay: number;
  local4hrRate: number;
  local8hrRate: number;
  local12hrRate: number;
  features: string[];
  image: string;
  popular?: boolean;
}

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  durationHours: string;
  sedanFare: number;
  suvFare: number;
  popularFor: string;
  highlights: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  stayCity: string;
}

export interface TourPackage {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  cities: string[];
  startingFareSedan: number;
  startingFareSuv: number;
  image: string;
  badge?: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
}

export interface BookingFormData {
  tripType: TripType;
  pickupCity: string;
  dropCity: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  localPackage?: '4hr40km' | '8hr80km' | '12hr120km';
  selectedVehicleId: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  pickupAddress: string;
  specialRequests?: string;
}

export interface BookingReceipt {
  bookingId: string;
  createdAt: string;
  status: 'Confirmed' | 'Pending Chauffeur Assignment';
  tripType: TripType;
  pickupCity: string;
  dropCity: string;
  pickupDateTime: string;
  returnDate?: string;
  vehicle: Vehicle;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  pickupAddress: string;
  estimatedKm: number;
  baseFare: number;
  driverAllowance: number;
  estimatedTollTaxes: number;
  totalEstimatedFare: number;
  advancePayable: number;
  balanceOnTrip: number;
}

export interface CustomerReview {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  route: string;
  date: string;
}
