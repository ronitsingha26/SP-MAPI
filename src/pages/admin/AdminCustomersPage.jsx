import { customers } from '../../data/index';
import { statusColor, statusLabel, formatDate } from '../../utils/helpers';
import { Search, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{customers.length} registered customers</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white border border-brand-green-light rounded-xl px-4 py-3 shadow-soft">
          <Search className="w-4 h-4 text-brand-text-muted" />
          <input type="text" placeholder="Search by name or mobile..." className="bg-transparent text-sm outline-none flex-1" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-40">
          <option>All Status</option>
          <option>Active</option>
          <option>Blocked</option>
        </select>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Mobile</th>
                <th>District</th>
                <th>Bookings</th>
                <th>Services</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-green-pale rounded-full flex items-center justify-center font-semibold text-brand-green text-sm flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-text text-sm">{c.name}</p>
                        <p className="text-xs text-brand-text-muted">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-sm">+91 {c.mobile}</td>
                  <td>{c.district}</td>
                  <td className="text-center font-semibold text-brand-green">{c.bookings}</td>
                  <td className="text-center font-semibold text-yellow-600">{c.services}</td>
                  <td className="text-xs text-brand-text-muted">{c.created_at}</td>
                  <td><span className={statusColor(c.status)}>{statusLabel(c.status)}</span></td>
                  <td>
                    <button className={`text-xs font-medium ${c.status === 'active' ? 'text-red-500 hover:underline' : 'text-brand-green hover:underline'}`}>
                      {c.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
