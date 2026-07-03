import { Link } from 'react-router-dom';
import { ClipboardList, CheckCircle2, Clock, ArrowRight, MapPin, User } from 'lucide-react';
import { serviceRequests } from '../../data/index';
import { formatDate, statusColor, statusLabel, serviceTypeLabel } from '../../utils/helpers';

const myTasks = serviceRequests.filter(s => s.assigned_amin === 'A001');
const completedCount = myTasks.filter(t => t.status === 'completed').length;
const activeCount = myTasks.filter(t => t.status === 'in_progress' || t.status === 'assigned').length;

export default function AminDashboard() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, Ram Chandra! 📐</h1>
          <p className="page-subtitle">District: Patna · License: BR-AMN-2018-0042</p>
        </div>
        <span className="badge-green">Active Amin</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-yellow-pale rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text">{activeCount}</p>
            <p className="text-sm text-brand-text-muted">Active Tasks</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-green-pale rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-brand-green" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text">87</p>
            <p className="text-sm text-brand-text-muted">Completed Tasks</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-yellow-pale rounded-xl flex items-center justify-center">
            <span className="text-yellow-600 text-xl">⭐</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text">4.8</p>
            <p className="text-sm text-brand-text-muted">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-brand-text text-lg">My Active Tasks</h2>
          <Link to="/amin/tasks" className="text-sm text-brand-green font-semibold hover:underline flex items-center gap-1">
            All Tasks <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-4">
          {myTasks.filter(t => t.status !== 'completed').map(t => (
            <Link key={t.id} to={`/amin/tasks/${t.id}`} className="block p-4 rounded-xl border border-brand-green-pale hover:bg-brand-green-pale/40 hover:border-brand-green transition-all group">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-brand-text group-hover:text-brand-green transition-colors">{serviceTypeLabel(t.service_type)}</p>
                  <p className="text-xs text-brand-text-muted">{t.id}</p>
                </div>
                <span className={`${statusColor(t.status)} flex-shrink-0`}>{statusLabel(t.status)}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-brand-text-muted">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-green" /> {t.district}</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {t.customer_name}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDate(t.created_at)}</span>
              </div>
            </Link>
          ))}
          {myTasks.filter(t => t.status !== 'completed').length === 0 && (
            <p className="text-center py-8 text-brand-text-muted">No active tasks. Check back later!</p>
          )}
        </div>
      </div>
    </div>
  );
}
