'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.user, data.token);
      toast.success(`ጤና ይሁን, ${data.user.name}! / Welcome back!`);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Login failed / መግባት አልተቻለም');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAFAF5' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white"
        style={{ background: 'linear-gradient(180deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)' }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐄</span>
          <div>
            <p className="font-bold text-lg">Oliyad & Aklilu</p>
            <p className="text-sm font-amharic text-white/70">ኦሊያድ እና አቅሊሉ</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Manage Your Farm<br />With Confidence
          </h2>
          <p className="font-amharic text-white/80 text-lg mb-8">
            እርሻዎን በተሟላ ሁኔታ ያስተዳድሩ
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '200+', l: 'Cattle / ከብቶች' },
              { n: '500L', l: 'Daily Milk / ወተት' },
              { n: '15+', l: 'Workers / ሰራተኞች' },
              { n: '100%', l: 'Tracked / ክትትል' },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="text-2xl font-bold">{s.n}</div>
                <div className="text-xs font-amharic text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/50 text-sm">© {new Date().getFullYear()} Oliyad, Aklilu &amp; Friends</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <span className="text-4xl">🐄</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome back</h1>
          <p className="font-amharic text-gray-500 mb-8">እንኳን ተመለሱ — ወደ ስርዓቱ ይግቡ</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email / ኢሜይል
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@olyiadcattle.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password / የይለፍ ቃል
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base"
              style={{ background: '#1B4332', opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <><LogIn size={18} /> Sign In / ግባ</>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl border" style={{ borderColor: '#D8F3DC', backgroundColor: '#f0fdf4' }}>
            <p className="text-xs font-medium text-gray-600 mb-2">Demo Credentials / የሙከራ መረጃ:</p>
            <p className="text-xs text-gray-500">Admin: admin@olyiadcattle.com</p>
            <p className="text-xs text-gray-500">Password: Admin@2024!</p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            New user?{' '}
            <Link href="/register" className="font-medium" style={{ color: '#1B4332' }}>
              Register / ተመዝገቡ
            </Link>
          </p>
          <p className="text-center mt-2">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
              ← Back to Home / ወደ ዋና ገጽ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
