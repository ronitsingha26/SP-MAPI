import { Link } from 'react-router-dom';
import { Users, Building2, Wrench, CreditCard, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { dashboardStats, bookings, serviceRequests } from '../../data/index';
import { formatCurrency } from '../../utils/helpers';

const s = dashboardStats.super_admin;
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
      <p className="text-2xl font-bold text-brand-text">{value}</p>
      <p className="text-sm text-brand-text-muted mt-0.5">{label}</p>
      {sub && <p className="text-xs text-brand-green font-medium mt-1">{sub}</p>}
    </div>
  );
}

export default function SuperAdminDashboard() {
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
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={s.total_users.toLocaleString()} color="green" />
        <StatCard icon={CreditCard} label="Bookings" value={s.total_bookings} color="yellow" />
        <StatCard icon={CreditCard} label="Revenue" value={formatCurrency(s.total_revenue)} color="green" sub="Platform Total" />
        <StatCard icon={Wrench} label="Pending Services" value={s.pending_services} color="yellow" />
        <StatCard icon={Shield} label="Active Amins" value={s.active_amins} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {/* Revenue Line Chart */}
        <div className="card p-6 xl:col-span-2">
          <h2 className="font-bold text-brand-text mb-5">Monthly Revenue (2026)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={s.monthly_revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EE" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7C6D' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7C6D' }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: '1px solid #A8D5B5' }} />
              <Line type="monotone" dataKey="revenue" stroke="#4CAF82" strokeWidth={2.5} dot={{ fill: '#4CAF82', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Charts */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Bookings by Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={s.booking_by_type} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({name, value}) => `${name}: ${value}%`} labelLine={false}>
                {s.booking_by_type.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Type Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Services by Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={s.service_by_type} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EE" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7C6D' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7C6D' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #A8D5B5' }} />
              <Bar dataKey="value" fill="#F5C842" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Manage District Admins', to: '/superadmin/admins', color: 'green' },
              { label: 'Configure Districts', to: '/superadmin/districts', color: 'yellow' },
              { label: 'Financial Reports', to: '/superadmin/financials', color: 'green' },
              { label: 'View Audit Logs', to: '/superadmin/audit', color: 'yellow' },
              { label: 'Send Broadcast', to: '/superadmin/broadcast', color: 'green' },
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
