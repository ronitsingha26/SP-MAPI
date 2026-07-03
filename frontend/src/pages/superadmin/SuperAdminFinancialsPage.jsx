import { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, RefreshCw, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, formatDate, statusColor, statusLabel } from '../../utils/helpers';
import api from '../../utils/api';

const COLORS = ['#4CAF82', '#F5C842', '#A8D5B5', '#FDE89A', '#6B7C6D'];

export default function SuperAdminFinancialsPage() {
  const [data, setData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes] = await Promise.all([
          api.get('/superadmin/dashboard'),
        ]);
        setData(dashRes.data);
        // Try to fetch all payments too
        try {
          const payRes = await api.get('/superadmin/payments');
          setPayments(payRes.data.payments || []);
        } catch (_) {
          // payments endpoint may not exist yet
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load financial data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>;
  if (error) return <div className="card p-8 text-center text-red-500">⚠️ {error}</div>;

  const stats = data?.stats || {};
  const monthlyRevenue = data?.monthly_revenue || [];
  const serviceByType = data?.service_by_type || [];

  const totalRevenue = Number(stats.total_revenue || 0);
  const totalApplications = Number(stats.total_applications || 0);

  const handleExport = async () => {
    try {
      const res = await api.get('/superadmin/export/payments', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Financial Reports 💰</h1>
          <p className="page-subtitle">Platform-wide revenue and payment analytics</p>
        </div>
        <button 
          onClick={handleExport}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-green-pale mb-3">
            <CreditCard className="w-5 h-5 text-brand-green" />
          </div>
          <p className="text-2xl font-bold text-brand-green">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm text-brand-text-muted">Total Revenue</p>
        </div>
        <div className="card p-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-yellow-pale mb-3">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-brand-text">{totalApplications}</p>
          <p className="text-sm text-brand-text-muted">Total Applications</p>
        </div>
        <div className="card p-6">
          <p className="text-2xl font-bold text-brand-text">{payments.filter(p => p.status === 'success').length || '—'}</p>
          <p className="text-sm text-brand-text-muted">Successful Payments</p>
        </div>
        <div className="card p-6">
          <p className="text-2xl font-bold text-brand-text">{payments.filter(p => p.status === 'pending' || p.status === 'created').length || '—'}</p>
          <p className="text-sm text-brand-text-muted">Pending Payments</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Monthly Revenue Trend</h2>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EE" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7C6D' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7C6D' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={v => formatCurrency(Number(v))} contentStyle={{ borderRadius: '12px', border: '1px solid #A8D5B5' }} />
                <Line type="monotone" dataKey="revenue" stroke="#4CAF82" strokeWidth={2.5} dot={{ fill: '#4CAF82', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-brand-text-muted py-12">No revenue data yet.</p>}
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Revenue by Service Type</h2>
          {serviceByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={serviceByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}
                     label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {serviceByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-brand-text-muted py-8">No data yet.</p>}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-green-pale">
          <h2 className="font-bold text-brand-text">Recent Payments</h2>
        </div>
        {payments.length === 0 ? (
          <div className="p-12 text-center text-brand-text-muted">
            <p className="text-3xl mb-3">💳</p>
            <p>No payment records yet. Revenue data will appear here once payments are processed.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment Ref</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 20).map(p => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.payment_ref}</td>
                    <td className="font-medium">{p.customer_name || '—'}</td>
                    <td className="capitalize text-xs">{p.service_type || p.payment_type || '—'}</td>
                    <td className="font-bold text-brand-green">{formatCurrency(Number(p.amount))}</td>
                    <td><span className="badge-grey">{p.payment_method || '—'}</span></td>
                    <td><span className={statusColor(p.status)}>{statusLabel(p.status)}</span></td>
                    <td className="text-xs text-brand-text-muted">{p.paid_at ? formatDate(p.paid_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
