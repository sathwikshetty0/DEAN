'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { clearAllData, exportAllData } from '@/lib/storage';
import { Save, Download, Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  if (isLoading || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev!, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateSettings(formData);
      toast.success('Saved');
    }
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleClearData = () => {
    if (confirm('This will delete ALL data. Are you sure?')) {
      clearAllData();
      toast.success('Data cleared. Refreshing...');
      window.location.reload();
    }
  };

  const inputClass = "w-full p-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-1 focus:ring-slate-300";
  const labelClass = "block text-xs font-medium text-slate-500 mb-1";

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-2">Shop Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Shop Name (English)</label>
              <input type="text" name="shopNameEn" value={formData.shopNameEn} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={`${labelClass} kannada-text`}>Shop Name (Kannada)</label>
              <input type="text" name="shopNameKn" value={formData.shopNameKn} onChange={handleChange} className={`${inputClass} kannada-text`} required />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address Line 1</label>
              <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className={`${inputClass} kannada-text`} required />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address Line 2</label>
              <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className={`${inputClass} kannada-text`} required />
            </div>
            <div>
              <label className={labelClass}>Phone 1</label>
              <input type="text" name="phone1" value={formData.phone1} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Phone 2</label>
              <input type="text" name="phone2" value={formData.phone2} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>GSTIN</label>
              <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>PAN</label>
              <input type="text" name="pan" value={formData.pan} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Alt Email</label>
              <input type="email" name="altEmail" value={formData.altEmail} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-2">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Bank Name</label>
              <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Account No</label>
              <input type="text" name="accountNo" value={formData.accountNo} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>IFSC Code</label>
              <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Branch</label>
              <input type="text" name="branch" value={formData.branch} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-2">Bill Defaults</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Default Language</label>
              <select name="defaultLanguage" value={formData.defaultLanguage} onChange={handleChange} className={inputClass}>
                <option value="both">Both</option>
                <option value="en">English</option>
                <option value="kn">Kannada</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Paper Size</label>
              <select name="paperSize" value={formData.paperSize} onChange={handleChange} className={inputClass}>
                <option value="A4">A4</option>
                <option value="A5">A5</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="gstOnByDefault" name="gstOnByDefault" checked={formData.gstOnByDefault} onChange={handleChange} className="w-4 h-4 rounded" />
              <label htmlFor="gstOnByDefault" className="text-sm text-slate-600">GST On by Default</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="showHsnTable" name="showHsnTable" checked={formData.showHsnTable} onChange={handleChange} className="w-4 h-4 rounded" />
              <label htmlFor="showHsnTable" className="text-sm text-slate-600">Show HSN/SAC Table</label>
            </div>
          </div>
          <div>
            <label className={labelClass}>Declaration Text</label>
            <textarea name="declaration" value={formData.declaration} onChange={handleChange} rows={2} className={inputClass}></textarea>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Data Management
        </h2>
        <p className="text-xs text-slate-400">Export backup or clear all data.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="inline-flex items-center px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 text-sm rounded-lg hover:bg-slate-100 transition-colors">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Backup
          </button>
          <button onClick={handleClearData} className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 text-sm rounded-lg hover:bg-red-100 transition-colors">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
