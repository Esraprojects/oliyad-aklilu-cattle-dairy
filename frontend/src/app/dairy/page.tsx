'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Droplets } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Cattle { id: string; tagNumber: string; name?: string; category: string; }
interface MilkRecord { id: string; cattle: { tagNumber: string; name?: string }; liters: number; session: string; recordedAt: string; user: { name: string }; fatContent?: number; }

function RecordMilkModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { data: cattle = [] } = useQuery<Cattle[]>({
    queryKey: ['cattle'],
    queryFn: () => api.get('/cattle').then(r => r.data),
  });
  const dairyCows = cattle.filter(c => c.category === 'DAIRY');
  const [form, setForm] = useState({ cattleId: '', liters: '', session: 'MORNING', fatContent: '', notes: '' });

  const mutation = useMutation({
    mutationFn: () => api.post('/milk', { ...form, liters: +form.liters, fatContent: form.fatContent ? +form.fatContent : undefined }),
    onSuccess: () => {
      toast.success('Milk recorded! / ወተት ተመዝግቧል!');
      qc.invalidateQueries({ queryKey: ['milk-records', 'milk-summary'] });
      onClose();
    },
    onError: () => toast.error('Failed / አልተሳካም'),
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800">Record Milk / ወተት ይመዝግቡ</h3>
            <p className="text-xs font-amharic text-gray-400">የወተት ምርት ያስገቡ</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dairy Cow / ወተት ከብት *</label>
            <select className="input-field" value={form.cattleId} onChange={e => setForm(p => ({ ...p, cattleId: e.target.value }))} required>
              <option value="">Select cow / ከብት ይምረጡ</option>
              {dairyCows.map(c => <option key={c.id} value={c.id}>{c.tagNumber}{c.name ? ` — ${c.name}` : ''}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session / ክፍለ ጊዜ</label>
              <select className="input-field" value={form.session} onChange={e => setForm(p => ({ ...p, session: e.target.value }))}>
                <option value="MORNING">Morning / ጠዋት</option>
                <option value="EVENING">Evening / ምሽት</option>
                <option value="MIDDAY">Midday / ቀን</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Liters / ሊትር *</label>
              <input type="number" step="0.1" className="input-field" placeholder="e.g. 12.5"
                value={form.liters} onChange={e => setForm(p => ({ ...p, liters: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fat Content % / ቅባት (%)</label>
            <input type="number" step="0.1" className="input-field" placeholder="e.g. 4.2 (optional)"
              value={form.fatContent} onChange={e => setForm(p => ({ ...p, fatContent: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / ማስታወሻ</label>
            <input className="input-field" placeholder="Optional" value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1 justify-center"
              style={{ background: '#0369A1' }}>
              {mutation.isPending ? 'Saving...' : 'Record / ይመዝግቡ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DairyPage() {
  const [showModal, setShowModal] = useState(false);

  const { data: records = [], isLoading } = useQuery<MilkRecord[]>({
    queryKey: ['milk-records'],
    queryFn: () => api.get('/milk').then(r => r.data),
  });

  const { data: summary } = useQuery({
    queryKey: ['milk-summary'],
    queryFn: () => api.get('/milk/summary').then(r => r.data),
  });

  const last7days = (() => {
    const map: Record<string, number> = {};
    records.forEach(r => {
      const d = format(new Date(r.recordedAt), 'MMM d');
      map[d] = (map[d] || 0) + r.liters;
    });
    return Object.entries(map).slice(-7).map(([date, liters]) => ({ date, liters }));
  })();

  return (
    <DashboardShell title="Dairy Production" titleAm="የወተት ምርት">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div />
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ background: '#0369A1' }}>
            <Plus size={18} /> Record Milk / ወተት ምዝገቡ
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#E0F2FE' }}>
              <Droplets size={22} style={{ color: '#0369A1' }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{summary?.todayTotal || 0}L</p>
              <p className="text-sm text-gray-600">Today / ዛሬ</p>
              <p className="text-xs font-amharic text-gray-400">ዛሬ የወተት ምርት</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#CCFBF1' }}>
              <span className="text-xl">🥛</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{summary?.monthTotal || 0}L</p>
              <p className="text-sm text-gray-600">This Month / ወር</p>
              <p className="text-xs font-amharic text-gray-400">ወርሃዊ የወተት ምርት</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#F0FDF4' }}>
              <span className="text-xl">📊</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{records.length}</p>
              <p className="text-sm text-gray-600">Total Records / ጠቅላላ</p>
              <p className="text-xs font-amharic text-gray-400">ጠቅላላ ምዝገባዎች</p>
            </div>
          </div>
        </div>

        {/* Session breakdown */}
        {summary?.bySession?.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {summary.bySession.map((s: { session: string; _sum: { liters: number } }) => (
              <div key={s.session} className="card text-center py-4" style={{ borderLeft: '4px solid #0369A1' }}>
                <p className="text-lg font-bold text-gray-800">{s._sum.liters?.toFixed(1)}L</p>
                <p className="text-xs font-amharic text-gray-500">{s.session === 'MORNING' ? 'ጠዋት' : s.session === 'EVENING' ? 'ምሽት' : 'ቀን'}</p>
                <p className="text-xs text-gray-400">{s.session}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bar chart */}
        {last7days.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-1">Daily Production (Last 7 days)</h3>
            <p className="text-xs font-amharic text-gray-400 mb-4">ያለፉት 7 ቀናት ምርት</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={last7days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${Number(v ?? 0).toFixed(1)}L`} />
                <Bar dataKey="liters" fill="#0369A1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Records table */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-800">Milk Records / የወተት ምዝገባ</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Cow / ከብት</th>
                  <th className="table-head">Session / ጊዜ</th>
                  <th className="table-head">Liters / ሊትር</th>
                  <th className="table-head">Fat % / ቅባት</th>
                  <th className="table-head">Date / ቀን</th>
                  <th className="table-head">Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="table-cell text-center py-8 text-gray-400">Loading...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={6} className="table-cell text-center py-8 text-gray-400 font-amharic">
                    No records / ምንም ምዝገባ የለም
                  </td></tr>
                ) : records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="table-cell font-mono text-xs">{r.cattle.tagNumber}{r.cattle.name && ` — ${r.cattle.name}`}</td>
                    <td className="table-cell">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: '#E0F2FE', color: '#0369A1' }}>
                        {r.session === 'MORNING' ? '☀️ Morning' : r.session === 'EVENING' ? '🌙 Evening' : '🌤️ Midday'}
                      </span>
                    </td>
                    <td className="table-cell font-bold" style={{ color: '#0369A1' }}>{r.liters}L</td>
                    <td className="table-cell text-sm">{r.fatContent ? `${r.fatContent}%` : '—'}</td>
                    <td className="table-cell text-xs">{format(new Date(r.recordedAt), 'MMM d, yyyy HH:mm')}</td>
                    <td className="table-cell text-xs text-gray-400">{r.user?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && <RecordMilkModal onClose={() => setShowModal(false)} />}
    </DashboardShell>
  );
}
