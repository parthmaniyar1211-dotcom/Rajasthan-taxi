// Core Domain Types for Rajasthan Rides - Taxi + Tours & Travels ERP

export type UserRole = 'ADMIN' | 'MANAGER' | 'VENDOR' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: UserRole;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  avatar?: string;
  vendorId?: string; // If role is VENDOR
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ServiceType = 'TAXI' | 'TOUR';
export type TripType = 'ONE_WAY' | 'ROUND_TRIP' | 'CUSTOM_TOUR';

export type BookingStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'ASSIGNED' 
  | 'ON_TRIP' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'PARTIALLY_PAID' 
  | 'PAID' 
  | 'REFUNDED';

export type PaymentMethod = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CARD' | 'ADVANCE_ONLINE';

export interface Vehicle {
  id: string;
  vehicleNumber: string; // e.g., RJ-06-TA-1024
  model: string; // e.g., Toyota Innova Crysta
  make?: string;
  type: 'SEDAN' | 'SUV' | 'PREMIUM' | 'TRAVELLER';
  category?: 'SEDAN' | 'SUV' | 'PREMIUM' | 'TRAVELLER';
  seating: number; // e.g., 4, 6, 7, 12, 17
  seatingCapacity?: number;
  luggageCapacity: number; // e.g., 2, 4, 8
  isAc: boolean;
  perKmRate: number;
  dailyRate: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'ON_TRIP' | 'MAINTENANCE' | 'INACTIVE';
  ownerType: 'COMPANY_OWNED' | 'VENDOR_ATTACHED';
  vendorId?: string;
  assignedDriverId?: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  permitType: 'RAJASTHAN_STATE' | 'ALL_INDIA_TOURIST';
  imageUrl: string;
  totalTripsCount: number;
  currentOdometerKm: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedVehicleId?: string;
  vendorId?: string;
  availability: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE' | 'BLOCKED';
  status?: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE' | 'BLOCKED';
  dailyAllowanceRate: number;
  rating: number;
  experienceYears: number;
  languages: string[];
  bankDetails: {
    accountNumber: string;
    ifsc: string;
    upiId: string;
    bankName: string;
  };
  totalEarnings: number;
  totalAdvances: number;
  totalPaid: number;
  outstandingBalance: number; // What company owes driver
  totalTrips?: number;
  dailyWage?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalBookings: number;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number; // What customer owes company
  createdAt: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  gstNumber?: string;
  fleetSize: number;
  totalTrips: number;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number; // What company owes vendor
  fleetSuppliedCount?: number;
  commissionRate?: number;
  outstandingPayable?: number;
}

export interface TourPackage {
  id: string;
  title: string; // e.g. "Royal Heritage Odyssey: Jaipur, Jodhpur & Udaipur"
  tagline: string;
  description?: string;
  startingCity?: string;
  vehicleType?: string;
  durationDays: number;
  durationNights: number;
  destinations: string[]; // ['Jaipur', 'Pushkar', 'Jodhpur', 'Udaipur']
  startingPrice: number;
  vehicleOptions: ('SEDAN' | 'SUV' | 'PREMIUM' | 'TRAVELLER')[];
  driverIncluded: boolean;
  featuredImage: string;
  galleryImages: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    city: string;
    description: string;
    activities: string[];
  }[];
  isPopular?: boolean;
}

export interface CustomTourEnquiry {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  startingCity: string;
  destinations: string[];
  startDate: string;
  durationDays: number;
  travelersCount: number;
  vehiclePreference: 'SEDAN' | 'SUV' | 'PREMIUM' | 'TRAVELLER';
  estimatedBudget?: number;
  requirementsNotes: string;
  status: 'NEW' | 'QUOTATION_SENT' | 'ACCEPTED' | 'REJECTED';
  quotedPrice?: number;
  createdAt: string;
}

export interface Booking {
  id: string; // e.g., RR-1001
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: ServiceType; // TAXI or TOUR
  tripType: TripType;
  pickupCity: string;
  pickupAddress: string;
  dropCity: string;
  dropAddress?: string;
  travelDate: string; // YYYY-MM-DD
  travelTime: string; // HH:mm
  returnDate?: string; // For round-trip / multi-day
  passengers: number;
  luggageCount: number;
  specialInstructions?: string;
  distanceKm?: number;
  
