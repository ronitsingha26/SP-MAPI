import { useState, useEffect } from 'react';
import { formatCurrency, formatDate, statusColor, statusLabel } from '../../utils/helpers';
import { Download, CreditCard, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/customer/payments');
        setPayments(res.data.payments || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load payments.');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>;

  const total = payments.filter(p => p.status === 'success').reduce((a, b) => a + Number(b.amount), 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment History</h1>
          <p className="page-subtitle">All your transactions with SP MAPI</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

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
            <span className="text-brand-green font-bold">{payments.filter(p => p.status === 'success').length}</span>
          </div>
          <div>
            <p className="text-xs text-brand-text-muted">Successful</p>
            <p className="text-xl font-bold text-brand-text">{payments.filter(p => p.status === 'success').length} Payments</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-brand-yellow-pale rounded-xl flex items-center justify-center">
            <span className="text-yellow-600 text-lg">₹</span>
          </div>
          <div>
            <p className="text-xs text-brand-text-muted">Refunded</p>
            <p className="text-xl font-bold text-brand-text">{payments.filter(p => p.status === 'refunded').length} Refunds</p>
          </div>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-green-pale">
          <h2 className="font-bold text-brand-text">All Transactions</h2>
        </div>
        {payments.length === 0 ? (
          <div className="p-12 text-center text-brand-text-muted">
            <p className="text-3xl mb-3">💳</p>
            <p>No payment history yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.payment_ref}</td>
                    <td><span className="font-medium text-brand-text capitalize">{p.payment_type || p.service_type || '—'}</span></td>
                    <td><span className="font-bold text-brand-green">{formatCurrency(Number(p.amount))}</span></td>
                    <td><span className="badge-grey">{p.payment_method || '—'}</span></td>
                    <td className="text-xs">{p.paid_at ? formatDate(p.paid_at) : '—'}</td>
                    <td><span className={statusColor(p.status)}>{statusLabel(p.status)}</span></td>
                    <td>
                      {p.status === 'success' && p.receipt_url && (
                        <a href={p.receipt_url} target="_blank" rel="noreferrer" className="text-brand-green hover:text-brand-text transition-colors">
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </td>
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
