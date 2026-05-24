'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, DollarSign } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Employee { id: string; name: string; phone?: string; position: string; salary: number; hireDate: string; isActive: boolean; }

function EmployeeModal({ onClose, employee }: { onClose: () => void; employee?: Employee | null }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: employee?.name || '', phone: employee?.phone || '',
    position: employee?.position || '', salary: employee?.salary || 0,
    address: '', hireDate: employee?.hireDate ? format(new Date(employee.hireDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
  });

  const mutation = useMutation({
    mutationFn: () => employee
      ? api.put(`/employees/${employee.id}`, form)
      : api.post('/employees', form),
    onSuccess: () => {
      toast.success(employee ? 'Updated! / ተዘምኗል!' : 'Employee added! / ሰራተኛ ተጨምሯል!');
      qc.invalidateQueries({ queryKey: ['employees'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800">{employee ? 'Edit Employee' : 'Add Employee'}</h3>
            <p className="text-xs font-amharic text-gray-400">{employee ? 'ሰራተኛ ያስተካክሉ' : 'አዲስ ሰራተኛ ጨምሩ'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name / ሙሉ ስም *</label>
            <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position / ሥራ</label>
              <input className="input-field" placeholder="e.g. Herdsman" value={form.position}
                onChange={e => setForm(p => ({ ...p, position: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (ETB)</label>
              <input type="number" className="input-field" value={form.salary}
                onChange={e => setForm(p => ({ ...p, salary: +e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone / ስልክ</label>
              <input type="tel" className="input-field" placeholder="+251..." value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date / የቀጠሩበት ቀን</label>
              <input type="date" className="input-field" value={form.hireDate}
                onChange={e => setForm(p => ({ ...p, hireDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address / አድራሻ</label>
            <input className="input-field" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1 justify-center" style={{ background: '#1B4332' }}>
              {mutation.isPending ? 'Saving...' : (employee ? 'Update' : 'Add / ጨምር')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PayrollModal({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const qc = useQueryClient();
  const now = new Date();
  const [form, setForm] = useState({ month: now.getMonth() + 1, year: now.getFullYear(), bonus: 0, deductions: 0, notes: '' });

  const mutation = useMutation({
    mutationFn: () => api.post(`/employees/${employee.id}/payroll`, form),
    onSuccess: () => { toast.success('Payroll created! / ደሞዝ ተፈጥሯል!'); qc.invalidateQueries({ queryKey: ['employees'] }); onClose(); },
    onError: () => toast.error('Already processed this month / ወርሃዊ ደሞዝ አስቀድሞ ተፈጥሯል'),
  });

  const net = employee.salary + +form.bonus - +form.deductions;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800">Process Payroll / ደሞዝ</h3>
            <p className="text-sm text-gray-500">{employee.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month / ወር</label>
              <select className="input-field" value={form.month} onChange={e => setForm(p => ({ ...p, month: +e.target.value }))}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{format(new Date(2024, i, 1), 'MMMM')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year / ዓ.ም</label>
              <input type="number" className="input-field" value={form.year}
                onChange={e => setForm(p => ({ ...p, year: +e.target.value }))} />
            </div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: '#F8F9FA' }}>
            <div className="flex justify-between text-sm mb-1"><span>Base Salary</span><span className="font-semibold">ETB {employee.salary.toLocaleString()}</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bonus (ETB) / ቦነስ</label>
            <input type="number" className="input-field" value={form.bonus}
              onChange={e => setForm(p => ({ ...p, bonus: +e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (ETB) / ቅነሳ</label>
            <input type="number" className="input-field" value={form.deductions}
              onChange={e => setForm(p => ({ ...p, deductions: +e.target.value }))} />
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: '#D8F3DC' }}>
            <p className="text-xs font-amharic text-gray-500">የተጣራ ደሞዝ / Net Salary</p>
            <p className="text-2xl font-bold" style={{ color: '#1B4332' }}>ETB {net.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1 justify-center" style={{ background: '#1B4332' }}>
              Process / ፍጠር
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [payrollEmp, setPayrollEmp] = useState<Employee | null>(null);

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => api.get('/employees').then(r => r.data),
  });

  const totalSalary = employees.filter(e => e.isActive).reduce((s, e) => s + e.salary, 0);

  return (
    <DashboardShell title="Employees & Payroll" titleAm="ሰራተኞች እና ደሞዝ">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <div className="card py-3 px-4 flex items-center gap-2">
              <span>👥</span>
              <div>
                <p className="text-lg font-bold text-gray-800">{employees.filter(e => e.isActive).length}</p>
                <p className="text-xs font-amharic text-gray-400">ንቁ ሰራተኞች</p>
              </div>
            </div>
            <div className="card py-3 px-4 flex items-center gap-2">
              <DollarSign size={18} style={{ color: '#1B4332' }} />
              <div>
                <p className="text-lg font-bold text-gray-800">ETB {totalSalary.toLocaleString()}</p>
                <p className="text-xs font-amharic text-gray-400">ወርሃዊ ደሞዝ</p>
              </div>
            </div>
          </div>
          <button onClick={() => { setEditEmp(null); setShowAdd(true); }} className="btn-primary" style={{ background: '#1B4332' }}>
            <Plus size={18} /> Add Employee / ሰራተኛ ጨምር
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-3 text-center py-12 text-gray-400 font-amharic">Loading...</div>
          ) : employees.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-400 font-amharic">No employees / ምንም ሰራተኛ የለም</div>
          ) : employees.map(emp => (
            <div key={emp.id} className={`card ${!emp.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: '#1B4332' }}>
                    {emp.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{emp.name}</p>
                    <p className="text-xs text-gray-400">{emp.position}</p>
                  </div>
                </div>
                <span className={emp.isActive ? 'badge-active' : 'badge-pending'}>
                  {emp.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {emp.phone && <p className="text-xs text-gray-500">📞 {emp.phone}</p>}
                <p className="text-xs text-gray-500">📅 {format(new Date(emp.hireDate), 'MMM d, yyyy')}</p>
                <p className="text-sm font-semibold" style={{ color: '#1B4332' }}>
                  ETB {emp.salary.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/month</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditEmp(emp); setShowAdd(true); }}
                  className="flex-1 text-xs py-2 rounded-lg font-medium"
                  style={{ background: '#F0FDF4', color: '#1B4332' }}>
                  Edit / ቀይር
                </button>
                <button onClick={() => setPayrollEmp(emp)}
                  className="flex-1 text-xs py-2 rounded-lg font-medium"
                  style={{ background: '#FEF3C7', color: '#8B5E3C' }}>
                  Payroll / ደሞዝ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(showAdd || editEmp) && <EmployeeModal employee={editEmp} onClose={() => { setShowAdd(false); setEditEmp(null); }} />}
      {payrollEmp && <PayrollModal employee={payrollEmp} onClose={() => setPayrollEmp(null)} />}
    </DashboardShell>
  );
}
