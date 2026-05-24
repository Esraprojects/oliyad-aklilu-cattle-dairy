'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Save, User, Lock } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, setAuth, logout } = useAuthStore();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

  const profileMutation = useMutation({
    mutationFn: () => api.put('/auth/profile', profile),
    onSuccess: (res) => {
      toast.success('Profile updated! / ፕሮፋይል ተዘምኗል!');
      if (user && token) setAuth({ ...user, ...res.data }, token);
    },
    onError: () => toast.error('Failed'),
  });

  return (
    <DashboardShell title="Settings" titleAm="ቅንብሮች">
      <div className="max-w-2xl space-y-6">
        {/* Farm Info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#D8F3DC' }}>
              🏡
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Farm Information / የእርሻ መረጃ</h3>
              <p className="text-xs font-amharic text-gray-400">ስለ እርሻዎ መሰረታዊ መረጃ</p>
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: '#F8F9FA' }}>
            <p className="font-bold text-gray-800">Oliyad, Aklilu and Friends Cattle Fattening and Dairy</p>
            <p className="font-amharic text-sm text-gray-500 mt-1">ኦሊያድ፣ አቅሊሉ እና ጓደኞቻቸው የከብት ማድለብ እና የወተት ምርት</p>
            <p className="text-xs text-gray-400 mt-2">Addis Ababa, Ethiopia / አዲስ አበባ, ኢትዮጵያ</p>
          </div>
        </div>

        {/* Profile */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#D8F3DC' }}>
              <User size={18} style={{ color: '#1B4332' }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">My Profile / ፕሮፋይሌ</h3>
              <p className="text-xs font-amharic text-gray-400">የግል መረጃ ያዘምኑ</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name / ሙሉ ስም</label>
              <input className="input-field" value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email / ኢሜይል</label>
              <input className="input-field" value={user?.email || ''} disabled style={{ backgroundColor: '#f9fafb', color: '#9ca3af' }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone / ስልክ</label>
              <input className="input-field" value={profile.phone}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+251..." />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ background: '#D8F3DC', color: '#1B4332' }}>
                {user?.role}
              </span>
              <span className="text-xs text-gray-400 font-amharic">ሚና / Role</span>
            </div>
            <button onClick={() => profileMutation.mutate()} disabled={profileMutation.isPending}
              className="btn-primary" style={{ background: '#1B4332' }}>
              <Save size={16} />
              {profileMutation.isPending ? 'Saving...' : 'Save Profile / አስቀምጥ'}
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <Lock size={18} style={{ color: '#8B5E3C' }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Security / ደህንነት</h3>
              <p className="text-xs font-amharic text-gray-400">የይለፍ ቃል ቀይር</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password / አሁን ያለ ቃል</label>
              <input type="password" className="input-field" value={passwords.current}
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password / አዲስ ቃል</label>
              <input type="password" className="input-field" value={passwords.newPass}
                onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm / አረጋግጥ</label>
              <input type="password" className="input-field" value={passwords.confirm}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
            </div>
            <button className="btn-earth">
              <Lock size={16} /> Change Password / ቀይር
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border border-red-100">
          <h3 className="font-bold text-red-600 mb-2">Danger Zone / አደጋ ዞን</h3>
          <button onClick={() => { logout(); window.location.href = '/login'; }}
            className="text-sm px-4 py-2 rounded-lg font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
            Sign Out from all devices / ሙሉ ለሙሉ ውጣ
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
