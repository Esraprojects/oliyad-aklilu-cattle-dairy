'use client';

import { useQuery } from '@tanstack/react-query';
import { Beef, Droplets, DollarSign, Users, TrendingUp, AlertTriangle, ShoppingCart, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import { format } from 'date-fns';

function StatCard({ icon, label, labelAm, value, sub, color, bg }: {
  icon: React.ReactNode; label: string; labelAm: string;
  value: string | number; sub?: string; color: string; bg: string;
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bg, color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-xs font-amharic text-gray-400">{labelAm}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then(r => r.data),
    refetchInterval: 60000,
  });

  const { data: trend } = useQuery({
    queryKey: ['milk-trend'],
    queryFn: () => api.get('/dashboard/milk-trend').then(r => r.data),
  });

  const { data: activity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => api.get('/dashboard/recent-activity').then(r => r.data),
  });

  const formatCurrency = (n: number) => `ETB ${n?.toLocaleString() || 0}`;

  return (
    <DashboardShell title="Dashboard" titleAm="ዳሽቦርድ">
      <div className="space-y-6">
        {/* Greeting */}
        <div className="rounded-2xl p-6 text-white"
          style={{ background: 'linear-gradient(135deg, #1B4332 0%, #40916C 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Good day! / ሰላም!</h2>
              <p className="font-amharic text-white/80 text-sm mt-1">
                ዛሬ {new Date().toLocaleDateString('am-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-white/70 text-sm mt-0.5">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <div className="text-5xl">🌄</div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<Beef size={24} />} color="#1B4332" bg="#D8F3DC"
            label="Active Cattle" labelAm="ንቁ ከብቶች"
            value={stats?.cattle?.active || 0}
            sub={`${stats?.cattle?.fattening || 0} fattening, ${stats?.cattle?.dairy || 0} dairy`}
          />
          <StatCard icon={<Droplets size={24} />} color="#0369A1" bg="#E0F2FE"
            label="Today's Milk" labelAm="ዛሬ የወተት ምርት"
            value={`${stats?.milk?.today || 0}L`}
            sub={`Month: ${stats?.milk?.month || 0}L`}
          />
          <StatCard icon={<DollarSign size={24} />} color="#8B5E3C" bg="#FEF3C7"
            label="Monthly Revenue" labelAm="ወርሃዊ ገቢ"
            value={formatCurrency(stats?.revenue?.month || 0)}
            sub={`Total: ${formatCurrency(stats?.revenue?.total || 0)}`}
          />
          <StatCard icon={<Users size={24} />} color="#7C3AED" bg="#EDE9FE"
            label="Employees" labelAm="ሰራተኞች"
            value={stats?.employees || 0}
            sub={`${stats?.pendingSales || 0} pending invoices`}
          />
        </div>

        {/* Alert Row */}
        {(stats?.lowStockFeeds > 0 || stats?.pendingSales > 0) && (
          <div className="flex flex-wrap gap-3">
            {stats?.lowStockFeeds > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: '#FEF9C3', color: '#854d0e' }}>
                <AlertTriangle size={16} />
                {stats.lowStockFeeds} feed types running low / ዝቅተኛ ክምችት
              </div>
            )}
            {stats?.pendingSales > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: '#DBEAFE', color: '#1e40af' }}>
                <ShoppingCart size={16} />
                {stats.pendingSales} unpaid invoices / ያልተከፈሉ ደረሰኞች
              </div>
            )}
          </div>
        )}

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milk trend chart */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-800">Milk Production Trend</h3>
                <p className="text-xs font-amharic text-gray-400">ያለፉት 30 ቀናት የወተት ምርት</p>
              </div>
              <div className="flex items-center gap-1 text-sm" style={{ color: '#40916C' }}>
                <TrendingUp size={16} />
                <span>30 days</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trend || []}>
                <defs>
                  <linearGradient id="milkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40916C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#40916C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }}
                  tickFormatter={d => d ? format(new Date(d), 'MMM d') : ''} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${Number(v ?? 0).toFixed(1)}L`}
                  labelFormatter={(d) => format(new Date(String(d)), 'MMM d, yyyy')} />
                <Area type="monotone" dataKey="liters" stroke="#40916C" fill="url(#milkGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick stats + recent */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} style={{ color: '#1B4332' }} />
              <h3 className="font-bold text-gray-800">Cattle Overview</h3>
            </div>
            <p className="text-xs font-amharic text-gray-400 mb-4">የከብት አጠቃላይ ሁኔታ</p>
            <div className="space-y-3">
              {[
                { label: 'Total Cattle / ጠቅላላ ከብቶች', value: stats?.cattle?.total || 0, color: '#1B4332', bg: '#D8F3DC' },
                { label: 'Fattening / ማድለብ', value: stats?.cattle?.fattening || 0, color: '#8B5E3C', bg: '#FEF3C7' },
                { label: 'Dairy Cows / ወተት አምራቾች', value: stats?.cattle?.dairy || 0, color: '#0369A1', bg: '#E0F2FE' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: s.bg }}>
                  <span className="text-sm font-amharic" style={{ color: s.color }}>{s.label}</span>
                  <span className="text-lg font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Recent Sales</h3>
              <p className="text-xs font-amharic text-gray-400">የቅርብ ጊዜ ሽያጮች</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head rounded-tl-lg">Invoice / ደረሰኝ</th>
                  <th className="table-head">Customer / ደንበኛ</th>
                  <th className="table-head">Type / አይነት</th>
                  <th className="table-head">Amount / መጠን</th>
                  <th className="table-head rounded-tr-lg">Status / ሁኔታ</th>
                </tr>
              </thead>
              <tbody>
                {activity?.recentSales?.length ? activity.recentSales.map((sale: {
                  id: string; invoiceNumber: string; customer?: { name: string };
                  type: string; totalAmount: number; status: string;
                }) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell font-mono text-xs">{sale.invoiceNumber}</td>
                    <td className="table-cell">{sale.customer?.name || 'Walk-in'}</td>
                    <td className="table-cell capitalize text-xs">{sale.type.toLowerCase()}</td>
                    <td className="table-cell font-semibold">ETB {sale.totalAmount?.toLocaleString()}</td>
                    <td className="table-cell">
                      <span className={sale.status === 'PAID' ? 'badge-paid' : sale.status === 'PENDING' ? 'badge-pending' : 'badge-active'}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="table-cell text-center text-gray-400 py-8 font-amharic">
                      No recent sales / ቅርብ ጊዜ ሽያጭ የለም
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
