import React, { useState, useEffect, useMemo } from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { dataStore } from './services/dataStore';
import { Booking, TourPackage, UserRole } from './types/rrTypes';

// Customer Flow Components
import { SplashScreen } from './components/customer/SplashScreen';
import { CustomerHome } from './components/customer/CustomerHome';
import { TaxiBookingFlow } from './components/customer/TaxiBookingFlow';
import { TourBookingFlow } from './components/customer/TourBookingFlow';
import { CustomerBookings } from './components/customer/CustomerBookings';
import { AuthModal } from './components/customer/AuthModal';
import { UserProfileModal } from './components/common/UserProfileModal';

// Admin / ERP Components
import { AdminSidebar, AdminSection } from './components/admin/AdminSidebar';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminBookingsView } from './components/admin/AdminBookingsView';
import { AdminVehiclesView } from './components/admin/AdminVehiclesView';
import { AdminDriversView } from './components/admin/AdminDriversView';
import { AdminToursView } from './components/admin/AdminToursView';
import { AdminPartiesView } from './components/admin/AdminPartiesView';
import { AdminFinancialTransactionsView } from './components/admin/AdminFinancialTransactionsView';
import { AdminAccountsLedgerView } from './components/admin/AdminAccountsLedgerView';
import { AdminBalanceSheetView } from './components/admin/AdminBalanceSheetView';
import { AdminProfitLossView } from './components/admin/AdminProfitLossView';
import { AdminReportsView } from './components/admin/AdminReportsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';

// Detail Components with Full Back Navigation
import { BookingDetailsView } from './components/details/BookingDetailsView';
import { CustomerDetailsView } from './components/details/CustomerDetailsView';
import { VehicleDetailsView } from './components/details/VehicleDetailsView';
import { DriverDetailsView } from './components/details/DriverDetailsView';
import { VendorDetailsView } from './components/details/VendorDetailsView';
import { TourDetailsView } from './components/details/TourDetailsView';
import { PaymentDetailsView } from './components/details/PaymentDetailsView';
import { ExpenseDetailsView } from './components/details/ExpenseDetailsView';
import { ReportDetailsView } from './components/details/ReportDetailsView';
import { ProfileView } from './components/details/ProfileView';

import {
  Car,
  Compass,
  LayoutDashboard,
  Users,
  Shield,
  Phone,
  LogOut,
  CalendarCheck,
  CheckCircle2,
  Menu,
  X,
  KeyRound,
  User as UserIcon,
  ArrowRight
} from 'lucide-react';

function AppContent() {
  const { currentRoute, navigate, goBack } = useNavigation();

  // Mobile drawer state for Admin Panel
  const [mobileAdminMenuOpen, setMobileAdminMenuOpen] = useState(false);

  // Auth & Profile Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Splash Screen flag
  const [showSplash, setShowSplash] = useState(() => currentRoute.path === '/splash');

  // Current User Subscription
  const [currentUser, setCurrentUser] = useState(dataStore.getCurrentUser());

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setCurrentUser(dataStore.getCurrentUser());
    });
    return unsub;
  }, []);

  const handleSplashContinue = () => {
    setShowSplash(false);
    navigate('/');
  };

  const handleSwitchToAdmin = () => {
    if (currentUser.role === 'CUSTOMER') {
      const adminUser = dataStore.getAllUsers().find((u) => u.role === 'ADMIN');
      if (adminUser) dataStore.setCurrentUser(adminUser);
    }
    navigate('/admin');
  };

  const handleSwitchToCustomer = () => {
    navigate('/');
  };

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'ADMIN' || role === 'MANAGER' || role === 'VENDOR') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    dataStore.logout();
    setIsProfileModalOpen(false);
    navigate('/');
  };

  // Determine if current route is an Admin route
  const isAdminRoute = currentRoute.path.startsWith('/admin');

  // Determine current active section for AdminSidebar
  const activeAdminSection: AdminSection = useMemo(() => {
    const p = currentRoute.path;
    if (p.startsWith('/admin/bookings')) return 'BOOKINGS';
    if (p.startsWith('/admin/vehicles')) return 'VEHICLES';
    if (p.startsWith('/admin/drivers')) return 'DRIVERS';
    if (p.startsWith('/admin/tours')) return 'TOURS';
    if (p.startsWith('/admin/customers')) return 'CUSTOMERS';
    if (p.startsWith('/admin/vendors')) return 'VENDORS';
    if (p.startsWith('/admin/payments')) return 'PAYMENTS';
    if (p.startsWith('/admin/expenses')) return 'EXPENSES';
    if (p.startsWith('/admin/accounts')) return 'ACCOUNTS';
    if (p.startsWith('/admin/balance-sheet')) return 'BALANCE_SHEET';
    if (p.startsWith('/admin/profit-loss')) return 'PROFIT_LOSS';
    if (p.startsWith('/admin/reports')) return 'REPORTS';
    if (p.startsWith('/admin/settings')) return 'SETTINGS';
    return 'DASHBOARD';
  }, [currentRoute.path]);

  // Handle AdminSidebar section selection
  const handleSelectAdminSection = (section: AdminSection) => {
    setMobileAdminMenuOpen(false);
    switch (section) {
      case 'DASHBOARD':
        navigate('/admin');
        break;
      case 'BOOKINGS':
        navigate('/admin/bookings');
        break;
      case 'CUSTOMERS':
        navigate('/admin/customers');
        break;
      case 'DRIVERS':
        navigate('/admin/drivers');
        break;
      case 'VEHICLES':
        navigate('/admin/vehicles');
        break;
      case 'TOURS':
        navigate('/admin/tours');
        break;
      case 'VENDORS':
        navigate('/admin/vendors');
        break;
      case 'PAYMENTS':
        navigate('/admin/payments');
        break;
      case 'EXPENSES':
        navigate('/admin/expenses');
        break;
      case 'ACCOUNTS':
        navigate('/admin/accounts');
        break;
      case 'BALANCE_SHEET':
        navigate('/admin/balance-sheet');
        break;
      case 'PROFIT_LOSS':
        navigate('/admin/profit-loss');
        break;
      case 'REPORTS':
        navigate('/admin/reports');
        break;
      case 'SETTINGS':
        navigate('/admin/settings');
        break;
    }
  };

  // Render Splash Screen if active
  if (showSplash) {
    return <SplashScreen onContinue={handleSplashContinue} />;
  }

  // -------------------------------------------------------------
  // ADMIN PANEL ROUTING & VIEW SELECTION
  // -------------------------------------------------------------
  if (isAdminRoute) {
    const renderAdminMain = () => {
      const p = currentRoute.path;

      // Detail Pages under Admin
      if (p.startsWith('/admin/bookings/')) {
        const id = p.split('/admin/bookings/')[1];
        return <BookingDetailsView bookingId={id} />;
      }
      if (p.startsWith('/admin/customers/')) {
        const id = p.split('/admin/customers/')[1];
        return <CustomerDetailsView customerId={id} />;
      }
      if (p.startsWith('/admin/vehicles/')) {
        const id = p.split('/admin/vehicles/')[1];
        return <VehicleDetailsView vehicleId={id} />;
      }
      if (p.startsWith('/admin/drivers/')) {
        const id = p.split('/admin/drivers/')[1];
        return <DriverDetailsView driverId={id} />;
      }
      if (p.startsWith('/admin/vendors/')) {
        const id = p.split('/admin/vendors/')[1];
        return <VendorDetailsView vendorId={id} />;
      }
      if (p.startsWith('/admin/tours/')) {
        const id = p.split('/admin/tours/')[1];
        return <TourDetailsView tourId={id} />;
      }
      if (p.startsWith('/admin/payments/')) {
        const id = p.split('/admin/payments/')[1];
        return <PaymentDetailsView paymentId={id} />;
      }
      if (p.startsWith('/admin/expenses/')) {
        const id = p.split('/admin/expenses/')[1];
        return <ExpenseDetailsView expenseId={id} />;
      }
      if (p.startsWith('/admin/reports/')) {
        const id = p.split('/admin/reports/')[1];
        return <ReportDetailsView reportId={id} />;
      }
      if (p === '/admin/profile/edit') {
        return <ProfileView isEditing={true} />;
      }
      if (p === '/admin/profile') {
        return <ProfileView isEditing={false} />;
      }

      // Main Admin List Views
      switch (activeAdminSection) {
        case 'DASHBOARD':
          return (
            <AdminDashboardView
              onNavigate={(sec) => handleSelectAdminSection(sec)}
              onOpenProfile={() => navigate('/admin/profile')}
            />
          );
        case 'BOOKINGS':
          return <AdminBookingsView />;
        case 'CUSTOMERS':
          return <AdminPartiesView type="CUSTOMERS" />;
        case 'DRIVERS':
          return <AdminDriversView />;
        case 'VEHICLES':
          return <AdminVehiclesView />;
        case 'TOURS':
          return <AdminToursView />;
        case 'VENDORS':
          return <AdminPartiesView type="VENDORS" />;
        case 'PAYMENTS':
          return <AdminFinancialTransactionsView type="PAYMENTS" />;
        case 'EXPENSES':
          return <AdminFinancialTransactionsView type="EXPENSES" />;
        case 'ACCOUNTS':
          return <AdminAccountsLedgerView />;
        case 'BALANCE_SHEET':
          return <AdminBalanceSheetView />;
        case 'PROFIT_LOSS':
          return <AdminProfitLossView />;
        case 'REPORTS':
          return <AdminReportsView />;
        case 'SETTINGS':
          return <AdminSettingsView />;
        default:
          return (
            <AdminDashboardView
              onNavigate={(sec) => handleSelectAdminSection(sec)}
              onOpenProfile={() => navigate('/admin/profile')}
            />
          );
      }
    };

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans">
        {/* Mobile Header for Admin */}
        <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold font-serif text-sm cursor-pointer"
            >
              RR
            </button>
            <span className="font-serif font-bold text-sm">Rajasthan Rides ERP</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/profile')}
              className="p-1 rounded text-amber-300"
              title="My Profile"
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileAdminMenuOpen(!mobileAdminMenuOpen)}
              className="p-1 rounded text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle admin navigation"
            >
              {mobileAdminMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`${mobileAdminMenuOpen ? 'block' : 'hidden'} md:block shrink-0`}>
          <AdminSidebar
            currentSection={activeAdminSection}
            onSelectSection={handleSelectAdminSection}
            onExitAdmin={handleSwitchToCustomer}
            onOpenProfile={() => navigate('/admin/profile')}
            onLogout={handleLogout}
          />
        </div>

        {/* Main Admin Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-h-screen">
          {renderAdminMain()}
        </main>

        {/* Profile Modal */}
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // CUSTOMER APP ROUTING & VIEW SELECTION
  // -------------------------------------------------------------
  const renderCustomerMain = () => {
    const p = currentRoute.path;

    // Booking Details / Invoice
    if (p.startsWith('/bookings/')) {
      const id = p.split('/bookings/')[1];
      return <BookingDetailsView bookingId={id} />;
    }

    // Profile & Edit Profile
    if (p === '/profile/edit') {
      return <ProfileView isEditing={true} />;
    }
    if (p === '/profile') {
      return <ProfileView isEditing={false} />;
    }

    // Taxi Booking Flow
    if (p === '/taxi-booking') {
      return (
        <TaxiBookingFlow
          initialPickup="Bhilwara"
          initialDrop="Ahmedabad"
          onBack={() => navigate('/')}
          onBookingConfirmed={(b) => navigate(`/bookings/${b.id}`)}
        />
      );
    }

    // Tour Package Booking Flow
    if (p.startsWith('/tour-booking/')) {
      const tourId = p.split('/tour-booking/')[1];
      const pkg = dataStore.getTours().find((t) => t.id === tourId) || dataStore.getTours()[0];
      return (
        <TourBookingFlow
          packageData={pkg}
          onBack={() => navigate('/')}
          onBookingConfirmed={(b) => navigate(`/bookings/${b.id}`)}
        />
      );
    }

    // My Bookings List
    if (p === '/my-bookings') {
      return (
        <CustomerBookings
          onBack={() => navigate('/')}
          onSelectBooking={(b) => navigate(`/bookings/${b.id}`)}
        />
      );
    }

    // Default Customer Home
    return (
      <CustomerHome
        onStartTaxiBooking={(params) => navigate('/taxi-booking', { state: params })}
        onSelectTourPackage={(pkg) => navigate(`/tour-booking/${pkg.id}`)}
        onOpenMyBookings={() => navigate('/my-bookings')}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Application Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-left font-serif text-xl font-bold tracking-tight text-slate-950 hover:text-amber-700 transition cursor-pointer"
          >
            Rajasthan Rides
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`hover:text-amber-800 transition py-1 cursor-pointer ${
                currentRoute.path === '/' || currentRoute.path === '/home'
                  ? 'text-amber-800 font-bold border-b-2 border-amber-600'
                  : ''
              }`}
            >
              Home &amp; Booking
            </button>
            <button
              type="button"
              onClick={() => navigate('/taxi-booking')}
              className={`hover:text-amber-800 transition py-1 cursor-pointer ${
                currentRoute.path === '/taxi-booking'
                  ? 'text-amber-800 font-bold border-b-2 border-amber-600'
                  : ''
              }`}
            >
              Outstation Cabs
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-amber-800 transition py-1 cursor-pointer"
            >
              Tour Packages
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-bookings')}
              className={`hover:text-amber-800 transition py-1 cursor-pointer ${
                currentRoute.path === '/my-bookings' || currentRoute.path.startsWith('/bookings/')
                  ? 'text-amber-800 font-bold border-b-2 border-amber-600'
                  : ''
              }`}
            >
              My Bookings
            </button>
          </nav>

          {/* Zone 3: Primary action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Credentials & Login Button */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="min-h-[44px] px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
              title="Open Demo Accounts & Login Dialog"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>Demo Logins</span>
            </button>

            {/* Admin ERP switch (only for staff or direct test) */}
            <button
              type="button"
              onClick={handleSwitchToAdmin}
              className="min-h-[44px] px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
              title="Open Admin ERP / Balance Sheet / P&L"
            >
              <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">ERP Portal</span>
              <span className="sm:hidden">ERP</span>
            </button>

            {/* Authenticated Profile Button */}
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="min-h-[44px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
              title="View and edit authenticated profile"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0 border border-amber-400"
                />
              ) : (
                <Users className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-500 font-medium">({currentUser.role})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Customer Screen Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {renderCustomerMain()}
      </main>

      {/* Mobile Bottom Navigation Bar (Touch-friendly: 44px min touch target) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden sticky bottom-0 z-40 bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-around text-[10px] font-bold text-slate-600 shadow-md"
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] justify-center cursor-pointer ${
            currentRoute.path === '/' || currentRoute.path === '/home' ? 'text-amber-800' : ''
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/taxi-booking')}
          className={`flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] justify-center cursor-pointer ${
            currentRoute.path === '/taxi-booking' ? 'text-amber-800' : ''
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Book Taxi</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/my-bookings')}
          className={`flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] justify-center cursor-pointer ${
            currentRoute.path === '/my-bookings' || currentRoute.path.startsWith('/bookings/')
              ? 'text-amber-800'
              : ''
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Trips</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] justify-center cursor-pointer ${
            currentRoute.path.startsWith('/profile') ? 'text-amber-800' : 'text-slate-700'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile</span>
        </button>
        <button
          type="button"
          onClick={handleSwitchToAdmin}
          className="flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] justify-center text-amber-700 font-bold cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>ERP</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-serif font-bold text-white text-sm">Rajasthan Rides</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-[11px] text-amber-400 font-medium">
                &ldquo;More Than Rides, Beautiful Journeys&rdquo;
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bhilwara · Jaipur · Udaipur · Jodhpur · Ahmedabad · Delhi Outstation Taxi &amp; Tour Specialists
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium flex-wrap justify-center">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
            >
              Demo Logins
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="hover:text-white cursor-pointer"
            >
              My Profile
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              type="button"
              onClick={handleSwitchToAdmin}
              className="text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              Admin Financial Panel
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a href="tel:+919829014820" className="hover:text-white flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> +91 98290 14820
            </a>
          </div>
        </div>
      </footer>

      {/* Auth & Demo Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Authenticated Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
