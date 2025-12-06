import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ArrowRight, Trash2, LayoutDashboard } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto mt-12 animate-fade-in-up delay-100">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-700">Riwayat Analisis Sebelumnya</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => onDelete(item.id, e)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus Riwayat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start justify-between mb-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            
            <h4 className="font-bold text-slate-800 mb-1 truncate pr-8">{item.businessName}</h4>
            <p className="text-xs text-slate-500 mb-3 truncate">{item.industry}</p>
            
            <div className="flex items-center text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              Lihat Laporan <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;