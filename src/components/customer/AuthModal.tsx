import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { UserRole } from '../../types/rrTypes';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Phone,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [email, setEmail] = useState('admin@rajasthantaxi.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('9000000001');
  const [otp, setOtp] = useState('1234');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const DEMO_CREDENTIALS: {
    role: UserRole;
    title: string;
    description: string;
    email: string;
    password: string;
    phone: string;
    badgeColor: string;
  }[] = [
    {
      role: 'ADMIN',
      title: 'Administrator',
      description: 'Full business access, P&L, balance sheet, accounting & operations',
      email: 'admin@rajasthantaxi.com',
      password: 'Admin@123',
      phone: '+91 90000 00001',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
    },
    {
      role: 'MANAGER',
      title: 'Operations Manager',
      description: 'Trip dispatch, fleet, drivers, tours & operational reports',
      email: 'manager@rajasthantaxi.com',
      password: 'Manager@123',
      phone: '+91 90000 00002',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
    },
    {
      role: 'VENDOR',
      title: 'Royal Travels Vendor',
      description: 'Assigned fleet vehicles, vendor trips, earnings & payout ledger',
      email: 'vendor@rajasthantaxi.com',
      password: 'Vendor@123',
      phone: '+91 90000 00003',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-300'
    },
    {
      role: 'CUSTOMER',
      title: 'Customer (Rahul Sharma)',
      description: 'Outstation cabs, custom tour planning, booking tickets & invoices',
      email: 'customer@rajasthantaxi.com',
      password: 'Customer@123',
      phone: '+91 90000 00004',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
    }
  ];

  // Pre-fill fields for user
  const handleSelectDemoAccount = (account: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setPhone(account.phone.replace(/[^0-9]/g, ''));
    setErrorMessage('');
  };

  // 1-Click Direct Login as Role
  const handleDirectLoginAs = (account: typeof DEMO_CREDENTIALS[0]) => {
    const res = dataStore.login(account.email, account.password);
    if (res.success && res.user) {
      onSuccess(res.user.role);
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to authenticate');
    }
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = dataStore.login(email, password);
    if (res.success && res.user) {
      onSuccess(res.user.role);
      onClose();
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please select a demo account.');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage('');
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Resolves phone to user or creates customer
    const user = dataStore.loginWithPhoneOrRole(phone);
    if (user) {
      onSuccess(user.role);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-slate-950 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black font-serif text-lg shadow-sm">
              RR
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                Rajasthan Rides Portal
              </h3>
              <p className="text-xs text-amber-300/90 font-medium">
                Sign in to your account or test any business role
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close login dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Main Login Form (5 cols on lg) */}
          <div className="lg:col-span-5 p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-5 bg-white">
            <div>
              <h4 className="font-serif text-xl font-bold text-slate-900">
                Welcome Back
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your credentials or choose a 1-click demo account.
              </p>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => { setAuthMode('PASSWORD'); setErrorMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'PASSWORD'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('OTP'); setErrorMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'OTP'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mobile OTP
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {authMode === 'PASSWORD' ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@rajasthantaxi.com"
                      className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password *
                    </label>
                    <span className="text-[10px] text-slate-400">Case-sensitive</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-600 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-amber-200 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9000000001"
                      className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-600 outline-none"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Enter 4-Digit OTP (Use 1234)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full text-center text-lg font-mono font-bold tracking-[0.5em] py-2 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-600 outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>{otpSent ? 'Verify OTP & Login' : 'Send One-Time Passcode'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Demo Accounts Showcase (7 cols on lg) */}
          <div className="lg:col-span-7 p-6 sm:p-7 bg-slate-50/70 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Demo Accounts</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Demo accounts — for testing different dashboards and permissions
              </p>
            </div>

            <div className="space-y-3">
              {DEMO_CREDENTIALS.map((account) => {
                const isSelected = email.toLowerCase() === account.email.toLowerCase();

                return (
                  <div
                    key={account.role}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-white border-amber-500 shadow-sm ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${account.badgeColor}`}>
                          {account.role}
                        </span>
                        <h5 className="font-bold text-xs text-slate-900">{account.title}</h5>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectDemoAccount(account)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                          title="Populate into login form"
                        >
                          Use Account
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDirectLoginAs(account)}
                          className="px-3 py-1 text-[11px] font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-2xs transition"
                          title={`Instantly authenticate as ${account.role}`}
                        >
                          Login as {account.role}
                        </button>
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email</span>
                        <span className="font-mono text-slate-800 text-[11px] select-all font-semibold">
                          {account.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Password</span>
                        <span className="font-mono text-slate-800 text-[11px] select-all font-semibold">
                          {account.password}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {account.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-950 flex items-center justify-between">
              <span>Security Note: These are pre-provisioned sandbox demo accounts.</span>
              <span className="font-bold text-amber-900">Padharo Mhare Desh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
