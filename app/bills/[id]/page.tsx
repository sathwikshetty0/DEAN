'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBillById } from '@/lib/storage';
import { useSettings } from '@/context/SettingsContext';
import { Bill } from '@/lib/types';
import { downloadPdf, generatePdfBlob } from '@/lib/pdf';
import { ArrowLeft, Download, Printer, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function BillDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { settings, isLoading: settingsLoading } = useSettings();
  
  const [bill, setBill] = useState<Bill | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const b = getBillById(id);
    if (b) setBill(b);
  }, [id]);

  useEffect(() => {
    let url = '';
    if (bill && settings) {
      generatePdfBlob(bill, settings).then(blob => {
        url = URL.createObjectURL(blob);
        setPdfUrl(url);
      });
    }
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [bill, settings]);

  if (!mounted || settingsLoading) return null;

  if (!bill) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-700">Bill not found</h2>
        <Link href="/bills" className="text-sm text-slate-500 hover:underline mt-2 inline-block">← Back to Bills</Link>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const text = `Invoice #${bill.billNo}\nAmount: ₹${bill.grandTotal}\nDate: ${new Date(bill.date).toLocaleDateString('en-IN')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    if (pdfUrl) { const w = window.open(pdfUrl); w?.print(); }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Invoice #{bill.billNo}</h1>
            <p className="text-xs text-slate-400 kannada-text">{bill.consignee.name || 'Walk-in'}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => downloadPdf(bill, settings!)}
            className="inline-flex items-center px-3 py-1.5 bg-white text-slate-600 border border-slate-200 text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download
          </button>
          <button 
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 bg-white text-slate-600 border border-slate-200 text-sm rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print
          </button>
          <button 
            onClick={handleWhatsApp}
            className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            WhatsApp
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden min-h-[600px]">
        {pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-full" title="Invoice Preview" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div>
          </div>
        )}
      </div>
    </div>
  );
}
