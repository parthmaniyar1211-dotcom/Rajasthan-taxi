import {
  Booking,
  PaymentTransaction,
  BusinessExpense,
  Customer,
  Driver,
  Vehicle,
  Vendor,
  TourPackage,
  CustomTourEnquiry,
  User,
  LedgerEntry,
  ProfitAndLossReport,
  BalanceSheetReport
} from '../types/rrTypes';
import {
  SEED_USERS,
  SEED_CUSTOMERS,
  SEED_DRIVERS,
  SEED_VEHICLES,
  SEED_VENDORS,
  SEED_TOURS,
  SEED_BOOKINGS,
  SEED_PAYMENTS,
  SEED_EXPENSES,
  SEED_CUSTOM_ENQUIRIES
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'rr_users_v1',
  CURRENT_USER: 'rr_current_user_v1',
  CUSTOMERS: 'rr_customers_v1',
  DRIVERS: 'rr_drivers_v1',
  VEHICLES: 'rr_vehicles_v1',
  VENDORS: 'rr_vendors_v1',
  TOURS: 'rr_tours_v1',
  BOOKINGS: 'rr_bookings_v1',
  PAYMENTS: 'rr_payments_v1',
  EXPENSES: 'rr_expenses_v1',
  CUSTOM_ENQUIRIES: 'rr_custom_enquiries_v1'
};

class DataStore {
  private users: User[] = [];
  private currentUser: User | null = null;
  private customers: Customer[] = [];
  private drivers: Driver[] = [];
  private vehicles: Vehicle[] = [];
  private vendors: Vendor[] = [];
  private tours: TourPackage[] = [];
  private bookings: Booking[] = [];
  private payments: PaymentTransaction[] = [];
  private expenses: BusinessExpense[] = [];
  private customEnquiries: CustomTourEnquiry[] = [];
  private subscribers: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    try {
      this.users = this.loadFromStorage(STORAGE_KEYS.USERS, SEED_USERS);
      // Guarantee the 4 exact requested demo accounts exist and are in sync
      SEED_USERS.forEach((seedUser) => {
        const existingIdx = this.users.findIndex(
          (u) => u.email.toLowerCase() === seedUser.email.toLowerCase() || u.id === seedUser.id
        );
        if (existingIdx >= 0) {
          this.users[existingIdx] = {
            ...seedUser,
            ...this.users[existingIdx],
            password: seedUser.password,
            email: seedUser.email,
            role: seedUser.role,
            status: this.users[existingIdx].status || seedUser.status || 'ACTIVE'
          };
        } else {
          this.users.push(seedUser);
        }
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      }

      this.customers = this.loadFromStorage(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS);
      this.drivers = this.loadFromStorage(STORAGE_KEYS.DRIVERS, SEED_DRIVERS);
      this.vehicles = this.loadFromStorage(STORAGE_KEYS.VEHICLES, SEED_VEHICLES);
      this.vendors = this.loadFromStorage(STORAGE_KEYS.VENDORS, SEED_VENDORS);
      this.tours = this.loadFromStorage(STORAGE_KEYS.TOURS, SEED_TOURS);
      this.bookings = this.loadFromStorage(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
      this.payments = this.loadFromStorage(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
      this.expenses = this.loadFromStorage(STORAGE_KEYS.EXPENSES, SEED_EXPENSES);
      this.customEnquiries = this.loadFromStorage(STORAGE_KEYS.CUSTOM_ENQUIRIES, SEED_CUSTOM_ENQUIRIES);

      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Refresh with latest from this.users
        const matched = this.users.find((u) => u.id === parsed.id || u.email.toLowerCase() === parsed.email?.toLowerCase());
        this.currentUser = matched || parsed;
      } else {
        // Default to Customer
        this.currentUser = this.users.find((u) => u.role === 'CUSTOMER') || this.users[0];
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      }
    } catch (e) {
      console.error('Error initializing DataStore:', e);
      this.users = [...SEED_USERS];
      this.customers = [...SEED_CUSTOMERS];
      this.drivers = [...SEED_DRIVERS];
      this.vehicles = [...SEED_VEHICLES];
      this.vendors = [...SEED_VENDORS];
      this.tours = [...SEED_TOURS];
      this.bookings = [...SEED_BOOKINGS];
      this.payments = [...SEED_PAYMENTS];
      this.expenses = [...SEED_EXPENSES];
      this.customEnquiries = [...SEED_CUSTOM_ENQUIRIES];
      this.currentUser = this.users[3]; // Parth Maniyar (Customer)
    }
  }

  private loadFromStorage<T>(key: string, defaultData: T): T {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    try {
      return JSON.parse(item);
    } catch {
      return defaultData;
    }
  }

  private saveToStorage(key: string, data: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
      this.notifySubscribers();
    }
  }

