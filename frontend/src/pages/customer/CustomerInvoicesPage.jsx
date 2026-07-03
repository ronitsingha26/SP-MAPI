import { useState, useEffect } from 'react';
import { formatCurrency, formatDate, statusColor, statusLabel } from '../../utils/helpers';
import { Download, FileText, RefreshCw, Eye } from 'lucide-react';
import api from '../../utils/api';

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/invoices/my-invoices');
        setInvoices(res.data.invoices || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load invoices.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>;

  return (
    <div className="animate-fade-in relative">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Invoices</h1>
          <p className="page-subtitle">View and download your GST invoices</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      <div className="card !p-0 overflow-hidden mb-8">
        {invoices.length === 0 ? (
          <div className="p-12 text-center text-brand-text-muted">
            <p className="text-3xl mb-3">🧾</p>
            <p>No invoices generated yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Service</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Issued On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="font-mono text-xs font-bold text-brand-text">{inv.invoice_number}</td>
                    <td><span className="font-medium capitalize">{inv.application_type || '—'}</span></td>
                    <td><span className="font-bold text-brand-green">{formatCurrency(Number(inv.total_amount))}</span></td>
                    <td><span className={statusColor(inv.status)}>{statusLabel(inv.status)}</span></td>
                    <td className="text-xs">{formatDate(inv.issued_at)}</td>
                    <td>
                      <button 
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 hover:bg-brand-green-pale rounded-lg transition-colors text-brand-green flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:bg-white print:p-0">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl print:shadow-none print:w-full print:max-w-full print:h-screen">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0 print:hidden">
              <h2 className="font-bold text-lg">Invoice Details</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="btn-secondary text-xs flex items-center gap-1">
                  <Download className="w-4 h-4" /> Print / PDF
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="btn-secondary text-xs">Close</button>
              </div>
            </div>
            
            {/* Printable Area */}
            <div className="p-8 overflow-y-auto" id="printable-invoice">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-black text-brand-text mb-1">SP MAPI</h1>
                  <p className="text-sm text-gray-500">SPMAPI Private Limited<br/>Bihar, India</p>
                  <p className="text-sm text-gray-500 mt-2">GSTIN: 10XXXXX0000X1Z5</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-brand-green uppercase tracking-wider mb-2">TAX INVOICE</h2>
                  <p className="text-sm font-mono text-gray-700"><strong>No:</strong> {selectedInvoice.invoice_number}</p>
                  <p className="text-sm text-gray-500"><strong>Date:</strong> {formatDate(selectedInvoice.issued_at)}</p>
                  <div className="mt-2 inline-block">
                    <span className={statusColor(selectedInvoice.status)}>{statusLabel(selectedInvoice.status)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 mb-8">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Billed To:</p>
                <p className="font-bold text-brand-text">{selectedInvoice.customer_name || 'Customer'}</p>
                <p className="text-sm text-gray-600">{selectedInvoice.customer_phone}</p>
              </div>

              <table className="w-full text-left border-collapse mb-8">
                <thead>
                  <tr className="border-b-2 border-brand-green-pale">
                    <th className="py-3 font-semibold text-gray-600">Description</th>
                    <th className="py-3 font-semibold text-gray-600 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 text-sm text-brand-text capitalize">
                      {selectedInvoice.application_type} Service<br/>
                      <span className="text-xs text-gray-400 font-mono">App ID: {selectedInvoice.application_id.slice(0,8)}...</span>
                    </td>
                    <td className="py-4 text-sm text-brand-text font-bold text-right">
                      {formatCurrency(Number(selectedInvoice.subtotal))}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(Number(selectedInvoice.subtotal))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-2">
                    <span>GST (18%):</span>
                    <span>{formatCurrency(Number(selectedInvoice.tax_amount))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-brand-green pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(Number(selectedInvoice.total_amount))}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 text-center text-xs text-gray-400">
                <p>This is a computer generated invoice and does not require a physical signature.</p>
                <p>Thank you for your business with SPMAPI Private Limited!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
