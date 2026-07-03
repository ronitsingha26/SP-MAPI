import { CreditCard } from 'lucide-react';

export default function AdminPaymentsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments & Revenue</h1>
          <p className="page-subtitle">Track service payments and financial reports</p>
        </div>
      </div>
      <div className="card p-8 text-center text-brand-text-muted mt-6">
        <CreditCard className="w-12 h-12 mx-auto mb-4 text-brand-green" />
        <p className="font-semibold text-lg text-brand-text mb-2">Payment History</p>
        <p>This module will show all UPI and card payments made by users for the Mapi and Bantwara services.</p>
      </div>
    </div>
  );
}
