import { useState } from 'react';
import { Plus } from 'lucide-react';
import { amins } from '../../data/index';
import { statusColor, statusLabel } from '../../utils/helpers';

export default function AdminAminsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Amin Management</h1>
          <p className="page-subtitle">{amins.length} registered field surveyors</p>
        </div>
        <button className="btn-primary"><Plus className="w-4 h-4" /> Add Amin</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {amins.map(a => (
          <div key={a.id} className="card hover:shadow-hover transition-all duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-brand-green-pale rounded-full flex items-center justify-center font-bold text-brand-green text-lg flex-shrink-0">
                {a.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-brand-text">{a.name}</h3>
                  <span className={statusColor(a.status)}>{statusLabel(a.status)}</span>
                </div>
                <p className="text-xs text-brand-text-muted">{a.license_number}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-brand-text-muted">District</span><span className="font-medium text-brand-text">{a.district}</span></div>
              <div className="flex justify-between"><span className="text-brand-text-muted">Mobile</span><span className="font-medium text-brand-text">{a.mobile}</span></div>
              <div className="flex justify-between"><span className="text-brand-text-muted">Tasks Done</span><span className="font-bold text-brand-green">{a.tasks_completed}</span></div>
              <div className="flex justify-between"><span className="text-brand-text-muted">Active Tasks</span><span className="font-medium text-brand-text">{a.active_tasks}</span></div>
              <div className="flex justify-between"><span className="text-brand-text-muted">Rating</span>
                <span className="font-semibold text-yellow-600">⭐ {a.rating}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-brand-green-pale">
              <button className="btn-outline flex-1 py-2 text-xs justify-center">View Tasks</button>
              <button className={`flex-1 py-2 text-xs justify-center rounded-xl font-semibold transition-all ${a.status === 'active' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-brand-green-pale text-brand-green hover:bg-brand-green hover:text-white'}`}>
                {a.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
