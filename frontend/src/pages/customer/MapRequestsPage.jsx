import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, RefreshCw, Plus } from 'lucide-react';
import api from '../../utils/api';

const STATUS_LABEL = { submitted:'Submitted', verification:'Verification', map_preparation:'Map Preparation', ready:'Ready', delivered:'Delivered', completed:'Completed', rejected:'Rejected' };
const STATUS_COLOR = { submitted:'badge-grey', verification:'badge-yellow', map_preparation:'badge-yellow', ready:'badge-green', delivered:'badge-green', completed:'badge-blue', rejected:'badge-red' };

export default function MapRequestsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/applications').then(res => {
      setApps((res.data.applications || []).filter(a => a.service_type === 'map'));
    }).catch(err => {
      setError(err.response?.data?.message || 'Failed to load.');
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Map className="w-5 h-5 text-blue-500" /> Map Requests</h1>
          <p className="page-subtitle">Your digital map / Naksha requests</p>
        </div>
        <Link to="/customer/services/map" className="btn-primary text-sm"><Plus className="w-4 h-4" /> New Request</Link>
      </div>
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-brand-green animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">⚠️ {error}</div>
        ) : apps.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="font-semibold text-brand-text mb-2">No map requests yet</p>
            <Link to="/customer/services/map" className="btn-primary mt-4">Request a Map</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Request ID</th><th>District</th><th>Submitted</th><th>Status</th></tr></thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id}>
                    <td className="font-mono text-xs font-semibold text-brand-green">{app.app_id}</td>
                    <td className="text-brand-text-muted">{app.district || '—'}</td>
                    <td className="text-brand-text-muted">{new Date(app.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td>
                    <td><span className={STATUS_COLOR[app.status] || 'badge-grey'}>{STATUS_LABEL[app.status] || app.status}</span></td>
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
