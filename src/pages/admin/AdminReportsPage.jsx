import { BarChart2 } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Reports</h1>
          <p className="page-subtitle">View analytics and performance metrics</p>
        </div>
      </div>
      <div className="card p-8 text-center text-brand-text-muted mt-6">
        <BarChart2 className="w-12 h-12 mx-auto mb-4 text-brand-green" />
        <p className="font-semibold text-lg text-brand-text mb-2">Analytics Dashboard</p>
        <p>This page will contain detailed graphs and CSV exports for total applications processed, revenue metrics, and Amin performance.</p>
      </div>
    </div>
  );
}
