import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wrench, CreditCard, TrendingUp, Shield, ArrowRight, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import api from '../../utils/api';

const COLORS = ['#4CAF82', '#F5C842', '#A8D5B5', '#FDE89A'];

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color === 'green' ? 'bg-brand-green-pale' : 'bg-brand-yellow-pale'}`}>
          <Icon className={`w-5 h-5 ${color === 'green' ? 'text-brand-green' : 'text-yellow-600'}`} />
        </div>
        <TrendingUp className="w-4 h-4 text-brand-green opacity-60" />
      </div>
      <p className="text-2xl font-bold text-brand-text">{value ?? '—'}</p>
      <p className="text-sm text-brand-text-muted mt-0.5">{label}</p>
      {sub && <p className="text-xs text-brand-green font-medium mt-1">{sub}</p>}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/superadmin/dashboard');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 mb-2">⚠️ {error}</p>
        <button onClick={() => window.location.reload()} className="btn-outline mt-2">Retry</button>
      </div>
    );
  }

  const s = stats?.stats || {};
  const monthlyRevenue = stats?.monthly_revenue || [];
  const serviceByType  = stats?.service_by_type  || [];
  const bookingByType  = stats?.booking_by_type  || [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Master Dashboard 👑</h1>
          <p className="page-subtitle">Platform-wide overview — SP MAPI</p>
        </div>
        <span className="badge-green">Super Admin</span>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Users}      label="Total Users"        value={Number(s.total_users || 0).toLocaleString()} color="green" />
        <StatCard icon={Shield}     label="Active Admins"      value={s.total_admins || 0}                          color="green" />
        <StatCard icon={CreditCard} label="Total Revenue"      value={formatCurrency(Number(s.total_revenue || 0))} color="green" sub="Platform Total" />
        <StatCard icon={Wrench}     label="Pending Services"   value={s.pending_services || 0}                      color="yellow" />
        <StatCard icon={Shield}     label="Active Amins"       value={s.active_amins || 0}                          color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {/* Revenue Line Chart */}
        <div className="card p-6 xl:col-span-2">
          <h2 className="font-bold text-brand-text mb-5">Monthly Revenue (2026)</h2>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EE" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7C6D' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7C6D' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={v => formatCurrency(Number(v))} contentStyle={{ borderRadius: '12px', border: '1px solid #A8D5B5' }} />
                <Line type="monotone" dataKey="revenue" stroke="#4CAF82" strokeWidth={2.5} dot={{ fill: '#4CAF82', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-brand-text-muted py-12">No revenue data yet.</p>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Services by Type</h2>
          {bookingByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bookingByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}
                     label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {bookingByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-brand-text-muted py-8">No data yet.</p>
          )}
        </div>
      </div>

      {/* Service Type Bar + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Applications by Service Type</h2>
          {serviceByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={serviceByType} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EE" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7C6D' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7C6D' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #A8D5B5' }} />
                <Bar dataKey="value" fill="#F5C842" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-brand-text-muted py-8">No data yet.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Manage District Admins', to: '/superadmin/admins',    color: 'green' },
              { label: 'Configure Districts',    to: '/superadmin/districts', color: 'yellow' },
              { label: 'View All Users',         to: '/superadmin/users',     color: 'green' },
              { label: 'Financial Reports',      to: '/superadmin/financials',color: 'green' },
              { label: 'View Audit Logs',        to: '/superadmin/audit',     color: 'yellow' },
            ].map(({ label, to, color }) => (
              <Link key={to} to={to} className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-soft ${color === 'green' ? 'border-brand-green-light hover:bg-brand-green-pale' : 'border-brand-yellow-light hover:bg-brand-yellow-pale'}`}>
                <span className="text-sm font-medium text-brand-text">{label}</span>
                <ArrowRight className={`w-4 h-4 ${color === 'green' ? 'text-brand-green' : 'text-yellow-600'}`} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