  // Package ref if TOUR
  tourPackageId?: string;
  tourPackageTitle?: string;

  // Assignment
  vehicleId?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vendorId?: string;

  // Financial Breakdown
  baseFare: number;
  driverAllowance: number;
  tollAndParkingEstimated: number;
  discount: number;
  taxGst: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;

  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;

  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string; // e.g., TXN-2001
  bookingId?: string;
  type: 'CUSTOMER_PAYMENT' | 'DRIVER_PAYMENT' | 'VENDOR_PAYMENT' | 'REFUND' | 'ADVANCE';
  fromParty: string; // Customer / Company / Vendor
  toParty: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: string; // YYYY-MM-DD
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  referenceNumber: string; // UTR / Cheque / Cash voucher
  notes?: string;
  recordedBy: string; // User ID / Admin
}

export type ExpenseCategory = 
  | 'FUEL' 
  | 'TOLL' 
  | 'PARKING' 
  | 'DRIVER_PAYMENT' 
  | 'VEHICLE_MAINTENANCE' 
  | 'SALARY' 
  | 'OFFICE_EXPENSE' 
  | 'COMMISSION' 
  | 'VENDOR_PAYMENT' 
  | 'OTHER';

export interface BusinessExpense {
  id: string; // e.g., EXP-3001
  bookingId?: string; // Link to specific booking if trip-related
  vehicleId?: string;
  driverId?: string;
  vendorId?: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  expenseDate: string; // YYYY-MM-DD
  date?: string;
  paidVia: PaymentMethod;
  paymentMode?: string;
  billReceiptUrl?: string;
  billNumber?: string;
  notes?: string;
  description?: string;
  payeeName?: string;
  recordedBy: string;
}

// Financial Ledger Entry for complete Double-Entry / Traceability
export interface LedgerEntry {
  id: string;
  date: string;
  account: 'CASH' | 'BANK' | 'ACCOUNTS_RECEIVABLE' | 'ACCOUNTS_PAYABLE' | 'REVENUE' | 'EXPENSE' | 'EQUITY';
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  sourceType: 'BOOKING' | 'PAYMENT' | 'EXPENSE' | 'CAPITAL';
  sourceReferenceId: string; // e.g. RR-1001, TXN-2001, EXP-3001
  description: string;
  partyName?: string;
}

export interface ProfitAndLossReport {
  period: string;
  revenues: {
    taxiRevenue: number;
    tourRevenue: number;
    tourPackageRevenue: number;
    otherIncome: number;
    totalRevenue: number;
  };
  directCosts: {
    fuelExpenses: number;
    driverDailyAllowances: number;
    tollExpenses: number;
    vendorHotelCost: number;
    totalDirectCosts: number;
  };
  operatingExpenses: {
    vehicleMaintenance: number;
    staffSalaries: number;
    officeRent: number;
    marketing: number;
    totalOperatingExpenses: number;
  };
  expenses: {
    fuel: number;
    driverCost: number;
    vendorCost: number;
    vehicleMaintenance: number;
    tollsAndParking: number;
    salariesAndOffice: number;
    otherExpenses: number;
    totalExpenses: number;
  };
  grossProfit: number;
  netProfit: number;
  profitMarginPercent: number;
  netMarginPercentage?: number;
}

export interface BalanceSheetReport {
  asOfDate: string;
  assets: {
    cashInHand: number;
    bankBalances: number;
    customerReceivables: number;
    fleetAndOtherAssets: number;
    fleetVehiclesValue: number;
    officeAssets: number;
    totalAssets: number;
  };
  liabilities: {
    vendorPayables: number;
    driverPayables: number;
    otherLiabilities: number;
    advanceCustomerTokens: number;
    totalLiabilities: number;
  };
  equity: {
    ownerCapital: number;
    initialCapital: number;
    retainedEarnings: number;
    totalEquity: number;
  };
  isBalanced: boolean; // ASSETS == LIABILITIES + EQUITY
}
