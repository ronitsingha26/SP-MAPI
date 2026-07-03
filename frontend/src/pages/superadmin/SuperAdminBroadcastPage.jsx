import { useState } from 'react';
import { Megaphone, Send, Users, Bell, CheckCircle2 } from 'lucide-react';

export default function SuperAdminBroadcastPage() {
  const [form, setForm] = useState({ title: '', body: '', recipient_type: 'all', type: 'info' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    // API call will be added in Phase 9 (Notifications)
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setForm({ title: '', body: '', recipient_type: 'all', type: 'info' });
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Broadcast Notifications 📢</h1>
          <p className="page-subtitle">Send announcements to all users or specific groups</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-bold text-brand-text mb-6 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-brand-green" /> New Broadcast
          </h2>

          {sent && (
            <div className="mb-4 p-4 bg-brand-green-pale border border-brand-green-light rounded-xl flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <p className="text-sm font-medium text-brand-green">Broadcast notification queued for delivery!</p>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="label">Recipient Group</label>
              <select className="input" value={form.recipient_type} onChange={e => setForm({...form, recipient_type: e.target.value})}>
                <option value="all">All Users</option>
                <option value="customer">All Customers</option>
                <option value="admin">All District Admins</option>
                <option value="amin">All Amins (Surveyors)</option>
              </select>
            </div>
            <div>
              <label className="label">Notification Type</label>
              <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="info">ℹ️ Information</option>
                <option value="success">✅ Success</option>
                <option value="warning">⚠️ Warning</option>
                <option value="alert">🚨 Alert</option>
              </select>
            </div>
            <div>
              <label className="label">Title *</label>
              <input className="input" required placeholder="e.g. System Maintenance Notice" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="label">Message *</label>
              <textarea className="input min-h-[120px]" required placeholder="Write your broadcast message here..." value={form.body} onChange={e => setForm({...form, body: e.target.value})} />
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full justify-center disabled:opacity-60">
              {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Broadcast</>}
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-bold text-brand-text mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-green" /> Delivery Channels
            </h3>
            <div className="space-y-3">
              {[
                { label: 'In-App Notification', status: 'Active', color: 'badge-green' },
                { label: 'Email Notification', status: 'Coming Soon', color: 'badge-yellow' },
                { label: 'SMS Notification', status: 'Coming Soon', color: 'badge-yellow' },
                { label: 'WhatsApp', status: 'Coming Soon', color: 'badge-yellow' },
              ].map(ch => (
                <div key={ch.label} className="flex items-center justify-between p-3 bg-brand-green-pale rounded-xl">
                  <span className="text-sm font-medium text-brand-text">{ch.label}</span>
                  <span className={`${ch.color} text-xs`}>{ch.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-brand-text mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-green" /> Recipient Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-brand-text-muted">Total Customers</span><span className="font-semibold">—</span></div>
              <div className="flex justify-between"><span className="text-brand-text-muted">Total Amins</span><span className="font-semibold">—</span></div>
              <div className="flex justify-between"><span className="text-brand-text-muted">Total Admins</span><span className="font-semibold">—</span></div>
            </div>
            <p className="text-xs text-brand-text-muted mt-3">Stats will populate from live data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
