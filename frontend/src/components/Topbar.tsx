'use client';

import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface TopbarProps { title: string; titleAm: string; }

export default function Topbar({ title, titleAm }: TopbarProps) {
  const { user } = useAuthStore();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        <p className="text-xs font-amharic text-gray-500">{titleAm}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search... ፈልግ"
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary w-48"
            style={{ '--tw-ring-color': '#1B4332' } as React.CSSProperties}
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#F4A261' }} />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: '#1B4332' }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
