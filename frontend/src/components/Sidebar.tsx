'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Beef, Wheat, Droplets, ShoppingCart,
  Users, BarChart3, Settings, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', labelAm: 'ዳሽቦርድ' },
  { href: '/cattle', icon: Beef, label: 'Cattle', labelAm: 'ከብቶች' },
  { href: '/feeding', icon: Wheat, label: 'Feeding', labelAm: 'አቅርቦት' },
  { href: '/dairy', icon: Droplets, label: 'Dairy Production', labelAm: 'የወተት ምርት' },
  { href: '/sales', icon: ShoppingCart, label: 'Sales & Invoices', labelAm: 'ሽያጭ' },
  { href: '/employees', icon: Users, label: 'Employees', labelAm: 'ሰራተኞች' },
  { href: '/reports', icon: BarChart3, label: 'Reports', labelAm: 'ሪፖርቶች' },
  { href: '/settings', icon: Settings, label: 'Settings', labelAm: 'ቅንብሮች' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('ወጥቷል / Logged out');
    router.push('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            🐄
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Oliyad & Aklilu</p>
            <p className="text-xs font-amharic leading-tight" style={{ color: 'rgba(255,255,255,0.7)' }}>
              ኦሊያድ እና አቅሊሉ
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, labelAm }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={active ? 'sidebar-link-active' : 'sidebar-link'}
              onClick={() => setMobileOpen(false)}
              style={active ? {} : { color: 'rgba(255,255,255,0.75)' }}
            >
              <Icon size={18} />
              <span className="flex-1 text-sm">{label}</span>
              <span className="text-xs font-amharic opacity-60">{labelAm}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogOut size={16} />
          <span>Logout</span>
          <span className="font-amharic text-xs ml-1">/ ውጣ</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden"
        style={{ background: '#1B4332', color: 'white' }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg, #1B4332 0%, #2D6A4F 100%)' }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 min-h-screen fixed inset-y-0 left-0"
        style={{ background: 'linear-gradient(180deg, #1B4332 0%, #2D6A4F 100%)' }}>
        <SidebarContent />
      </aside>
    </>
  );
}
