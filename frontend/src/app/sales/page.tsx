'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, FileText, DollarSign } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Sale {
  id: string; invoiceNumber: string; type: string; totalAmount: number;
  paidAmount: number; status: string; saleDate: string;
  customer?: { name: string; phone?: string };
  items: { description: string; quantity: number; unitPrice: number; totalPrice: number }[];
}
interface Customer { id: string; name: string; phone?: string; }

function NewSaleModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { data: customers = [] } = useQuery<Customer[]>({ queryKey: ['customers'], queryFn: () => api.get('/customers').then(r => r.data) });
  const [form, setForm] = useState({ customerId: '', type: 'MILK', notes: '', dueDate: '' });
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);

  const addItem = () => setItems(p => [...p, { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  const updateItem = (i: number, k: string, v: string | number) => {
    setItems(p => {
      const n = [...p];
      n[i] = { ...n[i], [k]: v };
      if (k === 'quantity' || k === 'unitPrice') n[i].totalPrice = +n[i].quantity * +n[i].unitPrice;
      return n;
    });
  };
  const total = items.reduce((s, i) => s + i.totalPrice, 0);

  const mutation = useMutation({
    mutationFn: () => api.post('/sales', { ...form, items }),
    onSuccess: () => { toast.success('Sale created! / ሽያጭ ተፈጥሯል!'); qc.invalidateQueries({ queryKey: ['sales'] }); onClose(); },
    onError: () => toast.error('Failed / አልተሳካም'),
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="font-bold text-gray-800">New Sale / አዲስ ሽያጭ</h3>
            <p className="text-xs font-amharic text-gray-400">የሽያጭ ደረሰኝ ይፍጠሩ</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Type / አይነት</label>
              <select className="input-field" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option value="MILK">Milk / ወተት</option>
                <option value="CATTLE">Cattle / ከብት</option>
                <option value="DAIRY_PRODUCT">Dairy Product / የወተት ምርት</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer / ደንበኛ</label>
              <select className="input-field" value={form.customerId} onChange={e => setForm(p => ({ ...p, customerId: e.target.value }))}>
                <option value="">Walk-in / ድንገት</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date / ምላሽ ቀን</label>
              <input type="date" className="input-field" value={form.dueDate}
                onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes / ማስታወሻ</label>
              <input className="input-field" placeholder="Optional" value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Items / ዝርዝሮች</label>
              <button type="button" onClick={addItem}
                className="text-xs flex items-center gap-1 px-3 py-1 rounded-lg"
                style={{ color: '#1B4332', backgroundColor: '#D8F3DC' }}>
                <Plus size={12} /> Add Row
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input className="input-field col-span-5 text-sm" placeholder="Description / ዝርዝር"
                    value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} required />
                  <input type="number" className="input-field col-span-2 text-sm" placeholder="Qty"
                    value={item.quantity} onChange={e => updateItem(i, 'quantity', +e.target.value)} />
                  <input type="number" className="input-field col-span-2 text-sm" placeholder="Price"
                    value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', +e.target.value)} />
                  <div className="col-span-2 text-sm font-semibold text-gray-700">ETB {item.totalPrice.toFixed(0)}</div>
                  <button type="button" onClick={() => setItems(p => p.filter((_, j) => j !== i))}
                    className="col-span-1 text-red-400 hover:text-red-600"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <div className="rounded-xl px-4 py-2 text-right" style={{ background: '#D8F3DC' }}>
                <p className="text-xs font-amharic text-gray-500">ጠቅላላ / Total</p>
                <p className="text-xl font-bold" style={{ color: '#1B4332' }}>ETB {total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1 justify-center" style={{ background: '#1B4332' }}>
              {mutation.isPending ? 'Creating...' : 'Create Invoice / ደረሰኝ ፍጠር'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const { data: sales = [], isLoading } = useQuery<Sale[]>({ queryKey: ['sales'], queryFn: () => api.get('/sales').then(r => r.data) });
  const { data: summary } = useQuery({ queryKey: ['sales-summary'], queryFn: () => api.get('/sales/summary/stats').then(r => r.data) });

  const payMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => api.put(`/sales/${id}/payment`, { paidAmount: amount }),
    onSuccess: () => { toast.success('Payment recorded!'); qc.invalidateQueries({ queryKey: ['sales'] }); },
  });

  return (
    <DashboardShell title="Sales & Invoices" titleAm="ሽያጭ እና ደረሰኞች">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div />
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ background: '#1B4332' }}>
            <Plus size={18} /> New Sale / አዲስ ሽያጭ
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#D8F3DC' }}>
              <DollarSign size={22} style={{ color: '#1B4332' }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">ETB {(summary?.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue / ጠቅላላ ገቢ</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <FileText size={22} style={{ color: '#8B5E3C' }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">ETB {(summary?.monthRevenue || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">This Month / ወር</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FEF9C3' }}>
              <span className="text-xl">⏳</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{summary?.pendingCount || 0}</p>
              <p className="text-sm text-gray-600">Pending / በጥበቃ</p>
            </div>
          </div>
        </div>

        {/* Sales table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Invoice / ደረሰኝ</th>
                  <th className="table-head">Customer / ደንበኛ</th>
                  <th className="table-head">Type / አይነት</th>
                  <th className="table-head">Total / ጠቅላላ</th>
                  <th className="table-head">Paid / ተከፍሏል</th>
                  <th className="table-head">Date / ቀን</th>
                  <th className="table-head">Status / ሁኔታ</th>
                  <th className="table-head">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="table-cell text-center py-10 text-gray-400">Loading...</td></tr>
                ) : sales.length === 0 ? (
                  <tr><td colSpan={8} className="table-cell text-center py-10 text-gray-400 font-amharic">
                    No sales yet / ምንም ሽያጭ የለም
                  </td></tr>
                ) : sales.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="table-cell font-mono text-xs font-semibold">{s.invoiceNumber}</td>
                    <td className="table-cell text-sm">{s.customer?.name || 'Walk-in'}</td>
                    <td className="table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: '#E0F2FE', color: '#0369A1' }}>
                        {s.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell font-semibold">ETB {s.totalAmount?.toLocaleString()}</td>
                    <td className="table-cell text-sm" style={{ color: '#166534' }}>ETB {s.paidAmount?.toLocaleString()}</td>
                    <td className="table-cell text-xs">{format(new Date(s.saleDate), 'MMM d, yyyy')}</td>
                    <td className="table-cell">
                      <span className={s.status === 'PAID' ? 'badge-paid' : s.status === 'PENDING' ? 'badge-pending' : 'badge-active'}>
                        {s.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      {s.status !== 'PAID' && (
                        <button
                          onClick={() => payMutation.mutate({ id: s.id, amount: s.totalAmount - s.paidAmount })}
                          className="text-xs px-2 py-1 rounded-lg font-medium"
                          style={{ background: '#D8F3DC', color: '#1B4332' }}>
                          Mark Paid / ተከፍሏል
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && <NewSaleModal onClose={() => setShowModal(false)} />}
    </DashboardShell>
  );
}
