import { useState, useEffect } from 'react';
import { GitBranch, Filter, Search } from 'lucide-react';
import { STATUS_CONFIG, formatDisplayDate } from '../../utils/storage';
import { applicationService } from '../../services/api';

export default function AdminBantwaraPage() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const data = await applicationService.getApplicationsByType('bantwara');
    setApps(data);
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    const result = await applicationService.updateStatus(appId, newStatus);
    if (result) {
      fetchApplications();
    }
  };

  const filteredApps = apps.filter(app => {
    if (filter !== 'all' && app.status !== filter) return false;
    if (search && !app.appId.toLowerCase().includes(search.toLowerCase()) && !app.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><GitBranch className="w-6 h-6 text-yellow-600" /> Manage Bantwara Applications</h1>
          <p className="page-subtitle">Review and update division survey requests</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2 bg-brand-green-pale rounded-xl px-3 py-2 max-w-sm flex-1">
            <Search className="w-4 h-4 text-brand-text-muted" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-text-muted" />
            <select className="input py-2 bg-brand-green-pale border-none" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG.bantwara).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID & Date</th>
                <th>Applicant</th>
                <th>Location</th>
                <th>Current Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.appId}>
                  <td>
                    <p className="font-mono text-xs font-semibold text-brand-green">{app.appId}</p>
                    <p className="text-xs text-brand-text-muted">{formatDisplayDate(app.createdAt)}</p>
                  </td>
                  <td>
                    <p className="font-medium text-brand-text">{app.name}</p>
                    <p className="text-xs text-brand-text-muted">{app.mobile}</p>
                  </td>
                  <td>
                    <p className="text-sm text-brand-text">{app.village}</p>
                    <p className="text-xs text-brand-text-muted">{app.district}</p>
                  </td>
                  <td>
                    {(() => {
                      const cfg = STATUS_CONFIG.bantwara[app.status] || { label: app.status, color: 'badge-grey' };
                      return <span className={cfg.color}>{cfg.label}</span>;
                    })()}
                  </td>
                  <td>
                    <select 
                      className="text-xs border border-gray-200 rounded p-1"
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app.appId, e.target.value)}
                    >
                      {Object.entries(STATUS_CONFIG.bantwara).map(([key, cfg]) => (
                        <option key={key} value={key}>{cfg.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-brand-text-muted">No applications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
