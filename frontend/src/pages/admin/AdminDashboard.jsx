import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Wrench, CreditCard, ArrowRight, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency, formatDate, statusColor, statusLabel } from '../../utils/helpers';
import api from '../../utils/api';

function StatCard({ icon: Icon, label, value, sub, color, to }) {
  return (
    <Link to={to} className="card-hover p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color === 'green' ? 'bg-brand-green-pale' : 'bg-brand-yellow-pale'}`}>
          <Icon className={`w-5 h-5 ${color === 'green' ? 'text-brand-green' : 'text-yellow-600'}`} />
        </div>
        <ArrowRight className="w-4 h-4 text-brand-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-2xl font-bold text-brand-text">{value ?? '—'}</p>
      <p className="text-sm text-brand-text-muted mt-0.5">{label}</p>
      {sub && <p className="text-xs text-brand-green font-medium mt-1">{sub}</p>}
    </Link>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, appsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/applications?limit=5')
        ]);
        setData(dashRes.data);
        setRecentApps(appsRes.data.applications || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>;
  if (error) return <div className="p-8 text-center text-red-500">⚠️ {error}</div>;

  const stats = data?.stats || {};
  const monthly = data?.monthly_applications || [];
  const districts = data?.districts || [];
  
  // Pending services meaning submitted/pending/verification where amin is not assigned.
  const pendingAssigns = recentApps.filter(a => a.status === 'submitted' || a.status === 'pending');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Districts: {districts.join(', ') || 'None assigned'}</p>
        </div>
        <span className="badge-green">✓ Active Admin</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Customers" value={stats.total_customers || 0} color="green" to="/admin/customers" />
        <StatCard icon={UserCheck} label="Active Amins" value={stats.active_amins || 0} sub="In your districts" color="green" to="/admin/amins" />
        <StatCard icon={Wrench} label="Pending Services" value={stats.pending_services || 0} sub="Needs Attention" color="yellow" to="/admin/services" />
        <StatCard icon={CreditCard} label="District Revenue" value={formatCurrency(Number(stats.district_revenue || 0))} color="green" to="/admin/payments" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Applications Chart */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Monthly Applications</h2>
          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthly} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EE" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7C6D' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7C6D' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #A8D5B5', background: '#fff' }} />
                <Bar dataKey="count" fill="#4CAF82" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-brand-text-muted py-10">No data available yet.</p>
          )}
        </div>

        {/* Pending Alerts */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" /> Action Required
          </h2>
          <div className="space-y-3">
            {pendingAssigns.length === 0 ? (
              <p className="text-sm text-brand-text-muted py-8 text-center">No pending service assignments.</p>
            ) : (
              pendingAssigns.slice(0, 4).map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-brand-green-pale rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-brand-text capitalize">{s.service_type} — {s.district}</p>
                    <p className="text-xs text-brand-text-muted">By {s.applicant_name} · Needs Amin</p>
                  </div>
                  <Link to="/admin/services" className="btn-primary py-1.5 px-3 text-xs">Assign</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-green-pale flex items-center justify-between">
          <h2 className="font-bold text-brand-text">Recent Service Applications</h2>
          <Link to="/admin/services" className="text-sm text-brand-green font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentApps.length === 0 ? (
          <p className="text-center text-brand-text-muted py-8">No recent applications.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Customer</th>
                  <th>Service Type</th>
                  <th>District</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Assigned Amin</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map(s => (
                  <tr key={s.id}>
                    <td className="font-mono text-xs">{s.app_id}</td>
                    <td className="font-medium">{s.applicant_name}</td>
                    <td className="capitalize text-xs font-medium text-brand-text-muted">{s.service_type}</td>
                    <td className="text-xs">{s.district}</td>
                    <td className="text-xs text-brand-text-muted">{formatDate(s.created_at)}</td>
                    <td><span className={statusColor(s.status)}>{statusLabel(s.status)}</span></td>
                    <td className="text-xs font-medium">
                      {s.amin_name ? s.amin_name : <span className="text-yellow-600 font-semibold">Pending Assign</span>}
                    </td>
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
