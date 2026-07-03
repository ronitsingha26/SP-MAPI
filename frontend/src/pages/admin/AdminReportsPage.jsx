import { useState, useEffect } from 'react';
import { BarChart2, RefreshCw, TrendingUp, Users, Wrench, CreditCard, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import api from '../../utils/api';

const COLORS = ['#4CAF82', '#F5C842', '#A8D5B5', '#FDE89A', '#6B7C6D'];

export default function AdminReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, appsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/applications', { params: { limit: 500 } }),
        ]);
        
        const apps = appsRes.data.applications || [];
        const stats = dashRes.data.stats || {};
        const monthly = dashRes.data.monthly_applications || [];

        // Build service type breakdown
        const serviceBreakdown = {};
        apps.forEach(a => {
          serviceBreakdown[a.service_type] = (serviceBreakdown[a.service_type] || 0) + 1;
        });
        const serviceData = Object.entries(serviceBreakdown).map(([name, value]) => ({ name, value }));

        // Build status breakdown
        const statusBreakdown = {};
        apps.forEach(a => {
          statusBreakdown[a.status] = (statusBreakdown[a.status] || 0) + 1;
        });
        const statusData = Object.entries(statusBreakdown).map(([name, value]) => ({ name, value }));

        // District breakdown
        const districtBreakdown = {};
        apps.forEach(a => {
          if (a.district) districtBreakdown[a.district] = (districtBreakdown[a.district] || 0) + 1;
        });
        const districtData = Object.entries(districtBreakdown).map(([name, value]) => ({ name, value })).slice(0, 10);

        setData({ stats, monthly, serviceData, statusData, districtData, totalApps: apps.length });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>;
  if (error) return <div className="card p-8 text-center text-red-500">⚠️ {error}</div>;

  const { stats, monthly, serviceData, statusData, districtData, totalApps } = data;

  const handleExport = async () => {
    try {
      const res = await api.get('/admin/export/applications', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications_export_${Date.now()}.csv`);
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
          <h1 className="page-title">System Reports 📊</h1>
          <p className="page-subtitle">Analytics and performance metrics for your districts</p>
        </div>
        <button 
          onClick={handleExport}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-green-pale mb-3">
            <Wrench className="w-5 h-5 text-brand-green" />
          </div>
          <p className="text-2xl font-bold text-brand-text">{totalApps}</p>
          <p className="text-sm text-brand-text-muted">Total Applications</p>
        </div>
        <div className="card p-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-yellow-pale mb-3">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending_services || 0}</p>
          <p className="text-sm text-brand-text-muted">Pending</p>
        </div>
        <div className="card p-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-green-pale mb-3">
            <Users className="w-5 h-5 text-brand-green" />
          </div>
          <p className="text-2xl font-bold text-brand-text">{stats.total_customers || 0}</p>
          <p className="text-sm text-brand-text-muted">Total Customers</p>
        </div>
        <div className="card p-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-green-pale mb-3">
            <CreditCard className="w-5 h-5 text-brand-green" />
          </div>
          <p className="text-2xl font-bold text-brand-green">{formatCurrency(Number(stats.district_revenue || 0))}</p>
          <p className="text-sm text-brand-text-muted">Revenue</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Applications */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Monthly Applications Trend</h2>
          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EE" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7C6D' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7C6D' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #A8D5B5' }} />
                <Bar dataKey="count" fill="#4CAF82" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-brand-text-muted py-10">No data available yet.</p>}
        </div>

        {/* Service Type Pie */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Applications by Service</h2>
          {serviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={serviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                     label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {serviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-brand-text-muted py-8">No data yet.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By District */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Applications by District</h2>
          {districtData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={districtData} barSize={24} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EE" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7C6D' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6B7C6D' }} width={90} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #A8D5B5' }} />
                <Bar dataKey="value" fill="#F5C842" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-brand-text-muted py-8">No data yet.</p>}
        </div>

        {/* Status Breakdown */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Application Status Breakdown</h2>
          <div className="space-y-3">
            {statusData.map(({ name, value }) => (
              <div key={name} className="flex items-center justify-between p-3 bg-brand-green-pale rounded-xl">
                <span className="text-sm font-medium text-brand-text capitalize">{name.replace(/_/g, ' ')}</span>
                <span className="font-bold text-brand-text">{value}</span>
              </div>
            ))}
            {statusData.length === 0 && (
              <p className="text-center text-brand-text-muted py-6">No status data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
