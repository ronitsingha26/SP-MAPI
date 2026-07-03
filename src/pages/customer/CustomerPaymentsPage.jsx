import { payments } from '../../data/index';
import { formatCurrency, formatDate, statusColor, statusLabel } from '../../utils/helpers';
import { Download, CreditCard } from 'lucide-react';

const myPayments = payments.filter(p => p.customer_name === 'Ramesh Kumar Singh');

export default function CustomerPaymentsPage() {
  const total = myPayments.filter(p => p.status === 'success').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment History</h1>
          <p className="page-subtitle">All your transactions with SP MAPI</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-brand-green-pale rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <p className="text-xs text-brand-text-muted">Total Paid</p>
            <p className="text-xl font-bold text-brand-green">{formatCurrency(total)}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-brand-green-pale rounded-xl flex items-center justify-center">
            <span className="text-brand-green font-bold">{myPayments.filter(p=>p.status==='success').length}</span>
          </div>
          <div>
            <p className="text-xs text-brand-text-muted">Successful</p>
            <p className="text-xl font-bold text-brand-text">{myPayments.filter(p=>p.status==='success').length} Payments</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-brand-yellow-pale rounded-xl flex items-center justify-center">
            <span className="text-yellow-600 text-lg">₹</span>
          </div>
          <div>
            <p className="text-xs text-brand-text-muted">Refunded</p>
            <p className="text-xl font-bold text-brand-text">{myPayments.filter(p=>p.status==='refunded').length} Refunds</p>
          </div>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-green-pale">
          <h2 className="font-bold text-brand-text">All Transactions</h2>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {myPayments.map(p => (
                <tr key={p.id}>
                  <td className="font-mono text-xs">{p.id}</td>
                  <td><span className="font-medium text-brand-text">{p.type}</span></td>
                  <td><span className="font-bold text-brand-green">{formatCurrency(p.amount)}</span></td>
                  <td><span className="badge-grey">{p.method}</span></td>
                  <td className="text-xs">{formatDate(p.paid_at)}</td>
                  <td><span className={statusColor(p.status)}>{statusLabel(p.status)}</span></td>
                  <td>
                    {p.status === 'success' && (
                      <button className="text-brand-green hover:text-brand-text transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
