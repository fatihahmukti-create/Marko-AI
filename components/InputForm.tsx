import React, { useState } from 'react';
import { BusinessInput } from '../types';
import { Briefcase, Target, Users, Zap, LayoutDashboard } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: BusinessInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<BusinessInput>({
    businessName: '',
    industry: '',
    description: '',
    targetAudience: '',
    goals: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8" />
          Mulai Strategi Baru
        </h2>
        <p className="text-blue-100">Ceritakan tentang bisnis Anda, dan AI kami akan merancang strategi pemenang.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" /> Nama Bisnis
            </label>
            <input
              type="text"
              name="businessName"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="Contoh: Kopi Senja"
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" /> Industri / Kategori
            </label>
            <input
              type="text"
              name="industry"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="Contoh: F&B, Fashion, SaaS"
              value={formData.industry}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Deskripsi Singkat Bisnis</label>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
            placeholder="Apa yang Anda jual? Apa keunikan produk Anda?"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> Target Audiens
          </label>
          <input
            type="text"
            name="targetAudience"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            placeholder="Contoh: Mahasiswa, umur 18-24, suka nongkrong hemat"
            value={formData.targetAudience}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" /> Tujuan Utama (Goal)
          </label>
          <input
            type="text"
            name="goals"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            placeholder="Contoh: Meningkatkan penjualan online sebesar 20% dalam 3 bulan"
            value={formData.goals}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
              isLoading 
                ? 'bg-slate-400 cursor-not-allowed text-slate-100' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sedang Menganalisis Pasar...
              </span>
            ) : (
              'Buat Strategi Pemasaran'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
