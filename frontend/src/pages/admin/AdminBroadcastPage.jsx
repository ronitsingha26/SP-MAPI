import { useState, useEffect } from 'react';
import { Megaphone, Send, Users, RefreshCw, Bell, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';

export default function AdminBroadcastPage() {
  const [form, setForm] = useState({ title: '', message: '', target: 'all' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) { setError('Title and message are required.'); return; }
    setSending(true); setError('');
    try {
      await api.post('/admin/broadcast', form);
      setSent(true);
      setForm({ title: '', message: '', target: 'all' });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send broadcast.');
    } finally { setSending(false); }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Megaphone className="w-6 h-6 text-brand-green" />Broadcast</h1>
          <p className="page-subtitle">Send notifications to all users or a specific group</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5 flex items-center gap-2"><Bell className="w-5 h-5 text-brand-green" />Compose Notification</h2>
          {sent && (
            <div className="mb-4 p-3 bg-brand-green-pale border border-brand-green rounded-xl text-brand-green text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Broadcast sent successfully!
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>
          )}
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="label">Target Audience</label>
              <select className="input" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}>
                <option value="all">All Users</option>
                <option value="customers">Customers Only</option>
                <option value="amins">Amins Only</option>
                <option value="admins">Admins Only</option>
              </select>
            </div>
            <div>
              <label className="label">Notification Title *</label>
              <input className="input" placeholder="e.g. New Feature Announcement" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Message *</label>
              <textarea className="input min-h-[120px] resize-none" placeholder="Write your message here…"
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full justify-center gap-2 disabled:opacity-60">
              <Send className="w-4 h-4" />
              {sending ? 'Sending…' : 'Send Broadcast'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="card p-6">
          <h2 className="font-bold text-brand-text mb-5 flex items-center gap-2"><Users className="w-5 h-5 text-brand-green" />Broadcast Tips</h2>
          <div className="space-y-4 text-sm text-brand-text-muted">
            <div className="p-4 bg-brand-green-pale rounded-xl">
              <p className="font-semibold text-brand-text mb-1">📢 All Users</p>
              <p>Sends to all registered customers, amins, and admins on the platform.</p>
            </div>
            <div className="p-4 bg-brand-yellow-pale rounded-xl">
              <p className="font-semibold text-brand-text mb-1">👥 Customers Only</p>
              <p>Sends only to registered customers who have applied for services.</p>
            </div>
            <div className="p-4 bg-brand-green-pale rounded-xl">
              <p className="font-semibold text-brand-text mb-1">🔧 Amins Only</p>
              <p>Sends to field staff (amins) for operational updates.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-xs">
              <p className="font-semibold text-brand-text mb-1">ℹ️ Note</p>
              <p>Notifications appear in users' notification bell. Emails/SMS are sent if configured.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
