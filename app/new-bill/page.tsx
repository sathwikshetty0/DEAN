'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBill } from '@/context/BillContext';
import { useSettings } from '@/context/SettingsContext';
import { getProducts, incrementCounter, addBill } from '@/lib/storage';
import { Product, BillItem } from '@/lib/types';
import { Plus, Trash2, Save, Eye, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { generatePdfBlob, downloadPdf } from '@/lib/pdf';

export default function NewBillPage() {
  const router = useRouter();
  const { state, dispatch, calculateTotals } = useBill();
  const { settings } = useSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getProducts().filter(p => p.active));
  }, []);

  const totals = calculateTotals();

  const handleAddProduct = (product: Product) => {
    const existing = state.items.find(i => i.productId === product.id);
    if (existing) {
      dispatch({
        type: 'UPDATE_ITEM',
        payload: { id: existing.id, item: { quantity: existing.quantity + 1 } }
      });
      toast.success(`${product.nameKn} +1`);
    } else {
      const newItem: BillItem = {
        id: crypto.randomUUID(),
        serialNo: state.items.length + 1,
        productId: product.id,
        nameKn: product.nameKn,
        nameEn: product.nameEn,
        gstRate: product.gstRate,
        quantity: 1,
        unit: product.unit,
        rate: product.price,
        amount: product.price,
        isCustom: false,
      };
      dispatch({ type: 'ADD_ITEM', payload: newItem });
      toast.success(`${product.nameKn} ಸೇರಿಸಲಾಗಿದೆ`);
    }
    setSearch('');
    setShowDropdown(false);
  };

  const handleAddCustom = () => {
    const newItem: BillItem = {
      id: crypto.randomUUID(),
      serialNo: state.items.length + 1,
      productId: null,
      nameKn: '',
      nameEn: '',
      gstRate: settings?.defaultGstRate || 5,
      quantity: 1,
      unit: 'piece',
      rate: 0,
      amount: 0,
      isCustom: true,
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  const handleSave = async () => {
    if (state.items.length === 0) {
      toast.error('ಕನಿಷ್ಠ ಒಂದು ಐಟಮ್ ಸೇರಿಸಿ');
      return;
    }

    const billNo = incrementCounter();
    const finalBill = {
      ...state,
      id: crypto.randomUUID(),
      billNo,
      draft: false,
      createdAt: new Date().toISOString(),
      ...totals,
    };

    addBill(finalBill);
    toast.success(`ಬಿಲ್ #${billNo} ಸೇವ್ ಆಗಿದೆ!`);

    if (settings) {
      downloadPdf(finalBill, settings);
    }

    dispatch({ type: 'RESET_BILL' });
    router.push(`/bills/${finalBill.id}`);
  };

  const handlePreview = async () => {
    if (state.items.length === 0) {
      toast.error('ಕನಿಷ್ಠ ಒಂದು ಐಟಮ್ ಸೇರಿಸಿ');
      return;
    }
    if (!settings) return;

    const tempBill = {
      ...state,
      id: 'preview',
      billNo: 0,
      draft: true,
      createdAt: new Date().toISOString(),
      ...totals,
    };

    const blob = await generatePdfBlob(tempBill, settings);
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setShowPreview(true);
  };

  const filteredProducts = (showDropdown || search.trim())
    ? products.filter(p =>
        search.trim() === '' ||
        p.nameKn.includes(search) || p.nameEn.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto space-y-4">
      
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 kannada-text">ಹೊಸ ಬಿಲ್</h1>
        <button onClick={() => dispatch({ type: 'RESET_BILL' })} className="text-xs text-red-500 hover:underline">Clear</button>
      </div>

      {/* Date */}
      <div className="flex gap-3 items-center">
        <label className="text-sm font-medium text-slate-600">Date:</label>
        <input
          type="date"
          value={state.date}
          onChange={e => dispatch({ type: 'SET_DATE', payload: e.target.value })}
          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* ── Product Search ── */}
      <div className="relative">
        <div className="flex items-center bg-white border border-slate-300 rounded-lg shadow-sm">
          <Search className="w-4 h-4 ml-3 text-slate-400" />
          <input
            type="text"
            placeholder="ಹುಡುಕಿ / Search product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="flex-1 px-3 py-2.5 bg-transparent outline-none text-sm kannada-text"
          />
          <button
            onClick={handleAddCustom}
            className="mr-2 px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Custom
          </button>
        </div>

        {/* Dropdown */}
        {(showDropdown || search.trim()) && filteredProducts.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddProduct(p);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 border-b border-slate-100 last:border-0 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-slate-900 kannada-text text-sm">{p.nameKn}</div>
                  <div className="text-xs text-slate-500">{p.nameEn}</div>
                </div>
                <span className="font-semibold text-sm text-primary">₹{p.price}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Items List (Mobile-friendly cards) ── */}
      <div className="space-y-2">
        {state.items.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">
            ಐಟಮ್ ಸೇರಿಸಲು ಮೇಲೆ ಹುಡುಕಿ
          </div>
        )}

        {state.items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">{idx + 1}.</span>
                  {item.isCustom ? (
                    <input
                      type="text"
                      value={item.nameKn}
                      placeholder="ಐಟಮ್ ಹೆಸರು"
                      onChange={e => dispatch({ type: 'UPDATE_ITEM', payload: { id: item.id, item: { nameKn: e.target.value } } })}
                      className="flex-1 text-sm font-medium kannada-text bg-transparent border-b border-dashed border-slate-300 focus:border-primary outline-none pb-0.5"
                    />
                  ) : (
                    <span className="text-sm font-medium kannada-text text-slate-900 truncate">{item.nameKn}</span>
                  )}
                </div>
                {!item.isCustom && (
                  <p className="text-xs text-slate-400 ml-5 mt-0.5">{item.nameEn}</p>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                className="p-1 text-slate-300 hover:text-red-500 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Qty, Rate, Amount row */}
            <div className="flex items-center gap-3 mt-2 ml-5">
              <div className="flex items-center gap-1">
                <label className="text-xs text-slate-500">Qty:</label>
                <input
                  type="number"
                  min="0.001"
                  step="any"
                  value={item.quantity}
                  onChange={e => dispatch({ type: 'UPDATE_ITEM', payload: { id: item.id, item: { quantity: parseFloat(e.target.value) || 0 } } })}
                  className="w-16 px-1.5 py-1 text-sm text-center border border-slate-200 rounded bg-slate-50 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-1">
                <label className="text-xs text-slate-500">Rate:</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={item.rate}
                  onChange={e => dispatch({ type: 'UPDATE_ITEM', payload: { id: item.id, item: { rate: parseFloat(e.target.value) || 0 } } })}
                  className="w-20 px-1.5 py-1 text-sm text-right border border-slate-200 rounded bg-slate-50 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="ml-auto text-sm font-bold text-slate-800">
                ₹{(item.quantity * item.rate).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Summary ── */}
      {state.items.length > 0 && (
        <div className="glass-card rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>₹{totals.subtotal.toFixed(2)}</span>
          </div>
          {state.gstEnabled && totals.cgst > 0 && (
            <>
              <div className="flex justify-between text-slate-600">
                <span>CGST</span>
                <span>₹{totals.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST</span>
                <span>₹{totals.sgst.toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="font-bold text-lg">Grand Total</span>
            <span className="font-bold text-2xl text-primary">₹{totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* ── Action Buttons ── */}
      {state.items.length > 0 && (
        <div className="flex gap-3 pb-4">
          <button
            onClick={handlePreview}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-blue-500/20"
          >
            <Save className="w-5 h-5" />
            Save & Download
          </button>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-3 border-b border-slate-200">
              <h3 className="text-base font-semibold">Invoice Preview</h3>
              <button onClick={() => { setShowPreview(false); if (pdfUrl) URL.revokeObjectURL(pdfUrl); }} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 p-2">
              {pdfUrl && <iframe src={pdfUrl} className="w-full h-full rounded border border-slate-200" title="PDF Preview" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
