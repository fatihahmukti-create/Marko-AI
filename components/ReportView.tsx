import React from 'react';
import { MarketingPlan } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, ShieldCheck, Zap, 
  Package, DollarSign, MapPin, Megaphone, CheckCircle,
  Users, Swords, Download, Printer, PiggyBank, Briefcase, Target, Smartphone, Video, Image, PenTool, Info
} from 'lucide-react';

interface ReportViewProps {
  plan: MarketingPlan;
  onReset: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ plan, onReset }) => {
  const chartData = plan.estimatedGrowth.map((growth, index) => ({
    month: `Bulan ${index + 1}`,
    growth: growth,
  }));

  const handlePrint = () => {
    window.print();
  };

  const getContentIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('video') || t.includes('reels') || t.includes('tiktok')) return <Video className="w-5 h-5" />;
    if (t.includes('image') || t.includes('foto') || t.includes('carousel')) return <Image className="w-5 h-5" />;
    return <PenTool className="w-5 h-5" />;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid">
        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Analisis & Strategi Pemasaran</h2>
            <p className="text-slate-500">Dibuat khusus oleh Marko AI</p>
          </div>
          <div className="flex gap-3 no-print">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Export Report (PDF)
            </button>
            <button 
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Buat Strategi Baru
            </button>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Ringkasan Eksekutif</h3>
          <p className="text-indigo-800 leading-relaxed text-sm md:text-base">{plan.executiveSummary}</p>
        </div>
      </div>

      {/* Market & Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col break-inside-avoid">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" /> Proyeksi Pertumbuhan
          </h3>
          
          <div className="mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3">
            <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-800 leading-relaxed">
              Grafik ini menunjukkan <strong>estimasi kenaikan performa bisnis</strong> (seperti omzet atau engagement) dalam persentase (%) selama 6 bulan ke depan. Proyeksi ini dihitung berdasarkan asumsi bahwa strategi pemasaran yang direkomendasikan diterapkan secara konsisten.
            </p>
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} unit="%" />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`+${value}%`, 'Pertumbuhan']}
                />
                <Area type="monotone" dataKey="growth" stroke="#4f46e5" fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">*Angka hanyalah estimasi prediksi AI dan dapat bervariasi tergantung kondisi pasar nyata.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 break-inside-avoid">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Users className="text-purple-500" /> Analisis Pasar & Persona
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-2">Market Overview</h4>
              <p className="text-slate-700 text-sm leading-relaxed border-l-4 border-blue-500 pl-4 bg-slate-50 py-2 pr-2 rounded-r-lg">
                {plan.marketAnalysis}
              </p>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-2">Target Persona</h4>
              <p className="text-slate-700 text-sm leading-relaxed border-l-4 border-purple-500 pl-4 bg-slate-50 py-2 pr-2 rounded-r-lg">
                {plan.targetPersona}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Swords className="w-6 h-6 text-rose-500" /> Analisis Kompetitor
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plan.competitorAnalysis.competitors.map((comp, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 font-bold text-slate-700">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-slate-800 line-clamp-1">{comp.name}</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">Kekuatan</span>
                  <p className="text-xs text-slate-600 leading-snug">{comp.strengths}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block mb-1">Kelemahan</span>
                  <p className="text-xs text-slate-600 leading-snug">{comp.weaknesses}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-300" /> Celah Pasar (Market Gap)
          </h4>
          <p className="text-indigo-100 leading-relaxed">
            {plan.competitorAnalysis.marketGap}
          </p>
        </div>
      </div>

      {/* Content Strategy Generator Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Smartphone className="w-7 h-7 text-pink-500" /> Ide Konten & Digital Marketing
        </h3>
        <p className="text-slate-500 mb-6">Rekomendasi konten kreatif untuk meningkatkan engagement digital Anda.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plan.contentStrategy?.map((idea, index) => (
            <div key={index} className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100/50 transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                  {idea.platform}
                </span>
                <div className="p-2 bg-pink-50 rounded-lg text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  {getContentIcon(idea.contentType)}
                </div>
              </div>
              
              <h4 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 leading-snug">{idea.topic}</h4>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">{idea.description}</p>
              
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
                <span>Type:</span>
                <span className="text-slate-600">{idea.contentType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Analisis SWOT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Kekuatan (Strengths)
            </h4>
            <ul className="space-y-2">
              {plan.swot.strengths.map((item, i) => (
                <li key={i} className="text-sm text-emerald-900 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Weaknesses */}
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
            <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Kelemahan (Weaknesses)
            </h4>
            <ul className="space-y-2">
              {plan.swot.weaknesses.map((item, i) => (
                <li key={i} className="text-sm text-orange-900 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Peluang (Opportunities)
            </h4>
            <ul className="space-y-2">
              {plan.swot.opportunities.map((item, i) => (
                <li key={i} className="text-sm text-blue-900 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

           {/* Threats */}
           <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 rotate-180" /> Ancaman (Threats)
            </h4>
            <ul className="space-y-2">
              {plan.swot.threats.map((item, i) => (
                <li key={i} className="text-sm text-red-900 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Marketing Mix (4Ps) */}
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-8 break-inside-avoid">
        <h3 className="text-2xl font-bold mb-8 text-center">Strategi Marketing Mix (4P)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">Product</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{plan.marketingMix.productStrategy}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">Price</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{plan.marketingMix.priceStrategy}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 text-pink-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">Place</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{plan.marketingMix.placeStrategy}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 text-amber-400">
              <Megaphone className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">Promotion</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{plan.marketingMix.promotionStrategy}</p>
          </div>
        </div>
      </div>

      {/* Investment Recommendation Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PiggyBank className="w-7 h-7 text-indigo-600" /> Rekomendasi Investasi Strategis
        </h3>
        <p className="text-slate-500 mb-6">Area kunci dimana Anda disarankan untuk mengalokasikan anggaran untuk pertumbuhan maksimal.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plan.investmentRecommendations?.map((item, index) => (
            <div key={index} className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100 hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Briefcase className="w-6 h-6 text-indigo-600" />
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    item.priority === 'High' ? 'bg-indigo-600 text-white' : 
                    item.priority === 'Medium' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.priority} Priority
                  </span>
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-2">{item.area}</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">{item.reasoning}</p>
              
              <div className="bg-white/70 rounded-lg p-3 border border-indigo-100 mt-2">
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                   <Target className="w-3 h-3" /> KPIs to Track
                </p>
                <ul className="space-y-1">
                  {item.kpis?.map((kpi, kIdx) => (
                    <li key={kIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="mt-1.5 w-1 h-1 bg-indigo-400 rounded-full flex-shrink-0"></span>
                      {kpi}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Rencana Aksi Taktis</h3>
        <div className="space-y-4">
          {plan.actionPlan.map((action, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-slate-50/50 break-inside-avoid">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-slate-800 text-lg mb-1">{action.title}</h4>
                <p className="text-slate-600 text-sm mb-3">{action.description}</p>
                <div className="flex gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    action.impact === 'High' ? 'bg-green-100 text-green-700' : 
                    action.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    Impact: {action.impact}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    action.difficulty === 'High' ? 'bg-red-100 text-red-700' : 
                    action.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    Difficulty: {action.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportView;