import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppRoute, BreadcrumbItem, FallbackRoute } from '../types/navigationTypes';
import { dataStore } from '../services/dataStore';
import { UserRole } from '../types/rrTypes';

interface NavigationContextType {
  currentRoute: AppRoute;
  previousRoute: AppRoute | null;
  historyStack: AppRoute[];
  canGoBack: boolean;
  navigate: (path: string, options?: { state?: any; replace?: boolean; title?: string }) => void;
  goBack: (fallback?: FallbackRoute) => void;
  getBreadcrumbs: () => BreadcrumbItem[];
  getRoleAwareFallback: (path: string, role: UserRole) => FallbackRoute;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

// Extract clean path from browser location (supports both hash and pathname)
function parseBrowserPath(): { path: string; search: string } {
  if (typeof window === 'undefined') return { path: '/', search: '' };
  
  // Prefer hash path if present (e.g. #/admin/bookings/RR-1001)
  const hash = window.location.hash;
  if (hash && hash.length > 1) {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    const [pathPart, queryPart] = raw.split('?');
    return { path: pathPart.startsWith('/') ? pathPart : '/' + pathPart, search: queryPart ? '?' + queryPart : '' };
  }

  // Fall back to pathname
  const path = window.location.pathname || '/';
  const search = window.location.search || '';
  return { path, search };
}

// Generate sensible title for a path
function getRouteTitle(path: string): string {
  if (path === '/' || path === '/home') return 'Home';
  if (path === '/taxi-booking') return 'Outstation Taxi Booking';
  if (path.startsWith('/tour-booking')) return 'Tour Package Booking';
  if (path === '/my-bookings') return 'My Bookings';
  if (path.startsWith('/bookings/')) {
    const id = path.split('/bookings/')[1];
    return `Booking #${id}`;
  }
  if (path === '/profile') return 'My Profile';
  if (path === '/profile/edit') return 'Edit Profile';

  // Admin routes
  if (path === '/admin' || path === '/admin/dashboard') return 'ERP Dashboard';
  if (path === '/admin/bookings') return 'Bookings & Dispatch';
  if (path.startsWith('/admin/bookings/')) {
    const id = path.split('/admin/bookings/')[1];
    return `Booking #${id}`;
  }
  if (path === '/admin/customers') return 'Customer Directory';
  if (path.startsWith('/admin/customers/')) {
    const id = path.split('/admin/customers/')[1];
    return `Customer Details (${id})`;
  }
  if (path === '/admin/drivers') return 'Chauffeurs & Drivers';
  if (path.startsWith('/admin/drivers/')) {
    const id = path.split('/admin/drivers/')[1];
    return `Driver Profile (${id})`;
  }
  if (path === '/admin/vehicles') return 'Fleet Vehicles';
  if (path.startsWith('/admin/vehicles/')) {
    const id = path.split('/admin/vehicles/')[1];
    return `Vehicle Details (${id})`;
  }
  if (path === '/admin/tours') return 'Tour Packages';
  if (path.startsWith('/admin/tours/')) {
    const id = path.split('/admin/tours/')[1];
    return `Tour Package (${id})`;
  }
  if (path === '/admin/vendors') return 'Vendor Partners';
  if (path.startsWith('/admin/vendors/')) {
    const id = path.split('/admin/vendors/')[1];
    return `Vendor Details (${id})`;
  }
  if (path === '/admin/payments') return 'Payment Transactions';
  if (path.startsWith('/admin/payments/')) {
    const id = path.split('/admin/payments/')[1];
    return `Payment Receipt (${id})`;
  }
  if (path === '/admin/expenses') return 'Business Expenses';
  if (path.startsWith('/admin/expenses/')) {
    const id = path.split('/admin/expenses/')[1];
    return `Expense Details (${id})`;
  }
  if (path === '/admin/accounts') return 'Accounts & Ledger';
  if (path === '/admin/balance-sheet') return 'Balance Sheet';
  if (path === '/admin/profit-loss') return 'Profit & Loss Statement';
  if (path === '/admin/reports') return 'Business Reports';
  if (path.startsWith('/admin/reports/')) {
    const id = path.split('/admin/reports/')[1];
    return `Report Details (${id})`;
  }
  if (path === '/admin/settings') return 'Business Settings';

  return 'Rajasthan Rides';
}

// Extract URL params from a path pattern
function extractParams(pattern: string, path: string): Record<string, string> {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  const params: Record<string, string> = {};

  if (patternParts.length !== pathParts.length) return params;

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const key = patternParts[i].slice(1);
      params[key] = decodeURIComponent(pathParts[i]);
    }
  }
  return params;
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = useMemo(() => {
    const { path } = parseBrowserPath();
    return {
      path,
      title: getRouteTitle(path),
      params: {},
      timestamp: Date.now()
    };
  }, []);

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(initial);
  const [historyStack, setHistoryStack] = useState<AppRoute[]>([initial]);
  const [userRole, setUserRole] = useState<UserRole>(() => dataStore.getCurrentUser().role);

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      const role = dataStore.getCurrentUser().role;
      setUserRole(role);
    });
    return unsub;
  }, []);

  // Sync with browser URL popstate and hashchange
  useEffect(() => {
    const handlePopState = (e?: Event) => {
      const { path } = parseBrowserPath();
      const popState = (e as PopStateEvent | undefined)?.state;
      const state = popState?.state;
      const title = popState?.title || getRouteTitle(path);

      setCurrentRoute({
        path,
        title,
        params: {},
        state,
        timestamp: Date.now()
      });

      // Update history stack
      setHistoryStack((prev) => {
        if (prev.length > 1) {
          return prev.slice(0, -1);
        }
        return [{ path, title, params: {}, state, timestamp: Date.now() }];
      });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Role-aware fallback calculator
  const getRoleAwareFallback = useCallback((path: string, role: UserRole): FallbackRoute => {
    // Booking Details fallback
    if (path.includes('/bookings/')) {
      if (role === 'CUSTOMER') {
        return { path: '/my-bookings', label: 'Back to My Bookings' };
      }
      if (role === 'VENDOR') {
        return { path: '/admin/bookings', label: 'Back to Vendor Bookings' };
      }
      return { path: '/admin/bookings', label: 'Back to Bookings' };
    }

    // Customer Details fallback
    if (path.includes('/customers/')) {
      return { path: '/admin/customers', label: 'Back to Customers' };
    }

    // Driver Details fallback
    if (path.includes('/drivers/')) {
      return { path: '/admin/drivers', label: 'Back to Drivers' };
    }

    // Vehicle Details fallback
    if (path.includes('/vehicles/')) {
      return { path: '/admin/vehicles', label: 'Back to Vehicles' };
    }

    // Tour Details fallback
    if (path.includes('/tours/') || path.startsWith('/tour-booking')) {
      return role === 'CUSTOMER' 
        ? { path: '/', label: 'Back to Tours' }
        : { path: '/admin/tours', label: 'Back to Tours' };
    }

    // Vendor Details fallback
    if (path.includes('/vendors/')) {
      return { path: '/admin/vendors', label: 'Back to Vendors' };
    }

    // Payment Details fallback
    if (path.includes('/payments/')) {
      return role === 'CUSTOMER'
        ? { path: '/my-bookings', label: 'Back to Bookings' }
        : { path: '/admin/payments', label: 'Back to Payments' };
    }

    // Expense Details fallback
    if (path.includes('/expenses/')) {
      return { path: '/admin/expenses', label: 'Back to Expenses' };
    }

    // Report Details fallback
    if (path.includes('/reports/')) {
      return { path: '/admin/reports', label: 'Back to Reports' };
    }

    // Profile & Edit Profile fallback
    if (path === '/profile/edit') {
      return { path: '/profile', label: 'Back to Profile' };
    }
    if (path === '/profile') {
      return role === 'CUSTOMER'
        ? { path: '/', label: 'Back to Home' }
        : { path: '/admin', label: 'Back to Dashboard' };
    }

    // Multi-step taxi booking fallback
    if (path === '/taxi-booking') {
      return { path: '/', label: 'Back to Home' };
    }

    // Default admin fallbacks
    if (path.startsWith('/admin/')) {
      return { path: '/admin', label: 'Back to Dashboard' };
    }

    return { path: '/', label: 'Back to Home' };
  }, []);

  // Navigate to a new route
  const navigate = useCallback((to: string, options?: { state?: any; replace?: boolean; title?: string }) => {
    const cleanPath = to.startsWith('/') ? to : '/' + to;
    const title = options?.title || getRouteTitle(cleanPath);

    const newRoute: AppRoute = {
      path: cleanPath,
      title,
      params: {},
      state: options?.state,
      timestamp: Date.now()
    };

    if (typeof window !== 'undefined') {
      const stateObj = { path: cleanPath, title, state: options?.state };
      const hashUrl = '#' + cleanPath;

      if (options?.replace) {
        window.history.replaceState(stateObj, title, hashUrl);
      } else {
        window.history.pushState(stateObj, title, hashUrl);
      }
    }

    setCurrentRoute(newRoute);

    setHistoryStack((prev) => {
      if (options?.replace) {
        return [...prev.slice(0, -1), newRoute];
      }
      return [...prev, newRoute];
    });
  }, []);

  // Go Back with smart fallback
  const goBack = useCallback((fallback?: FallbackRoute) => {
    // If there is actual history stack from user navigation in this session
    if (historyStack.length > 1) {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
        return;
      }
      // If window.history was at root, pop stack manually
      const prev = historyStack[historyStack.length - 2];
      setHistoryStack((s) => s.slice(0, -1));
      navigate(prev.path, { replace: true, state: prev.state, title: prev.title });
      return;
    }

    // No valid previous history in session (e.g. direct URL entry) -> use Smart Fallback!
    const effectiveFallback = fallback || getRoleAwareFallback(currentRoute.path, userRole);
    navigate(effectiveFallback.path, { replace: true });
  }, [historyStack, currentRoute.path, userRole, getRoleAwareFallback, navigate]);

  const previousRoute = historyStack.length > 1 ? historyStack[historyStack.length - 2] : null;
  const canGoBack = historyStack.length > 1 || currentRoute.path !== '/';

  // Compute breadcrumbs for current page
  const getBreadcrumbs = useCallback((): BreadcrumbItem[] => {
    const p = currentRoute.path;
    const items: BreadcrumbItem[] = [];

    if (p.startsWith('/admin')) {
      items.push({ label: 'Dashboard', path: '/admin', onClick: () => navigate('/admin') });

      if (p === '/admin' || p === '/admin/dashboard') {
        return items;
      }

      if (p.startsWith('/admin/bookings')) {
        items.push({ label: 'Bookings', path: '/admin/bookings', onClick: () => navigate('/admin/bookings') });
        if (p.includes('/admin/bookings/')) {
          const id = p.split('/admin/bookings/')[1];
          items.push({ label: `Booking #${id}` });
        }
      } else if (p.startsWith('/admin/customers')) {
        items.push({ label: 'Customers', path: '/admin/customers', onClick: () => navigate('/admin/customers') });
        if (p.includes('/admin/customers/')) {
          const id = p.split('/admin/customers/')[1];
          const cust = dataStore.getCustomers().find((c) => c.id === id);
          items.push({ label: cust ? cust.name : id });
        }
      } else if (p.startsWith('/admin/vehicles')) {
        items.push({ label: 'Vehicles', path: '/admin/vehicles', onClick: () => navigate('/admin/vehicles') });
        if (p.includes('/admin/vehicles/')) {
          const id = p.split('/admin/vehicles/')[1];
          const veh = dataStore.getVehicles().find((v) => v.id === id);
          items.push({ label: veh ? `${veh.model} (${veh.vehicleNumber})` : id });
        }
      } else if (p.startsWith('/admin/drivers')) {
        items.push({ label: 'Drivers', path: '/admin/drivers', onClick: () => navigate('/admin/drivers') });
        if (p.includes('/admin/drivers/')) {
          const id = p.split('/admin/drivers/')[1];
          const drv = dataStore.getDrivers().find((d) => d.id === id);
          items.push({ label: drv ? drv.name : id });
        }
      } else if (p.startsWith('/admin/vendors')) {
        items.push({ label: 'Vendors', path: '/admin/vendors', onClick: () => navigate('/admin/vendors') });
        if (p.includes('/admin/vendors/')) {
          const id = p.split('/admin/vendors/')[1];
          const vnd = dataStore.getVendors().find((v) => v.id === id);
          items.push({ label: vnd ? vnd.name : id });
        }
      } else if (p.startsWith('/admin/tours')) {
        items.push({ label: 'Tour Packages', path: '/admin/tours', onClick: () => navigate('/admin/tours') });
        if (p.includes('/admin/tours/')) {
          const id = p.split('/admin/tours/')[1];
          const tour = dataStore.getTours().find((t) => t.id === id);
          items.push({ label: tour ? tour.title : id });
        }
      } else if (p.startsWith('/admin/payments')) {
        items.push({ label: 'Payments', path: '/admin/payments', onClick: () => navigate('/admin/payments') });
        if (p.includes('/admin/payments/')) {
          const id = p.split('/admin/payments/')[1];
          items.push({ label: `Receipt #${id}` });
        }
      } else if (p.startsWith('/admin/expenses')) {
        items.push({ label: 'Expenses', path: '/admin/expenses', onClick: () => navigate('/admin/expenses') });
        if (p.includes('/admin/expenses/')) {
          const id = p.split('/admin/expenses/')[1];
          items.push({ label: `Expense #${id}` });
        }
      } else if (p === '/admin/accounts') {
        items.push({ label: 'Accounts & Ledger' });
      } else if (p === '/admin/balance-sheet') {
        items.push({ label: 'Balance Sheet' });
      } else if (p === '/admin/profit-loss') {
        items.push({ label: 'Profit & Loss' });
      } else if (p.startsWith('/admin/reports')) {
        items.push({ label: 'Reports', path: '/admin/reports', onClick: () => navigate('/admin/reports') });
        if (p.includes('/admin/reports/')) {
          const id = p.split('/admin/reports/')[1];
          items.push({ label: `Report (${id})` });
        }
      } else if (p === '/admin/settings') {
        items.push({ label: 'Settings' });
      } else if (p === '/admin/profile') {
        items.push({ label: 'Profile' });
      } else if (p === '/admin/profile/edit') {
        items.push({ label: 'Profile', path: '/admin/profile', onClick: () => navigate('/admin/profile') });
        items.push({ label: 'Edit' });
      }
      return items;
    }

    // Customer App Breadcrumbs
    items.push({ label: 'Home', path: '/', onClick: () => navigate('/') });

    if (p === '/' || p === '/home') return items;

    if (p === '/taxi-booking') {
      items.push({ label: 'Outstation Taxi Booking' });
    } else if (p.startsWith('/tour-booking')) {
      const id = p.split('/tour-booking/')[1];
      const pkg = dataStore.getTours().find((t) => t.id === id);
      items.push({ label: 'Tour Packages', path: '/', onClick: () => navigate('/') });
      items.push({ label: pkg ? pkg.title : 'Tour Details' });
    } else if (p === '/my-bookings') {
      items.push({ label: 'My Bookings' });
    } else if (p.startsWith('/bookings/')) {
      const id = p.split('/bookings/')[1];
      items.push({ label: 'My Bookings', path: '/my-bookings', onClick: () => navigate('/my-bookings') });
      items.push({ label: `Booking #${id}` });
    } else if (p === '/profile') {
      items.push({ label: 'Profile' });
    } else if (p === '/profile/edit') {
      items.push({ label: 'Profile', path: '/profile', onClick: () => navigate('/profile') });
      items.push({ label: 'Edit Profile' });
    }

    return items;
  }, [currentRoute.path, navigate]);

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        previousRoute,
        historyStack,
        canGoBack,
        navigate,
        goBack,
        getBreadcrumbs,
        getRoleAwareFallback
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return ctx;
};
