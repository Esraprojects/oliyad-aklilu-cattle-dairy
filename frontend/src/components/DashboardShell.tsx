'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface Props {
  children: React.ReactNode;
  title: string;
  titleAm: string;
}

export default function DashboardShell({ children, title, titleAm }: Props) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FAFAF5' }}>
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col">
        <Topbar title={title} titleAm={titleAm} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
