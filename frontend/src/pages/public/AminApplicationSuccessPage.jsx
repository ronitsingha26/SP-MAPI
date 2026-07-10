import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, ArrowRight, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../../utils/api';

export default function AminApplicationSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfError, setPdfError] = useState('');
  
  const appId = location.state?.appId || 'UNKNOWN';
  const initialFormData = location.state?.formData || null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  };

  const downloadPDF = async () => {
    if (appId === 'UNKNOWN') {
      setPdfError('Invalid Application ID. Cannot generate PDF.');
      return;
    }

    setIsGenerating(true);
    setPdfError('');
    
    try {
      let formData = initialFormData;
      
      if (!formData) {
        const res = await api.get(`/public/amin-recruitment/application/${appId}`);
        if (res.data.success && res.data.application) {
          formData = res.data.application;
        } else {
          throw new Error('Could not fetch application details.');
        }
      }

      const doc = new jsPDF();
      
      const logoImg = await loadImage('/f.png');
      let currentY = 20;

      if (logoImg) {
        const targetWidth = 30; // 30mm width
        const targetHeight = (targetWidth / logoImg.width) * logoImg.height;
        doc.addImage(logoImg, 'PNG', 105 - (targetWidth / 2), 15, targetWidth, targetHeight);
        currentY = 15 + targetHeight + 10;
      }
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(34, 197, 94); // brand green
    doc.text('SP MAPI', 105, currentY, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('SPMAPI Private Limited', 105, currentY + 7, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Amin Job Application Receipt', 105, currentY + 20, { align: 'center' });
    
    // Application Details Table
    const tableData = [
      ['Application ID', appId],
      ['Application Date & Time', formData.created_at ? new Date(formData.created_at).toLocaleString() : new Date().toLocaleString()],
      ['Current Status', formData.status || 'Submitted']
    ];

    if (formData) {
      tableData.push(
        ['Applicant Name', formData.name || formData.applicant_name || 'N/A'],
        ["Father's Name", formData.father_name || '-'],
        ['Mobile Number', formData.mobile || 'N/A'],
        ['Email', formData.email || 'N/A'],
        ['Gender', formData.gender || 'N/A'],
        ['Date of Birth', formData.dob ? formData.dob.split('-').reverse().join('/') : 'N/A'],
        ['State', formData.state || 'N/A'],
        ['District', formData.district || 'N/A'],
        ['Block', formData.block_name || 'N/A'],
        ['Village', formData.village || 'N/A'],
        ['PIN Code', formData.pin_code || formData.pincode || 'N/A'],
        ['Highest Qualification', formData.highest_qualification || 'N/A'],
        ['Years of Experience', formData.experience_years ? formData.experience_years.toString() : '0'],
        ['Previous Organization', formData.previous_organization || 'N/A']
      );
    }

      autoTable(doc, {
        startY: currentY + 30,
        head: [['Field', 'Details']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
        styles: { fontSize: 10, cellPadding: 5 }
      });

    // Footer
    const finalY = doc.lastAutoTable.finalY || 200;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('This is a system-generated acknowledgement. Please keep this receipt for future reference.', 105, finalY + 20, { align: 'center' });
    
    // Save
    doc.save(`Amin_Application_${appId}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setPdfError(err.response?.data?.message || err.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-brand-cream p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-soft p-8 text-center border border-gray-100 animate-fade-in">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-brand-green" />
        </div>
        
        <h1 className="text-2xl font-bold text-brand-text mb-2">Application Submitted Successfully</h1>
        <p className="text-brand-text-muted mb-8">
          Thank you for applying to join our team. Please save your Application ID to track your status.
        </p>

        {pdfError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2 text-left">
            <span className="text-lg leading-none">⚠️</span> {pdfError}
          </div>
        )}

        <div className="bg-brand-cream p-4 rounded-xl border border-gray-100 mb-8 flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-1">Application ID</p>
            <p className="font-mono text-xl text-brand-text font-bold">{appId}</p>
          </div>
          <button 
            onClick={copyToClipboard}
            className="p-3 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-colors group"
            title="Copy ID"
          >
            {copied ? (
              <span className="text-sm font-semibold text-brand-green flex items-center gap-1">Copied!</span>
            ) : (
              <Copy className="w-5 h-5 text-brand-text-muted group-hover:text-brand-green" />
            )}
          </button>
        </div>

        <div className="space-y-4">
          <button 
            onClick={downloadPDF} 
            disabled={isGenerating}
            className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isGenerating ? 'Generating PDF...' : 'Download Application (PDF)'}
          </button>
          <Link to="/" className="w-full justify-center text-sm font-semibold text-gray-600 hover:text-brand-text flex items-center justify-center py-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent">
            Go to Home
          </Link>
          <button 
            onClick={() => navigate('/', { state: { scrollTo: 'track-application' } })}
            className="w-full justify-center text-sm font-semibold text-brand-green hover:underline flex items-center justify-center gap-2"
          >
            Track Application <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
