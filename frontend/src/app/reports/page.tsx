'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, TrendingUp, Beef, Droplets, DollarSign } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import { format, subDays, startOfMonth } from 'date-fns';

const COLORS = ['#1B4332', '#40916C', '#F4A261', '#8B5E3C', '#0369A1'];

export default function ReportsPage() {
  const [tab, setTab] = useState<'weight' | 'milk' | 'sales' | 'feeding'>('weight');
  const [from, setFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: weightData = [] } = useQuery({
    queryKey: ['report-weight'],
    queryFn: () => api.get('/reports/weight-gain').then(r => r.data),
    enabled: tab === 'weight',
  });
  const { data: milkData } = useQuery({
    queryKey: ['report-milk', from, to],
    queryFn: () => api.get(`/reports/milk?from=${from}&to=${to}`).then(r => r.data),
    enabled: tab === 'milk',
  });
  const { data: salesData } = useQuery({
    queryKey: ['report-sales', from, to],
    queryFn: () => api.get(`/reports/sales?from=${from}&to=${to}`).then(r => r.data),
    enabled: tab === 'sales',
  });
  const { data: feedingData } = useQuery({
    queryKey: ['report-feeding', from, to],
    queryFn: () => api.get(`/reports/feeding-cost?from=${from}&to=${to}`).then(r => r.data),
    enabled: tab === 'feeding',
  });

  const tabs = [
    { key: 'weight', icon: <Beef size={16} />, label: 'Weight Gain', labelAm: 'ክብደት ጭማሪ' },
    { key: 'milk', icon: <Droplets size={16} />, label: 'Milk Production', labelAm: 'ወተት ምርት' },
    { key: 'sales', icon: <DollarSign size={16} />, label: 'Sales', labelAm: 'ሽያጭ' },
    { key: 'feeding', icon: <TrendingUp size={16} />, label: 'Feeding Cost', labelAm: 'የምግብ ወጪ' },
  ];

  return (
    <DashboardShell title="Reports & Analytics" titleAm="ሪፖርቶች እና ትንታኔ">
      <div className="space-y-6">
        {/* Tab bar */}
        <div className="flex flex-wrap gap-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={tab === t.key
                ? { background: '#1B4332', color: 'white' }
                : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }}>
              {t.icon}
              <span>{t.label}</span>
              <span className="font-amharic text-xs opacity-70">/ {t.labelAm}</span>
            </button>
          ))}
        </div>

        {/* Date range (for non-weight tabs) */}
        {tab !== 'weight' && (
          <div className="card py-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">From / ጀምሮ:</label>
              <input type="date" className="input-field w-auto" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">To / እስከ:</label>
              <input type="date" className="input-field w-auto" value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => { setFrom(format(subDays(new Date(), 7), 'yyyy-MM-dd')); setTo(format(new Date(), 'yyyy-MM-dd')); }}
                className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#F0FDF4', color: '#1B4332' }}>Last 7 days</button>
              <button onClick={() => { setFrom(format(startOfMonth(new Date()), 'yyyy-MM-dd')); setTo(format(new Date(), 'yyyy-MM-dd')); }}
                className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#F0FDF4', color: '#1B4332' }}>This month</button>
            </div>
          </div>
        )}

        {/* Weight Gain Report */}
        {tab === 'weight' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-bold text-gray-800 mb-1">Weight Gain by Cattle</h3>
              <p className="text-xs font-amharic text-gray-400 mb-4">እያንዳንዱ ከብት ክብደት ጭማሪ</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weightData.slice(0, 15)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="tagNumber" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number, n: string) => [`${v}kg`, n === 'gain' ? 'Weight Gain' : 'Current']} />
                  <Bar dataKey="gain" fill="#1B4332" radius={[4, 4, 0, 0]} name="gain" />
                  <Bar dataKey="currentWeight" fill="#D8F3DC" radius={[4, 4, 0, 0]} name="currentWeight" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-0 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-head">Tag / መለያ</th>
                    <th className="table-head">Breed / ዝርያ</th>
                    <th className="table-head">Initial / ዋናው</th>
                    <th className="table-head">Current / አሁን</th>
                    <th className="table-head">Gain / ጭማሪ</th>
                    <th className="table-head">Gain %</th>
                  </tr>
                </thead>
                <tbody>
                  {weightData.map((c: { id: string; tagNumber: string; name?: string; breed: string; initialWeight: number; currentWeight: number; gain: number; gainPercent: string }) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="table-cell font-mono text-xs">{c.tagNumber}{c.name && ` — ${c.name}`}</td>
                      <td className="table-cell text-sm">{c.breed}</td>
                      <td className="table-cell">{c.initialWeight}kg</td>
                      <td className="table-cell font-semibold">{c.currentWeight}kg</td>
                      <td className="table-cell">
                        <span className={`font-bold ${c.gain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {c.gain >= 0 ? '+' : ''}{c.gain}kg
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: +c.gainPercent > 0 ? '#D8F3DC' : '#FEE2E2', color: +c.gainPercent > 0 ? '#166534' : '#991B1B' }}>
                          {c.gainPercent}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Milk Report */}
        {tab === 'milk' && milkData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="card text-center">
                <p className="text-2xl font-bold" style={{ color: '#0369A1' }}>{milkData.total?.toFixed(1)}L</p>
                <p className="text-sm text-gray-600 font-amharic">ጠቅላላ / Total Milk</p>
              </div>
              <div className="card text-center">
                <p className="text-2xl font-bold text-gray-800">{milkData.count}</p>
                <p className="text-sm text-gray-600 font-amharic">ምዝገባዎች / Records</p>
              </div>
              <div className="card text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {milkData.count ? (milkData.total / milkData.count).toFixed(1) : 0}L
                </p>
                <p className="text-sm text-gray-600 font-amharic">አማካይ / Average</p>
              </div>
            </div>
            <div className="card p-0 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-head">Cow / ከብት</th>
                    <th className="table-head">Breed / ዝርያ</th>
                    <th className="table-head">Session / ጊዜ</th>
                    <th className="table-head">Liters / ሊትር</th>
                    <th className="table-head">Date / ቀን</th>
                  </tr>
                </thead>
                <tbody>
                  {milkData.records?.map((r: { id: string; cattle: { tagNumber: string; name?: string; breed: string }; session: string; liters: number; recordedAt: string }) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="table-cell font-mono text-xs">{r.cattle.tagNumber}</td>
                      <td className="table-cell text-sm">{r.cattle.breed}</td>
                      <td className="table-cell text-xs">{r.session}</td>
                      <td className="table-cell font-bold" style={{ color: '#0369A1' }}>{r.liters}L</td>
                      <td className="table-cell text-xs">{format(new Date(r.recordedAt), 'MMM d')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sales Report */}
        {tab === 'sales' && salesData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="card text-center">
                <p className="text-2xl font-bold" style={{ color: '#1B4332' }}>ETB {salesData.total?.toLocaleString()}</p>
                <p className="text-sm text-gray-600 font-amharic">ጠቅላላ ገቢ</p>
              </div>
              <div className="card text-center">
                <p className="text-2xl font-bold text-gray-800">{salesData.sales?.length}</p>
                <p className="text-sm text-gray-600 font-amharic">ሽያጮች</p>
              </div>
            </div>
            {salesData.byType?.length > 0 && (
              <div className="card flex flex-col items-center">
                <h3 className="font-bold text-gray-800 mb-4 self-start">Sales by Type / በአይነት</h3>
                <PieChart width={300} height={200}>
                  <Pie data={salesData.byType} dataKey="_sum.totalAmount" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
                    {salesData.byType.map((_: unknown, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(v: number) => `ETB ${v.toLocaleString()}`} />
                </PieChart>
              </div>
            )}
          </div>
        )}

        {/* Feeding Cost Report */}
        {tab === 'feeding' && feedingData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="card text-center">
                <p className="text-2xl font-bold" style={{ color: '#8B5E3C' }}>
                  ETB {feedingData.summary?._sum?.cost?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-600 font-amharic">ጠቅላላ ወጪ</p>
              </div>
              <div className="card text-center">
                <p className="text-2xl font-bold text-gray-800">{feedingData.summary?._count || 0}</p>
                <p className="text-sm text-gray-600 font-amharic">ምዝገባዎች</p>
              </div>
              <div className="card text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {feedingData.summary?._sum?.quantity?.toFixed(0) || 0}kg
                </p>
                <p className="text-sm text-gray-600 font-amharic">ጠቅላላ ምግብ</p>
              </div>
            </div>
            {feedingData.byFeed?.length > 0 && (
              <div className="card">
                <h3 className="font-bold text-gray-800 mb-4">Cost by Feed Type / በምግብ አይነት</h3>
                <div className="space-y-3">
                  {feedingData.byFeed.map((b: { feedId: string; feed?: { name: string; nameAm: string }; _sum: { cost: number; quantity: number } }) => (
                    <div key={b.feedId} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: '#F8F9FA' }}>
                      <div>
                        <p className="font-medium text-sm text-gray-800">{b.feed?.name || 'Unknown'}</p>
                        <p className="text-xs font-amharic text-gray-400">{b.feed?.nameAm}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: '#8B5E3C' }}>ETB {b._sum.cost?.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{b._sum.quantity?.toFixed(0)}kg used</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button className="btn-secondary text-sm">
            <Download size={16} /> Export / ወደ ውጭ ላክ
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
