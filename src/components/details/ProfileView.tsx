import React, { useState } from 'react';
import { dataStore } from '../../services/dataStore';
import { PageHeader } from '../common/PageHeader';
import { useNavigation } from '../../context/NavigationContext';
import { User, Phone, Mail, Shield, Calendar, Edit3, CheckCircle2, AlertCircle, Save } from 'lucide-react';

interface ProfileViewProps {
  isEditing?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ isEditing: initialIsEditing = false }) => {
  const { navigate, goBack } = useNavigation();
  const currentUser = dataStore.getCurrentUser();

  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Full Name cannot be empty.');
      return;
    }

    const updated = dataStore.updateUserProfile(currentUser.id, {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      avatar: avatar.trim() || undefined
    });

    if (updated) {
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
      navigate('/profile', { replace: true });
    } else {
      setErrorMsg('Failed to update profile.');
    }
  };

  const isCustomer = currentUser.role === 'CUSTOMER';
  const parentBackFallback = isCustomer
    ? { path: '/', label: 'Back to Home' }
    : { path: '/admin', label: 'Back to Dashboard' };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title={isEditing ? 'Edit Profile' : 'User Account Profile'}
        subtitle={`Role: ${currentUser.role} · User ID: ${currentUser.id}`}
        backLabel={isEditing ? 'Back to Profile' : parentBackFallback.label}
        backFallback={isEditing ? { path: '/profile', label: 'Back to Profile' } : parentBackFallback}
        onBack={isEditing ? () => setIsEditing(false) : undefined}
        badge={
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
            {currentUser.status || 'ACTIVE'}
          </span>
        }
        actions={
          !isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : null
        }
      />

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-slate-100 text-center sm:text-left">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-amber-500 text-slate-950 font-bold font-serif text-2xl flex items-center justify-center">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-slate-900">{currentUser.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-xs text-slate-600">
              <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {currentUser.role}
              </span>
              <span>·</span>
              <span className="font-mono text-slate-500">{currentUser.email}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Account created: {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Active Member'}
            </p>
          </div>
        </div>

        {/* View Mode or Edit Mode */}
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
              <div className="font-bold text-slate-900 text-sm">{currentUser.name}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business Role</span>
              <div className="font-bold text-amber-900 text-sm">{currentUser.role}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
              <div className="font-mono font-bold text-slate-900 text-sm">{currentUser.phone}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
              <div className="font-mono font-semibold text-slate-900 text-sm">{currentUser.email}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Status</span>
              <div className="font-semibold text-emerald-700 text-sm">{currentUser.status || 'ACTIVE'}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Updated</span>
              <div className="font-mono text-slate-700 text-xs">
                {currentUser.updatedAt ? new Date(currentUser.updatedAt).toLocaleString() : 'Recent'}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold outline-none focus:border-amber-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Avatar Photo URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
