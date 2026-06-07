'use client';

import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '@/lib/storage';
import { Product } from '@/lib/types';
import { Search, Download, Edit2 } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nameKn.includes(search) || p.nameEn.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const exportCsv = () => {
    const headers = ['Name (Kannada)', 'Name (English)', 'Category', 'Unit', 'Price', 'GST Rate'];
    const rows = products.map(p => [
      `"${p.nameKn}"`, `"${p.nameEn}"`, `"${p.category}"`, p.unit, p.price, p.gstRate
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Products</h1>
        <button onClick={exportCsv} className="inline-flex items-center px-3 py-1.5 bg-white text-slate-600 border border-slate-200 text-sm rounded-lg hover:bg-slate-50 transition-colors">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Category sidebar */}
        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-slate-100 p-3 space-y-0.5 overflow-x-auto md:overflow-x-visible flex md:flex-col shrink-0">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`text-left px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === 'All' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            All ({products.length})
          </button>
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap kannada-text transition-colors ${activeCategory === cat ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Main */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-slate-300 kannada-text"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-100 flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs">
                <tr>
                  <th className="px-3 py-2 font-medium">ಹೆಸರು</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Unit</th>
                  <th className="px-3 py-2 font-medium text-right">Price</th>
                  <th className="px-3 py-2 font-medium text-right">GST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map(product => (
                  <tr key={product.id} className={`hover:bg-slate-50/50 transition-colors ${!product.active ? 'opacity-40' : ''}`}>
                    <td className="px-3 py-2.5 font-medium text-slate-800 kannada-text text-xs">{product.nameKn}</td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs">{product.nameEn}</td>
                    <td className="px-3 py-2.5 text-slate-400 text-xs">{product.unit}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-slate-700 text-xs">₹{product.price.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-right text-slate-400 text-xs">{product.gstRate}%</td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-400 text-sm">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
