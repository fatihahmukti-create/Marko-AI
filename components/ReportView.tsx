import React from 'react';
import { MarketingPlan } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, ShieldCheck, Zap, 
  Package, DollarSign, MapPin, Megaphone, CheckCircle,
  Users, Swords, Download, Printer, PiggyBank, Briefcase, Target, Smartphone, Video, Image, PenTool, Info, ShieldAlert, Activity, Lock, MessageCircle, FileText, RefreshCw
} from 'lucide-react';

interface ReportViewProps {
  plan: MarketingPlan;
  onReset: () => void;
  onAskAI?: (message: string) => void;
}

const ReportView: React.FC<ReportViewProps> = ({ plan, onReset, onAskAI }) => {
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
    <div className="space-y-8 animate-fade-in pb-12 print:space-y-6 print:pb-0 print:animate-none">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid print:p-0 print:border-none print:shadow-none">
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
        
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 print:bg-white print:border-slate-200">
          <h3 className="text-lg font-bold text-indigo-900 mb-2 print:text-slate-900">Ringkasan Eksekutif</h3>
          <p className="text-indigo-800 leading-relaxed text-sm md:text-base print:text-slate-700">{plan.executiveSummary}</p>
        </div>
      </div>

      {/* Market & Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1 print:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col break-inside-avoid">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" /> Proyeksi Pertumbuhan
          </h3>
          
          <div className="mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 print:hidden">
            <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-800 leading-relaxed">
              Grafik ini menunjukkan <strong>estimasi kenaikan performa bisnis</strong> (seperti omzet atau engagement) dalam persentase (%) selama 6 bulan ke depan. Proyeksi ini dihitung berdasarkan asumsi bahwa strategi pemasaran yang direkomendasikan diterapkan secara konsisten.
            </p>
          </div>

          <div className="flex-1 min-h-[300px] print:min-h-[350px]">
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
          <p className="text-xs text-slate-400 mt-4 text-center">*Angka hanyalah estimasi prediksi AI.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 break-inside-avoid">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Users className="text-purple-500" /> Analisis Pasar & Persona
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-2">Market Overview</h4>
              <p className="text-slate-700 text-sm leading-relaxed border-l-4 border-blue-500 pl-4 bg-slate-50 py-2 pr-2 rounded-r-lg print:border-l-2 print:bg-white print:pl-2">
                {plan.marketAnalysis}
              </p>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-2">Target Persona</h4>
              <p className="text-slate-700 text-sm leading-relaxed border-l-4 border-purple-500 pl-4 bg-slate-50 py-2 pr-2 rounded-r-lg print:border-l-2 print:bg-white print:pl-2">
                {plan.targetPersona}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid print:p-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Swords className="w-6 h-6 text-rose-500" /> Analisis Kompetitor
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3">
          {plan.competitorAnalysis.competitors.map((comp, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-200 print:bg-white">
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

        <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg print:bg-white print:text-black print:border print:border-slate-200 print:shadow-none">
          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-300 print:text-yellow-600" /> Celah Pasar (Market Gap)
          </h4>
          <p className="text-indigo-100 leading-relaxed print:text-slate-700">
            {plan.competitorAnalysis.marketGap}
          </p>
        </div>
      </div>

      {/* Risk Analysis Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid page-break-before">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-orange-500" /> Analisis Risiko & Mitigasi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
          {plan.riskAnalysis?.map((risk, index) => (
            <div key={index} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden break-inside-avoid print:bg-white">
              <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex justify-between items-center print:bg-white print:border-b">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-500" />
                  {risk.riskType}
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                    risk.impact === 'High' ? 'bg-red-100 text-red-700 border-red-200' : 
                    risk.impact === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-green-100 text-green-700 border-green-200'
                  }`}>
                    Imp: {risk.impact}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{risk.description}</p>
                <div className="bg-white rounded-lg p-3 border border-slate-200 flex gap-3 items-start print:border-none print:p-0">
                  <Lock className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase block mb-1">Strategi Mitigasi</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{risk.mitigation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Strategy Generator Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Smartphone className="w-7 h-7 text-pink-500" /> Ide Konten Digital
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2">
          {plan.contentStrategy?.map((idea, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 p-5 break-inside-avoid flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {idea.platform}
                </span>
                <div className="text-pink-500">
                  {getContentIcon(idea.contentType)}
                </div>
              </div>
              
              <h4 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 leading-snug">{idea.topic}</h4>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed flex-grow">{idea.description}</p>
              
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
                <span>Type:</span>
                <span className="text-slate-600">{idea.contentType}</span>
              </div>

              {/* Chat Integration Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-auto no-print">
                <button 
                  onClick={() => onAskAI && onAskAI(`Buatkan script lengkap dan caption menarik untuk ide konten ini: "${idea.topic}" di platform ${idea.platform}. Deskripsi: ${idea.description}`)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-semibold rounded-lg transition-colors border border-pink-100"
                >
                  <FileText className="w-3 h-3" /> Buat Script
                </button>
                <button 
                  onClick={() => onAskAI && onAskAI(`Berikan 3 variasi angle alternatif untuk ide konten "${idea.topic}" agar lebih viral.`)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
                >
                  <RefreshCw className="w-3 h-3" /> Variasi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid page-break-before">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Analisis SWOT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
          {/* Strengths */}
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 print:bg-white print:border-slate-200">
            <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2 print:text-emerald-700">
              <ShieldCheck className="w-5 h-5" /> Kekuatan (Strengths)
            </h4>
            <ul className="space-y-2">
              {plan.swot.strengths.map((item, i) => (
                <li key={i} className="text-sm text-emerald-900 flex items-start gap-2 print:text-slate-700">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Weaknesses */}
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 print:bg-white print:border-slate-200">
            <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2 print:text-orange-700">
              <AlertTriangle className="w-5 h-5" /> Kelemahan (Weaknesses)
            </h4>
            <ul className="space-y-2">
              {plan.swot.weaknesses.map((item, i) => (
                <li key={i} className="text-sm text-orange-900 flex items-start gap-2 print:text-slate-700">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 print:bg-white print:border-slate-200">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2 print:text-blue-700">
              <Zap className="w-5 h-5" /> Peluang (Opportunities)
            </h4>
            <ul className="space-y-2">
              {plan.swot.opportunities.map((item, i) => (
                <li key={i} className="text-sm text-blue-900 flex items-start gap-2 print:text-slate-700">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

           {/* Threats */}
           <div className="bg-red-50 p-6 rounded-xl border border-red-100 print:bg-white print:border-slate-200">
            <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2 print:text-red-700">
              <TrendingUp className="w-5 h-5 rotate-180" /> Ancaman (Threats)
            </h4>
            <ul className="space-y-2">
              {plan.swot.threats.map((item, i) => (
                <li key={i} className="text-sm text-red-900 flex items-start gap-2 print:text-slate-700">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Marketing Mix (4Ps) */}
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-8 break-inside-avoid print:bg-white print:text-black print:border print:border-slate-200 print:shadow-none">
        <h3 className="text-2xl font-bold mb-8 text-center print:text-slate-800">Strategi Marketing Mix (4P)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 print:bg-white print:border-slate-200">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 text-indigo-400 print:bg-indigo-50 print:text-indigo-600">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">Product</h4>
            <p className="text-slate-300 text-sm leading-relaxed print:text-slate-600">{plan.marketingMix.productStrategy}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 print:bg-white print:border-slate-200">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400 print:bg-emerald-50 print:text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">Price</h4>
            <p className="text-slate-300 text-sm leading-relaxed print:text-slate-600">{plan.marketingMix.priceStrategy}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 print:bg-white print:border-slate-200">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 text-pink-400 print:bg-pink-50 print:text-pink-600">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">Place</h4>
            <p className="text-slate-300 text-sm leading-relaxed print:text-slate-600">{plan.marketingMix.placeStrategy}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 print:bg-white print:border-slate-200">
             <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 text-amber-400 print:bg-amber-50 print:text-amber-600">
              <Megaphone className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">Promotion</h4>
            <p className="text-slate-300 text-sm leading-relaxed print:text-slate-600">{plan.marketingMix.promotionStrategy}</p>
          </div>
        </div>
      </div>

      {/* Investment Recommendation Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 break-inside-avoid page-break-before">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PiggyBank className="w-7 h-7 text-indigo-600" /> Rekomendasi Investasi Strategis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plan.investmentRecommendations?.map((item, index) => (
            <div key={index} className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100 flex flex-col h-full print:bg-white print:border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <Briefcase className="w-6 h-6 text-indigo-600" />
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                    item.priority === 'High' ? 'bg-indigo-600 text-white border-indigo-600 print:bg-white print:text-indigo-700' : 
                    item.priority === 'Medium' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}>
                    {item.priority}
                  </span>
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-2">{item.area}</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">{item.reasoning}</p>
              
              <div className="bg-white/70 rounded-lg p-3 border border-indigo-100 mt-2 print:border-none print:p-0">
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                   <Target className="w-3 h-3" /> KPIs
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
            <div key={index} className="flex flex-col md:flex-row gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50/50 break-inside-avoid print:bg-white">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-slate-800 text-lg mb-1">{action.title}</h4>
                <p className="text-slate-600 text-sm mb-3">{action.description}</p>
                <div className="flex gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                    action.impact === 'High' ? 'bg-green-100 text-green-700 border-green-200' : 
                    action.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}>
                    Impact: {action.impact}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                    action.difficulty === 'High' ? 'bg-red-100 text-red-700 border-red-200' : 
                    action.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    Diff: {action.difficulty}
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