'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, AlertTriangle } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Feed { id: string; name: string; nameAm: string; type: string; unit: string; costPerUnit: number; stockQty: number; minStock: number; }
interface Cattle { id: string; tagNumber: string; name?: string; }
interface FeedingLog { id: string; cattle: { tagNumber: string; name?: string }; feed: { name: string }; quantity: number; cost: number; fedAt: string; user: { name: string }; }

function LogFeedingModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { data: feeds = [] } = useQuery<Feed[]>({ queryKey: ['feeds'], queryFn: () => api.get('/feeds').then(r => r.data) });
  const { data: cattle = [] } = useQuery<Cattle[]>({ queryKey: ['cattle'], queryFn: () => api.get('/cattle').then(r => r.data) });
  const [form, setForm] = useState({ cattleId: '', feedId: '', quantity: '', notes: '' });

  const mutation = useMutation({
    mutationFn: () => api.post('/feeding', { ...form, quantity: +form.quantity }),
    onSuccess: () => { toast.success('Feeding logged! / ተመዝግቧል!'); qc.invalidateQueries({ queryKey: ['feeding-logs', 'feeds'] }); onClose(); },
    onError: () => toast.error('Failed / አልተሳካም'),
  });

  const selectedFeed = feeds.find(f => f.id === form.feedId);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800">Log Feeding / ምግብ ይመዝግቡ</h3>
            <p className="text-xs font-amharic text-gray-400">ከብቱን ምግብ ያስገቡ</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cattle / ከብት *</label>
            <select className="input-field" value={form.cattleId} onChange={e => setForm(p => ({ ...p, cattleId: e.target.value }))} required>
              <option value="">Select cattle / ከብት ይምረጡ</option>
              {cattle.map(c => <option key={c.id} value={c.id}>{c.tagNumber}{c.name ? ` — ${c.name}` : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Feed Type / የምግብ አይነት *</label>
            <select className="input-field" value={form.feedId} onChange={e => setForm(p => ({ ...p, feedId: e.target.value }))} required>
              <option value="">Select feed / ምግብ ይምረጡ</option>
              {feeds.map(f => <option key={f.id} value={f.id}>{f.name} ({f.nameAm}) — ETB {f.costPerUnit}/{f.unit}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({selectedFeed?.unit || 'units'}) / መጠን</label>
            <input type="number" step="0.1" className="input-field" placeholder="e.g. 5"
              value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} required />
            {selectedFeed && form.quantity && (
              <p className="text-xs text-gray-400 mt-1">
                Cost / ዋጋ: ETB {(selectedFeed.costPerUnit * +form.quantity).toFixed(2)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / ማስታወሻ</label>
            <input className="input-field" placeholder="Optional" value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1 justify-center" style={{ background: '#1B4332' }}>
              {mutation.isPending ? 'Saving...' : 'Log / ይመዝግቡ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FeedingPage() {
  const [showModal, setShowModal] = useState(false);
  const { data: feeds = [] } = useQuery<Feed[]>({ queryKey: ['feeds'], queryFn: () => api.get('/feeds').then(r => r.data) });
  const { data: logs = [], isLoading } = useQuery<FeedingLog[]>({
    queryKey: ['feeding-logs'],
    queryFn: () => api.get('/feeding').then(r => r.data),
  });
  const { data: summary } = useQuery({
    queryKey: ['feeding-summary'],
    queryFn: () => api.get('/feeding/summary').then(r => r.data),
  });

  const lowStock = feeds.filter(f => f.stockQty <= f.minStock);

  return (
    <DashboardShell title="Feeding Management" titleAm="የምግብ አስተዳደር">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div />
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ background: '#1B4332' }}>
            <Plus size={18} /> Log Feeding / ምግብ ምዝገቡ
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-800">{summary?.today?._count || 0}</div>
            <div className="text-sm text-gray-600">Today's Sessions / ዛሬ</div>
            <div className="text-xs text-gray-400 font-amharic">ETB {summary?.today?._sum?.cost?.toFixed(0) || 0}</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-800">{summary?.today?._sum?.quantity?.toFixed(0) || 0}kg</div>
            <div className="text-sm text-gray-600">Today's Feed / ዛሬ ምግብ</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-800">ETB {(summary?.month?._sum?.cost || 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Month Cost / ወርሃዊ ወጪ</div>
          </div>
        </div>

        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: '#FEF9C3' }}>
            <AlertTriangle size={18} style={{ color: '#854d0e' }} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#854d0e' }}>Low Stock Alert / ዝቅተኛ ክምችት</p>
              <p className="text-xs font-amharic mt-1" style={{ color: '#92400e' }}>
                {lowStock.map(f => `${f.name} (${f.nameAm}): ${f.stockQty}${f.unit} remaining`).join(' | ')}
              </p>
            </div>
          </div>
        )}

        {/* Feed inventory */}
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-1">Feed Inventory / የምግብ ክምችት</h3>
          <p className="text-xs font-amharic text-gray-400 mb-4">የምግብ አይነቶች እና ክምችት</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {feeds.map(f => (
              <div key={f.id} className={`rounded-xl p-4 border ${f.stockQty <= f.minStock ? 'border-yellow-300' : 'border-gray-100'}`}
                style={{ backgroundColor: f.stockQty <= f.minStock ? '#FFFBEB' : '#F8FAFC' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{f.name}</p>
                    <p className="text-xs font-amharic text-gray-400">{f.nameAm}</p>
                  </div>
                  {f.stockQty <= f.minStock && <AlertTriangle size={14} style={{ color: '#F59E0B' }} />}
                </div>
                <p className="text-xl font-bold" style={{ color: f.stockQty <= f.minStock ? '#B45309' : '#1B4332' }}>
                  {f.stockQty}{f.unit}
                </p>
                <p className="text-xs text-gray-400">ETB {f.costPerUnit}/{f.unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feeding log table */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-800">Recent Feeding Logs / የቅርብ ምግብ ምዝገባ</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Cattle / ከብት</th>
                  <th className="table-head">Feed / ምግብ</th>
                  <th className="table-head">Quantity / መጠን</th>
                  <th className="table-head">Cost / ዋጋ</th>
                  <th className="table-head">Date / ቀን</th>
                  <th className="table-head">By / ያስገባ</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="table-cell text-center py-8 text-gray-400">Loading...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={6} className="table-cell text-center py-8 text-gray-400 font-amharic">
                    No feeding logs / ምንም ምዝገባ የለም
                  </td></tr>
                ) : logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="table-cell font-mono text-xs">{log.cattle.tagNumber}</td>
                    <td className="table-cell text-sm">{log.feed.name}</td>
                    <td className="table-cell">{log.quantity}kg</td>
                    <td className="table-cell text-sm font-medium">ETB {log.cost?.toFixed(2)}</td>
                    <td className="table-cell text-xs">{format(new Date(log.fedAt), 'MMM d, yyyy HH:mm')}</td>
                    <td className="table-cell text-xs text-gray-400">{log.user?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && <LogFeedingModal onClose={() => setShowModal(false)} />}
    </DashboardShell>
  );
}
