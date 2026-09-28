import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Car,
  UserCheck,
  Compass,
  Truck,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  PieChart,
  Scale,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  User
} from 'lucide-react';
import { dataStore } from '../../services/dataStore';

export type AdminSection =
  | 'DASHBOARD'
  | 'BOOKINGS'
  | 'CUSTOMERS'
  | 'DRIVERS'
  | 'VEHICLES'
  | 'TOURS'
  | 'VENDORS'
  | 'PAYMENTS'
  | 'EXPENSES'
  | 'ACCOUNTS'
  | 'BALANCE_SHEET'
  | 'PROFIT_LOSS'
  | 'REPORTS'
  | 'SETTINGS';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onExitAdmin: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  onExitAdmin,
  onOpenProfile,
  onLogout
}) => {
  const currentUser = dataStore.getCurrentUser();

  const operationsMenu: { section: AdminSection; label: string; icon: any; roles: string[] }[] = [
    { section: 'DASHBOARD', label: 'Executive Cockpit', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'VENDOR'] },
    { section: 'BOOKINGS', label: 'Bookings & Dispatch', icon: CalendarCheck, roles: ['ADMIN', 'MANAGER', 'VENDOR'] },
    { section: 'VEHICLES', label: 'Fleet & RC Records', icon: Car, roles: ['ADMIN', 'MANAGER', 'VENDOR'] },
    { section: 'DRIVERS', label: 'Chauffeur Staff', icon: UserCheck, roles: ['ADMIN', 'MANAGER'] },
    { section: 'TOURS', label: 'Tour Packages', icon: Compass, roles: ['ADMIN', 'MANAGER'] }
  ];

  const partiesMenu: { section: AdminSection; label: string; icon: any; roles: string[] }[] = [
    { section: 'CUSTOMERS', label: 'Customers Directory', icon: Users, roles: ['ADMIN', 'MANAGER'] },
    { section: 'VENDORS', label: 'Vendor Operators', icon: Truck, roles: ['ADMIN', 'MANAGER'] }
  ];

  const financeMenu: { section: AdminSection; label: string; icon: any; roles: string[] }[] = [
    { section: 'PAYMENTS', label: 'Customer Payments', icon: CreditCard, roles: ['ADMIN', 'MANAGER', 'VENDOR'] },
    { section: 'EXPENSES', label: 'Operating Expenses', icon: Receipt, roles: ['ADMIN', 'MANAGER'] },
    { section: 'ACCOUNTS', label: 'General Ledger', icon: FileSpreadsheet, roles: ['ADMIN'] },
    { section: 'BALANCE_SHEET', label: 'Balance Sheet', icon: Scale, roles: ['ADMIN'] },
    { section: 'PROFIT_LOSS', label: 'Profit & Loss', icon: PieChart, roles: ['ADMIN'] }
  ];

  const adminMenu: { section: AdminSection; label: string; icon: any; roles: string[] }[] = [
    { section: 'REPORTS', label: 'Reports & CSV Exports', icon: FileText, roles: ['ADMIN', 'MANAGER'] },
    { section: 'SETTINGS', label: 'Company Settings', icon: Settings, roles: ['ADMIN'] }
  ];

  const filterByRole = (items: typeof operationsMenu) =>
    items.filter((item) => item.roles.includes(currentUser.role));

  const renderNavGroup = (title: string, items: typeof operationsMenu) => {
    const visible = filterByRole(items);
    if (visible.length === 0) return null;

    return (
      <div className="space-y-1 mb-4">
        <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </div>
        {visible.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.section;

          return (
            <button
              key={item.section}
              type="button"
              onClick={() => onSelectSection(item.section)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 min-h-screen flex flex-col justify-between border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black font-serif text-base shadow-sm">
              RR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-sm text-white tracking-tight">
                  Rajasthan Rides
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Business ERP Management</p>
            </div>
          </div>
        </div>

        {/* Current User Role Notice & Profile trigger */}
        <div
          onClick={onOpenProfile}
          className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-850 transition group"
          title="Click to view and edit profile"
        >
          <div className="flex items-center gap-2 truncate">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-amber-400"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="truncate">
              <div className="text-white text-xs font-semibold truncate group-hover:text-amber-300 transition">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
            {currentUser.role}
          </span>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 overflow-y-auto max-h-[calc(100vh-220px)]">
          {renderNavGroup('Operations', operationsMenu)}
          {renderNavGroup('Directory & CRM', partiesMenu)}
          {renderNavGroup('Accounting & Finance', financeMenu)}
          {renderNavGroup('Analytics', adminMenu)}
        </nav>
      </div>

      {/* Footer Switcher & Profile / Logout Actions */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50 space-y-1.5">
        {onOpenProfile && (
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-750 text-slate-200 transition"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>My Profile</span>
          </button>
        )}

        <button
          type="button"
          onClick={onExitAdmin}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 transition"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Switch to Customer View</span>
        </button>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition"
          >
            <LogOut className="w-3 h-3" />
            <span>Log Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
