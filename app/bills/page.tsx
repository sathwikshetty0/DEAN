'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBills, deleteBill } from '@/lib/storage';
import { Bill } from '@/lib/types';
import { FileText, Search, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All Time' | 'Today' | 'This Month'>('All Time');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBills(getBills());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleDelete = (id: string) => {
    if (confirm('Delete this bill?')) {
      deleteBill(id);
      setBills(getBills());
      toast.success('Deleted');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const monthStr = todayStr.substring(0, 7);

  const filteredBills = bills.filter(b => {
    const matchesSearch = 
      b.consignee.name.toLowerCase().includes(search.toLowerCase()) ||
      b.billNo.toString().includes(search);
    let matchesFilter = true;
    if (filter === 'Today') matchesFilter = b.date === todayStr;
    else if (filter === 'This Month') matchesFilter = b.date.startsWith(monthStr);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Bills</h1>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-slate-300 kannada-text"
          />
        </div>
        <div className="flex bg-slate-100 p-0.5 rounded-lg">
          {['All Time', 'This Month', 'Today'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="px-4 py-2.5 font-medium">Bill No.</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">Customer</th>
                <th className="px-4 py-2.5 font-medium text-right">Total</th>
                <th className="px-4 py-2.5 font-medium text-center w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center">
                    <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No bills found</p>
                  </td>
                </tr>
              ) : (
                filteredBills.map(bill => (
                  <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {bill.draft ? <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-xs">DRAFT</span> : `#${bill.billNo}`}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(bill.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-slate-600 kannada-text text-xs">{bill.consignee.name || 'Walk-in'}</td>
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
