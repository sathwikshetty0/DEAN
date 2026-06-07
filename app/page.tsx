'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FilePlus, FileText, ArrowRight, Eye, Trash2 } from 'lucide-react';
import { getBills, deleteBill } from '@/lib/storage';
import { Bill } from '@/lib/types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBills(getBills());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      deleteBill(id);
      setBills(getBills());
      toast.success('Bill deleted');
    }
  };

  if (!mounted) return null;

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.substring(0, 7);

  const billsToday = bills.filter(b => b.date === today && !b.draft);
  const revenueToday = billsToday.reduce((sum, b) => sum + b.grandTotal, 0);

  const billsThisMonth = bills.filter(b => b.date.startsWith(thisMonth) && !b.draft);
  const revenueThisMonth = billsThisMonth.reduce((sum, b) => sum + b.grandTotal, 0);

  const recentBills = bills.slice(0, 7);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
        <Link 
          href="/new-bill" 
          className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <FilePlus className="w-4 h-4 mr-2" />
          New Bill
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard title="Bills Today" value={billsToday.length.toString()} />
        <MetricCard title="Revenue Today" value={`₹${revenueToday.toLocaleString('en-IN')}`} accent />
        <MetricCard title="Bills This Month" value={billsThisMonth.length.toString()} />
        <MetricCard title="Revenue This Month" value={`₹${revenueThisMonth.toLocaleString('en-IN')}`} accent />
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Recent Bills</h2>
          <Link href="/bills" className="text-xs text-slate-500 hover:text-slate-800 font-medium">View All →</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="px-4 py-2.5 font-medium">Bill No.</th>
                <th className="px-4 py-2.5 font-medium">Customer</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium text-right">Total</th>
                <th className="px-4 py-2.5 font-medium text-center w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No bills yet.</td>
                </tr>
              ) : (
                recentBills.map(bill => (
                  <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {bill.draft ? 'DRAFT' : `#${bill.billNo}`}
                    </td>
                    <td className="px-4 py-3 text-slate-600 kannada-text text-xs">{bill.consignee.name || 'Walk-in'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(bill.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">
                      ₹{bill.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/bills/${bill.id}`} className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(bill.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, accent = false }: { title: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-medium text-slate-400 mb-1">{title}</p>
      <h3 className={`text-lg font-bold ${accent ? 'text-slate-900' : 'text-slate-700'}`}>{value}</h3>
    </div>
  );
}
