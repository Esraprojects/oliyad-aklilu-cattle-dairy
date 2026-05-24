'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setAuth(data.user, data.token);
      toast.success('Account created! / መለያ ተፈጥሯል!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FAFAF5' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🐄</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-1">Create Account</h1>
          <p className="font-amharic text-gray-500">አዲስ መለያ ይፍጠሩ</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name / ሙሉ ስም</label>
              <input type="text" className="input-field" placeholder="e.g. Oliyad Bekele"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email / ኢሜይል</label>
              <input type="email" className="input-field" placeholder="your@email.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone / ስልክ (Optional)</label>
              <input type="tel" className="input-field" placeholder="+251 91 123 4567"
                value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password / የይለፍ ቃል</label>
              <input type="password" className="input-field" placeholder="Min 8 characters"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2"
              style={{ background: '#1B4332', opacity: loading ? 0.7 : 1 }}>
              <UserPlus size={18} />
              {loading ? 'Creating...' : 'Create Account / ተመዝገቡ'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: '#1B4332' }}>
            Sign In / ግባ
          </Link>
        </p>
      </div>
    </div>
  );
}
