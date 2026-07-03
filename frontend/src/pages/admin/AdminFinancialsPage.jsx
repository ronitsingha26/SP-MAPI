import { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, CreditCard, RefreshCw, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import api from '../../utils/api';

function StatCard({ label, value, icon: Icon, color = 'green' }) {
  return (
    <div className="card p-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color === 'green' ? 'bg-brand-green-pale' : 'bg-brand-yellow-pale'}`}>
        <Icon className={`w-5 h-5 ${color === 'green' ? 'text-brand-green' : 'text-yellow-600'}`} />
      </div>
      <p className="text-2xl font-bold text-brand-text">{value}</p>
      <p className="text-sm text-brand-text-muted mt-0.5">{label}</p>
    </div>
  );
}

export default function AdminFinancialsPage() {
  const [data, setData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [dashRes, payRes] = await Promise.all([
          api.get('/admin/super-dashboard'),
          api.get('/admin/all-payments', { params: { limit: 30, page: 1 } }),
        ]);
        setData(dashRes.data);
        setPayments(payRes.data.payments || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load financials.');
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleExport = async () => {
    try {
      const res = await api.get('/admin/super-export/payments', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'payments_export.csv'; a.click();
    } catch (e) { alert('Export failed'); }
  };

  if (loading) return <div className="flex justify-center py-24"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>;
  if (error) return <div className="card p-8 text-center text-red-500">⚠️ {error}</div>;

  const s = data?.stats || {};
  const monthlyRevenue = data?.monthly_revenue || [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><BarChart2 className="w-6 h-6 text-brand-green" />Financial Reports</h1>
          <p className="page-subtitle">Platform-wide revenue and payment overview</p>
        </div>
        <button onClick={handleExport} className="btn-outline"><Download className="w-4 h-4" /> Export CSV</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CreditCard} label="Total Revenue" value={formatCurrency(Number(s.total_revenue || 0))} color="green" />
        <StatCard icon={TrendingUp} label="Total Users" value={Number(s.total_users || 0).toLocaleString()} color="green" />
        <StatCard icon={BarChart2} label="Pending Services" value={s.pending_services || 0} color="yellow" />
        <StatCard icon={CreditCard} label="Active Admins" value={s.total_admins || 0} color="green" />
      </div>

      {monthlyRevenue.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-brand-text mb-5">Monthly Revenue (2026)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EE" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7C6D' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7C6D' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={v => formatCurrency(Number(v))} contentStyle={{ borderRadius: '12px', border: '1px solid #A8D5B5' }} />
              <Line type="monotone" dataKey="revenue" stroke="#4CAF82" strokeWidth={2.5} dot={{ fill: '#4CAF82', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2 className="font-bold text-brand-text mb-5 flex items-center gap-2"><CreditCard className="w-5 h-5 text-brand-green" />Recent Payments</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr>
              <th>Txn ID</th><th>Customer</th><th>Amount</th><th>Service</th><th>Date</th><th>Status</th>
            </tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-brand-green-pale/20">
                  <td className="font-mono text-xs">{p.transaction_id || p.id?.slice(0, 8)}</td>
                  <td>{p.customer_name || '—'}</td>
                  <td className="font-semibold text-brand-green">{formatCurrency(Number(p.amount || 0))}</td>
                  <td className="text-brand-text-muted capitalize">{p.service_type || '—'}</td>
                  <td className="text-brand-text-muted text-sm">{p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td><span className={p.status === 'success' ? 'badge-green' : 'badge-yellow'}>{p.status}</span></td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-brand-text-muted">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
