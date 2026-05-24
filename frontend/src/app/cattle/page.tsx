'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Beef, Weight, Heart, X, ChevronDown } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Cattle {
  id: string; tagNumber: string; name?: string; breed: string; gender: string;
  category: string; status: string; currentWeight: number; initialWeight: number;
  purchasePrice: number; targetWeight?: number; color?: string; purchaseDate: string;
  weightRecords?: { weight: number; recordedAt: string }[];
}

const BREEDS = ['Boran', 'Fogera', 'Horro', 'Highland Zebu', 'Holstein-Friesian Cross', 'Simmental Cross', 'Jersey Cross', 'Other'];
const CATEGORIES = ['FATTENING', 'DAIRY', 'BREEDING', 'CALF'];
const STATUSES = ['ACTIVE', 'SOLD', 'DECEASED', 'TRANSFERRED'];

function CattleModal({ onClose, onSuccess, cattle }: {
  onClose: () => void;
  onSuccess: () => void;
  cattle?: Cattle | null;
}) {
  const [form, setForm] = useState({
    tagNumber: cattle?.tagNumber || '',
    name: cattle?.name || '',
    breed: cattle?.breed || 'Boran',
    gender: cattle?.gender || 'MALE',
    category: cattle?.category || 'FATTENING',
    status: cattle?.status || 'ACTIVE',
    currentWeight: cattle?.currentWeight || 0,
    initialWeight: cattle?.initialWeight || 0,
    targetWeight: cattle?.targetWeight || '',
    purchasePrice: cattle?.purchasePrice || 0,
    color: cattle?.color || '',
    purchaseDate: cattle?.purchaseDate ? format(new Date(cattle.purchaseDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
  });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => cattle
      ? api.put(`/cattle/${cattle.id}`, data)
      : api.post('/cattle', data),
    onSuccess: () => { toast.success(cattle ? 'Updated! / ተዘምኗል!' : 'Cattle registered! / ተመዝግቧል!'); onSuccess(); onClose(); },
    onError: () => toast.error('Failed / አልተሳካም'),
  });

  const f = (k: string, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{cattle ? 'Edit Cattle' : 'Register Cattle'}</h2>
            <p className="text-xs font-amharic text-gray-400">{cattle ? 'ከብቱን ያስተካክሉ' : 'አዲስ ከብት ይመዝግቡ'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag Number / መለያ ቁጥር *</label>
              <input className="input-field" placeholder="OAF-001" value={form.tagNumber}
                onChange={e => f('tagNumber', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name / ስም</label>
              <input className="input-field" placeholder="Optional" value={form.name}
                onChange={e => f('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breed / ዝርያ *</label>
              <select className="input-field" value={form.breed} onChange={e => f('breed', e.target.value)}>
                {BREEDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender / ጾታ</label>
              <select className="input-field" value={form.gender} onChange={e => f('gender', e.target.value)}>
                <option value="MALE">Male / ወንድ</option>
                <option value="FEMALE">Female / ሴት</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category / ምድብ</label>
              <select className="input-field" value={form.category} onChange={e => f('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status / ሁኔታ</label>
              <select className="input-field" value={form.status} onChange={e => f('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Weight (kg) / ዋናው ክብደት</label>
              <input type="number" className="input-field" value={form.initialWeight}
                onChange={e => f('initialWeight', +e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight (kg) / አሁን ክብደት</label>
              <input type="number" className="input-field" value={form.currentWeight}
                onChange={e => f('currentWeight', +e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Weight (kg) / ዒላማ ክብደት</label>
              <input type="number" className="input-field" value={form.targetWeight}
                onChange={e => f('targetWeight', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (ETB) / ዋጋ</label>
              <input type="number" className="input-field" value={form.purchasePrice}
                onChange={e => f('purchasePrice', +e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color / ቀለም</label>
              <input className="input-field" placeholder="e.g. Black & White" value={form.color}
                onChange={e => f('color', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date / የገዢ ቀን</label>
              <input type="date" className="input-field" value={form.purchaseDate}
                onChange={e => f('purchaseDate', e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel / ሰርዝ</button>
            <button type="submit" disabled={mutation.isPending}
              className="btn-primary flex-1 justify-center" style={{ background: '#1B4332' }}>
              {mutation.isPending ? 'Saving...' : (cattle ? 'Update / አዘምን' : 'Register / ምዝገቡ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function WeightModal({ cattle, onClose }: { cattle: Cattle; onClose: () => void }) {
  const qc = useQueryClient();
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const mutation = useMutation({
    mutationFn: () => api.post(`/cattle/${cattle.id}/weight`, { weight: +weight, notes }),
    onSuccess: () => {
      toast.success('Weight recorded! / ክብደት ተመዝግቧል!');
      qc.invalidateQueries({ queryKey: ['cattle'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="font-bold text-gray-800 mb-1">Record Weight / ክብደት ያስገቡ</h3>
        <p className="text-xs font-amharic text-gray-400 mb-4">
          {cattle.tagNumber} — Current: {cattle.currentWeight}kg
        </p>
        <input type="number" className="input-field mb-3" placeholder="New weight in kg"
          value={weight} onChange={e => setWeight(e.target.value)} autoFocus />
        <input className="input-field mb-4" placeholder="Notes (optional) / ማስታወሻ"
          value={notes} onChange={e => setNotes(e.target.value)} />
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={!weight || mutation.isPending}
            className="btn-primary flex-1 justify-center" style={{ background: '#1B4332' }}>
            Save / አስቀምጥ
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CattlePage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editCattle, setEditCattle] = useState<Cattle | null>(null);
  const [weightCattle, setWeightCattle] = useState<Cattle | null>(null);

  const { data: cattle = [], isLoading } = useQuery<Cattle[]>({
    queryKey: ['cattle'],
    queryFn: () => api.get('/cattle').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/cattle/${id}`),
    onSuccess: () => { toast.success('Deleted / ተሰርዟል'); qc.invalidateQueries({ queryKey: ['cattle'] }); },
  });

  const filtered = cattle.filter(c => {
    const matchSearch = c.tagNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.breed.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || c.category === filter || c.status === filter;
    return matchSearch && matchFilter;
  });

  const categoryColor: Record<string, string> = {
    FATTENING: '#8B5E3C', DAIRY: '#0369A1', BREEDING: '#7C3AED', CALF: '#0F766E',
  };
  const categoryBg: Record<string, string> = {
    FATTENING: '#FEF3C7', DAIRY: '#E0F2FE', BREEDING: '#EDE9FE', CALF: '#CCFBF1',
  };

  return (
    <DashboardShell title="Cattle Management" titleAm="የከብት አስተዳደር">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input-field pl-9" placeholder="Search cattle... / ከብት ፈልግ"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="relative">
              <select className="input-field pr-8 appearance-none"
                value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="ALL">All / ሁሉም</option>
                <option value="FATTENING">Fattening / ማድለብ</option>
                <option value="DAIRY">Dairy / ወተት</option>
                <option value="BREEDING">Breeding / ርባታ</option>
                <option value="ACTIVE">Active / ንቁ</option>
                <option value="SOLD">Sold / ተሸጠ</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <button onClick={() => { setEditCattle(null); setShowModal(true); }}
            className="btn-primary" style={{ background: '#1B4332' }}>
            <Plus size={18} /> Add Cattle / ከብት ጨምር
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total / ጠቅላላ', value: cattle.length, icon: '🐄' },
            { label: 'Fattening / ማድለብ', value: cattle.filter(c => c.category === 'FATTENING').length, icon: '📈' },
            { label: 'Dairy / ወተት', value: cattle.filter(c => c.category === 'DAIRY').length, icon: '🥛' },
            { label: 'Sold / ተሸጠ', value: cattle.filter(c => c.status === 'SOLD').length, icon: '💰' },
          ].map(s => (
            <div key={s.label} className="card text-center py-4">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-gray-800">{s.value}</div>
              <div className="text-xs font-amharic text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Tag / መለያ</th>
                  <th className="table-head">Breed / ዝርያ</th>
                  <th className="table-head">Category / ምድብ</th>
                  <th className="table-head">Weight / ክብደት</th>
                  <th className="table-head">Gain / ጭማሪ</th>
                  <th className="table-head">Status / ሁኔታ</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="table-cell text-center py-12 text-gray-400">Loading... / በመጫን ላይ...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="table-cell text-center py-12 text-gray-400 font-amharic">
                    No cattle found / ምንም ከብት አልተገኘም
                  </td></tr>
                ) : filtered.map(c => {
                  const gain = c.currentWeight - c.initialWeight;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell">
                        <div>
                          <div className="font-mono font-semibold text-gray-800 text-sm">{c.tagNumber}</div>
                          {c.name && <div className="font-amharic text-xs text-gray-400">{c.name}</div>}
                        </div>
                      </td>
                      <td className="table-cell text-sm">{c.breed}</td>
                      <td className="table-cell">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: categoryBg[c.category], color: categoryColor[c.category] }}>
                          {c.category}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm font-semibold">{c.currentWeight}kg</div>
                        {c.targetWeight && (
                          <div className="text-xs text-gray-400">Target: {c.targetWeight}kg</div>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className={`text-sm font-medium ${gain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {gain >= 0 ? '+' : ''}{gain}kg
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={c.status === 'ACTIVE' ? 'badge-active' : c.status === 'SOLD' ? 'badge-sold' : 'badge-pending'}>
                          {c.status}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button title="Record weight" onClick={() => setWeightCattle(c)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                            <Weight size={15} />
                          </button>
                          <button title="Edit" onClick={() => { setEditCattle(c); setShowModal(true); }}
                            className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" style={{ color: '#1B4332' }}>
                            <Beef size={15} />
                          </button>
                          <button title="Health" className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                            <Heart size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <CattleModal cattle={editCattle} onClose={() => { setShowModal(false); setEditCattle(null); }}
          onSuccess={() => qc.invalidateQueries({ queryKey: ['cattle'] })} />
      )}
      {weightCattle && (
        <WeightModal cattle={weightCattle} onClose={() => setWeightCattle(null)} />
      )}
    </DashboardShell>
  );
}