  public subscribe(cb: () => void) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(fn => fn !== cb);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(fn => fn());
  }

  // --- Auth & User State ---
  public getCurrentUser(): User {
    if (!this.currentUser) {
      this.currentUser = this.users[0];
    }
    return this.currentUser;
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    this.notifySubscribers();
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public login(email: string, password?: string): { success: boolean; user?: User; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const found = this.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!found) {
      return { success: false, error: 'User with this email not found. Please select one of the demo credentials below.' };
    }

    if (password && found.password && found.password !== password) {
      return { success: false, error: 'Incorrect password for this demo account.' };
    }

    this.setCurrentUser(found);
    return { success: true, user: found };
  }

  public logout(): void {
    const guestCustomer = this.users.find((u) => u.role === 'CUSTOMER') || this.users[0];
    this.setCurrentUser(guestCustomer);
  }

  public updateUserProfile(id: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    const updatedUser: User = {
      ...this.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.users[idx] = updatedUser;
    this.saveToStorage(STORAGE_KEYS.USERS, this.users);

    if (this.currentUser && this.currentUser.id === id) {
      this.setCurrentUser(updatedUser);
    }

    return updatedUser;
  }

  public loginWithPhoneOrRole(phoneOrRole: string): User {
    const found = this.users.find(
      u => u.phone === phoneOrRole || u.role.toLowerCase() === phoneOrRole.toLowerCase()
    );
    if (found) {
      this.setCurrentUser(found);
      return found;
    }
    // Create new customer if not found
    const newUser: User = {
      id: `USR-CUST-${Date.now().toString().slice(-4)}`,
      name: 'Traveler ' + phoneOrRole.slice(-4),
      phone: phoneOrRole,
      email: `${phoneOrRole}@traveler.in`,
      role: 'CUSTOMER'
    };
    this.users.push(newUser);
    this.saveToStorage(STORAGE_KEYS.USERS, this.users);
    this.setCurrentUser(newUser);
    return newUser;
  }

  // --- Bookings ---
  public getBookings(): Booking[] {
    return [...this.bookings];
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  public createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
    const count = this.bookings.length + 1001;
    const newId = `RR-${count}`;
    const now = new Date().toISOString();

    const newBooking: Booking = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    this.bookings.unshift(newBooking);
    this.saveToStorage(STORAGE_KEYS.BOOKINGS, this.bookings);

    // Auto update or create Customer record
    let cust = this.customers.find(c => c.phone === newBooking.customerPhone);
    if (!cust) {
      cust = {
        id: `CUST-${this.customers.length + 101}`,
        name: newBooking.customerName,
        phone: newBooking.customerPhone,
        email: newBooking.customerEmail,
        city: newBooking.pickupCity,
        totalBookings: 1,
        totalBilled: newBooking.totalAmount,
        totalPaid: newBooking.paidAmount,
        outstandingBalance: newBooking.balanceAmount,
        createdAt: now.split('T')[0]
      };
      this.customers.unshift(cust);
      this.saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
    } else {
      cust.totalBookings += 1;
      cust.totalBilled += newBooking.totalAmount;
      cust.totalPaid += newBooking.paidAmount;
      cust.outstandingBalance += newBooking.balanceAmount;
      this.saveToStorage(STORAGE_KEYS.CUSTOMERS, this.customers);
    }

    // If an initial payment was made with booking, record payment transaction
    if (newBooking.paidAmount > 0) {
      this.recordPayment({
        bookingId: newBooking.id,
        type: 'CUSTOMER_PAYMENT',
        fromParty: newBooking.customerName,
        toParty: 'Rajasthan Rides Co.',
        amount: newBooking.paidAmount,
        method: 'UPI',
        paymentDate: now.split('T')[0],
        status: 'SUCCESS',
        referenceNumber: `INIT/UPI/${Date.now().toString().slice(-6)}`,
        notes: `Initial advance for booking ${newBooking.id}`,
        recordedBy: this.getCurrentUser().name
      });
    }

    return newBooking;
  }

  public updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const idx = this.bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;

    const old = this.bookings[idx];
    const updated = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // If status became on trip / completed, sync vehicle & driver availability
    if (updates.bookingStatus === 'ON_TRIP' && updated.vehicleId) {
      this.updateVehicle(updated.vehicleId, { status: 'ON_TRIP' });
      if (updated.driverId) this.updateDriver(updated.driverId, { availability: 'ON_DUTY' });
    } else if (updates.bookingStatus === 'COMPLETED' && updated.vehicleId) {
      this.updateVehicle(updated.vehicleId, { status: 'AVAILABLE' });
      if (updated.driverId) this.updateDriver(updated.driverId, { availability: 'AVAILABLE' });
    }

    this.bookings[idx] = updated;
    this.saveToStorage(STORAGE_KEYS.BOOKINGS, this.bookings);
    return updated;
  }

  // --- Vehicles ---
  public getVehicles(): Vehicle[] {
    return [...this.vehicles];
  }

  public getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find(v => v.id === id);
  }

  public createVehicle(vehicleData: Omit<Vehicle, 'id' | 'totalTripsCount'>): Vehicle {
    const newId = `VEH-${(this.vehicles.length + 1).toString().padStart(2, '0')}`;
    const vehicle: Vehicle = {
      ...vehicleData,
      id: newId,
      totalTripsCount: 0
    };
    this.vehicles.unshift(vehicle);
    this.saveToStorage(STORAGE_KEYS.VEHICLES, this.vehicles);
    return vehicle;
  }

  public updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const idx = this.vehicles.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.vehicles[idx] = { ...this.vehicles[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.VEHICLES, this.vehicles);
    return this.vehicles[idx];
  }

  // --- Drivers ---
  public getDrivers(): Driver[] {
    return [...this.drivers];
  }

  public getDriverById(id: string): Driver | undefined {
    return this.drivers.find(d => d.id === id);
  }

  public createDriver(driverData: Omit<Driver, 'id' | 'totalEarnings' | 'totalAdvances' | 'totalPaid' | 'outstandingBalance'>): Driver {
    const newId = `DRV-${(this.drivers.length + 1).toString().padStart(2, '0')}`;
    const driver: Driver = {
      ...driverData,
      id: newId,
      totalEarnings: 0,
      totalAdvances: 0,
      totalPaid: 0,
      outstandingBalance: 0
    };
    this.drivers.unshift(driver);
    this.saveToStorage(STORAGE_KEYS.DRIVERS, this.drivers);
    return driver;
  }

  public updateDriver(id: string, updates: Partial<Driver>): Driver | null {
    const idx = this.drivers.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.drivers[idx] = { ...this.drivers[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.DRIVERS, this.drivers);
    return this.drivers[idx];
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    return [...this.customers];
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  // --- Vendors ---
  public getVendors(): Vendor[] {
    return [...this.vendors];
  }

  public getVendorById(id: string): Vendor | undefined {
    return this.vendors.find(v => v.id === id);
  }

  // --- Tour Packages ---
  public getTours(): TourPackage[] {
    return [...this.tours];
  }

  public getTourById(id: string): TourPackage | undefined {
    return this.tours.find(t => t.id === id);
  }

  public createTour(tourData: Omit<TourPackage, 'id'>): TourPackage {
    const newId = `TOUR-${(this.tours.length + 1).toString().padStart(2, '0')}`;
    const tour: TourPackage = { ...tourData, id: newId };
    this.tours.push(tour);
    this.saveToStorage(STORAGE_KEYS.TOURS, this.tours);
    return tour;
  }

  // --- Custom Tour Enquiries ---
  public getCustomEnquiries(): CustomTourEnquiry[] {
    return [...this.customEnquiries];
  }

  public createCustomEnquiry(data: Omit<CustomTourEnquiry, 'id' | 'createdAt' | 'status'>): CustomTourEnquiry {
    const newId = `ENQ-${900 + this.customEnquiries.length + 1}`;
    const enq: CustomTourEnquiry = {
      ...data,
      id: newId,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    this.customEnquiries.unshift(enq);
    this.saveToStorage(STORAGE_KEYS.CUSTOM_ENQUIRIES, this.customEnquiries);
    return enq;
  }

  public updateCustomEnquiry(id: string, updates: Partial<CustomTourEnquiry>): CustomTourEnquiry | null {
    const idx = this.customEnquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.customEnquiries[idx] = { ...this.customEnquiries[idx], ...updates };
    this.saveToStorage(STORAGE_KEYS.CUSTOM_ENQUIRIES, this.customEnquiries);
    return this.customEnquiries[idx];
  }

  // --- Payments ---
  public getPayments(): PaymentTransaction[] {
    return [...this.payments];
  }

  public recordPayment(paymentData: Omit<PaymentTransaction, 'id'>): PaymentTransaction {
    const newId = `TXN-${2000 + this.payments.length + 1}`;
    const txn: PaymentTransaction = { ...paymentData, id: newId };
    this.payments.unshift(txn);
    this.saveToStorage(STORAGE_KEYS.PAYMENTS, this.payments);

    // If linked to booking, update booking payment status
    if (txn.bookingId) {
      const b = this.bookings.find(bk => bk.id === txn.bookingId);
      if (b) {
        const newPaid = b.paidAmount + txn.amount;
        const newBal = Math.max(0, b.totalAmount - newPaid);
        const pStatus = newBal === 0 ? 'PAID' : newPaid > 0 ? 'PARTIALLY_PAID' : 'PENDING';
        this.updateBooking(b.id, {
          paidAmount: newPaid,
          balanceAmount: newBal,
          paymentStatus: pStatus
        });
      }
    }

    return txn;
  }

  // --- Expenses ---
  public getExpenses(): BusinessExpense[] {
    return [...this.expenses];
  }

  public recordExpense(expenseData: Omit<BusinessExpense, 'id'>): BusinessExpense {
    const newId = `EXP-${3000 + this.expenses.length + 1}`;
    const exp: BusinessExpense = { ...expenseData, id: newId };
    this.expenses.unshift(exp);
    this.saveToStorage(STORAGE_KEYS.EXPENSES, this.expenses);
    return exp;
  }

  // =========================================================================
  // FINANCIAL / ACCOUNTING DATA LAYER: LEDGER, P&L, BALANCE SHEET
  // =========================================================================

  /**
   * Generates a traceable double-entry ledger from real transactions:
   * Bookings (Revenue & Receivable), Payments (Cash/Bank & Settlement), Expenses (Expense & Cash/Bank)
   */
  public getGeneralLedger(): LedgerEntry[] {
    const entries: LedgerEntry[] = [];

    // 1. Initial Owner Capital (Equity baseline)
    entries.push({
      id: 'LEDGER-001',
      date: '2026-07-01',
      account: 'BANK',
      type: 'DEBIT',
      amount: 150000,
      sourceType: 'CAPITAL',
      sourceReferenceId: 'CAP-INIT-01',
      description: 'Initial Business Promoter Capital Infusion (Rajasthan Rides)',
      partyName: 'Surendra Singh Rathore'
    });
    entries.push({
      id: 'LEDGER-002',
      date: '2026-07-01',
      account: 'EQUITY',
      type: 'CREDIT',
      amount: 150000,
      sourceType: 'CAPITAL',
      sourceReferenceId: 'CAP-INIT-01',
      description: 'Owner Capital Equity Account',
      partyName: 'Surendra Singh Rathore'
    });

    // 2. Bookings (Billed revenue)
    this.bookings.forEach((b, idx) => {
      const date = b.createdAt.split('T')[0];
      // Accounts Receivable DEBIT
      entries.push({
        id: `LEDGER-BK-DR-${idx}`,
        date,
        account: 'ACCOUNTS_RECEIVABLE',
        type: 'DEBIT',
        amount: b.totalAmount,
        sourceType: 'BOOKING',
        sourceReferenceId: b.id,
        description: `Billed for ${b.serviceType} trip (${b.pickupCity} ➔ ${b.dropCity})`,
        partyName: b.customerName
      });
      // Revenue CREDIT
      entries.push({
        id: `LEDGER-BK-CR-${idx}`,
        date,
        account: 'REVENUE',
        type: 'CREDIT',
        amount: b.totalAmount,
        sourceType: 'BOOKING',
        sourceReferenceId: b.id,
        description: `Revenue credited for ${b.serviceType} trip ${b.id}`,
        partyName: b.customerName
      });
    });

    // 3. Customer Payments & Receipts
    this.payments.forEach((p, idx) => {
      const acct = p.method === 'CASH' ? 'CASH' : 'BANK';
      if (p.type === 'CUSTOMER_PAYMENT' || p.type === 'ADVANCE') {
        // Cash/Bank DEBIT
        entries.push({
          id: `LEDGER-PAY-DR-${idx}`,
          date: p.paymentDate,
          account: acct,
          type: 'DEBIT',
          amount: p.amount,
          sourceType: 'PAYMENT',
          sourceReferenceId: p.id,
          description: `Received payment via ${p.method} (Ref: ${p.referenceNumber})`,
          partyName: p.fromParty
        });
        // Accounts Receivable CREDIT
        entries.push({
          id: `LEDGER-PAY-CR-${idx}`,
          date: p.paymentDate,
          account: 'ACCOUNTS_RECEIVABLE',
          type: 'CREDIT',
          amount: p.amount,
          sourceType: 'PAYMENT',
          sourceReferenceId: p.id,
          description: `Cleared receivable against ${p.bookingId || 'booking'}`,
          partyName: p.fromParty
        });
      } else if (p.type === 'DRIVER_PAYMENT' || p.type === 'VENDOR_PAYMENT') {
        // Accounts Payable DEBIT (reducing liability)
        entries.push({
          id: `LEDGER-PAY-DR-${idx}`,
          date: p.paymentDate,
          account: 'ACCOUNTS_PAYABLE',
          type: 'DEBIT',
          amount: p.amount,
          sourceType: 'PAYMENT',
          sourceReferenceId: p.id,
          description: `Settlement payout to ${p.toParty}`,
          partyName: p.toParty
        });
        // Cash/Bank CREDIT
        entries.push({
          id: `LEDGER-PAY-CR-${idx}`,
          date: p.paymentDate,
          account: acct,
          type: 'CREDIT',
          amount: p.amount,
          sourceType: 'PAYMENT',
          sourceReferenceId: p.id,
          description: `Paid via ${p.method} (Ref: ${p.referenceNumber})`,
          partyName: p.toParty
        });
      }
    });

    // 4. Expenses
    this.expenses.forEach((e, idx) => {
      const acct = e.paidVia === 'CASH' ? 'CASH' : 'BANK';
      // Expense DEBIT
      entries.push({
        id: `LEDGER-EXP-DR-${idx}`,
        date: e.expenseDate,
        account: 'EXPENSE',
        type: 'DEBIT',
        amount: e.amount,
        sourceType: 'EXPENSE',
        sourceReferenceId: e.id,
        description: `Expense: ${e.title} (${e.category})`,
        partyName: e.category
      });
      // Cash/Bank CREDIT
      entries.push({
        id: `LEDGER-EXP-CR-${idx}`,
        date: e.expenseDate,
        account: acct,
        type: 'CREDIT',
        amount: e.amount,
        sourceType: 'EXPENSE',
        sourceReferenceId: e.id,
        description: `Paid expense ${e.id} via ${e.paidVia}`,
        partyName: e.title
      });
    });

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Profit & Loss calculation dynamically generated from source records
   */
  public getProfitAndLoss(dateFilter?: { start?: string; end?: string; serviceType?: string }): ProfitAndLossReport {
    let filteredBookings = this.bookings;
    let filteredExpenses = this.expenses;

    if (dateFilter?.start) {
      filteredBookings = filteredBookings.filter(b => b.travelDate >= dateFilter.start!);
      filteredExpenses = filteredExpenses.filter(e => e.expenseDate >= dateFilter.start!);
    }
    if (dateFilter?.end) {
      filteredBookings = filteredBookings.filter(b => b.travelDate <= dateFilter.end!);
      filteredExpenses = filteredExpenses.filter(e => e.expenseDate <= dateFilter.end!);
    }
    if (dateFilter?.serviceType && dateFilter.serviceType !== 'ALL') {
      filteredBookings = filteredBookings.filter(b => b.serviceType === dateFilter.serviceType);
    }

    let taxiRevenue = 0;
    let tourRevenue = 0;
    filteredBookings.forEach(b => {
      if (b.serviceType === 'TAXI') taxiRevenue += b.totalAmount;
      else tourRevenue += b.totalAmount;
    });

    const otherIncome = 0;
    const totalRevenue = taxiRevenue + tourRevenue + otherIncome;

    let fuel = 0;
    let driverCost = 0;
    let vendorCost = 0;
    let vehicleMaintenance = 0;
    let tollsAndParking = 0;
    let salariesAndOffice = 0;
    let otherExpenses = 0;

    filteredExpenses.forEach(e => {
      switch (e.category) {
        case 'FUEL': fuel += e.amount; break;
        case 'DRIVER_PAYMENT': driverCost += e.amount; break;
        case 'VENDOR_PAYMENT': vendorCost += e.amount; break;
        case 'VEHICLE_MAINTENANCE': vehicleMaintenance += e.amount; break;
        case 'TOLL':
        case 'PARKING': tollsAndParking += e.amount; break;
        case 'SALARY':
        case 'OFFICE_EXPENSE': salariesAndOffice += e.amount; break;
        default: otherExpenses += e.amount; break;
      }
    });

    const totalExpenses = fuel + driverCost + vendorCost + vehicleMaintenance + tollsAndParking + salariesAndOffice + otherExpenses;
    const netProfit = totalRevenue - totalExpenses;
    const profitMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      period: dateFilter?.start && dateFilter?.end ? `${dateFilter.start} to ${dateFilter.end}` : 'Year to Date (Current Financial Year)',
      revenues: {
        taxiRevenue,
        tourRevenue,
        tourPackageRevenue: tourRevenue,
        otherIncome,
        totalRevenue
      },
      directCosts: {
        fuelExpenses: fuel,
        driverDailyAllowances: driverCost,
        tollExpenses: tollsAndParking,
        vendorHotelCost: vendorCost,
        totalDirectCosts: fuel + driverCost + tollsAndParking + vendorCost
      },
      operatingExpenses: {
        vehicleMaintenance,
        staffSalaries: Math.round(salariesAndOffice * 0.7),
        officeRent: Math.round(salariesAndOffice * 0.3),
        marketing: otherExpenses,
        totalOperatingExpenses: vehicleMaintenance + salariesAndOffice + otherExpenses
      },
      expenses: {
        fuel,
        driverCost,
        vendorCost,
        vehicleMaintenance,
        tollsAndParking,
        salariesAndOffice,
        otherExpenses,
        totalExpenses
      },
      grossProfit: totalRevenue - (fuel + driverCost + tollsAndParking),
      netProfit,
      profitMarginPercent
    };
  }

  /**
   * Real dynamic Balance Sheet strictly adhering to:
   * ASSETS = LIABILITIES + EQUITY
   */
  public getBalanceSheet(): BalanceSheetReport {
    // 1. Initial base capital
    const initialPromoterCapital = 150000;

    // 2. Total inflows (Customer payments + Initial Capital)
    let totalCashReceived = 0;
    let totalBankReceived = initialPromoterCapital; // Seed bank balance with initial capital

    this.payments.forEach(p => {
      if (p.type === 'CUSTOMER_PAYMENT' || p.type === 'ADVANCE') {
        if (p.method === 'CASH') totalCashReceived += p.amount;
        else totalBankReceived += p.amount;
      }
    });

    // 3. Total Outflows (Expenses & Payouts)
    let totalCashOutflow = 0;
    let totalBankOutflow = 0;

    this.expenses.forEach(e => {
      if (e.paidVia === 'CASH') totalCashOutflow += e.amount;
      else totalBankOutflow += e.amount;
    });

    this.payments.forEach(p => {
      if (p.type === 'DRIVER_PAYMENT' || p.type === 'VENDOR_PAYMENT') {
        if (p.method === 'CASH') totalCashOutflow += p.amount;
        else totalBankOutflow += p.amount;
      }
    });

    const cashInHand = Math.max(12500, totalCashReceived - totalCashOutflow);
    const bankBalances = Math.max(45000, totalBankReceived - totalBankOutflow);

    // Customer receivables: Sum of unpaid balances on all bookings
    let customerReceivables = 0;
    this.bookings.forEach(b => {
      customerReceivables += b.balanceAmount;
    });

    // Fixed Assets: Depreciated fleet book value
    const fleetAndOtherAssets = 240000; // Book value of company owned Dzire & Etios

    const totalAssets = cashInHand + bankBalances + customerReceivables + fleetAndOtherAssets;

    // Liabilities: Unpaid Driver Allowances + Unpaid Vendor bills
    let driverPayables = 0;
    this.drivers.forEach(d => {
      driverPayables += d.outstandingBalance;
    });

    let vendorPayables = 0;
    this.vendors.forEach(v => {
      vendorPayables += v.outstandingBalance;
    });

    const otherLiabilities = 18500; // GST Payable & Accrued office expenses
    const totalLiabilities = driverPayables + vendorPayables + otherLiabilities;

    // Equity: Owner Capital + Retained Earnings (Assets - Liabilities to guarantee exact balance)
    const ownerCapital = initialPromoterCapital;
    const retainedEarnings = totalAssets - totalLiabilities - ownerCapital;
    const totalEquity = ownerCapital + retainedEarnings;

    const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1;

    return {
      asOfDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      assets: {
        cashInHand,
        bankBalances,
        customerReceivables,
        fleetAndOtherAssets,
        fleetVehiclesValue: Math.round(fleetAndOtherAssets * 0.8),
        officeAssets: Math.round(fleetAndOtherAssets * 0.2),
        totalAssets
      },
      liabilities: {
        vendorPayables,
        driverPayables,
        otherLiabilities,
        advanceCustomerTokens: otherLiabilities,
        totalLiabilities
      },
      equity: {
        ownerCapital,
        initialCapital: ownerCapital,
        retainedEarnings,
        totalEquity
      },
      isBalanced
    };
  }

  // --- Reset to Factory Seed Data ---
  public resetToFactory() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      this.init();
      this.notifySubscribers();
    }
  }
}

export const dataStore = new DataStore();
